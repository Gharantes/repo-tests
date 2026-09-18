/**
 * Teste de sistema: entrar e sair do Synergia (RF02, RF03).
 *
 * Percorre o caminho inteiro, do jeito que um aluno percorre: navegador abre a
 * tela de login, o formulário é preenchido, o botão é clicado, a requisição sai
 * para a API real e o banco real responde. Nada é simulado.
 */
describe('Sistema: autenticação', () => {
  it('a URL da instituição recém-criada abre o login dela', () => {
    cy.criarInstituicao().then((instituicao) => {
      // /<identifier> leva para /<identifier>/login, e o tenant é resolvido
      // pelo endpoint list-all-tenants, ou seja, pelo banco.
      cy.visit(`/${instituicao.identifier}`);

      cy.location('pathname').should('eq', `/${instituicao.identifier}/login`);
      cy.contains('.auth-subtitle', instituicao.title).should('be.visible');
    });
  });

  it('identifier que não existe mostra tenant não encontrado', () => {
    cy.visit(`/inexistente-${Date.now()}/login`);

    cy.contains('Tenant não encontrado').should('be.visible');
    cy.contains('button', 'Login').should('not.exist');
  });

  it('a raiz leva ao login da instituição pelo identifier digitado', () => {
    cy.criarInstituicao().then((instituicao) => {
      cy.visit('/');

      cy.contains('button', 'Criar Novo Tenant').should('be.visible');
      cy.preencherCampo('Identifier do Tenant', instituicao.identifier);
      cy.contains('button', 'Entrar').click();

      cy.location('pathname').should('eq', `/${instituicao.identifier}/login`);
    });
  });

  it('login com as credenciais corretas leva ao dashboard', () => {
    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);

      cy.location('pathname').should('include', '/dashboard');
    });
  });

  it('login com senha errada não entra e continua na tela de login', () => {
    cy.criarInstituicao().then((instituicao) => {
      cy.visit(`/${instituicao.identifier}/login`);

      cy.preencherCampo('Usuário', 'ADMIN');
      cy.preencherCampo('Senha', 'SenhaCompletamenteErrada');

      cy.contains('button', 'Login').click();

      // A aplicação avisa e não sai do lugar.
      cy.contains('Não foi possível realizar login.').should('be.visible');
      cy.location('pathname').should('include', '/login');
    });
  });

  it('o botão de login fica desabilitado enquanto o formulário está incompleto', () => {
    cy.criarInstituicao().then((instituicao) => {
      cy.visit(`/${instituicao.identifier}/login`);

      cy.contains('button', 'Login').should('be.disabled');

      cy.preencherCampo('Usuário', 'ADMIN');
      cy.contains('button', 'Login').should('be.disabled');

      cy.preencherCampo('Senha', instituicao.senhaAdmin);
      cy.contains('button', 'Login').should('not.be.disabled');
    });
  });

  it('sem sessão, as telas internas redirecionam para o login da instituição', () => {
    cy.criarInstituicao().then((instituicao) => {
      // O guard HasActiveTenant protege as rotas internas.
      cy.visit(`/${instituicao.identifier}/projects`);

      cy.location('pathname', { timeout: 20000 }).should('eq', `/${instituicao.identifier}/login`);
    });
  });

  it('a sessão guardada de uma instituição não entra em outra', () => {
    cy.criarInstituicao().then((instituicaoA) => {
      cy.criarInstituicao().then((instituicaoB) => {
        cy.entrarPelaInterface(instituicaoA);

        // O localStorage guarda a sessão de A; a URL de B não pode reaproveitá-la.
        cy.visit(`/${instituicaoB.identifier}/dashboard`);

        cy.location('pathname', { timeout: 20000 }).should('eq', `/${instituicaoB.identifier}/login`);
        cy.contains('.auth-subtitle', instituicaoB.title).should('be.visible');
        cy.contains('button', 'Login').should('be.disabled');
        cy.location('pathname').should('eq', `/${instituicaoB.identifier}/login`);
      });
    });
  });

  it('a sessão sobrevive a recarregar a página', () => {
    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);

      cy.reload();

      // O login guardado no localStorage é revalidado contra a API (checkLastSeen).
      cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard');
    });
  });
});
