# OMKA System Architecture

## Overview
The Offline Multimodal Knowledge Assistant (OMKA) is a full-stack RAG (Retrieval-Augmented Generation) system designed for private, high-performance knowledge retrieval.

## System Components

### 1. Frontend (React + Vite)
- **Voice Interface**: Captures audio using the Web Audio API and visualizes levels with Framer Motion.
- **Streaming UI**: Handles Server-Sent Events (SSE) to display AI tokens in real-time.
- **Document Management**: Interface for uploading and tracking knowledge base ingestion.

### 2. Backend (FastAPI)
- **STT Service**: Uses OpenAI Whisper (Offline) for high-fidelity speech-to-text.
- **RAG Engine**:
    - **Embedding**: `all-MiniLM-L6-v2` converts text to 384-dimensional vectors.
    - **Vector Store**: FAISS (Facebook AI Similarity Search) manages efficient nearest-neighbor retrieval.
- **LLM Inference**: Integrated with local Ollama instance (Mistral/LLaMA-3).
- **Monitoring**: Integrated MLflow for experiment tracking and a custom Metrics API.

## Data Flow
1. **Ingestion**: Document -> Chunks -> Embeddings -> FAISS Index.
2. **Retrieval**: Query -> Embedding -> Top-K Search -> Context.
3. **Generation**: Context + Prompt -> Streaming LLM -> User.
