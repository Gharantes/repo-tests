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

export interface TagDeTeste {
  id: number;
  title: string;
}

export interface BandeirasDaTag {
  forProjects?: boolean;
  forEvents?: boolean;
  forAccounts?: boolean;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Cria uma instituição nova (com a conta ADMIN) chamando a API real. */
      criarInstituicao(senhaAdmin?: string): Chainable<InstituicaoDeTeste>;
      /** Descobre o id da conta ADMIN da instituição, pela API real de login. */
      idDaContaAdmin(instituicao: InstituicaoDeTeste): Chainable<number>;
      /** Cria uma tag pela API real e devolve o id gravado. */
      criarTag(
        idTenant: number,
        titulo: string,
        bandeiras?: BandeirasDaTag
      ): Chainable<number>;
      /** Cria um projeto pela API real e devolve o id gravado. */
      criarProjeto(
        idTenant: number,
        idAccount: number,
        titulo: string,
        descricao?: string,
        tags?: number[]
      ): Chainable<number>;
      /** Cria um evento pela API real e devolve o id gravado. */
      criarEvento(
        idTenant: number,
        idAccount: number,
        titulo: string,
        descricao?: string,
        tags?: number[]
      ): Chainable<number>;
      /** Cria uma conta pela API real e devolve o id gravado. */
      criarConta(
        idTenant: number,
        login: string,
        primeiroNome: string,
        sobrenome: string,
        senha: string
      ): Chainable<number>;
      /** Faz login pela interface, preenchendo o formulário como um aluno faria. */
      entrarPelaInterface(
        instituicao: InstituicaoDeTeste,
        login?: string,
        senha?: string
      ): Chainable<void>;
      /** Sai da sessão pelo menu do avatar, como o usuário faria. */
      sairPelaInterface(): Chainable<void>;
      /** Digita num campo do Angular Material identificado pelo rótulo. */
      preencherCampo(rotulo: string, valor: string): Chainable<void>;
      /** Alterna uma caixa de seleção do Material, identificada pelo rótulo. */
      alternarCaixa(rotulo: string): Chainable<void>;
      /** Apaga o conteúdo do campo e digita outro, para as telas de edição. */
      substituirCampo(rotulo: string, valor: string): Chainable<void>;
      /** Navega até a listagem de projetos pelo menu lateral, como um usuário faria. */
      irParaProjetos(): Chainable<void>;
      /** Navega da listagem para o formulário de novo projeto. */
      irParaNovoProjeto(): Chainable<void>;
      /** Navega até a listagem de eventos pelo menu lateral. */
      irParaEventos(): Chainable<void>;
      /** Navega da listagem para o formulário de novo evento. */
      irParaNovoEvento(): Chainable<void>;
      /** Navega até a listagem de tags, abrindo o grupo Administração do menu. */
      irParaTags(): Chainable<void>;
      /** Navega até a listagem de usuários, abrindo o grupo Administração. */
      irParaUsuarios(): Chainable<void>;
      /** Escolhe uma tag no filtro da listagem de projetos e fecha o painel. */
      filtrarPorTag(titulo: string): Chainable<void>;
      /** Abre o diálogo do card de um projeto na listagem. */
      abrirCardDoProjeto(titulo: string): Chainable<void>;
      /** Abre o diálogo do card de um evento na listagem. */
      abrirCardDoEvento(titulo: string): Chainable<void>;
      /** Aciona uma ação do menu de três pontos, na linha da tabela que contém o texto. */
      acaoDaLinha(textoDaLinha: string, acao: string): Chainable<void>;
      /** Lê os projetos de um tenant direto da API real, para conferir persistência. */
      listarProjetosPelaApi(
        idTenant: number,
        texto?: string
      ): Chainable<Array<{ id: number; title: string }>>;
      /** Lê os eventos de um tenant direto da API real. */
      listarEventosPelaApi(
        idTenant: number,
        texto?: string
      ): Chainable<Array<{ id: number; title: string }>>;
      /** Lê as contas de um tenant direto da API real. */
      listarContasPelaApi(
        idTenant: number,
        texto?: string
      ): Chainable<
        Array<{ id: number; login: string; firstName: string; lastName: string }>
      >;
      /** Lê as tags de um tenant direto da API real. */
      listarTagsPelaApi(
        idTenant: number,
        texto?: string
      ): Chainable<
        Array<{
          id: number;
          title: string;
          forProjects: boolean;
          forEvents: boolean;
          forAccounts: boolean;
        }>
      >;
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

Cypress.Commands.add('idDaContaAdmin', (instituicao: InstituicaoDeTeste) => {
  // O login pela API devolve o id da conta, que é o que a massa de dados precisa
  // para vincular autor/organizador. É a mesma consulta que a tela usa.
  return cy
    .request('POST', `${api()}/api/page-login/check-login-information`, {
      idTenant: instituicao.idTenant,
      login: 'ADMIN',
      password: instituicao.senhaAdmin,
      checkLastSeen: false,
    })
    .then((r) => cy.wrap((r.body as { idAccount: number }).idAccount, { log: false }));
});

Cypress.Commands.add(
  'criarTag',
  (idTenant: number, titulo: string, bandeiras: BandeirasDaTag = {}) => {
    return cy
      .request({
        method: 'POST',
        url: `${api()}/api/entity-tag/create-tag`,
        body: {
          idTenant,
          title: titulo,
          forProjects: bandeiras.forProjects ?? true,
          forEvents: bandeiras.forEvents ?? false,
          forAccounts: bandeiras.forAccounts ?? false,
        },
      })
      .then((resposta) => {
        expect(resposta.status, 'criação da tag').to.eq(200);
        return cy.listarTagsPelaApi(idTenant, titulo).then((tags) => {
          const tag = tags.find((t) => t.title === titulo);
          expect(tag, `tag ${titulo} deve existir no banco`).to.not.be.undefined;
          return cy.wrap((tag as { id: number }).id, { log: false });
        });
      });
  }
);

Cypress.Commands.add(
  'criarProjeto',
  (
    idTenant: number,
    idAccount: number,
    titulo: string,
    descricao = 'Projeto criado pelo teste de sistema.',
    tags: number[] = []
  ) => {
    return cy
      .request({
        method: 'POST',
        url: `${api()}/api/entity-project/store`,
        body: { idTenant, idAccount, title: titulo, description: descricao, bannerUrl: null, tags },
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

Cypress.Commands.add(
  'criarEvento',
  (
    idTenant: number,
    idAccount: number,
    titulo: string,
    descricao = 'Evento criado pelo teste de sistema.',
    tags: number[] = []
  ) => {
    return cy
      .request({
        method: 'POST',
        url: `${api()}/api/entity-event/store`,
        body: { idTenant, idAccount, title: titulo, description: descricao, bannerUrl: null, tags },
      })
      .then((resposta) => {
        expect(resposta.status, 'criação do evento').to.eq(200);
        return cy.listarEventosPelaApi(idTenant, titulo).then((eventos) => {
          const evento = eventos.find((e) => e.title === titulo);
          expect(evento, `evento ${titulo} deve existir no banco`).to.not.be.undefined;
          return cy.wrap((evento as { id: number }).id, { log: false });
        });
      });
  }
);

Cypress.Commands.add(
  'criarConta',
  (
    idTenant: number,
    login: string,
    primeiroNome: string,
    sobrenome: string,
    senha: string
  ) => {
    return cy
      .request({
        method: 'POST',
        url: `${api()}/api/entity-account/store`,
        body: {
          idTenant,
          email: `${login.toLowerCase()}@e2e.local`,
          login,
          password: senha,
          firstName: primeiroNome,
          lastName: sobrenome,
          tags: [],
        },
      })
      .then((resposta) => {
        expect(resposta.status, 'criação da conta').to.eq(200);
        return cy.listarContasPelaApi(idTenant, login).then((contas) => {
          const conta = contas.find((c) => c.login === login);
          expect(conta, `conta ${login} deve existir no banco`).to.not.be.undefined;
          return cy.wrap((conta as { id: number }).id, { log: false });
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

Cypress.Commands.add('listarEventosPelaApi', (idTenant: number, texto?: string) => {
  const url =
    `${api()}/api/entity-event/list-events-by-tenant?id-tenant=${idTenant}` +
    (texto ? `&text=${encodeURIComponent(texto)}` : '');
  return cy.request('POST', url).then((r) => cy.wrap(r.body as Array<{ id: number; title: string }>, { log: false }));
});

Cypress.Commands.add('listarContasPelaApi', (idTenant: number, texto?: string) => {
  const url =
    `${api()}/api/entity-account/list-accounts-by-tenant?id-tenant=${idTenant}&lookup-tags=true` +
    (texto ? `&text=${encodeURIComponent(texto)}` : '');
  return cy
    .request('POST', url)
    .then((r) =>
      cy.wrap(
        r.body as Array<{ id: number; login: string; firstName: string; lastName: string }>,
        { log: false }
      )
    );
});

Cypress.Commands.add('listarTagsPelaApi', (idTenant: number, texto?: string) => {
  // As três bandeiras vão como false de propósito: é assim que a tela de tags
  // consulta, e significa "não filtre por uso", não "traga só as desmarcadas".
  const url =
    `${api()}/api/entity-tag/list-tags-by-tenant?id-tenant=${idTenant}` +
    `&for-projects=false&for-events=false&for-accounts=false` +
    (texto ? `&text=${encodeURIComponent(texto)}` : '');
  return cy.request('POST', url).then((r) =>
    cy.wrap(
      r.body as Array<{
        id: number;
        title: string;
        forProjects: boolean;
        forEvents: boolean;
        forAccounts: boolean;
      }>,
      { log: false }
    )
  );
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

Cypress.Commands.add('sairPelaInterface', () => {
  // Sair de verdade: o menu do avatar limpa o localStorage e volta para o
  // login. Sem isso, a tela de login reencontra a sessão guardada e entra
  // sozinha de novo, o que impediria testar a entrada com outra conta.
  cy.get('#avatar-wrap').click();
  cy.get('.mat-mdc-menu-panel').contains('button', 'Logout').click();
  cy.location('pathname', { timeout: 20000 }).should('include', '/login');
});

Cypress.Commands.add('preencherCampo', (rotulo: string, valor: string) => {
  // O `mat-label` do Angular Material fica por cima do input enquanto o campo
  // está vazio e sem foco, e o Cypress se recusa a digitar num elemento coberto.
  // Focar primeiro faz o rótulo subir, e aí a digitação acontece como a de uma
  // pessoa - sem `force: true`, que desligaria a checagem de que o campo está
  // mesmo clicável.
  cy.contains('mat-form-field', rotulo).find('input').focus().should('be.focused').type(valor);
});

Cypress.Commands.add('alternarCaixa', (rotulo: string) => {
  // Clicar no `mat-checkbox` inteiro não funciona: o centro do elemento cai
  // entre a caixa e o texto, numa faixa que não reage. O clique vai no
  // `<label>`, que é onde a pessoa clica e o que o navegador liga ao input.
  cy.contains('mat-checkbox', rotulo).find('label').click();
});

Cypress.Commands.add('substituirCampo', (rotulo: string, valor: string) => {
  // Nas telas de edição o campo já vem preenchido pelo `populateForm`, então
  // digitar por cima concatenaria. Limpar primeiro é o que a pessoa faria.
  cy.contains('mat-form-field', rotulo)
    .find('input')
    .focus()
    .should('be.focused')
    .clear()
    .type(valor);
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

Cypress.Commands.add('irParaEventos', () => {
  // "Eventos" fica no mesmo grupo "Explorar" de "Projetos", que já abre expandido.
  cy.contains('.nav-sub-item', 'Eventos').should('be.visible').click();
  cy.location('pathname', { timeout: 20000 }).should('include', '/events');
  cy.contains('button', 'Criar novo evento').should('be.visible');
});

Cypress.Commands.add('irParaNovoEvento', () => {
  cy.contains('button', 'Criar novo evento').click();
  cy.location('pathname', { timeout: 20000 }).should('include', '/create-event');
  cy.contains('mat-form-field', 'Título').should('be.visible');
});

/**
 * O grupo "Administração" do menu começa fechado e o clique no cabeçalho é um
 * alterna-estado. Abrir só quando o item ainda não está na tela evita fechar o
 * grupo por engano quando um teste navega duas vezes.
 */
function garantirAdministracaoAberta(item: string) {
  cy.get('#nav-container').then(($nav) => {
    const jaVisivel = $nav
      .find('.nav-sub-item')
      .toArray()
      .some((el) => (el.textContent ?? '').includes(item));
    if (!jaVisivel) {
      cy.contains('.nav-item', 'Administração').click();
    }
  });
}

Cypress.Commands.add('irParaTags', () => {
  garantirAdministracaoAberta('Tags');
  cy.contains('.nav-sub-item', 'Tags').should('be.visible').click();
  cy.location('pathname', { timeout: 20000 }).should('include', '/tags');
  cy.contains('button', 'Criar nova Tag').should('be.visible');
});

Cypress.Commands.add('irParaUsuarios', () => {
  garantirAdministracaoAberta('Usuários');
  cy.contains('.nav-sub-item', 'Usuários').should('be.visible').click();
  cy.location('pathname', { timeout: 20000 }).should('include', '/accounts');
  cy.contains('button', 'Criar novo usuário').should('be.visible');
});

Cypress.Commands.add('filtrarPorTag', (titulo: string) => {
  // O filtro é um autocomplete de seleção múltipla: escolher uma opção limpa o
  // texto digitado e reabre o painel, para permitir escolher a próxima. Fechar
  // com Esc no fim deixa a listagem visível para as verificações.
  cy.contains('mat-form-field', 'Filtrar por Tags')
    .find('input')
    .focus()
    .should('be.focused')
    .type(titulo);
  cy.get('mat-option').contains(titulo).click();
  cy.contains('mat-form-field', 'Filtrar por Tags').find('input').type('{esc}');
  cy.get('mat-option').should('not.exist');
});

Cypress.Commands.add('abrirCardDoProjeto', (titulo: string) => {
  // O card abre um diálogo, que por sua vez busca o projeto por id com
  // lookup-tags e lookup-members ligados. Esperar o título dentro do diálogo
  // garante que a consulta voltou antes de qualquer verificação.
  cy.contains('.card-primary', titulo).should('be.visible').click();
  cy.get('mat-dialog-container', { timeout: 20000 }).should('be.visible');
  cy.get('mat-dialog-container').contains('#project-title', titulo).should('be.visible');
});

Cypress.Commands.add('abrirCardDoEvento', (titulo: string) => {
  cy.contains('.card-primary', titulo).should('be.visible').click();
  cy.get('mat-dialog-container', { timeout: 20000 }).should('be.visible');
  cy.get('mat-dialog-container').contains('#event-title', titulo).should('be.visible');
});

Cypress.Commands.add('acaoDaLinha', (textoDaLinha: string, acao: string) => {
  // As tabelas de tags e usuários escondem editar/deletar atrás do menu de três
  // pontos da linha. O menu do Material é renderizado num overlay fora da
  // tabela, por isso a busca pelo item acontece no painel, e não na linha.
  cy.contains('tr', textoDaLinha).find('.expand-action-menu-btn').click();
  cy.get('.mat-mdc-menu-panel').should('be.visible').contains('button', acao).click();
  cy.get('.mat-mdc-menu-panel').should('not.exist');
});

export {};
