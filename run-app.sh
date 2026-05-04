#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

fuser -k 3000/tcp 4200/tcp >/dev/null 2>&1 || true

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [[ -n "${FRONTEND_PID:-}" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

echo "Starting backend on port 3000..."
(
  cd "$BACKEND_DIR"
  npm start
) > "$ROOT_DIR/backend.log" 2>&1 &
BACKEND_PID=$!

echo "Starting frontend on port 4200..."
(
  cd "$FRONTEND_DIR"
  npm start
) > "$ROOT_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!

echo ""
echo "App is starting up."
echo "- Backend log: $ROOT_DIR/backend.log"
echo "- Frontend log: $ROOT_DIR/frontend.log"
echo "- Frontend URL: http://localhost:4200"
echo "- Backend URL:  http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services."

wait "$BACKEND_PID" "$FRONTEND_PID"
