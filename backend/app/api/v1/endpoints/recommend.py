import httpx2
from fastapi import APIRouter, HTTPException, status

from app.core.config import settings
from app.schemas.recommend import RecommendRequest, RecommendResponse

router = APIRouter()


@router.post("/recommend", response_model=RecommendResponse)
async def recommend(payload: RecommendRequest) -> RecommendResponse:
    """Forward a validated search to the AI/Data team's owned service."""

    if not settings.ai_recommendation_api_url:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The recommendation service is not configured.",
        )

    headers = {"Accept": "application/json"}
    if settings.ai_recommendation_api_key:
        headers["Authorization"] = f"Bearer {settings.ai_recommendation_api_key}"

    try:
        async with httpx2.AsyncClient(timeout=20) as client:
            response = await client.post(
                settings.ai_recommendation_api_url,
                json=payload.model_dump(),
                headers=headers,
            )
            response.raise_for_status()
    except httpx2.HTTPError as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The recommendation service could not be reached.",
        ) from error

    try:
        return RecommendResponse.model_validate(response.json())
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The recommendation service returned an invalid response.",
        ) from error
