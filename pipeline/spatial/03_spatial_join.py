"""Stage 3: put each point in the right station bowl.

Join points to 15 / 30 / 45 minute isochrone polygons.
If a catchment has fewer than 5 property points, mark it for IDW later.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
INTERIM = ROOT / "data" / "interim"


def run() -> None:
    INTERIM.mkdir(parents=True, exist_ok=True)
    raise NotImplementedError("Spatial join points to isochrones. Write data/interim.")


if __name__ == "__main__":
    run()
