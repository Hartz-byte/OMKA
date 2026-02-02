import aiohttp
import asyncio
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
                raise Exception(f"Ollama error: {resp.status}")
            data = await resp.json()
            return data["response"]

async def batch_generate(prompts: list[str]):
    tasks = [generate_llm_response_async(p) for p in prompts]
    return await asyncio.gather(*tasks)
