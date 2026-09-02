"""Rule engine: filter, sort, fill the sentence.

The kitchen does not invent numbers. It only uses numbers already on the scored sheet.
"""

from app.schemas.recommend import RecommendRequest, RecommendResponse, RecommendationCard


def _flood_label(card: dict) -> str:
    if card.get("flood_risk_label"):
        return str(card["flood_risk_label"])
    score = float(card.get("flood_risk_score", 0))
    if score >= 1:
        return "high"
    if score >= 0.5:
        return "medium"
    return "low"


def _explanation(card: dict, request: RecommendRequest) -> str:
    score = float(card.get("composite_score", 0))
    name = card.get("station_name", "Unknown")
    rent = int(card.get("avg_rent", 0))
    commute = int(card.get("total_commute_time", 0))
    flood = _flood_label(card)
    work = request.work_station
    gap_pct = round((request.budget - rent) / request.budget * 100) if request.budget else 0

    if score >= 75:
        return (
            f"Station area {name}: strongly recommended (score {score:.1f}). "
            f"Estimated kos rent Rp{rent:,}/month ({gap_pct}% under your budget). "
            f"Total travel time to {work} is about {commute} minutes. Flood risk is {flood}."
        )
    if score >= 50:
        return (
            f"Station area {name}: fairly reachable (score {score:.1f}). "
            f"Estimated kos rent Rp{rent:,}/month. Travel time to work is about {commute} minutes. "
            f"Flood risk is {flood}."
        )
    return (
        f"Station area {name}: less efficient (score {score:.1f}). "
        f"Rent or daily living cost is high for this budget. Travel time is {commute} minutes."
    )


def recommend(request: RecommendRequest, rows: list[dict]) -> RecommendResponse:
    matched: list[RecommendationCard] = []
    for row in rows:
        rent = float(row.get("avg_rent", 0))
        commute = float(row.get("total_commute_time", 0))
        if rent > request.budget:
            continue
        if commute > request.max_commute:
            continue
        matched.append(
            RecommendationCard(
                station_id=str(row.get("station_id", "")),
                station_name=str(row.get("station_name", "")),
                composite_score=float(row.get("composite_score", 0)),
                avg_rent=rent,
                total_commute_time=commute,
                flood_risk_score=float(row.get("flood_risk_score", 0)),
                data_source=str(row.get("data_source", "primary")),
                explanation=_explanation(row, request),
            )
        )
    matched.sort(key=lambda item: item.composite_score, reverse=True)
    return RecommendResponse(query=request, count=len(matched), results=matched)
