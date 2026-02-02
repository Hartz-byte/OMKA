from backend.rag.chunking import chunk_text
from backend.rag.embeddings import embed_texts
from backend.rag.vector_store import create_index, add_metadata, save_index
import os
from backend.config import DATA_DIR, CHUNK_SIZE, CHUNK_OVERLAP, FAISS_INDEX_PATH

def ingest_document(text: str, source: str):
    chunks = chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)
    vectors = embed_texts(chunks)

    create_index(vectors)
    
    metadata = [{"text": c, "source": source} for c in chunks]
    add_metadata(metadata)
    
    # Ensure directory exists before saving
    os.makedirs(os.path.dirname(FAISS_INDEX_PATH), exist_ok=True)
    save_index() # Critical: Ensure index is saved to disk

if __name__ == "__main__":
    # Automated ingestion for evaluation testing
    os.makedirs(DATA_DIR, exist_ok=True)
    test_file = os.path.join(DATA_DIR, "test.txt")
    with open(test_file, "w") as f:
        f.write("OMKA is an Offline Multimodal Knowledge Assistant designed by Antigravity.")
    
    with open(test_file, "r") as f:
        content = f.read()
        ingest_document(content, "test.txt")
        print("Ingestion Complete and Index Saved.")
