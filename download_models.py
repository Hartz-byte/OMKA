import os

# Paths
BASE_DIR = r"D:\AIML-Projects\OMKA\models"
CACHE_ROOT = BASE_DIR
EMBEDDING_DIR = os.path.join(BASE_DIR, "embeddings")

os.makedirs(CACHE_ROOT, exist_ok=True)
os.makedirs(EMBEDDING_DIR, exist_ok=True)

os.environ["XDG_CACHE_HOME"] = CACHE_ROOT

import whisper
print("Downloading Whisper model...")
whisper.load_model("small")
print("Whisper model downloaded ✅")

# Sentence Transformers
from sentence_transformers import SentenceTransformer

print("Downloading embedding model...")
SentenceTransformer(
    "all-MiniLM-L6-v2",
    cache_folder=EMBEDDING_DIR
)
print("Embedding model downloaded ✅")

print("\nAll models downloaded successfully 🎉")
