from pathlib import Path

BASE_DIR = Path("D:/projects/omka")

DATA_DIR = BASE_DIR / "data"
MODEL_DIR = BASE_DIR / "models"

WHISPER_MODEL = "small"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

FAISS_INDEX_PATH = MODEL_DIR / "faiss_index" / "index.bin"

OLLAMA_URL = "http://localhost:11434"
OLLAMA_MODEL = "mistral"

TOP_K = 5
CHUNK_SIZE = 500
CHUNK_OVERLAP = 100
