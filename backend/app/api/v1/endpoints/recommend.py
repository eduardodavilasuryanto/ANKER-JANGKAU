from fastapi import APIRouter, HTTPException, status
from app.schemas.recommend import RecommendRequest, RecommendResponse
from app.services.engine import run_engine

router = APIRouter()

@router.post("/recommend", response_model=RecommendResponse)
async def recommend(payload: RecommendRequest) -> RecommendResponse:
    """Run local rule-based AI recommendations."""
    try:
        results = run_engine(payload)
        return RecommendResponse(
            query=payload,
            count=len(results),
            results=results
        )
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating recommendations: {str(error)}"
        )
