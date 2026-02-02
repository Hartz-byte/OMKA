import faiss
import numpy as np
from backend.config import FAISS_INDEX_PATH
from backend.core.logger import logger

_index = None
_metadata = []

def create_index(vectors: np.ndarray):
    global _index
    dim = vectors.shape[1]
    _index = faiss.IndexFlatL2(dim)
    _index.add(vectors)
    logger.info("FAISS index created")

def save_index():
    faiss.write_index(_index, str(FAISS_INDEX_PATH))

def load_index():
    global _index
    _index = faiss.read_index(str(FAISS_INDEX_PATH))

def add_metadata(meta: list[dict]):
    _metadata.extend(meta)

def search(query_vector, k: int):
    distances, indices = _index.search(query_vector, k)
    return indices[0], distances[0], _metadata
