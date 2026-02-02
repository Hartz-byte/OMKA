from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import asyncio
import json
import time
from backend.rag.retrieval import cached_retrieve
from backend.core.prompts import build_prompt
from backend.core.ollama_client import stream_llm_response_async
from backend.config import TOP_K
from backend.monitoring.hallucination import hallucination_score
from backend.monitoring.mlflow_logger import log_run
from backend.monitoring.metrics import metrics

router = APIRouter()

@router.post("/query")
async def query(payload: dict):
    start_time = time.time()
    query_text = payload["query"]
    
    # 1. Retrieve context
    context, sources = cached_retrieve(query_text, TOP_K)
    prompt = build_prompt(context, query_text)
    
    async def event_generator():
        full_answer = ""
        
        # First send initial metadata (score will be updated at the end)
        metadata = {
            "sources": sources,
            "hallucination_score": 0.0 # Placeholder
        }
        yield json.dumps(metadata) + "\n--METADATA_END--\n"
        
        # Then stream tokens and collect them
        async for token in stream_llm_response_async(prompt):
            full_answer += token
            yield token
            
        # Finalization: Calculate metrics after stream is complete
        score = hallucination_score(full_answer, context)
        metrics.record_latency(start_time)
        metrics.record_hallucination_score(score)
        log_run(query_text, full_answer, context, sources, score)
        
        # Send final metadata update
        final_meta = {"hallucination_score": score, "done": True}
        yield "\n--METADATA_START--\n" + json.dumps(final_meta) + "\n--METADATA_END--\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
