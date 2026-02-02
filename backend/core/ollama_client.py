import aiohttp
import asyncio
import json
from backend.config import OLLAMA_URL, OLLAMA_MODEL
from backend.core.logger import logger

async def generate_llm_response_async(prompt: str) -> str:
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(f"{OLLAMA_URL}/api/generate", json=payload, timeout=300) as resp:
            if resp.status != 200:
                error_text = await resp.text()
                logger.error(f"Ollama error {resp.status}: {error_text}")
                raise Exception(f"Ollama error: {resp.status} - {error_text}")
            data = await resp.json()
            return data["response"]

async def stream_llm_response_async(prompt: str):
    """Async generator for streaming response tokens."""
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": True
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(f"{OLLAMA_URL}/api/generate", json=payload, timeout=300) as resp:
            if resp.status != 200:
                error_text = await resp.text()
                logger.error(f"Ollama error {resp.status}: {error_text}")
                raise Exception(f"Ollama error: {resp.status} - {error_text}")
            
            async for line in resp.content:
                if line:
                    chunk = json.loads(line.decode('utf-8'))
                    if "response" in chunk:
                        yield chunk["response"]
                    if chunk.get("done"):
                        break

async def batch_generate(prompts: list[str]):
    tasks = [generate_llm_response_async(p) for p in prompts]
    return await asyncio.gather(*tasks)
