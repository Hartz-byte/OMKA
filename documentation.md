# Offline Multimodal Knowledge Assistant (OMKA)

## 1. Project Overview

**Offline Multimodal Knowledge Assistant (OMKA)** is a full‑stack, production‑oriented AI system that enables users to interact with their private documents using **voice or text**, fully **offline**, without any paid APIs or cloud dependencies.

The system combines:
- **Speech‑to‑Text (STT)**
- **Large Language Models (LLMs)**
- **Retrieval Augmented Generation (RAG)**
- **Generative AI**
- **MLOps & monitoring**
- **Scalable backend architecture**

OMKA is designed to reflect **Google‑style AI/ML engineering standards**, focusing on reliability, grounding, modularity, and scalability.

---

## 2. Key Objectives

- Enable **voice‑based and text‑based Q&A** over user documents
- Prevent hallucinations using **RAG with source grounding**
- Run fully on **local hardware** (RTX 3050, 4 GB VRAM)
- Follow **production ML best practices** (pipelines, versioning, monitoring)
- Be cloud‑ready by design (Vertex AI / GKE compatible)

---

## 3. Target System Specifications

- **RAM:** 16 GB
- **GPU:** NVIDIA RTX 3050 (4 GB VRAM)
- **OS:** Linux / Windows
- **Inference:** Quantized models (4‑bit)

---

## 4. High‑Level Architecture

```
User (Browser)
   │
   │ Voice / Text
   ▼
Frontend (React)
   │
   ▼
FastAPI Backend (Async)
   ├── STT Service (Whisper)
   ├── RAG Service
   │    ├── Embedding Model
   │    ├── FAISS Vector Store
   │    └── Retriever
   ├── LLM Inference Service
   └── Monitoring & Metrics
```

---

## 5. Application Modules

### 5.1 Frontend Application

**Responsibilities:**
- Capture microphone audio
- Provide chat‑style UI
- Display answers with sources
- Stream partial responses

**Tech Stack:**
- React
- Web Audio API
- Fetch / WebSocket

**Key UI Components:**
- Voice input button
- Chat history panel
- Source citation panel
- Confidence indicator

---

### 5.2 Backend Application

**Framework:** FastAPI (async)

**Responsibilities:**
- Handle API requests
- Route queries
- Manage ML pipelines
- Serve streaming responses

**Core Endpoints:**
- `/ingest` – document upload
- `/transcribe` – audio → text
- `/query` – RAG‑based inference
- `/metrics` – system metrics

---

## 6. Model & Tooling Stack

### 6.1 Speech‑to‑Text (STT)

**Model:** OpenAI Whisper (open‑source)
- Variant: `small` or `medium`
- GPU‑accelerated via CUDA

**Why Whisper:**
- High accuracy
- Offline
- Multilingual support

---

### 6.2 Embedding Model

**Model:** `all‑MiniLM‑L6‑v2`

**Purpose:**
- Convert text chunks into dense vectors

**Why:**
- Lightweight
- Fast inference
- Strong semantic similarity

---

### 6.3 Vector Database

**Tool:** FAISS

**Responsibilities:**
- Store embeddings
- Perform nearest‑neighbor search

**Index Type:**
- Flat or IVF (configurable)

---

### 6.4 Large Language Model (LLM)

**Model Options:**
- Mistral‑7B‑Instruct (Q4)
- LLaMA‑3‑8B‑Instruct (Q4)

**Runtime:**
- llama.cpp

**Why Quantization:**
- Fits into 4 GB VRAM
- Minimal quality loss

---

## 7. Retrieval Augmented Generation (RAG)

### 7.1 Document Ingestion Workflow

1. User uploads documents
2. Text extracted (PDF/Doc/Text)
3. Chunking with overlap
4. Embedding generation
5. FAISS index update
6. Metadata stored (source, page)

---

### 7.2 Query Workflow

1. User query (voice or text)
2. Voice → text (if needed)
3. Query embedding
4. Top‑K retrieval from FAISS
5. Context assembly
6. Prompt construction
7. LLM inference
8. Answer + citations returned

---

## 8. Prompt Engineering Strategy

- System prompt enforces:
  - Answer only from provided context
  - Cite sources
  - Say "I don’t know" if insufficient data

**Anti‑Hallucination Techniques:**
- Context‑only answering
- Source‑required responses
- Confidence scoring

---

## 9. MLOps Design

### 9.1 Experiment Tracking

**Tool:** MLflow

Tracked:
- Model versions
- Chunk size
- Retrieval parameters
- Latency
- Accuracy metrics

---

### 9.2 Data & Model Versioning

**Tool:** DVC

Versioned Assets:
- Raw documents
- Processed chunks
- FAISS indices
- Model binaries

---

### 9.3 Pipelines

**Pipelines Implemented:**
- Document ingestion pipeline
- Embedding pipeline
- Evaluation pipeline

Pipelines are reproducible and config‑driven.

---

### 9.4 Monitoring & Metrics

Tracked Metrics:
- Query latency
- Retrieval precision@K
- Faithfulness score
- STT Word Error Rate

Metrics exposed via `/metrics` endpoint.

---

## 10. Scalability & System Design

Although local, OMKA is built for scale:

- Stateless API design
- Separable inference services
- Batch embedding jobs
- Horizontal scaling ready

**Cloud Migration Path:**
- FAISS → Vertex Matching Engine
- Local LLM → Vertex AI endpoints
- FastAPI → GKE

---

## 11. Security & Privacy

- Fully offline processing
- No external API calls
- Local data storage
- No telemetry leakage

---

## 12. Repository Structure

```
omka/
├── backend/
│   ├── api/
│   ├── rag/
│   ├── stt/
│   ├── llm/
│   ├── pipelines/
│   └── monitoring/
├── frontend/
├── mlops/
│   ├── dvc.yaml
│   ├── mlflow/
├── docs/
│   ├── architecture.md
│   ├── system_design.md
│   ├── evaluation.md
├── README.md
```

---

## 13. Evaluation Strategy

- Retrieval Precision@K
- Faithfulness vs source
- Latency benchmarks
- GPU vs CPU comparison

---

## 14. Why This Project Is Google‑Ready

- End‑to‑end ownership
- Production ML thinking
- Strong grounding & safety
- Scalable system design
- Clean engineering practices

---

## 15. Future Enhancements

- Multilingual RAG
- Streaming token generation
- Active learning loop
- Automated retraining

---

**OMKA demonstrates the skills of an AI/ML engineer capable of building real‑world, scalable, safe, and maintainable AI systems — aligned with Google’s engineering culture.**

