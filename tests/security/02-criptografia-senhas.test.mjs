// Criptografia e senhas
//
// Confere, olhando direto no banco, como a senha é guardada: não pode estar em
// texto puro, tem que ser um hash lento e com sal (bcrypt, Argon2, scrypt ou
// PBKDF2), e isso vale em todos os caminhos que gravam senha - cadastro de
// conta, criação da instituição (conta ADMIN) e troca de senha.
//
// Também cobre o fluxo de login (sem atalho que pule a senha, sem vazar hash
// na resposta), a política mínima de senha e segredos versionados no git.

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { after, before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { garantirBackendNoAr, login, loginAceito } from '../lib/api.mjs';
import { fecharBanco, uma } from '../lib/db.mjs';
import { Massa, SENHA_FORTE } from '../lib/massa.mjs';

const RAIZ = fileURLToPath(new URL('../../', import.meta.url));

// Prefixos dos formatos de hash adaptativo mais comuns (inclusive com o
// `{id}` do DelegatingPasswordEncoder do Spring Security).
const HASH_ADAPTATIVO = /^(\{(bcrypt|argon2|argon2@SpringSecurity_v5_8|scrypt|pbkdf2)[^}]*\})?(\$2[aby]\$\d{2}\$|\$argon2(id|i|d)\$|\$s0\$|\$scrypt\$|\$pbkdf2)/;

const massa = new Massa();
let inst;

before(async () => {
  await garantirBackendNoAr();
  inst = await massa.instituicao('cripto');
});

after(async () => {
  await massa.limpar();
  await fecharBanco();
});

const senhaGravada = async (idConta) => (await uma('SELECT password FROM account WHERE id = $1', [idConta])).password;

describe('Senhas - armazenamento', () => {
  it('a senha de uma conta nova não é gravada em texto puro', async () => {
    const conta = await massa.conta(inst, 'texto-puro', 'Minha-Senha-Secreta-1!');

    const gravada = await senhaGravada(conta.id);

    assert.ok(!gravada.includes('Minha-Senha-Secreta-1!'), 'a coluna password contém a senha em texto puro');
  });

  it('a senha é gravada com um hash adaptativo (bcrypt, Argon2, scrypt ou PBKDF2)', async () => {
    const conta = await massa.conta(inst, 'formato-hash');

    const gravada = await senhaGravada(conta.id);

    assert.match(gravada, HASH_ADAPTATIVO, 'o valor gravado não é de um algoritmo de hash de senha conhecido');
  });

  it('duas contas com a mesma senha ficam com hashes diferentes (sal)', async () => {
    const a = await massa.conta(inst, 'sal-a', 'Senha-Repetida-123!');
    const b = await massa.conta(inst, 'sal-b', 'Senha-Repetida-123!');

    assert.notEqual(await senhaGravada(a.id), await senhaGravada(b.id), 'senhas iguais geram valores iguais: sem sal');
  });

  it('a senha do ADMIN criado junto com a instituição também é hash', async () => {
    const gravada = await senhaGravada(inst.admin.id);

    assert.ok(!gravada.includes(SENHA_FORTE), 'a senha do ADMIN está em texto puro');
    assert.match(gravada, HASH_ADAPTATIVO);
  });

  it('a troca de senha também grava hash', async () => {
    const conta = await massa.conta(inst, 'troca');

    const resposta = await conta.sessao.post(`/api/entity-account/update/${conta.id}`, {
      corpo: { idTenant: inst.id, email: conta.email, login: conta.login, password: 'Senha-Nova-456!', firstName: 'x', lastName: 'y' },
    });
    assert.ok(resposta.ok, `a troca da própria senha falhou (HTTP ${resposta.status})`);

    const gravada = await senhaGravada(conta.id);
    assert.ok(!gravada.includes('Senha-Nova-456!'), 'a senha nova foi gravada em texto puro');
    assert.match(gravada, HASH_ADAPTATIVO);
  });
});

describe('Senhas - login', () => {
  it('controle: a senha correta autentica', async () => {
    const conta = await massa.conta(inst, 'login-ok');

    const { resposta } = await login(inst.id, conta.login, conta.senha);

    assert.equal(loginAceito(resposta), true, 'login legítimo falhou - o resto da suíte não é confiável assim');
  });

  it('a senha errada não autentica', async () => {
    const conta = await massa.conta(inst, 'login-errado');

    const { resposta } = await login(inst.id, conta.login, 'senha-errada');

    assert.equal(loginAceito(resposta), false);
  });

  it('não existe atalho de login sem senha (checkLastSeen)', async () => {
    // A conta acabou de logar dentro de massa.conta(), então o last_seen é recente.
    const conta = await massa.conta(inst, 'sem-senha');

    const { resposta } = await login(inst.id, conta.login, '', { checkLastSeen: true });

    assert.equal(loginAceito(resposta), false, 'entrou na conta sem informar a senha');
  });

  it('nem o login nem as listagens devolvem a senha ou o hash', async () => {
    const conta = await massa.conta(inst, 'sem-vazamento');
    const gravada = await senhaGravada(conta.id);

    const { resposta: respLogin } = await login(inst.id, conta.login, conta.senha);
    const respLista = await conta.sessao.post('/api/entity-account/list-accounts-by-tenant', { query: { 'id-tenant': inst.id } });
    const respConta = await conta.sessao.get(`/api/entity-get-by-id/get-account-by-id/${conta.id}`);

    for (const r of [respLogin, respLista, respConta]) {
      assert.ok(!r.texto.includes(gravada), 'o valor gravado da senha apareceu numa resposta da API');
      assert.ok(!/"password"\s*:/i.test(r.texto), 'a resposta tem um campo password');
    }
  });
});

describe('Senhas - política mínima', () => {
  for (const fraca of ['123', 'abc', 'senha']) {
    it(`a senha fraca "${fraca}" é recusada no cadastro`, async () => {
      const usuario = `fraca-${fraca}`;

      const resposta = await inst.admin.sessao.post('/api/entity-account/store', {
        corpo: { idTenant: inst.id, email: `${usuario}@seguranca.test`, login: usuario, password: fraca, firstName: 'x', lastName: 'y' },
      });

      const gravou = await uma('SELECT 1 FROM account WHERE id_tenant = $1 AND login = $2', [inst.id, usuario]);
      assert.equal(gravou, null, `a conta foi criada com a senha "${fraca}"`);
      assert.ok(!resposta.ok);
    });
  }
});

describe('Senhas - segredos no repositório', () => {
  it('nenhum arquivo .env (fora os .env.example) está versionado no git', () => {
    const versionados = execFileSync('git', ['ls-files'], { cwd: RAIZ, encoding: 'utf8' })
      .split('\n')
      .filter((f) => /(^|\/)\.env(\.[^/]*)?$/.test(f) && !f.endsWith('.example'));

    assert.deepEqual(versionados, [], `arquivos .env versionados: ${versionados.join(', ')}`);
  });

  it('os application*.yaml não trazem senha de banco padrão embutida', () => {
    const arquivos = execFileSync('git', ['ls-files', 'backend/src/main/resources/application*.yaml'], { cwd: RAIZ, encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);

    const achados = arquivos.flatMap((arquivo) =>
      readFileSync(RAIZ + arquivo, 'utf8')
        .split('\n')
        .map((linha, i) => ({ arquivo, n: i + 1, linha: linha.trim() }))
        // password: ${VAR:valor-padrão}  ou  password: valor-literal
        .filter(({ linha }) => /^password:\s*(\$\{[^:}]+:[^}]+\}|[^$\s].*)$/.test(linha)),
    );

    assert.deepEqual(
      achados.map((a) => `${a.arquivo}:${a.n}`),
      [],
      'a senha tem valor padrão: se a variável faltar, a aplicação sobe com uma senha conhecida',
    );
  });
});
