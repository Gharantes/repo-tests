/**
 * Teste de sistema: entrar e sair do Synergia (RF02, RF03).
 *
 * Percorre o caminho inteiro, do jeito que um aluno percorre: navegador abre a
 * tela de login, o formulário é preenchido, o botão é clicado, a requisição sai
 * para a API real e o banco real responde. Nada é simulado.
 */
describe('Sistema: autenticação', () => {
  it('a instituição recém-criada aparece na lista de tenants da tela de login', () => {
    cy.criarInstituicao().then((instituicao) => {
      cy.visit('/login');

      cy.preencherCampo('Tenant', instituicao.identifier);

      // A lista vem do endpoint list-all-tenants, ou seja, do banco.
      cy.get('mat-option').should('contain.text', instituicao.identifier);
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
      cy.visit('/login');

      cy.preencherCampo('Tenant', instituicao.identifier);
      cy.get('mat-option').contains(instituicao.identifier).click();
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
      cy.visit('/login');

      cy.contains('button', 'Login').should('be.disabled');

      cy.preencherCampo('Tenant', instituicao.identifier);
      cy.get('mat-option').contains(instituicao.identifier).click();
      cy.contains('button', 'Login').should('be.disabled');

      cy.preencherCampo('Usuário', 'ADMIN');
      cy.contains('button', 'Login').should('be.disabled');

      cy.preencherCampo('Senha', instituicao.senhaAdmin);
      cy.contains('button', 'Login').should('not.be.disabled');
    });
  });

  it('sem sessão, as telas internas redirecionam para o login', () => {
    // O guard HasActiveTenant protege as rotas internas.
    cy.visit('/projects');

    cy.location('pathname', { timeout: 20000 }).should('include', '/login');
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
