from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import asyncio
import json
import time
from backend.rag.retrieval import cached_retrieve
from backend.core.prompts import build_prompt
from backend.core.ollama_client import stream_llm_response_async, generate_llm_response_async
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
    
    # 2. Get full response for hallucination score calculation 
    # (Since we need the full answer for the current heuristic score)
    # Note: In a real high-throughput system, we might score asynchronously 
    # or use a different streaming-friendly metric.
    full_answer = await generate_llm_response_async(prompt)
    score = hallucination_score(full_answer, context)
    
    # Log metrics
    metrics.record_latency(start_time)
    metrics.record_hallucination_score(score)
    log_run(query_text, full_answer, context, sources, score)

    async def event_generator():
        # First send metadata
        metadata = {
            "sources": sources,
            "hallucination_score": score
        }
        yield json.dumps(metadata) + "\n--METADATA_END--\n"
        
        # Then stream tokens from the actual generator
        async for token in stream_llm_response_async(prompt):
            yield token

    return StreamingResponse(event_generator(), media_type="text/event-stream")
