/**
 * Teste de sistema: publicar e encontrar um projeto (RF04, RF05, RF07, RF11).
 *
 * Este é o ciclo que o documento de requisitos chama de essencial: alguém
 * publica um projeto e outra pessoa consegue achá-lo. Aqui ele é percorrido
 * inteiro pelo navegador, contra o banco real, e a navegação é feita pelo menu
 * lateral, como um aluno faria - não por URL digitada.
 */
describe('Sistema: projetos', () => {
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
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
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
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
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
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
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
      cy.idDaContaAdmin(instituicaoA).then((idAdminA) => {
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
  it('o filtro por tag mostra só os projetos que têm aquela tag', () => {
    const tag = `Robótica ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
        cy.criarTag(instituicao.idTenant, tag).then((idTag) => {
          cy.criarProjeto(instituicao.idTenant, idAdmin, 'Projeto Etiquetado', undefined, [idTag]);
          cy.criarProjeto(instituicao.idTenant, idAdmin, 'Projeto Sem Etiqueta');

          cy.entrarPelaInterface(instituicao);
          cy.irParaProjetos();

          cy.contains('.card-primary', 'Projeto Etiquetado').should('be.visible');
          cy.contains('.card-primary', 'Projeto Sem Etiqueta').should('be.visible');

          cy.filtrarPorTag(tag);

          cy.contains('.card-primary', 'Projeto Etiquetado').should('be.visible');
          cy.contains('.card-primary', 'Projeto Sem Etiqueta').should('not.exist');
        });
      });
    });
  });

  it('escolher duas tags no filtro exige que o projeto tenha as duas', () => {
    const tagA = `Robótica ${Date.now()}`;
    const tagB = `Extensão ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
        cy.criarTag(instituicao.idTenant, tagA).then((idTagA) => {
          cy.criarTag(instituicao.idTenant, tagB).then((idTagB) => {
            cy.criarProjeto(instituicao.idTenant, idAdmin, 'Projeto Com As Duas', undefined, [
              idTagA,
              idTagB,
            ]);
            cy.criarProjeto(instituicao.idTenant, idAdmin, 'Projeto Só Com Uma', undefined, [
              idTagA,
            ]);

            cy.entrarPelaInterface(instituicao);
            cy.irParaProjetos();

            cy.filtrarPorTag(tagA);
            // Com uma tag só, os dois passam.
            cy.contains('.card-primary', 'Projeto Com As Duas').should('be.visible');
            cy.contains('.card-primary', 'Projeto Só Com Uma').should('be.visible');

            cy.filtrarPorTag(tagB);
            // Com as duas, sobra quem tem as duas - é o HAVING COUNT(DISTINCT).
            cy.contains('.card-primary', 'Projeto Com As Duas').should('be.visible');
            cy.contains('.card-primary', 'Projeto Só Com Uma').should('not.exist');
          });
        });
      });
    });
  });

  it('editar um projeto pelo diálogo do card troca o título na listagem e no banco', () => {
    const titulo = `Projeto Antes ${Date.now()}`;
    const novoTitulo = `Projeto Depois ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
        cy.criarProjeto(instituicao.idTenant, idAdmin, titulo);

        cy.entrarPelaInterface(instituicao);
        cy.irParaProjetos();

        // O caminho real até a edição passa pelo card: clicar abre o diálogo,
        // e é lá que mora o botão "Editar Projeto".
        cy.abrirCardDoProjeto(titulo);
        cy.contains('button', 'Editar Projeto').click();

        cy.location('pathname', { timeout: 20000 }).should('include', '/edit-project/');
        cy.contains('mat-form-field', 'Título').find('input').should('have.value', titulo);

        cy.substituirCampo('Título', novoTitulo);
        cy.contains('button', 'Salvar').should('not.be.disabled').click();

        cy.location('pathname', { timeout: 20000 }).should('include', '/projects');
        cy.contains('.card-primary', novoTitulo).should('be.visible');
        cy.contains('.card-primary', titulo).should('not.exist');

        cy.listarProjetosPelaApi(instituicao.idTenant).then((projetos) => {
          expect(
            projetos.find((p) => p.title === novoTitulo),
            'o título novo precisa estar no banco'
          ).to.not.be.undefined;
          expect(
            projetos.find((p) => p.title === titulo),
            'o título antigo não pode ter sobrado'
          ).to.be.undefined;
        });
      });
    });
  });
});
