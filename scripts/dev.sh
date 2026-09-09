#!/usr/bin/env bash
# Start FastAPI and Vite together for local development.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cleanup() {
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}

(
  cd "$ROOT_DIR/backend"
  exec uv run uvicorn app.main:app --reload --port 8000
) &
BACKEND_PID=$!

(
  cd "$ROOT_DIR/frontend"
  exec npm run dev
) &
FRONTEND_PID=$!

trap cleanup EXIT INT TERM

echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8000/docs"
wait
