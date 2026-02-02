# OMKA: Offline Multimodal Knowledge Assistant

A production-ready, local AI assistant for interacting with private documents using STT, RAG, and LLMs.

## 🚀 Quick Start
1. **Ollama**: Run `ollama run mistral`
2. **Backend**: `cd backend && uvicorn main:app --reload`
3. **Frontend**: `cd frontend && npm run dev`

## 📂 Documentation
- [System Architecture](docs/architecture.md)
- [System Design](docs/system_design.md)
- [Evaluation Metrics](docs/evaluation.md) (Pending detailed run results)

## 🛠️ Features
- **Token-by-Token Streaming**: Instant local inference responses.
- **Voice-to-Text**: Offline transcription using Whisper.
- **Grounded Results**: Hallucination detection and source citations for all answers.
- **Production Metrics**: Tracking Latency, Confidence, Precision@K, and WER.
- **MLOps Enabled**: DVC pipelines and MLflow tracking integrated.