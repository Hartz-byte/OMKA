# OMKA System Design

## 1. Retrieval Strategy
We use a **bi-encoder architecture** with `sentence-transformers`. 
- **Chunking**: Fixed-size chunking (500 tokens) with 100-token overlap to maintain semantic context boundaries.
- **Search**: L2 distance metric in FAISS for fast retrieval of the top 5 most relevant chunks.

## 2. Hallucination Guardrails
OMKA implements a unique "Grounding Confidence Score":
- **Keyword Overlap**: A refined bag-of-words check (excluding stop-words) determines how much of the answer is derived directly from the sources.
- **Source Attribution**: Every response includes metadata pointing back to specific source files.

## 3. Scalability
The backend is designed as a stateless FastAPI application, allowing multiple workers to handle concurrent queries. The FAISS index is persistent and optimized for low-memory environments.

## 4. UI/UX Principles
- **Modern Glassmorphism**: High-contrast, transparent layouts for a premium feel.
- **Micro-interactions**: Hover effects, pulse animations during voice capture, and token-by-token streaming to reduce perceived latency.
