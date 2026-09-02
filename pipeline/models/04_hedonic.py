"""Stage 4: station premium.

Rent = b0 + b1 * travel_time + b2 * size + b3 * kos_flag + b4 * house_flag + e

b1 is the station premium in rupiah per extra minute of travel.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROCESSED = ROOT / "data" / "processed"


def run() -> None:
    PROCESSED.mkdir(parents=True, exist_ok=True)
    raise NotImplementedError("Fit the hedonic model. Save coefficients, not guesses.")


if __name__ == "__main__":
    run()
