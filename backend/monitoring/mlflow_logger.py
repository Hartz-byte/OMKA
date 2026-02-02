import mlflow
from backend.config import BASE_DIR

mlflow.set_tracking_uri(f"file:///{BASE_DIR}/mlops/mlruns")
mlflow.set_experiment("omka_experiment")

def log_run(query: str, answer: str, context: str, sources: list, hallucination_score: float):
    with mlflow.start_run():
        mlflow.log_param("query", query)
        mlflow.log_param("num_sources", len(sources))
        mlflow.log_text(context, "context.txt")
        mlflow.log_text(answer, "answer.txt")
        mlflow.log_metric("hallucination_score", hallucination_score)
