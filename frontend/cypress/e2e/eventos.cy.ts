/**
 * Teste de sistema: publicar e encontrar um evento (RF04, RF05, RF07, RF11).
 *
 * O espelho de `projetos.cy.ts`, para a outra entidade que o Synergia publica.
 * A repetição é proposital: o formulário de evento é um componente diferente,
 * com conector, rota e endpoint próprios, e nada garante que ele funcione só
 * porque o de projetos funciona. O que o backend já cobre em SQL, aqui é
 * percorrido pelo navegador.
 */
describe('Sistema: eventos', () => {
  it('criar um evento pela interface grava no banco e ele aparece na listagem', () => {
    const titulo = `Semana de Inovação ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);
      cy.irParaEventos();
      cy.irParaNovoEvento();

      cy.preencherCampo('Título', titulo);
      cy.preencherCampo('Descrição', 'Evento criado pelo teste de sistema, ponta a ponta.');

      cy.contains('button', 'Salvar').should('not.be.disabled').click();

      // A aplicação confirma e volta para a listagem.
      cy.location('pathname', { timeout: 20000 }).should('include', '/events');

      // 1) Aparece na tela.
      cy.contains('.card-primary', titulo).should('be.visible');

      // 2) Está mesmo no banco: a API devolve a linha.
      cy.listarEventosPelaApi(instituicao.idTenant).then((eventos) => {
        const criado = eventos.find((e) => e.title === titulo);
        expect(criado, 'o evento criado pela tela precisa existir no banco').to.not.be.undefined;
      });
    });
  });

  it('o evento criado sobrevive a recarregar a aplicação inteira', () => {
    const titulo = `Mostra de Extensão ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);
      cy.irParaEventos();
      cy.irParaNovoEvento();

      cy.preencherCampo('Título', titulo);
      cy.preencherCampo('Descrição', 'Mostra aberta à comunidade.');
      cy.contains('button', 'Salvar').click();

      cy.location('pathname', { timeout: 20000 }).should('include', '/events');
      cy.contains('.card-primary', titulo).should('be.visible');

      // Recarregar joga a sessão fora da memória; ela é remontada do
      // localStorage e revalidada contra a API, e a listagem é buscada de novo
      // no banco. Se o evento tivesse ficado só em memória, sumiria aqui.
      cy.reload();
      cy.location('pathname', { timeout: 30000 }).should('include', '/dashboard');
      cy.irParaEventos();

      cy.contains('.card-primary', titulo).should('be.visible');
    });
  });

  it('a busca por texto filtra a listagem de eventos', () => {
    cy.criarInstituicao().then((instituicao) => {
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
        cy.criarEvento(instituicao.idTenant, idAdmin, 'Congresso de Robótica');
        cy.criarEvento(instituicao.idTenant, idAdmin, 'Feira de Sustentabilidade');

        cy.entrarPelaInterface(instituicao);
        cy.irParaEventos();

        cy.contains('.card-primary', 'Congresso de Robótica').should('be.visible');
        cy.contains('.card-primary', 'Feira de Sustentabilidade').should('be.visible');

        cy.preencherCampo('Procure por Eventos', 'Feira');

        cy.contains('.card-primary', 'Feira de Sustentabilidade').should('be.visible');
        cy.contains('.card-primary', 'Congresso de Robótica').should('not.exist');
      });
    });
  });

  it('a busca de eventos é indiferente a maiúsculas e minúsculas', () => {
    cy.criarInstituicao().then((instituicao) => {
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
        cy.criarEvento(instituicao.idTenant, idAdmin, 'Jornada Acadêmica');

        cy.entrarPelaInterface(instituicao);
        cy.irParaEventos();

        cy.preencherCampo('Procure por Eventos', 'ACADÊMICA');

        cy.contains('.card-primary', 'Jornada Acadêmica').should('be.visible');
      });
    });
  });

  it('busca sem resultado deixa a listagem de eventos vazia, sem quebrar a tela', () => {
    cy.criarInstituicao().then((instituicao) => {
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
        cy.criarEvento(instituicao.idTenant, idAdmin, 'Congresso de Robótica');

        cy.entrarPelaInterface(instituicao);
        cy.irParaEventos();
        cy.contains('.card-primary', 'Congresso de Robótica').should('be.visible');

        cy.preencherCampo('Procure por Eventos', 'Simpósio de Astrofísica');

        cy.get('.card-primary').should('not.exist');
        cy.contains('button', 'Criar novo evento').should('be.visible');
      });
    });
  });

  it('um evento de outra instituição não aparece para quem não é dela', () => {
    cy.criarInstituicao().then((instituicaoA) => {
      cy.idDaContaAdmin(instituicaoA).then((idAdminA) => {
        cy.criarEvento(instituicaoA.idTenant, idAdminA, 'Evento Exclusivo da A');

        cy.criarInstituicao().then((instituicaoB) => {
          cy.entrarPelaInterface(instituicaoB);
          cy.irParaEventos();

          cy.contains('button', 'Criar novo evento').should('be.visible');
          cy.contains('.card-primary', 'Evento Exclusivo da A').should('not.exist');
        });
      });
    });
  });

  it('o botão Salvar do evento fica desabilitado enquanto título e descrição não são preenchidos', () => {
    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);
      cy.irParaEventos();
      cy.irParaNovoEvento();

      cy.contains('button', 'Salvar').should('be.disabled');

      cy.preencherCampo('Título', 'Só o título');
      cy.contains('button', 'Salvar').should('be.disabled');

      cy.preencherCampo('Descrição', 'Agora com descrição.');
      cy.contains('button', 'Salvar').should('not.be.disabled');
    });
  });

  it('o evento criado pela tela aparece em Seus Eventos, com o organizador vinculado', () => {
    const titulo = `Evento do Menu ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);
      cy.irParaEventos();
      cy.irParaNovoEvento();

      cy.preencherCampo('Título', titulo);
      cy.preencherCampo('Descrição', 'Verifica o vínculo de organização.');
      cy.contains('button', 'Salvar').click();
      cy.location('pathname', { timeout: 20000 }).should('include', '/events');

      // "Seus Eventos" é alimentado por list-events-by-account, ou seja, depende
      // do vínculo conta <-> evento ter sido gravado na criação.
      cy.reload();
      cy.location('pathname', { timeout: 30000 }).should('include', '/dashboard');
      cy.contains('.nav-item', 'Seus Eventos').click();

      cy.contains('.nav-sub-label', titulo, { timeout: 20000 }).should('be.visible');
    });
  });

  it('editar um evento pelo diálogo do card troca o título na listagem e no banco', () => {
    const titulo = `Evento Antes ${Date.now()}`;
    const novoTitulo = `Evento Depois ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.idDaContaAdmin(instituicao).then((idAdmin) => {
        cy.criarEvento(instituicao.idTenant, idAdmin, titulo);

        cy.entrarPelaInterface(instituicao);
        cy.irParaEventos();

        // O caminho real até a edição passa pelo card: clicar abre o diálogo,
        // e é lá que mora o botão "Editar Evento".
        cy.abrirCardDoEvento(titulo);
        cy.contains('button', 'Editar Evento').click();

        cy.location('pathname', { timeout: 20000 }).should('include', '/edit-event/');

        // O formulário chega preenchido pelo getEventById.
        cy.contains('mat-form-field', 'Título')
          .find('input')
          .should('have.value', titulo);

        cy.substituirCampo('Título', novoTitulo);
        cy.contains('button', 'Salvar').should('not.be.disabled').click();

        cy.location('pathname', { timeout: 20000 }).should('include', '/events');
        cy.contains('.card-primary', novoTitulo).should('be.visible');
        cy.contains('.card-primary', titulo).should('not.exist');

        cy.listarEventosPelaApi(instituicao.idTenant).then((eventos) => {
          expect(
            eventos.find((e) => e.title === novoTitulo),
            'o título novo precisa estar no banco'
          ).to.not.be.undefined;
          expect(
            eventos.find((e) => e.title === titulo),
            'o título antigo não pode ter sobrado'
          ).to.be.undefined;
        });
      });
    });
  });
});
