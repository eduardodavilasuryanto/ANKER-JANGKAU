import json
from pathlib import Path

# Resolve path to the demo geojson based on the monorepo structure
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
GEOJSON_PATH = BASE_DIR / "frontend" / "public" / "data" / "demo" / "catchments.geojson"

class DataLoader:
    _catchments = None

    @classmethod
    def get_catchments(cls):
        if cls._catchments is None:
            try:
                with open(GEOJSON_PATH, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    cls._catchments = [feature["properties"] for feature in data.get("features", [])]
            except Exception as e:
                print(f"Error loading catchments from {GEOJSON_PATH}: {e}")
                cls._catchments = []
        return cls._catchments
