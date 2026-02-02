import time

class Metrics:
    def __init__(self):
        self.latencies = []
        self.hallucination_scores = []
        self.precision_scores = []
        self.wer_scores = []
        self.query_count = 0

    def record_latency(self, start):
        self.latencies.append(time.time() - start)
        self.query_count += 1

    def record_hallucination_score(self, score):
        self.hallucination_scores.append(score)

    def record_precision(self, score):
        """Measures retrieval relevance."""
        self.precision_scores.append(score)

    def record_wer(self, score):
        """Measures Speech-to-Text accuracy."""
        self.wer_scores.append(score)

    def get_summary(self):
        avg_latency = sum(self.latencies) / len(self.latencies) if self.latencies else 0
        avg_hallucination = sum(self.hallucination_scores) / len(self.hallucination_scores) if self.hallucination_scores else 0
        avg_precision = sum(self.precision_scores) / len(self.precision_scores) if self.precision_scores else 1.0
        avg_wer = sum(self.wer_scores) / len(self.wer_scores) if self.wer_scores else 0.0
        
        return {
            "total_queries": self.query_count,
            "avg_latency": round(avg_latency, 3),
            "avg_hallucination_score": round(avg_hallucination, 3),
            "avg_retrieval_precision": round(avg_precision, 2),
            "avg_stt_wer": round(avg_wer, 2),
            "status": "healthy"
        }

metrics = Metrics()
