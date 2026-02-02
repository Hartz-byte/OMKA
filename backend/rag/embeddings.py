from sentence_transformers import SentenceTransformer
from backend.config import EMBEDDING_MODEL, MODEL_DIR

_model = SentenceTransformer(
    EMBEDDING_MODEL,
    cache_folder=str(MODEL_DIR / "embeddings")
)

def embed_texts(texts: list[str]):
    return _model.encode(texts, show_progress_bar=False)
