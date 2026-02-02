def hallucination_score(answer: str, context: str) -> float:
    answer_tokens = set(answer.lower().split())
    context_tokens = set(context.lower().split())
    out_tokens = answer_tokens - context_tokens
    if not answer_tokens:
        return 0.0
    score = len(out_tokens) / len(answer_tokens)
    return score
