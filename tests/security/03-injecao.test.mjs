// Injeção de código
//
// Duas frentes:
//
// 1. Dinâmica: manda payloads clássicos de SQL injection para os campos que
//    chegam ao banco (busca por texto, login, senha, identificador da
//    instituição, parâmetros numéricos) e confere que eles são tratados como
//    dado - nada de vazar outra instituição, derrubar tabela ou abrir sessão.
//    Payload de XSS é gravado e devolvido como JSON, nunca como HTML.
//
// 2. Estática: varre o código-fonte atrás dos padrões que abrem a porta para
//    injeção - SQL montado com interpolação de string no backend, e
//    innerHTML / bypassSecurityTrust / eval no frontend Angular.

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { after, before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { anonimo, garantirBackendNoAr, login, loginAceito } from '../lib/api.mjs';
import { fecharBanco, uma } from '../lib/db.mjs';
import { Massa } from '../lib/massa.mjs';

const RAIZ = fileURLToPath(new URL('../../', import.meta.url));

const PAYLOADS_SQL = [
  "' OR '1'='1",
  "' OR 1=1 --",
  "%' OR 1=1 --",
  "') OR ('1'='1",
  "'; DROP TABLE account; --",
  "' UNION SELECT id, login, password, email, first_name, last_name FROM account --",
];

const massa = new Massa();
let vitima, maria, atacante, eve;

before(async () => {
  await garantirBackendNoAr();
  vitima = await massa.instituicao('inj-vitima');
  maria = await massa.conta(vitima, 'maria');
  await massa.projeto(maria, 'Projeto secreto da vitima');
  atacante = await massa.instituicao('inj-atacante');
  eve = await massa.conta(atacante, 'eve');
});

after(async () => {
  await massa.limpar();
  await fecharBanco();
});

const tabelaExiste = async (nome) => Boolean(await uma('SELECT to_regclass($1) AS t', [nome]).then((r) => r.t));

describe('Injeção de SQL - buscas por texto', () => {
  // Cada busca roda na instituição da própria Eve: se o payload escapar do
  // parâmetro, o resultado traria dados da vítima ou derrubaria a tabela.
  const buscas = [
    ['contas', '/api/entity-account/list-accounts-by-tenant', {}],
    ['projetos', '/api/entity-project/list-projects-by-tenant', {}],
    ['eventos', '/api/entity-event/list-events-by-tenant', {}],
    ['tags', '/api/entity-tag/list-tags-by-tenant', { 'for-projects': false, 'for-events': false, 'for-accounts': false }],
  ];

  for (const [nome, rota, extras] of buscas) {
    it(`a busca de ${nome} trata payloads de SQL como texto`, async () => {
      for (const payload of PAYLOADS_SQL) {
        const resposta = await eve.sessao.post(rota, { query: { 'id-tenant': atacante.id, text: payload, ...extras } });

        assert.notEqual(resposta.status, 500, `erro de SQL com o payload ${payload}`);
        assert.ok(!resposta.texto.includes(maria.email), `dados da vítima vazaram com o payload ${payload}`);
        assert.ok(!resposta.texto.includes('Projeto secreto da vitima'), `dados da vítima vazaram com o payload ${payload}`);
        assert.ok(!resposta.texto.includes(eve.email), `o payload ${payload} casou com tudo (devia buscar o texto literal)`);
      }
      assert.equal(await tabelaExiste('account'), true, 'a tabela account foi derrubada');
    });
  }
});

describe('Injeção de SQL - login', () => {
  it('payload no campo login não abre sessão', async () => {
    for (const payload of ["admin' --", "admin'/*", "' OR '1'='1' --", "maria' OR '1'='1"]) {
      const { resposta } = await login(vitima.id, payload, 'qualquer-coisa');
      assert.equal(loginAceito(resposta), false, `entrou com login = ${payload}`);
    }
  });

  it('payload no campo senha não abre sessão', async () => {
    for (const payload of ["' OR '1'='1", "' OR 1=1 --", "x' OR 'x'='x"]) {
      const { resposta } = await login(vitima.id, 'maria', payload);
      assert.equal(loginAceito(resposta), false, `entrou com senha = ${payload}`);
    }
  });
});

describe('Injeção - outros parâmetros', () => {
  it('parâmetro numérico com SQL é recusado pela conversão de tipo', async () => {
    const resposta = await eve.sessao.post('/api/entity-account/list-accounts-by-tenant', {
      query: { 'id-tenant': `${atacante.id} OR 1=1` },
    });

    assert.equal(resposta.status, 400);
    assert.ok(!resposta.texto.includes(maria.email));
  });

  it('identificador de instituição com SQL é recusado e nada é gravado', async () => {
    const identifier = "x'); DROP TABLE tenant; --";

    const resposta = await anonimo().post('/api/entity-tenant/store', {
      corpo: { title: 'Injeção', identifier, login: 'admin', password: 'Sinergia#Teste-2026!' },
    });

    assert.ok(!resposta.ok, 'identificador malicioso foi aceito');
    assert.equal(await uma('SELECT 1 FROM tenant WHERE identifier = $1', [identifier]), null);
    assert.equal(await tabelaExiste('tenant'), true, 'a tabela tenant foi derrubada');
  });

  it('payload de XSS é guardado como texto e devolvido como JSON, não como HTML', async () => {
    const xss = '<img src=x onerror=alert(document.cookie)><script>alert(1)</script>';
    await massa.projeto(eve, xss);

    const resposta = await eve.sessao.post('/api/entity-project/list-projects-by-tenant', { query: { 'id-tenant': atacante.id } });

    assert.match(resposta.headers.get('content-type') ?? '', /application\/json/);
    assert.ok(resposta.json.some((p) => p.title === xss), 'o título não voltou exatamente como foi enviado');
  });
});

describe('Injeção - análise estática do código-fonte', () => {
  const versionados = (padrao) =>
    execFileSync('git', ['ls-files', padrao], { cwd: RAIZ, encoding: 'utf8' }).split('\n').filter(Boolean);

  const procurar = (arquivos, teste) =>
    arquivos.flatMap((arquivo) =>
      readFileSync(RAIZ + arquivo, 'utf8')
        .split('\n')
        .map((linha, i) => ({ onde: `${arquivo}:${i + 1}`, linha: linha.trim() }))
        .filter(({ linha }) => teste(linha)),
    );

  it('o backend não monta SQL com interpolação de string', () => {
    const SQL = /\b(SELECT|INSERT\s+INTO|DELETE\s+FROM|UPDATE\s+\w+\s+SET|WHERE|ORDER\s+BY)\b/i;
    const INTERPOLACAO = /\$\{?[A-Za-z_]|"\s*\+\s*[A-Za-z_]/;

    const achados = procurar(versionados('backend/src/main/kotlin/**.kt'), (l) => SQL.test(l) && INTERPOLACAO.test(l));

    assert.deepEqual(achados, [], 'SQL montado com string: use parâmetros nomeados (:param)');
  });

  it('os arquivos .sql só usam parâmetros nomeados', () => {
    const achados = procurar(versionados('backend/src/main/resources/sql/**.sql'), (l) => /\$\{|%s/.test(l));

    assert.deepEqual(achados, []);
  });

  it('o frontend não injeta HTML cru nem executa código dinâmico', () => {
    const PERIGOSO = /\[innerHTML\]|\.innerHTML\s*=|outerHTML|insertAdjacentHTML|bypassSecurityTrust|\beval\(|new Function\(|document\.write/;

    const achados = procurar(
      versionados('frontend/src/**').filter((f) => /\.(ts|html)$/.test(f) && !f.endsWith('.spec.ts')),
      (l) => PERIGOSO.test(l),
    );

    assert.deepEqual(achados, []);
  });
});
