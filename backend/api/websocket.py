from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
from backend.rag.retrieval import cached_retrieve
from backend.core.prompts import build_prompt
from backend.core.ollama_client import stream_llm_response_async
from backend.config import TOP_K
from backend.core.logger import logger

router = APIRouter()

@router.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("WebSocket client connected")
    try:
        while True:
            # Receive text data
            data = await websocket.receive_text()
            payload = json.loads(data)
            query_text = payload.get("query")
            
            if not query_text:
                continue

            # RAG flow
            context, sources = cached_retrieve(query_text, TOP_K)
            prompt = build_prompt(context, query_text)
            
            # Send initial metadata
            await websocket.send_json({
                "type": "metadata",
                "sources": sources
            })

            # Stream response
            async for token in stream_llm_response_async(prompt):
                await websocket.send_json({
                    "type": "token",
                    "token": token
                })
            
            # End of message signal
            await websocket.send_json({"type": "end"})

    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close()
