/// <reference types="cypress" />

/**
 * Comandos compartilhados pelos testes de sistema.
 *
 * Regra da suíte: nada aqui simula resposta de servidor. A massa de dados é
 * criada chamando a API real (`cy.request`), que grava no PostgreSQL real, e a
 * verificação é feita ou pela interface ou consultando a mesma API. Cada
 * execução usa um identificador único, então as rodadas não colidem entre si
 * nem exigem limpar o banco antes.
 */

export interface InstituicaoDeTeste {
  idTenant: number;
  identifier: string;
  title: string;
  senhaAdmin: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Cria uma instituição nova (com a conta ADMIN) chamando a API real. */
      criarInstituicao(senhaAdmin?: string): Chainable<InstituicaoDeTeste>;
      /** Cria uma tag pela API real e devolve o id gravado. */
      criarTag(idTenant: number, titulo: string): Chainable<number>;
      /** Cria um projeto pela API real e devolve o id gravado. */
      criarProjeto(
        idTenant: number,
        idAccount: number,
        titulo: string,
        descricao?: string
      ): Chainable<number>;
      /** Faz login pela interface, preenchendo o formulário como um aluno faria. */
      entrarPelaInterface(
        instituicao: InstituicaoDeTeste,
        login?: string,
        senha?: string
      ): Chainable<void>;
      /** Digita num campo do Angular Material identificado pelo rótulo. */
      preencherCampo(rotulo: string, valor: string): Chainable<void>;
      /** Navega até a listagem de projetos pelo menu lateral, como um usuário faria. */
      irParaProjetos(): Chainable<void>;
      /** Navega da listagem para o formulário de novo projeto. */
      irParaNovoProjeto(): Chainable<void>;
      /** Lê os projetos de um tenant direto da API real, para conferir persistência. */
      listarProjetosPelaApi(
        idTenant: number,
        texto?: string
      ): Chainable<Array<{ id: number; title: string }>>;
    }
  }
}

const api = () => Cypress.env('apiUrl') as string;

/** Sufixo único por execução, para que rodadas repetidas não colidam. */
const sufixo = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

Cypress.Commands.add('criarInstituicao', (senhaAdmin = 'AdminE2E123') => {
  const marca = sufixo();
  const identifier = `e2e-${marca}`;
  const title = `Instituição E2E ${marca}`;

  return cy
    .request({
      method: 'POST',
      url: `${api()}/api/entity-tenant/store`,
      body: { title, identifier, password: senhaAdmin, isPrivate: false },
    })
    .then((resposta) => {
      expect(resposta.status, 'criação da instituição').to.eq(200);
      // Lê de volta pela API para pegar o id que o banco gerou.
      return cy
        .request('POST', `${api()}/api/entity-tenant/list-all-tenants`)
        .then((lista) => {
          const tenant = (lista.body as Array<{ id: number; identifier: string }>).find(
            (t) => t.identifier === identifier
          );
          expect(tenant, `tenant ${identifier} deve existir no banco`).to.not.be.undefined;
          return cy.wrap<InstituicaoDeTeste>(
            {
              idTenant: (tenant as { id: number }).id,
              identifier,
              title,
              senhaAdmin,
            },
            { log: false }
          );
        });
    });
});

Cypress.Commands.add('criarTag', (idTenant: number, titulo: string) => {
  return cy
    .request({
      method: 'POST',
      url: `${api()}/api/entity-tag/create-tag`,
      body: {
        idTenant,
        title: titulo,
        forProjects: true,
        forEvents: false,
        forAccounts: false,
      },
    })
    .then((resposta) => {
      expect(resposta.status, 'criação da tag').to.eq(200);
      return cy
        .request(
          'POST',
          `${api()}/api/entity-tag/list-tags-by-tenant?id-tenant=${idTenant}` +
            `&for-projects=false&for-events=false&for-accounts=false&text=${encodeURIComponent(titulo)}`
        )
        .then((lista) => {
          const tag = (lista.body as Array<{ id: number; title: string }>).find(
            (t) => t.title === titulo
          );
          expect(tag, `tag ${titulo} deve existir no banco`).to.not.be.undefined;
          return cy.wrap((tag as { id: number }).id, { log: false });
        });
    });
});

Cypress.Commands.add(
  'criarProjeto',
  (idTenant: number, idAccount: number, titulo: string, descricao = 'Projeto criado pelo teste de sistema.') => {
    return cy
      .request({
        method: 'POST',
        url: `${api()}/api/entity-project/store`,
        body: { idTenant, idAccount, title: titulo, description: descricao, bannerUrl: null, tags: [] },
      })
      .then((resposta) => {
        expect(resposta.status, 'criação do projeto').to.eq(200);
        return cy.listarProjetosPelaApi(idTenant, titulo).then((projetos) => {
          const projeto = projetos.find((p) => p.title === titulo);
          expect(projeto, `projeto ${titulo} deve existir no banco`).to.not.be.undefined;
          return cy.wrap((projeto as { id: number }).id, { log: false });
        });
      });
  }
);

Cypress.Commands.add('listarProjetosPelaApi', (idTenant: number, texto?: string) => {
  const url =
    `${api()}/api/entity-project/list-projects-by-tenant?id-tenant=${idTenant}` +
    (texto ? `&text=${encodeURIComponent(texto)}` : '');
  return cy.request('POST', url).then((r) => cy.wrap(r.body as Array<{ id: number; title: string }>, { log: false }));
});

Cypress.Commands.add(
  'entrarPelaInterface',
  (instituicao: InstituicaoDeTeste, login = 'ADMIN', senha?: string) => {
    cy.visit('/login');

    // O campo de instituição é um autocomplete: digitar não basta, é preciso
    // escolher a opção, porque o formulário guarda o objeto e não o texto.
    cy.preencherCampo('Tenant', instituicao.identifier);
    cy.get('mat-option').contains(instituicao.identifier).click();

    cy.preencherCampo('Usuário', login);
    cy.preencherCampo('Senha', senha ?? instituicao.senhaAdmin);

    cy.contains('button', 'Login').should('not.be.disabled').click();

    // A aplicação leva para o dashboard quando a API confirma as credenciais.
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard');
  }
);

Cypress.Commands.add('preencherCampo', (rotulo: string, valor: string) => {
  // O `mat-label` do Angular Material fica por cima do input enquanto o campo
  // está vazio e sem foco, e o Cypress se recusa a digitar num elemento coberto.
  // Focar primeiro faz o rótulo subir, e aí a digitação acontece como a de uma
  // pessoa - sem `force: true`, que desligaria a checagem de que o campo está
  // mesmo clicável.
  cy.contains('mat-form-field', rotulo).find('input').focus().should('be.focused').type(valor);
});

Cypress.Commands.add('irParaProjetos', () => {
  // Navegação de verdade, pelo menu lateral. Visitar /projects direto pela URL
  // não serve: a sessão vive em memória, então um carregamento novo cai no
  // guard HasActiveTenant e volta para o login. Pelo menu, o usuário continua
  // na mesma instância da aplicação, que é o caminho real.
  cy.contains('.nav-sub-item', 'Projetos').should('be.visible').click();
  cy.location('pathname', { timeout: 20000 }).should('include', '/projects');
  cy.contains('button', 'Criar novo projeto').should('be.visible');
});

Cypress.Commands.add('irParaNovoProjeto', () => {
  cy.contains('button', 'Criar novo projeto').click();
  cy.location('pathname', { timeout: 20000 }).should('include', '/create-project');
  cy.contains('mat-form-field', 'Título').should('be.visible');
});

export {};
