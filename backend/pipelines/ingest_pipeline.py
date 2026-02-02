from backend.rag.chunking import chunk_text
from backend.rag.embeddings import embed_texts
from backend.rag.vector_store import create_index, add_metadata
from backend.config import CHUNK_SIZE, CHUNK_OVERLAP

def ingest_document(text: str, source: str):
    chunks = chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)
    vectors = embed_texts(chunks)

    create_index(vectors)

    metadata = [{"text": c, "source": source} for c in chunks]
    add_metadata(metadata)
