"""Stage 2: wash the groceries.

Rent: 100_000 <= price <= 50_000_000
Food: 1_000 <= price <= 200_000
Receipt: 1_000 <= amount <= 5_000_000
Keep points inside 106.5E-107.5E, 6.8S-6.0S. Drop (0, 0).

Write only into data/interim/.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
INTERIM = ROOT / "data" / "interim"


def run() -> None:
    INTERIM.mkdir(parents=True, exist_ok=True)
    raise NotImplementedError("Read data/raw, apply the wash rules, write data/interim.")


if __name__ == "__main__":
    run()
