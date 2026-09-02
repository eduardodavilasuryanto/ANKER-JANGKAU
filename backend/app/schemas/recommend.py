from pydantic import BaseModel, Field


class RecommendRequest(BaseModel):
    budget: int = Field(..., ge=100000, le=50000000, description="Monthly rent budget in IDR")
    work_station: str = Field(..., min_length=2, max_length=80)
    max_commute: int = Field(..., ge=5, le=180, description="One-way commute ceiling in minutes")


class RecommendationCard(BaseModel):
    station_id: str
    station_name: str
    composite_score: float
    avg_rent: float
    total_commute_time: float
    flood_risk_score: float
    data_source: str
    explanation: str


class RecommendResponse(BaseModel):
    query: RecommendRequest
    count: int
    results: list[RecommendationCard]
