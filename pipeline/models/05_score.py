"""Stage 5: one report card per catchment.

Composite score is 0 to 100:
  0.40 * rent_score
+ 0.30 * time_score
+ 0.20 * living_cost_score
- 0.10 * flood_penalty   (max 10 points off)

Do not change weights without a written team decision.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROCESSED = ROOT / "data" / "processed"


def run() -> None:
    PROCESSED.mkdir(parents=True, exist_ok=True)
    raise NotImplementedError("Compute composite scores. Write data/processed.")


if __name__ == "__main__":
    run()
