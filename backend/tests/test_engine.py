from app.schemas.recommend import RecommendRequest
from app.services.engine import recommend

SAMPLE_ROWS = [
    {
        "station_id": "TEB",
        "station_name": "Tebet",
        "composite_score": 82.0,
        "avg_rent": 1500000,
        "total_commute_time": 20,
        "flood_risk_score": 0.0,
        "flood_risk_label": "low",
        "data_source": "primary",
    },
    {
        "station_id": "BGR",
        "station_name": "Bogor",
        "composite_score": 61.0,
        "avg_rent": 900000,
        "total_commute_time": 55,
        "flood_risk_score": 0.5,
        "flood_risk_label": "medium",
        "data_source": "primary",
    },
]


def test_engine_filters_and_ranks() -> None:
    request = RecommendRequest(budget=1800000, work_station="Sudirman", max_commute=40)
    result = recommend(request, SAMPLE_ROWS)
    assert result.count == 1
    assert result.results[0].station_name == "Tebet"
    assert "strongly recommended" in result.results[0].explanation
