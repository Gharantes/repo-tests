// Massa de dados dos testes.
//
// Tudo é criado pela API, do jeito legítimo: a instituição pelo cadastro
// público, as contas pelo ADMIN dela, os projetos e eventos pelo próprio dono.
// Assim a senha passa pelo mesmo caminho de gravação de produção (o que importa
// para o teste de criptografia), e a massa continua funcionando quando o
// backend passar a exigir login nessas rotas.
//
// Cada execução usa identificadores únicos, então a suíte pode rodar contra o
// banco de desenvolvimento sem colidir com dados reais, e `limpar()` apaga só
// o que ela mesma criou.

import { anonimo, login } from './api.mjs';
import { excluirTenant, uma } from './db.mjs';

/** Senha que passa em qualquer política razoável, para a massa não depender da política. */
export const SENHA_FORTE = 'Sinergia#Teste-2026!';

const execucao = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function exigirSucesso(resposta, oQue) {
  if (!resposta.ok) {
    const motivo = resposta.headers.get('x-error') ?? resposta.texto;
    throw new Error(`Falha ao preparar a massa (${oQue}): HTTP ${resposta.status} ${motivo}`);
  }
}

export class Massa {
  #tenants = [];

  /** Cria uma instituição pelo cadastro público. Já vem com a conta ADMIN logada. */
  async instituicao(nome) {
    const identifier = `sec-${nome}-${execucao}`.toLowerCase();
    const resposta = await anonimo().post('/api/entity-tenant/store', {
      corpo: { title: `Seg ${nome} ${execucao}`, identifier, login: 'admin', password: SENHA_FORTE },
    });
    exigirSucesso(resposta, `instituição ${nome}`);

    const { id } = await uma('SELECT id FROM tenant WHERE identifier = $1', [identifier]);
    this.#tenants.push(id);

    const idAdmin = (await uma('SELECT id FROM account WHERE id_tenant = $1 AND login = $2', [id, 'admin'])).id;
    const { sessao } = await login(id, 'admin', SENHA_FORTE);
    return { id, identifier, admin: { id: Number(idAdmin), login: 'admin', senha: SENHA_FORTE, sessao } };
  }

  /** Conta comum, criada pelo ADMIN da instituição. */
  async conta(inst, usuario, senha = SENHA_FORTE) {
    const email = `${usuario}.${execucao}@seguranca.test`;
    const resposta = await inst.admin.sessao.post('/api/entity-account/store', {
      corpo: { idTenant: inst.id, email, login: usuario, password: senha, firstName: usuario, lastName: 'Teste' },
    });
    exigirSucesso(resposta, `conta ${usuario}`);

    const { id } = await uma('SELECT id FROM account WHERE id_tenant = $1 AND login = $2', [inst.id, usuario]);
    const { sessao } = await login(inst.id, usuario, senha);
    return { id: Number(id), idTenant: inst.id, login: usuario, senha, email, sessao };
  }

  async projeto(conta, titulo) {
    const resposta = await conta.sessao.post('/api/entity-project/store', {
      corpo: this.#corpoProjetoOuEvento(conta, titulo),
    });
    exigirSucesso(resposta, `projeto ${titulo}`);
    return this.#idPorTitulo('project', conta.idTenant, titulo);
  }

  async evento(conta, titulo) {
    const resposta = await conta.sessao.post('/api/entity-event/store', {
      corpo: this.#corpoProjetoOuEvento(conta, titulo),
    });
    exigirSucesso(resposta, `evento ${titulo}`);
    return this.#idPorTitulo('event', conta.idTenant, titulo);
  }

  async tag(inst, titulo) {
    const resposta = await inst.admin.sessao.post('/api/entity-tag/create-tag', {
      corpo: { idTenant: inst.id, title: titulo, forProjects: true, forEvents: true, forAccounts: true },
    });
    exigirSucesso(resposta, `tag ${titulo}`);
    return this.#idPorTitulo('tags', inst.id, titulo);
  }

  async nota(conta, titulo) {
    const resposta = await conta.sessao.post('/api/entity-note/store', {
      corpo: {
        idTenant: conta.idTenant,
        idAccount: conta.id,
        type: 'TEXT',
        title: titulo,
        content: 'Conteúdo privado da nota.',
        items: [],
        color: '#FFFFFF',
        pinned: false,
        archived: false,
      },
    });
    exigirSucesso(resposta, `nota ${titulo}`);
    return Number(resposta.json);
  }

  /** Registra uma instituição criada fora de `instituicao()` para ela também ser apagada no fim. */
  registrarTenant(id) {
    this.#tenants.push(id);
  }

  async limpar() {
    for (const id of this.#tenants.splice(0)) {
      await excluirTenant(id);
    }
  }

  #corpoProjetoOuEvento(conta, titulo) {
    return {
      idTenant: conta.idTenant,
      idAccount: conta.id,
      title: titulo,
      description: 'Criado pela suíte de segurança.',
      bannerUrl: null,
      tags: [],
    };
  }

  async #idPorTitulo(tabela, idTenant, titulo) {
    const linha = await uma(`SELECT id FROM ${tabela} WHERE id_tenant = $1 AND title = $2`, [idTenant, titulo]);
    return Number(linha.id);
  }
}

export const sufixoDaExecucao = execucao;
