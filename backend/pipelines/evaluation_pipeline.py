import time
import asyncio
import os
from backend.rag.retrieval import cached_retrieve
from backend.monitoring.hallucination import hallucination_score
from backend.core.ollama_client import generate_llm_response_async
from backend.core.prompts import build_prompt
from backend.rag.vector_store import load_index
from backend.config import FAISS_INDEX_PATH

async def evaluate_system(test_set: list):
    """
    test_set: list of dicts with {"query": "...", "expected_context": "..."}
    """
    # Ensure index is loaded for the background process
    if os.path.exists(FAISS_INDEX_PATH):
        try:
            load_index()
        except Exception as e:
            print(f"Error loading FAISS index: {e}")
            return []
    else:
        print(f"Warning: FAISS index not found at {FAISS_INDEX_PATH}. Run ingestion first.")
        return []

    results = []
    
    for item in test_set:
        query = item["query"]
        print(f"Evaluating query: {query}")
        start = time.time()
        
        # 1. Retrieval
        try:
            context, sources = cached_retrieve(query, top_k=5)
            print(f"DEBUG: Retrieved {len(sources)} sources")
        except Exception as e:
            print(f"Retrieval failed for query '{query}': {e}")
            context, sources = "", []

        # 2. Generation
        answer = "No context found"
        score = 1.0
        if context:
            prompt = build_prompt(context, query)
            answer = await generate_llm_response_async(prompt)
            score = hallucination_score(answer, context)
        
        # 3. Metrics
        latency = time.time() - start
        
        # Simple Precision check
        precision = 1.0 if (sources and any(src.lower() in context.lower() for src in sources)) else 0.0
        
        results.append({
            "query": query,
            "latency": round(latency, 2),
            "hallucination": round(score, 3),
            "precision": precision,
            "answer": answer
        })
        
    return results

if __name__ == "__main__":
    # Example evaluation run
    sample_tests = [
        {"query": "What is OMKA?", "expected_context": "test.txt"}
    ]
    # Use modern asyncio.run
    try:
        metrics_results = asyncio.run(evaluate_system(sample_tests))
        print("\n=== Evaluation Results ===")
        for res in metrics_results:
            print(f"Query: {res['query']}")
            print(f"  Latency: {res['latency']}s")
            print(f"  Grounding Score: {1-res['hallucination']}")
            print(f"  Precision: {res['precision']}")
    except Exception as e:
        print(f"Evaluation failed: {e}")
