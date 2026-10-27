// IDOR (Insecure Direct Object Reference)
//
// Cenário: duas instituições. Na "vítima" mora a Maria, com projeto, evento,
// tag e nota. Na "atacante" mora a Eve, que faz login normalmente na própria
// instituição e depois tenta mexer nos objetos da vítima só trocando o ID na
// URL ou no corpo da requisição.
//
// Cada teste confere o ESTADO no banco, não só o status HTTP: o que importa é
// se o dado da vítima foi lido, alterado ou apagado. Os testes de "controle"
// garantem o outro lado - que o dono legítimo continua conseguindo usar a
// rota. Sem eles, uma rota quebrada passaria por "segura".

import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { anonimo, garantirBackendNoAr, login, loginAceito, recusado } from '../lib/api.mjs';
import { fecharBanco, uma } from '../lib/db.mjs';
import { Massa } from '../lib/massa.mjs';

const massa = new Massa();
let vitima, maria, idProjeto, idEvento, idNota;
let atacante, eve;

before(async () => {
  await garantirBackendNoAr();

  vitima = await massa.instituicao('vitima');
  maria = await massa.conta(vitima, 'maria');
  idProjeto = await massa.projeto(maria, 'Projeto da Maria');
  idEvento = await massa.evento(maria, 'Evento da Maria');
  idNota = await massa.nota(maria, 'Nota privada da Maria');

  atacante = await massa.instituicao('atacante');
  eve = await massa.conta(atacante, 'eve');
});

after(async () => {
  await massa.limpar();
  await fecharBanco();
});

const tituloNoBanco = async (tabela, id) => (await uma(`SELECT title FROM ${tabela} WHERE id = $1`, [id]))?.title;
const existe = async (tabela, id) => Boolean(await uma(`SELECT 1 FROM ${tabela} WHERE id = $1`, [id]));

describe('IDOR - controles (o dono legítimo continua conseguindo usar as rotas)', () => {
  it('a Maria edita o próprio projeto', async () => {
    const id = await massa.projeto(maria, 'Projeto de controle');

    const resposta = await maria.sessao.post(`/api/entity-project/update/${id}`, {
      corpo: { idTenant: vitima.id, idAccount: maria.id, title: 'Projeto de controle editado', description: 'ok', bannerUrl: null, tags: [] },
    });

    assert.ok(resposta.ok, `a edição legítima deveria funcionar (HTTP ${resposta.status})`);
    assert.equal(await tituloNoBanco('project', id), 'Projeto de controle editado');
  });

  it('a Maria apaga a própria nota', async () => {
    const id = await massa.nota(maria, 'Nota de controle');

    const resposta = await maria.sessao.delete(`/api/entity-note/delete/${id}`, { query: { 'id-account': maria.id } });

    assert.ok(resposta.ok, `a exclusão legítima deveria funcionar (HTTP ${resposta.status})`);
    assert.equal(await existe('note', id), false);
  });
});

describe('IDOR - leitura de dados de outra instituição', () => {
  it('sem login, a API recusa listar as contas de uma instituição', async () => {
    const resposta = await anonimo().post('/api/entity-account/list-accounts-by-tenant', {
      query: { 'id-tenant': vitima.id },
    });

    assert.ok(recusado(resposta), `rota de dados respondeu HTTP ${resposta.status} para quem não fez login`);
    assert.ok(!resposta.texto.includes(maria.email), 'e-mail da Maria vazou para um anônimo');
  });

  it('a Eve não lista as contas da instituição vítima trocando o id-tenant', async () => {
    const resposta = await eve.sessao.post('/api/entity-account/list-accounts-by-tenant', {
      query: { 'id-tenant': vitima.id },
    });

    assert.ok(!resposta.texto.includes(maria.email), 'a lista de contas da vítima (com e-mail) vazou para a Eve');
  });

  it('a Eve não lê a conta da Maria pelo ID', async () => {
    const resposta = await eve.sessao.get(`/api/entity-get-by-id/get-account-by-id/${maria.id}`);

    assert.ok(!resposta.texto.includes(maria.email), 'os dados da conta da Maria vazaram para a Eve');
  });
});

describe('IDOR - alteração de dados de outra instituição', () => {
  it('a Eve não edita o projeto da Maria', async () => {
    const resposta = await eve.sessao.post(`/api/entity-project/update/${idProjeto}`, {
      corpo: { idTenant: vitima.id, idAccount: eve.id, title: 'PROJETO INVADIDO', description: 'x', bannerUrl: null, tags: [] },
    });

    assert.equal(await tituloNoBanco('project', idProjeto), 'Projeto da Maria', 'o projeto da vítima foi alterado');
    assert.ok(recusado(resposta), `o servidor aceitou a edição (HTTP ${resposta.status})`);
  });

  it('a Eve não edita o evento da Maria', async () => {
    const resposta = await eve.sessao.post(`/api/entity-event/update/${idEvento}`, {
      corpo: { idTenant: vitima.id, idAccount: eve.id, title: 'EVENTO INVADIDO', description: 'x', bannerUrl: null, tags: [] },
    });

    assert.equal(await tituloNoBanco('event', idEvento), 'Evento da Maria', 'o evento da vítima foi alterado');
    assert.ok(recusado(resposta), `o servidor aceitou a edição (HTTP ${resposta.status})`);
  });

  it('a Eve não renomeia a instituição vítima', async () => {
    const tituloOriginal = await tituloNoBanco('tenant', vitima.id);

    const resposta = await eve.sessao.post(`/api/entity-tenant/update/${vitima.id}`, {
      corpo: { title: 'INSTITUICAO INVADIDA', identifier: vitima.identifier, login: '', password: '' },
    });

    assert.equal(await tituloNoBanco('tenant', vitima.id), tituloOriginal, 'a instituição da vítima foi renomeada');
    assert.ok(recusado(resposta), `o servidor aceitou a edição (HTTP ${resposta.status})`);
  });

  it('a Eve não troca a senha do ADMIN da instituição vítima', async () => {
    const senhaDoAtacante = 'Eve-Assumiu-o-Admin-1!';

    const resposta = await eve.sessao.post(`/api/entity-account/update/${vitima.admin.id}`, {
      corpo: {
        idTenant: vitima.id,
        email: 'eve@atacante.test',
        login: 'admin',
        password: senhaDoAtacante,
        firstName: 'System',
        lastName: 'Admin',
      },
    });

    const { resposta: loginDaEve } = await login(vitima.id, 'admin', senhaDoAtacante);
    assert.equal(loginAceito(loginDaEve), false, 'a Eve tomou a conta ADMIN da vítima com a senha que ela escolheu');
    assert.ok(recusado(resposta), `o servidor aceitou a troca de senha (HTTP ${resposta.status})`);
  });
});

describe('IDOR - exclusão de dados de outra instituição', () => {
  it('a Eve não apaga uma conta da instituição vítima', async () => {
    const alvo = await massa.conta(vitima, 'alvo-exclusao');

    const resposta = await eve.sessao.delete(`/api/entity-delete-by-id/delete-account/${alvo.id}`);

    assert.equal(await existe('account', alvo.id), true, 'a conta da vítima foi apagada');
    assert.ok(recusado(resposta), `o servidor aceitou a exclusão (HTTP ${resposta.status})`);
  });

  it('a Eve não apaga uma tag da instituição vítima', async () => {
    const idTag = await massa.tag(vitima, 'Tag da vítima');

    // Esta rota apaga via GET: basta a vítima abrir um link ou imagem.
    const resposta = await eve.sessao.get(`/api/entity-delete-by-id/delete-tag-by-id/${idTag}`);

    assert.equal(await existe('tags', idTag), true, 'a tag da vítima foi apagada');
    assert.ok(recusado(resposta), `o servidor aceitou a exclusão (HTTP ${resposta.status})`);
  });

  it('a Eve não apaga a nota da Maria informando o próprio id-account', async () => {
    const resposta = await eve.sessao.delete(`/api/entity-note/delete/${idNota}`, { query: { 'id-account': eve.id } });

    assert.equal(await existe('note', idNota), true, 'a nota da Maria foi apagada');
    assert.ok(recusado(resposta), `o servidor aceitou a exclusão (HTTP ${resposta.status})`);
  });

  it('a Eve não apaga a nota da Maria se passando por ela (id-account da Maria)', async () => {
    // A checagem de dono das notas existe, mas confia no id-account que o
    // cliente manda. A identidade tem que vir da sessão, não da requisição.
    const resposta = await eve.sessao.delete(`/api/entity-note/delete/${idNota}`, { query: { 'id-account': maria.id } });

    assert.equal(await existe('note', idNota), true, 'a nota da Maria foi apagada por quem não é a Maria');
    assert.ok(recusado(resposta), `o servidor aceitou a exclusão (HTTP ${resposta.status})`);
  });
});
