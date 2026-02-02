# OMKA: Offline Multimodal Knowledge Assistant

Offline Multimodal Knowledge Assistant (OMKA) is a full-stack, production-oriented AI system designed for private, offline interaction with documents via voice and text. Developed following Google-style engineering standards, it emphasizes reliability, modularity, and source grounding without cloud dependencies.

## 1. Project Overview
The system enables users to query their private knowledge bases using natural language. It integrates Speech-to-Text (STT), Retrieval Augmented Generation (RAG), and local Large Language Models (LLMs) to provide grounded, citation-backed answers while running entirely on consumer-grade hardware.

## 2. High-Level Architecture
- **Frontend**: React-based Single Page Application handling real-time token streaming and audio visualization.
- **Backend (Async FastAPI)**: Orchestrates the pipeline, including STT (Whisper), Retrieval (FAISS), and Inference (Ollama).
- **RAG Engine**: Uses local embeddings to navigate a vector space of document chunks.
- **Monitoring**: Integrated metrics dashboard and MLOps tracking.

## 3. Technology Stack and Models
- **Generative AI**: Ollama (Mistral-7B / LLaMA-3 quantized).
- **Speech-to-Text**: OpenAI Whisper (Small/Medium variants).
- **Embeddings**: `all-MiniLM-L6-v2` (Sentence-Transformers).
- **Vector Store**: FAISS (Facebook AI Similarity Search).
- **Frameworks**: FastAPI, React + Vite, Tailwind CSS, Framer Motion.
- **MLOps**: MLflow (Experiment Tracking), DVC (Data Versioning).

## 4. System Specifications
- **Operating System**: Windows 11 / Linux
- **GPU**: NVIDIA RTX 3050 (4 GB VRAM)
- **RAM**: 16 GB DDR4
- **Storage**: Local persistent storage for vector indices and data files.

## 5. Development and Data Pipeline
The project implements a structured MLOps lifecycle to ensure reproducibility:
- **Ingestion Pipeline**: Processes raw `.txt` or `.md` files, performs chunking (500 tokens, 100 overlap), generates embeddings, and updates the FAISS index.
- **DVC Integration**: Manages the versioning of raw data and model binaries (`models/faiss_index/index.bin`).
- **Path Management**: Config-driven relative paths ensure cross-platform compatibility.

## 6. AI Logic and Query Workflow
1. User provides input via text or the Web Audio API.
2. Whisper transcribes audio into text (if voice input).
3. Query embeddings are generated and matched against the FAISS store for context retrieval.
4. Prompt is constructed following grounding constraints (cite sources, say "I don't know" if no context).
5. Tokens are streamed to the UI in real-time via Server-Sent Events (SSE).

## 7. Metrics and Monitoring
OMKA tracks key performance indicators via a dedicated `/metrics` endpoint and MLflow.

### Live Metrics (API)
The system currently reports the following performance data:
- **Total Queries**: 2
- **Avg Latency**: 40.832s
- **Avg Hallucination Score**: 0.547
- **Avg Retrieval Precision**: 1.0
- **Avg STT WER**: 0.0

### MLflow Tracking
Every query is logged as an experiment run, tracking:
- **Parameters**: Chunk size, Top-K settings.
- **Metrics**: Latency and Grounding confidence.
- **Artifacts**: Full context files and raw AI responses for post-run analysis.

## 8. System Benchmarking (Evaluation)
An autonomous `evaluation_pipeline.py` is included to measure system efficacy.
**Sample Evaluation Result**:
- **Query**: "What is OMKA?"
- **Latency**: 15.7s
- **Grounding Score**: 0.641 (High-fidelity keyword overlap)
- **Retrieval Precision**: Successfully retrieved and indexed relevant source fragments.

## 9. Project Structure
```text
omka/
├── backend/
│   ├── api/            # API Routers (ingest, query, transcribe, metrics)
│   ├── core/           # LLM clients, prompt templates, and system loggers
│   ├── monitoring/     # Metrics API, Hallucination checks, and MLflow
│   ├── pipelines/      # Ingestion and Evaluation workflows
│   ├── rag/            # Embeddings, chunking, and FAISS logic
│   └── stt/            # Whisper STT implementation
├── frontend/           # React + Vite Application
├── docs/               # System architecture and evaluation blueprints
├── data/               # Local knowledge base documents
├── models/             # Persistent vector indices and embeddings
├── mlops/              # DVC configuration and MLflow artifacts
├── README.md           # Project documentation
└── requirements.txt    # Python dependencies
```

## 10. How to Run and Test

### Prerequisite: Ollama
Ensure Ollama is installed and running:
```powershell
ollama pull mistral
```

### Backend Execution
```powershell
pip install -r requirements.txt
cd backend
uvicorn main:app --reload --port 8000
```

### Frontend Execution
```powershell
cd frontend
npm install
npm run dev
```

### Component Testing
1. **Pipeline Test**: `python -m backend.pipelines.ingest_pipeline`
2. **System Benchmark**: `python -m backend.pipelines.evaluation_pipeline`
3. **MLflow Dashboard**: `mlflow ui --backend-store-uri file:///D:/AIML-Projects/OMKA/mlops/mlruns`
4. **Metrics Endpoint**: Access `http://localhost:8000/metrics`
