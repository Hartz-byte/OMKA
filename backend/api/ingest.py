from fastapi import APIRouter, UploadFile
from backend.pipelines.ingest_pipeline import ingest_document
from backend.rag.chunking import chunk_text
from backend.config import CHUNK_SIZE, CHUNK_OVERLAP

router = APIRouter()

@router.post("/ingest")
async def ingest(file: UploadFile):
    # Read uploaded file
    text = (await file.read()).decode("utf-8")
    
    # Run ingestion (stores in FAISS and metadata)
    ingest_document(text, file.filename)
    
    # Optional: preview first 2 chunks for output
    chunks = chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)
    preview = chunks[:2]  # first 2 chunks
    
    return {
        "status": "ingested",
        "file": file.filename,
        "num_chunks": len(chunks),
        "preview": preview
    }
