from fastapi import APIRouter
import asyncio
from backend.rag.retrieval import cached_retrieve
from backend.core.prompts import build_prompt
from backend.core.ollama_client import generate_llm_response_async
from backend.config import TOP_K
from backend.monitoring.hallucination import hallucination_score
from backend.monitoring.mlflow_logger import log_run

router = APIRouter()

@router.post("/query")
async def query(payload: dict):
    query_text = payload["query"]
    context, sources = cached_retrieve(query_text, TOP_K)
    prompt = build_prompt(context, query_text)
    
    answer = await generate_llm_response_async(prompt)
    score = hallucination_score(answer, context)
    
    log_run(query_text, answer, context, sources, score)
    
    return {"answer": answer, "sources": sources, "hallucination_score": score}
