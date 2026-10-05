#!/usr/bin/env bash
# Sobe backend e frontend juntos; Ctrl+C derruba os dois.
set -euo pipefail

cd "$(dirname "$0")/.."

trap 'kill 0' EXIT

(cd backend && ./gradlew bootRun) &
(cd frontend && npx nx serve synergia-frontend) &
wait
