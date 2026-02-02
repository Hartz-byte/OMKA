from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import ingest, query, transcribe, health, metrics, websocket

app = FastAPI(title="OMKA Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; refine for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router)
app.include_router(query.router)
app.include_router(transcribe.router)
app.include_router(health.router)
app.include_router(metrics.router)
app.include_router(websocket.router)
