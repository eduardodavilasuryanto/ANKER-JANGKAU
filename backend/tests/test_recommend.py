from app.main import app
from fastapi.testclient import TestClient


def test_recommend_returns_valid_response() -> None:
    client = TestClient(app)

    response = client.post(
        "/api/v1/recommend",
        json={"min_budget": 1000000, "max_budget": 1800000, "work_station": "Manggarai", "max_commute": 35},
    )

    assert response.status_code == 200
    data = response.json()
    assert "results" in data
