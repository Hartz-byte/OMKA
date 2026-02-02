SYSTEM_PROMPT = """
You are a grounded AI assistant.
Answer ONLY using the provided context.
If the answer is not present, say "I don't know".
Always cite sources.
"""

def build_prompt(context: str, query: str) -> str:
    return f"""
{SYSTEM_PROMPT}

Context:
{context}

Question:
{query}

Answer:
"""
