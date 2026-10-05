#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Starting PostgreSQL via Docker Compose..."
docker compose up -d postgres

echo "Starting backend..."
(cd backend && mvn spring-boot:run) &
BACKEND_PID=$!

echo "Starting frontend..."
(cd frontend && npm install && npm run dev -- --host 0.0.0.0) &
FRONTEND_PID=$!

trap 'kill $BACKEND_PID $FRONTEND_PID' EXIT
wait
