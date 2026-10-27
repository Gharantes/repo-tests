// Bots (automação maliciosa)
//
// Simula o que um robô faz contra a API: força bruta de senha, enumeração de
// usuários e criação em massa. O esperado é que o servidor perceba a rajada e
// barre (HTTP 429, 423 ou 403) antes do fim dela, e que não dê pistas de quais
// logins existem.
//
// Este arquivo roda por último de propósito: quando o limite de taxa existir,
// ele pode bloquear o IP da suíte por um tempo, e os outros arquivos não podem
// pagar por isso.
//
// BOT_TENTATIVAS controla o tamanho da rajada (padrão: 20).

import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { anonimo, garantirBackendNoAr, login, loginAceito, STATUS_DE_BLOQUEIO } from '../lib/api.mjs';
import { consultar, fecharBanco } from '../lib/db.mjs';
import { Massa, sufixoDaExecucao } from '../lib/massa.mjs';

const TENTATIVAS = Number(process.env.BOT_TENTATIVAS ?? 20);

const massa = new Massa();
let inst, maria;

before(async () => {
  await garantirBackendNoAr();
  inst = await massa.instituicao('bots');
  maria = await massa.conta(inst, 'maria');
});

after(async () => {
  await massa.limpar();
  await fecharBanco();
});

/** Dispara `n` requisições em sequência e devolve a lista de status. */
async function rajada(n, requisicao) {
  const status = [];
  for (let i = 0; i < n; i++) {
    status.push((await requisicao(i)).status);
  }
  return status;
}

const foiBarrado = (status) => status.some((s) => STATUS_DE_BLOQUEIO.includes(s));

describe('Bots - enumeração de usuários', () => {
  it('o login responde igual para usuário inexistente e para senha errada', async () => {
    const { resposta: inexistente } = await login(inst.id, 'nao-existe-ninguem', 'qualquer-senha');
    const { resposta: senhaErrada } = await login(inst.id, maria.login, 'qualquer-senha');

    assert.equal(inexistente.status, senhaErrada.status, 'o status entrega se o login existe');
    assert.equal(inexistente.texto, senhaErrada.texto, 'a mensagem entrega se o login existe');
  });

  it('sem login, a API não confirma se um login ou e-mail existe', async () => {
    const resposta = await anonimo().get('/api/entity-account/get-account-by-login-or-email', {
      query: { 'id-tenant': inst.id, login: maria.login, email: 'x@x.test' },
    });

    assert.ok(!resposta.ok, `um robô anônimo descobre logins válidos por aqui (HTTP ${resposta.status}, resposta ${resposta.texto})`);
  });
});

describe('Bots - força bruta', () => {
  it(`${TENTATIVAS} senhas erradas seguidas no login são barradas`, async () => {
    const status = await rajada(TENTATIVAS, (i) =>
      login(inst.id, maria.login, `chute-${i}`).then(({ resposta }) => resposta),
    );

    assert.ok(foiBarrado(status), `nenhuma das ${TENTATIVAS} tentativas foi barrada. Status: ${[...new Set(status)].join(', ')}`);
  });

  it('a força bruta não acerta a senha mesmo quando o chute final é o certo', async () => {
    // Depois da rajada do teste anterior, a conta deveria estar travada ou o IP
    // limitado. Um robô que acerta no chute N+1 não pode entrar direto.
    const { resposta } = await login(inst.id, maria.login, maria.senha);

    assert.equal(loginAceito(resposta), false, 'logo depois da rajada, o robô entrou com a senha certa sem nenhum obstáculo');
  });

  it(`${TENTATIVAS} chutes seguidos na senha da página de instituições são barrados`, async () => {
    const status = await rajada(TENTATIVAS, (i) =>
      anonimo().post('/api/entity-tenant/check-list-tenants-password', { corpo: { password: `chute-${i}` } }),
    );

    assert.ok(foiBarrado(status), `nenhuma das ${TENTATIVAS} tentativas foi barrada. Status: ${[...new Set(status)].join(', ')}`);
  });
});

describe('Bots - criação em massa', () => {
  it(`${TENTATIVAS} cadastros de instituição seguidos são barrados`, async () => {
    const prefixo = `sec-spam-${sufixoDaExecucao}`;

    const status = await rajada(TENTATIVAS, (i) =>
      anonimo().post('/api/entity-tenant/store', {
        corpo: { title: `Spam ${i}`, identifier: `${prefixo}-${i}`, login: 'admin', password: 'Sinergia#Teste-2026!' },
      }),
    );

    const criadas = await consultar('SELECT id FROM tenant WHERE identifier LIKE $1', [`${prefixo}-%`]);
    criadas.forEach(({ id }) => massa.registrarTenant(id));

    assert.ok(foiBarrado(status), `${criadas.length} instituições criadas por robô, nenhuma requisição barrada`);
    assert.ok(criadas.length < TENTATIVAS);
  });
});
