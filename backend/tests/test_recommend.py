from app.main import app
from fastapi.testclient import TestClient


def test_recommend_requires_the_team_owned_upstream_url() -> None:
    client = TestClient(app)

    response = client.post(
        "/api/v1/recommend",
        json={"budget": 1800000, "work_station": "Manggarai", "max_commute": 35},
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "The recommendation service is not configured."
