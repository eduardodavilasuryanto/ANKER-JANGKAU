"""Stage 6: pack the lunch for the shop.

Write data/outputs/jangkau_bogor_line_scored.geojson
Copy a small copy into frontend/public/data/ only when the file stays light.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUTPUTS = ROOT / "data" / "outputs"
PUBLIC = ROOT / "frontend" / "public" / "data"


def run() -> None:
    OUTPUTS.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    raise NotImplementedError("Export scored GeoJSON for the map and the kitchen.")


if __name__ == "__main__":
    run()
