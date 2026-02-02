def hallucination_score(answer: str, context: str) -> float:
    # Common English stop words to filter out of the grounding check
    STOP_WORDS = {
        "is", "the", "are", "a", "an", "and", "or", "but", "in", "on", "at", 
        "to", "of", "for", "with", "by", "from", "up", "about", "into", "over", 
        "after", "it", "they", "this", "that", "these", "those", "is", "be", 
        "been", "being", "have", "has", "had", "do", "does", "did", "was", "were"
    }
    
    def get_keywords(text):
        # Convert to lower, split and remove non-alphanumeric/stop words
        words = text.lower().split()
        return {w.strip(".,!?;:()[]") for w in words if w not in STOP_WORDS and len(w) > 2}

    answer_keywords = get_keywords(answer)
    context_keywords = get_keywords(context)
    
    if not answer_keywords:
        return 0.0
        
    # Find keywords in answer that are NOT in context
    out_tokens = answer_keywords - context_keywords
    
    # Score is ratio of "hallucinated" keywords to total keywords in answer
    score = len(out_tokens) / len(answer_keywords)
    return score
