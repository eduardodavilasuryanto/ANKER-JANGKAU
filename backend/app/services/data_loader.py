"""Load the scored catchment sheet the kitchen uses at runtime."""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

from app.core.config import settings


def _path() -> Path:
    return Path(settings.scored_geojson_path).resolve()


@lru_cache(maxsize=1)
def load_catchments() -> list[dict]:
    path = _path()
    if not path.exists():
        return []
    payload = json.loads(path.read_text(encoding="utf-8"))
    features = payload.get("features", [])
    rows: list[dict] = []
    for feature in features:
        props = feature.get("properties", {})
        rows.append(props)
    return rows
