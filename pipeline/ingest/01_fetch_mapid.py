"""Stage 1: fetch sealed jars.

Write only into data/raw/ and data/external/.
Never edit a file that is already in those folders. Write a new dated file instead.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data" / "raw"
EXTERNAL = ROOT / "data" / "external"


def run() -> None:
    RAW.mkdir(parents=True, exist_ok=True)
    EXTERNAL.mkdir(parents=True, exist_ok=True)
    raise NotImplementedError(
        "Connect MAPID, OSM, KRL, and InaRISK here. Save original files only."
    )


if __name__ == "__main__":
    run()
