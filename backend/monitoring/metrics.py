import time

class Metrics:
    def __init__(self):
        self.latencies = []
        self.hallucination_scores = []
        self.query_count = 0

    def record_latency(self, start):
        self.latencies.append(time.time() - start)
        self.query_count += 1

    def record_hallucination_score(self, score):
        self.hallucination_scores.append(score)

    def get_summary(self):
        avg_latency = sum(self.latencies) / len(self.latencies) if self.latencies else 0
        avg_hallucination = sum(self.hallucination_scores) / len(self.hallucination_scores) if self.hallucination_scores else 0
        return {
            "total_queries": self.query_count,
            "avg_latency": round(avg_latency, 3),
            "avg_hallucination_score": round(avg_hallucination, 3),
            "status": "healthy"
        }

metrics = Metrics()
