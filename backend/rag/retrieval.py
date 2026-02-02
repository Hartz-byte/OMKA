from functools import lru_cache
from backend.rag.embeddings import embed_texts
from backend.rag.vector_store import search

@lru_cache(maxsize=128)
def cached_retrieve(query: str, top_k: int):
    query_vec = embed_texts([query])
    indices, _, metadata = search(query_vec, top_k)
    context = ""
    sources = []
    for idx in indices:
        context += metadata[idx]["text"] + "\n"
        sources.append(metadata[idx]["source"])
    return context, sources
