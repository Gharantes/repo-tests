#!/usr/bin/env bash
# Roda a suíte de segurança de ponta a ponta:
#
#   1. se já houver um backend respondendo em API_URL, usa ele;
#   2. senão, empacota o backend, sobe o .jar apontando para o banco das
#      variáveis PG* e derruba ele no fim.
#
# O banco é o mesmo para o backend e para os testes (que leem o que foi gravado),
# por isso a configuração fica num lugar só: PGHOST, PGPORT, PGDATABASE, PGUSER e
# PGPASSWORD - as variáveis padrão do Postgres.
#
# Uso:  bash tests/rodar.sh            (todos os testes)
#       bash tests/rodar.sh test:idor  (um script do package.json)
set -euo pipefail

cd "$(dirname "$0")"
RAIZ="$(cd .. && pwd)"

export API_URL="${API_URL:-http://localhost:8080}"
export PGHOST="${PGHOST:-localhost}"
export PGPORT="${PGPORT:-5432}"
export PGDATABASE="${PGDATABASE:-synergia_seguranca}"
export PGUSER="${PGUSER:-postgres}"
SCRIPT_NPM="${1:-test}"

backend_no_ar() {
  curl -4 -fsS -o /dev/null -X POST "$API_URL/api/entity-tenant/list-all-tenants" 2>/dev/null
}

[ -d node_modules ] || npm ci --no-audit --no-fund

if backend_no_ar; then
  echo "Usando o backend que já está no ar em $API_URL."
else
  LOG="${RUNNER_TEMP:-$RAIZ/tests}/backend-seguranca.log"

  jar=$(ls "$RAIZ"/backend/build/libs/*.jar 2>/dev/null | grep -v -- '-plain.jar' | head -n 1 || true)
  if [ -z "$jar" ]; then
    echo "Empacotando o backend..."
    (cd "$RAIZ/backend" && ./gradlew bootJar -x test --no-daemon -q)
    jar=$(ls "$RAIZ"/backend/build/libs/*.jar | grep -v -- '-plain.jar' | head -n 1)
  fi

  echo "Subindo $jar contra $PGHOST:$PGPORT/$PGDATABASE (log em $LOG)"
  # Sobe a partir de tests/ e não de backend/: assim o backend/.env da máquina
  # de desenvolvimento não é carregado por cima do banco de teste.
  DATABASE_URL="jdbc:postgresql://$PGHOST:$PGPORT/$PGDATABASE" \
  DATABASE_USERNAME="$PGUSER" \
  DATABASE_PASSWORD="${PGPASSWORD:-}" \
  DATABASE_NAME="$PGDATABASE" \
  LIST_TENANT_PAGE_PASSWORD="${LIST_TENANT_PAGE_PASSWORD:-senha-da-suite-de-seguranca}" \
    java -Xmx768m -jar "$jar" --server.port="${API_URL##*:}" > "$LOG" 2>&1 &
  BACKEND_PID=$!
  trap 'kill "$BACKEND_PID" 2>/dev/null || true' EXIT

  for i in $(seq 1 60); do
    if backend_no_ar; then
      echo "Backend no ar depois de ~$((i * 2))s."
      break
    fi
    if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
      echo "O backend morreu ao subir. Últimas linhas do log:"
      tail -n 40 "$LOG"
      exit 1
    fi
    sleep 2
  done
  backend_no_ar || { echo "O backend não respondeu em 2 minutos."; tail -n 40 "$LOG"; exit 1; }
fi

npm run "$SCRIPT_NPM"
