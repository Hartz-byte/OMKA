# OMKA Evaluation Strategy

## 1. Metrics Overview
The system is evaluated based on three primary pillars: Retrieval Accuracy, Generative Faithfulness, and System Performance.

### 1.1 Retrieval Precision@K
- **Definition**: The percentage of the top-K retrieved chunks that are relevant to the query.
- **Goal**: > 0.80
- **Tracking**: Logged per-query in the Metrics API.

### 1.2 Hallucination (Faithfulness) Score
- **Definition**: The ratio of factual keywords in the AI response that find a direct match in the retrieved context.
- **Metric**: `1.0 - (hallucinated_keywords / total_keywords)`
- **Goal**: > 0.85

### 1.3 STT Word Error Rate (WER)
- **Definition**: The edit distance between the transcribed text and a ground-truth reference.
- **Goal**: < 0.15

## 2. Benchmark Results (Mistral-7B Q4)
| Metric | Result |
| :--- | :--- |
| **Avg Latency** | ~40s (RTX 3050) |
| **Grounding Score** | 0.92 |
| **Retrieval Precision** | 0.88 |

## 3. Continuous Evaluation
OMKA uses the `evaluation_pipeline.py` script to run automated benchmarks against a curated `test_set.json`. Results are tracked via MLflow to detect performance regressions during model or prompt updates.
