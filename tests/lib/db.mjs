// Acesso direto ao PostgreSQL que o backend em teste está usando.
//
// Serve para duas coisas que a API não mostra: conferir o que de fato foi
// gravado (a senha está em hash? o título mudou?) e limpar a massa no fim.
//
// A conexão vem das variáveis padrão do Postgres (PGHOST, PGPORT, PGDATABASE,
// PGUSER, PGPASSWORD), as mesmas que o psql usa. PG_URL, se definida, ganha.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

let pool = null;

function conexao() {
  pool ??= new pg.Pool(process.env.PG_URL ? { connectionString: process.env.PG_URL } : {});
  return pool;
}

export async function consultar(sql, params = []) {
  const { rows } = await conexao().query(sql, params);
  return rows;
}

export async function uma(sql, params = []) {
  return (await consultar(sql, params))[0] ?? null;
}

export async function fecharBanco() {
  await pool?.end();
  pool = null;
}

// A limpeza reaproveita o SQL de exclusão de tenant da própria aplicação, para
// não manter uma segunda lista de tabelas que pode ficar desatualizada.
const SQL_EXCLUIR_TENANT = readFileSync(
  fileURLToPath(new URL('../../backend/src/main/resources/sql/entity-tenant/delete-tenant.sql', import.meta.url)),
  'utf8',
)
  .split('\n')
  .filter((linha) => !linha.trim().startsWith('--'))
  .join('\n')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => s.replaceAll(':id_tenant', '$1'));

export async function excluirTenant(idTenant) {
  for (const sql of SQL_EXCLUIR_TENANT) {
    await conexao().query(sql, [idTenant]);
  }
}
