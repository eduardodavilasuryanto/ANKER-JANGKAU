from app.services.data_loader import DataLoader
from app.schemas.recommend import RecommendRequest

def filter_and_sort(payload: RecommendRequest, catchments: list[dict]) -> list[dict]:
    filtered = []
    for c in catchments:
        rent = c.get("avg_rent", float("inf"))
        if rent > payload.max_budget or rent < payload.min_budget:
            continue
        
        commute = c.get("total_commute_time", float("inf"))
        if commute > payload.max_commute:
            continue
            
        filtered.append(c)
        
    filtered.sort(key=lambda x: x.get("composite_score", 0), reverse=True)
    return filtered

def generate_explanation(c: dict, payload: RecommendRequest) -> str:
    score = c.get("composite_score", 0.0)
    name = c.get("station_name", "Unknown")
    rent = c.get("avg_rent", 0.0)
    commute = c.get("total_commute_time", 0.0)
    flood = c.get("flood_risk_label", "Unknown")
    
    pct_under = 0
    if payload.max_budget > 0:
        pct_under = int((1 - (rent / payload.max_budget)) * 100)
        
    rent_str = f"{int(rent):,}".replace(",", ".")
    
    if score >= 75:
        base = f"Kawasan stasiun {name}: sangat direkomendasikan (skor {score:.1f}). Estimasi sewa kos Rp{rent_str}/bulan ({pct_under}% di bawah batas anggaran Anda). Total waktu perjalanan ke {payload.work_station} sekitar {commute} menit. Risiko banjir {flood}."
    elif 50 <= score < 75:
        base = f"Kawasan stasiun {name}: cukup terjangkau (skor {score:.1f}). Estimasi sewa kos Rp{rent_str}/bulan. Waktu perjalanan ke {payload.work_station} sekitar {commute} menit. Risiko banjir {flood}."
    else:
        base = f"Kawasan stasiun {name}: kurang efisien (skor {score:.1f}). Sewa atau biaya hidup harian tinggi untuk anggaran ini. Waktu perjalanan adalah {commute} menit."
        
    if c.get("data_source") == "interpolated":
        base += " (Data primer terbatas. Estimasi ini menggunakan interpolasi spasial.)"
        
    return base

def run_engine(payload: RecommendRequest) -> list[dict]:
    catchments = DataLoader.get_catchments()
    filtered = filter_and_sort(payload, catchments)
    
    results = []
    for c in filtered:
        results.append({
            "station_id": c.get("station_id", ""),
            "station_name": c.get("station_name", ""),
            "composite_score": c.get("composite_score", 0.0),
            "avg_rent": c.get("avg_rent", 0.0),
            "total_commute_time": c.get("total_commute_time", 0.0),
            "flood_risk_score": c.get("flood_risk_score", 0.0),
            "flood_risk_label": c.get("flood_risk_label", ""),
            "data_source": c.get("data_source", "primary"),
            "explanation": generate_explanation(c, payload)
        })
    return results
