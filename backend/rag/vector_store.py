import faiss
import numpy as np
import json
import os
from backend.config import FAISS_INDEX_PATH
from backend.core.logger import logger

_index = None
_metadata = []

def create_index(vectors: np.ndarray):
    global _index
    dim = vectors.shape[1]
    _index = faiss.IndexFlatL2(dim)
    _index.add(vectors.astype('float32'))
    logger.info("FAISS index created")

def save_index():
    if _index is None:
        return
    # Save FAISS index
    faiss.write_index(_index, str(FAISS_INDEX_PATH))
    # Save metadata to a JSON file alongside the index
    meta_path = str(FAISS_INDEX_PATH).replace(".bin", "_meta.json")
    with open(meta_path, "w") as f:
        json.dump(_metadata, f)

def load_index():
    global _index, _metadata
    # Load FAISS index
    if os.path.exists(FAISS_INDEX_PATH):
        _index = faiss.read_index(str(FAISS_INDEX_PATH))
    # Load metadata
    meta_path = str(FAISS_INDEX_PATH).replace(".bin", "_meta.json")
    if os.path.exists(meta_path):
        with open(meta_path, "r") as f:
            _metadata = json.load(f)

def add_metadata(meta: list[dict]):
    global _metadata
    _metadata.extend(meta)

def search(query_vector, k: int):
    if _index is None:
        logger.warning("Search called on uninitialized index.")
        return [], [], []
    
    # Ensure query_vector is 2D and float32
    query_vector = np.array(query_vector).astype('float32')
    if query_vector.ndim == 1:
        query_vector = query_vector.reshape(1, -1)
        
    distances, indices = _index.search(query_vector, k)
    
    # Filter out -1 indices which FAISS returns if not enough neighbors are found
    valid_mask = indices[0] != -1
    valid_indices = indices[0][valid_mask]
    valid_distances = distances[0][valid_mask]
    
    return valid_indices, valid_distances, _metadata
