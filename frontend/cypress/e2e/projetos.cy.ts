/**
 * Teste de sistema: publicar e encontrar um projeto (RF04, RF05, RF07, RF11).
 *
 * Este é o ciclo que o documento de requisitos chama de essencial: alguém
 * publica um projeto e outra pessoa consegue achá-lo. Aqui ele é percorrido
 * inteiro pelo navegador, contra o banco real, e a navegação é feita pelo menu
 * lateral, como um aluno faria - não por URL digitada.
 */
describe('Sistema: projetos', () => {
  /** Descobre o id da conta ADMIN da instituição, pela API real de login. */
  const idDoAdmin = (instituicao: { idTenant: number; senhaAdmin: string }) =>
    cy
      .request('POST', `${Cypress.env('apiUrl')}/api/page-login/check-login-information`, {
        idTenant: instituicao.idTenant,
        login: 'ADMIN',
        password: instituicao.senhaAdmin,
        checkLastSeen: false,
      })
      .then((r) => (r.body as { idAccount: number }).idAccount);

  it('criar um projeto pela interface grava no banco e ele aparece na listagem', () => {
    const titulo = `Robótica Colaborativa ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);
      cy.irParaProjetos();
      cy.irParaNovoProjeto();

      cy.preencherCampo('Título', titulo);
      cy.preencherCampo('Descrição', 'Projeto criado pelo teste de sistema, ponta a ponta.');

      cy.contains('button', 'Salvar').should('not.be.disabled').click();

      // A aplicação confirma e volta para a listagem.
      cy.location('pathname', { timeout: 20000 }).should('include', '/projects');

      // 1) Aparece na tela.
      cy.contains('.card-primary', titulo).should('be.visible');

      // 2) Está mesmo no banco: a API devolve a linha.
      cy.listarProjetosPelaApi(instituicao.idTenant).then((projetos) => {
        const criado = projetos.find((p) => p.title === titulo);
        expect(criado, 'o projeto criado pela tela precisa existir no banco').to.not.be.undefined;
      });
    });
  });

  it('o projeto criado sobrevive a recarregar a aplicação inteira', () => {
    const titulo = `Horta Vertical ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);
      cy.irParaProjetos();
      cy.irParaNovoProjeto();

      cy.preencherCampo('Título', titulo);
      cy.preencherCampo('Descrição', 'Horta na área externa do campus.');
      cy.contains('button', 'Salvar').click();

      cy.location('pathname', { timeout: 20000 }).should('include', '/projects');
      cy.contains('.card-primary', titulo).should('be.visible');

      // Recarrega tudo: a aplicação Angular é destruída e reconstruída, a sessão
      // é restaurada do localStorage e revalidada contra a API. Se o projeto
      // reaparecer, ele veio do PostgreSQL, não da memória do navegador.
      cy.reload();
      cy.location('pathname', { timeout: 30000 }).should('include', '/dashboard');
      cy.irParaProjetos();

      cy.contains('.card-primary', titulo, { timeout: 20000 }).should('be.visible');
    });
  });

  it('a busca por texto filtra a listagem de projetos', () => {
    cy.criarInstituicao().then((instituicao) => {
      idDoAdmin(instituicao).then((idAdmin) => {
        // Massa criada pela API real, gravando no mesmo banco.
        cy.criarProjeto(instituicao.idTenant, idAdmin, 'Robótica Colaborativa');
        cy.criarProjeto(instituicao.idTenant, idAdmin, 'Horta Vertical');

        cy.entrarPelaInterface(instituicao);
        cy.irParaProjetos();

        cy.contains('.card-primary', 'Robótica Colaborativa').should('be.visible');
        cy.contains('.card-primary', 'Horta Vertical').should('be.visible');

        // Digitar na busca dispara a consulta com ILIKE no backend.
        cy.preencherCampo('Procure por Projetos', 'Horta');

        cy.contains('.card-primary', 'Horta Vertical').should('be.visible');
        cy.contains('.card-primary', 'Robótica Colaborativa').should('not.exist');
      });
    });
  });

  it('a busca é indiferente a maiúsculas e minúsculas', () => {
    cy.criarInstituicao().then((instituicao) => {
      idDoAdmin(instituicao).then((idAdmin) => {
        cy.criarProjeto(instituicao.idTenant, idAdmin, 'Feira de Ciências');

        cy.entrarPelaInterface(instituicao);
        cy.irParaProjetos();

        cy.preencherCampo('Procure por Projetos', 'CIÊNCIAS');

        cy.contains('.card-primary', 'Feira de Ciências').should('be.visible');
      });
    });
  });

  it('busca sem resultado deixa a listagem vazia, sem quebrar a tela', () => {
    cy.criarInstituicao().then((instituicao) => {
      idDoAdmin(instituicao).then((idAdmin) => {
        cy.criarProjeto(instituicao.idTenant, idAdmin, 'Robótica Colaborativa');

        cy.entrarPelaInterface(instituicao);
        cy.irParaProjetos();
        cy.contains('.card-primary', 'Robótica Colaborativa').should('be.visible');

        cy.preencherCampo('Procure por Projetos', 'Astronomia Quântica');

        cy.get('.card-primary').should('not.exist');
        // A tela continua de pé: o botão de criar segue disponível.
        cy.contains('button', 'Criar novo projeto').should('be.visible');
      });
    });
  });

  it('um projeto de outra instituição não aparece para quem não é dela', () => {
    // Isolamento por tenant, verificado pela tela e não só pelo SQL.
    cy.criarInstituicao().then((instituicaoA) => {
      idDoAdmin(instituicaoA).then((idAdminA) => {
        cy.criarProjeto(instituicaoA.idTenant, idAdminA, 'Projeto Exclusivo da A');

        cy.criarInstituicao().then((instituicaoB) => {
          cy.entrarPelaInterface(instituicaoB);
          cy.irParaProjetos();

          cy.contains('button', 'Criar novo projeto').should('be.visible');
          cy.contains('.card-primary', 'Projeto Exclusivo da A').should('not.exist');
        });
      });
    });
  });

  it('o botão Salvar fica desabilitado enquanto título e descrição não são preenchidos', () => {
    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);
      cy.irParaProjetos();
      cy.irParaNovoProjeto();

      cy.contains('button', 'Salvar').should('be.disabled');

      cy.preencherCampo('Título', 'Só o título');
      cy.contains('button', 'Salvar').should('be.disabled');

      cy.preencherCampo('Descrição', 'Agora com descrição.');
      cy.contains('button', 'Salvar').should('not.be.disabled');
    });
  });

  it('o projeto criado pela tela aparece em Seus Projetos, com o autor como membro', () => {
    const titulo = `Projeto do Menu ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);
      cy.irParaProjetos();
      cy.irParaNovoProjeto();

      cy.preencherCampo('Título', titulo);
      cy.preencherCampo('Descrição', 'Verifica o vínculo de autoria.');
      cy.contains('button', 'Salvar').click();
      cy.location('pathname', { timeout: 20000 }).should('include', '/projects');

      // "Seus Projetos" no menu lateral é alimentado por list-projects-by-account,
      // ou seja, depende do vínculo autor <-> projeto ter sido gravado.
      cy.reload();
      cy.location('pathname', { timeout: 30000 }).should('include', '/dashboard');
      cy.contains('.nav-item', 'Seus Projetos').click();

      cy.contains('.nav-sub-label', titulo, { timeout: 20000 }).should('be.visible');
    });
  });
});
