from fastapi import APIRouter
from backend.monitoring.metrics import metrics

router = APIRouter()

@router.get("/metrics")
async def get_metrics():
    """Returns system performance and ML metrics."""
    return metrics.get_summary()
