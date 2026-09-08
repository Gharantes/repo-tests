/**
 * Teste de sistema: abrir um projeto ou evento e ver o que ele tem (RF07, RF09).
 *
 * O que estava sem cobertura nenhuma: as telas de detalhes. Elas dependem dos
 * endpoints `get-*-by-id` com as bandeiras `lookup-tags` e `lookup-members`,
 * que disparam consultas extras no banco. O backend já testa essas consultas;
 * o que só o navegador prova é que o caminho até elas existe - card, diálogo,
 * botão - e que o resultado chega na tela.
 */
describe('Sistema: telas de detalhes', () => {
  it('o card do projeto abre o diálogo com a descrição e o autor entre os membros', () => {
    const titulo = `Projeto com Card ${Date.now()}`;
    const descricao = 'Descrição que precisa aparecer no diálogo do card.';

    cy.criarInstituicao().then((instituicao) => {
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
        cy.criarProjeto(instituicao.idTenant, idAdmin, titulo, descricao);

        cy.entrarPelaInterface(instituicao);
        cy.irParaProjetos();
        cy.abrirCardDoProjeto(titulo);

        // O diálogo busca o projeto por id com lookup-members ligado, então o
        // autor vinculado na criação precisa aparecer aqui.
        cy.get('mat-dialog-container').within(() => {
          cy.contains('.description-text', descricao).should('be.visible');
          cy.contains('.member-name', 'System Admin').should('be.visible');
        });
      });
    });
  });

  it('do diálogo se chega à página do projeto, com título, descrição e membros', () => {
    const titulo = `Projeto Página Cheia ${Date.now()}`;
    const descricao = 'Descrição que precisa aparecer na página do projeto.';

    cy.criarInstituicao().then((instituicao) => {
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
        cy.criarProjeto(instituicao.idTenant, idAdmin, titulo, descricao);

        cy.entrarPelaInterface(instituicao);
        cy.irParaProjetos();
        cy.abrirCardDoProjeto(titulo);

        cy.contains('button', 'Ir para página do Projeto').click();

        cy.location('pathname', { timeout: 20000 }).should('include', '/project/');
        cy.get('mat-dialog-container').should('not.exist');

        cy.contains('#project-title', titulo).should('be.visible');
        cy.contains('.section-body', descricao).should('be.visible');
        cy.contains('.member-name', 'System Admin').should('be.visible');
      });
    });
  });

  it('as tags vinculadas ao projeto aparecem na página de detalhes', () => {
    const titulo = `Projeto com Tags ${Date.now()}`;
    const tagA = `Robótica ${Date.now()}`;
    const tagB = `Extensão ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
        cy.criarTag(instituicao.idTenant, tagA).then((idTagA) => {
          cy.criarTag(instituicao.idTenant, tagB).then((idTagB) => {
            cy.criarProjeto(instituicao.idTenant, idAdmin, titulo, 'Projeto etiquetado.', [
              idTagA,
              idTagB,
            ]);

            cy.entrarPelaInterface(instituicao);
            cy.irParaProjetos();
            cy.abrirCardDoProjeto(titulo);
            cy.contains('button', 'Ir para página do Projeto').click();
            cy.location('pathname', { timeout: 20000 }).should('include', '/project/');

            // As duas tags vêm de project_tag_relationship, via lookup-tags.
            cy.get('#tags-container').within(() => {
              cy.contains('mat-chip', tagA).should('be.visible');
              cy.contains('mat-chip', tagB).should('be.visible');
            });
          });
        });
      });
    });
  });

  it('o projeto aberto pelo menu Seus Projetos leva à mesma página de detalhes', () => {
    const titulo = `Projeto do Menu Lateral ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
        cy.criarProjeto(instituicao.idTenant, idAdmin, titulo, 'Aberto pelo menu.');

        cy.entrarPelaInterface(instituicao);

        // Caminho alternativo até os detalhes: o menu lateral, alimentado por
        // list-projects-by-account.
        cy.contains('.nav-item', 'Seus Projetos').click();
        cy.contains('.nav-sub-label', titulo, { timeout: 20000 }).click();

        cy.location('pathname', { timeout: 20000 }).should('include', '/project/');
        cy.contains('#project-title', titulo).should('be.visible');
      });
    });
  });

  it('do diálogo do evento se chega à página do evento, com título e descrição', () => {
    const titulo = `Evento Página Cheia ${Date.now()}`;
    const descricao = 'Descrição que precisa aparecer na página do evento.';

    cy.criarInstituicao().then((instituicao) => {
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
        cy.criarEvento(instituicao.idTenant, idAdmin, titulo, descricao);

        cy.entrarPelaInterface(instituicao);
        cy.irParaEventos();
        cy.abrirCardDoEvento(titulo);

        cy.contains('button', 'Ir para página do Evento').click();

        cy.location('pathname', { timeout: 20000 }).should('include', '/event/');
        cy.get('mat-dialog-container').should('not.exist');

        cy.contains('#event-title', titulo).should('be.visible');
        cy.contains('.section-body', descricao).should('be.visible');
      });
    });
  });

  it('as tags vinculadas ao evento aparecem na página de detalhes', () => {
    const titulo = `Evento com Tags ${Date.now()}`;
    const tag = `Semana Acadêmica ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
        cy.criarTag(instituicao.idTenant, tag, {
          forProjects: false,
          forEvents: true,
          forAccounts: false,
        }).then((idTag) => {
          cy.criarEvento(instituicao.idTenant, idAdmin, titulo, 'Evento etiquetado.', [idTag]);

          cy.entrarPelaInterface(instituicao);
          cy.irParaEventos();
          cy.abrirCardDoEvento(titulo);
          cy.contains('button', 'Ir para página do Evento').click();
          cy.location('pathname', { timeout: 20000 }).should('include', '/event/');

          cy.get('#tags-container').within(() => {
            cy.contains('mat-chip', tag).should('be.visible');
          });
        });
      });
    });
  });

  it('o evento aberto pelo menu Seus Eventos leva à mesma página de detalhes', () => {
    const titulo = `Evento do Menu Lateral ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
        cy.criarEvento(instituicao.idTenant, idAdmin, titulo, 'Aberto pelo menu.');

        cy.entrarPelaInterface(instituicao);

        cy.contains('.nav-item', 'Seus Eventos').click();
        cy.contains('.nav-sub-label', titulo, { timeout: 20000 }).click();

        cy.location('pathname', { timeout: 20000 }).should('include', '/event/');
        cy.contains('#event-title', titulo).should('be.visible');
      });
    });
  });
});
