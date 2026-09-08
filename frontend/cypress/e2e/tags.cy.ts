/**
 * Teste de sistema: administrar tags (RF06, RN02).
 *
 * As tags são a única entidade do Synergia que a interface expõe numa tabela
 * com menu de ações, e não em cards. O ciclo completo - criar, buscar, editar,
 * excluir - é percorrido pela tela, incluindo as três bandeiras de uso, que
 * decidem em quais telas a tag pode ser escolhida depois.
 */
describe('Sistema: tags', () => {
  it('criar uma tag pela interface grava no banco e ela aparece na tabela', () => {
    const titulo = `Robótica ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);
      cy.irParaTags();

      cy.contains('button', 'Criar nova Tag').click();
      cy.location('pathname', { timeout: 20000 }).should('include', '/create-tag');

      cy.preencherCampo('Título', titulo);
      cy.alternarCaixa('Disponível para Projetos');

      cy.contains('button', 'Salvar').should('not.be.disabled').click();

      cy.location('pathname', { timeout: 20000 }).should('include', '/tags');
      cy.contains('tr', titulo).should('be.visible');

      cy.listarTagsPelaApi(instituicao.idTenant, titulo).then((tags) => {
        const criada = tags.find((t) => t.title === titulo);
        expect(criada, 'a tag criada pela tela precisa existir no banco').to.not.be.undefined;
      });
    });
  });

  it('as bandeiras marcadas na tela são exatamente as que ficam gravadas', () => {
    const titulo = `Extensão ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);
      cy.irParaTags();

      cy.contains('button', 'Criar nova Tag').click();
      cy.location('pathname', { timeout: 20000 }).should('include', '/create-tag');

      cy.preencherCampo('Título', titulo);
      // Duas marcadas, uma deixada de fora de propósito.
      cy.alternarCaixa('Disponível para Projetos');
      cy.alternarCaixa('Disponível para Usuários');

      cy.contains('button', 'Salvar').click();
      cy.location('pathname', { timeout: 20000 }).should('include', '/tags');

      // A tabela mostra as bandeiras como caixas desabilitadas: duas marcadas.
      cy.contains('tr', titulo)
        .find('input[type="checkbox"]:checked')
        .should('have.length', 2);

      // E o banco concorda, coluna por coluna.
      cy.listarTagsPelaApi(instituicao.idTenant, titulo).then((tags) => {
        const tag = tags.find((t) => t.title === titulo);
        expect(tag, 'a tag precisa existir').to.not.be.undefined;
        expect(tag?.forProjects, 'forProjects').to.eq(true);
        expect(tag?.forAccounts, 'forAccounts').to.eq(true);
        expect(tag?.forEvents, 'forEvents ficou desmarcada na tela').to.eq(false);
      });
    });
  });

  it('a busca por nome filtra a tabela de tags', () => {
    cy.criarInstituicao().then((instituicao) => {
      cy.criarTag(instituicao.idTenant, 'Sustentabilidade');
      cy.criarTag(instituicao.idTenant, 'Robótica');

      cy.entrarPelaInterface(instituicao);
      cy.irParaTags();

      cy.contains('tr', 'Sustentabilidade').should('be.visible');
      cy.contains('tr', 'Robótica').should('be.visible');

      cy.preencherCampo('Nome', 'Sustenta');

      cy.contains('tr', 'Sustentabilidade').should('be.visible');
      cy.contains('tr', 'Robótica').should('not.exist');
    });
  });

  it('editar uma tag pela tabela troca o título na tela e no banco', () => {
    const titulo = `Tag Antes ${Date.now()}`;
    const novoTitulo = `Tag Depois ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.criarTag(instituicao.idTenant, titulo);

      cy.entrarPelaInterface(instituicao);
      cy.irParaTags();

      cy.acaoDaLinha(titulo, 'Editar');
      cy.location('pathname', { timeout: 20000 }).should('include', '/edit-tag/');

      // O formulário chega preenchido pelo getTagById.
      cy.contains('mat-form-field', 'Título').find('input').should('have.value', titulo);

      cy.substituirCampo('Título', novoTitulo);
      cy.contains('button', 'Salvar').click();

      cy.location('pathname', { timeout: 20000 }).should('include', '/tags');
      cy.contains('tr', novoTitulo).should('be.visible');
      cy.contains('tr', titulo).should('not.exist');

      cy.listarTagsPelaApi(instituicao.idTenant).then((tags) => {
        expect(tags.find((t) => t.title === novoTitulo), 'título novo no banco').to.not.be
          .undefined;
        expect(tags.find((t) => t.title === titulo), 'título antigo não pode sobrar').to.be
          .undefined;
      });
    });
  });

  it('editar uma tag muda as bandeiras de uso gravadas', () => {
    const titulo = `Bandeiras ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      // Nasce valendo só para projetos.
      cy.criarTag(instituicao.idTenant, titulo, {
        forProjects: true,
        forEvents: false,
        forAccounts: false,
      });

      cy.entrarPelaInterface(instituicao);
      cy.irParaTags();

      cy.contains('tr', titulo).find('input[type="checkbox"]:checked').should('have.length', 1);

      cy.acaoDaLinha(titulo, 'Editar');
      cy.location('pathname', { timeout: 20000 }).should('include', '/edit-tag/');

      // Passa a valer também para eventos.
      cy.alternarCaixa('Disponível para Eventos');
      cy.contains('button', 'Salvar').click();

      cy.location('pathname', { timeout: 20000 }).should('include', '/tags');
      cy.contains('tr', titulo).find('input[type="checkbox"]:checked').should('have.length', 2);

      cy.listarTagsPelaApi(instituicao.idTenant, titulo).then((tags) => {
        const tag = tags.find((t) => t.title === titulo);
        expect(tag?.forProjects, 'forProjects continua').to.eq(true);
        expect(tag?.forEvents, 'forEvents passou a valer').to.eq(true);
      });
    });
  });

  it('deletar uma tag pela tabela some com ela da tela e do banco', () => {
    const titulo = `Tag Descartável ${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.criarTag(instituicao.idTenant, titulo);

      cy.entrarPelaInterface(instituicao);
      cy.irParaTags();
      cy.contains('tr', titulo).should('be.visible');

      cy.acaoDaLinha(titulo, 'Deletar');

      cy.contains('tr', titulo).should('not.exist');

      cy.listarTagsPelaApi(instituicao.idTenant).then((tags) => {
        expect(
          tags.find((t) => t.title === titulo),
          'a tag deletada pela tela não pode continuar no banco'
        ).to.be.undefined;
      });
    });
  });

  it('o botão Salvar da tag fica desabilitado enquanto o título está vazio', () => {
    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);
      cy.irParaTags();

      cy.contains('button', 'Criar nova Tag').click();
      cy.location('pathname', { timeout: 20000 }).should('include', '/create-tag');

      cy.contains('button', 'Salvar').should('be.disabled');

      // Marcar bandeira não basta: o título é o único campo obrigatório.
      cy.alternarCaixa('Disponível para Projetos');
      cy.contains('button', 'Salvar').should('be.disabled');

      cy.preencherCampo('Título', 'Agora tem título');
      cy.contains('button', 'Salvar').should('not.be.disabled');
    });
  });

  it('uma tag de outra instituição não aparece na tabela', () => {
    cy.criarInstituicao().then((instituicaoA) => {
      cy.criarTag(instituicaoA.idTenant, 'Tag Exclusiva da A');

      cy.criarInstituicao().then((instituicaoB) => {
        cy.entrarPelaInterface(instituicaoB);
        cy.irParaTags();

        cy.contains('button', 'Criar nova Tag').should('be.visible');
        cy.contains('tr', 'Tag Exclusiva da A').should('not.exist');
      });
    });
  });
});
