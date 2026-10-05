#!/usr/bin/env bash
# Apaga todas as tabelas do schema public e recria a partir dos .sql em db/.
set -euo pipefail

cd "$(dirname "$0")/.."

export PGHOST="${DB_HOST:-localhost}"
export PGPORT="${DB_PORT:-5432}"
export PGDATABASE="${DB_NAME:-test_dev}"
export PGUSER="${DB_USER:-evoge_user}"
export PGPASSWORD="${DB_PASSWORD:-evoge_pass}"

read -rp "Apagar TODOS os dados de '$PGDATABASE' em $PGHOST:$PGPORT? Digite o nome do banco para confirmar: " answer
[[ "$answer" == "$PGDATABASE" ]] || { echo "Cancelado."; exit 1; }

sql_files=()
for f in db/*.sql; do sql_files+=(-f "$f"); done

# Tudo numa transação: se a criação falhar, o wipe é desfeito.
psql -v ON_ERROR_STOP=1 --single-transaction -c "
DO \$\$
DECLARE t text;
BEGIN
  FOR t IN SELECT quote_ident(tablename) FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE 'TRUNCATE TABLE ' || t || ' CASCADE';
  END LOOP;
  FOR t IN SELECT quote_ident(tablename) FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE 'DROP TABLE IF EXISTS ' || t || ' CASCADE';
  END LOOP;
END \$\$;" "${sql_files[@]}"

echo "Banco '$PGDATABASE' recriado."
