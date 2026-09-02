from fastapi import APIRouter

from app.schemas.recommend import RecommendRequest, RecommendResponse
from app.services.data_loader import load_catchments
from app.services.engine import recommend as run_engine

router = APIRouter()


@router.post("/recommend", response_model=RecommendResponse)
def recommend(payload: RecommendRequest) -> RecommendResponse:
    rows = load_catchments()
    return run_engine(payload, rows)
