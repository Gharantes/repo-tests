/**
 * Teste de sistema: administrar usuários (RF01, RF08, RN01).
 *
 * O teste mais forte da suíte está aqui: uma conta é criada preenchendo o
 * formulário da tela e, em seguida, essa mesma conta entra no sistema pela tela
 * de login. Nenhuma etapa é simulada, então o caminho inteiro - formulário,
 * endpoint, INSERT, consulta de autenticação - precisa estar de pé para o teste
 * passar. É o oposto de um "frontend de mentira".
 */
describe('Sistema: usuários', () => {
  it('criar um usuário pela interface grava no banco e ele aparece na lista', () => {
    const login = `ALUNO${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);
      cy.irParaUsuarios();

      cy.contains('button', 'Criar novo usuário').click();
      cy.location('pathname', { timeout: 20000 }).should('include', '/create-account');

      cy.preencherCampo('Nome', 'Marina');
      cy.preencherCampo('Sobrenome', 'Duarte');
      cy.preencherCampo('Username', login);
      cy.preencherCampo('Email', `${login.toLowerCase()}@e2e.local`);
      cy.preencherCampo('Senha', 'SenhaDoAluno123');

      cy.contains('button', 'Salvar').should('not.be.disabled').click();

      cy.location('pathname', { timeout: 20000 }).should('include', '/accounts');
      cy.contains('.account-row', login).should('be.visible');
      cy.contains('.account-row', 'Marina Duarte').should('be.visible');

      cy.listarContasPelaApi(instituicao.idTenant, login).then((contas) => {
        const criada = contas.find((c) => c.login === login);
        expect(criada, 'a conta criada pela tela precisa existir no banco').to.not.be.undefined;
        expect(criada?.firstName, 'primeiro nome gravado').to.eq('Marina');
        expect(criada?.lastName, 'sobrenome gravado').to.eq('Duarte');
      });
    });
  });

  it('o usuário criado pela tela consegue entrar no sistema com a senha que foi digitada', () => {
    const login = `ALUNO${Date.now()}`;
    const senha = 'SenhaDoAluno123';

    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);
      cy.irParaUsuarios();

      cy.contains('button', 'Criar novo usuário').click();
      cy.location('pathname', { timeout: 20000 }).should('include', '/create-account');

      cy.preencherCampo('Nome', 'Rafael');
      cy.preencherCampo('Sobrenome', 'Nunes');
      cy.preencherCampo('Username', login);
      cy.preencherCampo('Email', `${login.toLowerCase()}@e2e.local`);
      cy.preencherCampo('Senha', senha);
      cy.contains('button', 'Salvar').click();
      cy.location('pathname', { timeout: 20000 }).should('include', '/accounts');

      // Sai da conta ADMIN e entra com a conta que acabou de ser cadastrada.
      cy.sairPelaInterface();
      cy.entrarPelaInterface(instituicao, login, senha);

      // Chegar ao dashboard como a conta nova prova que a senha foi gravada e
      // que a consulta de autenticação a encontra.
      cy.location('pathname').should('include', '/dashboard');
      cy.contains('#user-name', login).should('be.visible');
    });
  });

  it('a conta nova não entra com a senha errada', () => {
    const login = `ALUNO${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.criarConta(instituicao.idTenant, login, 'Carla', 'Prado', 'SenhaCerta123');

      cy.visit(`/${instituicao.identifier}/login`);
      cy.preencherCampo('Usuário', login);
      cy.preencherCampo('Senha', 'SenhaErrada123');
      cy.contains('button', 'Login').click();

      cy.contains('Não foi possível realizar login.').should('be.visible');
      cy.location('pathname').should('include', '/login');
    });
  });

  it('a busca filtra a lista de usuários por login e por nome', () => {
    const loginA = `MARINA${Date.now()}`;
    const loginB = `RAFAEL${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.criarConta(instituicao.idTenant, loginA, 'Marina', 'Duarte', 'Senha123');
      cy.criarConta(instituicao.idTenant, loginB, 'Rafael', 'Nunes', 'Senha123');

      cy.entrarPelaInterface(instituicao);
      cy.irParaUsuarios();

      cy.contains('.account-row', loginA).should('be.visible');
      cy.contains('.account-row', loginB).should('be.visible');

      // Por login.
      cy.get('input[placeholder="Buscar por nome, login ou email..."]').type(loginA);
      cy.contains('.account-row', loginA).should('be.visible');
      cy.contains('.account-row', loginB).should('not.exist');

      // Por nome: a mesma consulta procura em login, nome e sobrenome.
      cy.get('input[placeholder="Buscar por nome, login ou email..."]').clear().type('Nunes');
      cy.contains('.account-row', loginB).should('be.visible');
      cy.contains('.account-row', loginA).should('not.exist');
    });
  });

  it('editar um usuário pela lista troca o nome na tela e no banco', () => {
    const login = `ALUNO${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.criarConta(instituicao.idTenant, login, 'Marina', 'Duarte', 'Senha123');

      cy.entrarPelaInterface(instituicao);
      cy.irParaUsuarios();

      cy.acaoDaLinha(login, 'Editar Usuário');
      cy.location('pathname', { timeout: 20000 }).should('include', '/edit-account/');

      // O formulário chega preenchido, menos a senha - que não volta da API.
      cy.contains('mat-form-field', 'Nome').find('input').should('have.value', 'Marina');
      cy.contains('mat-form-field', 'Username').find('input').should('have.value', login);

      cy.substituirCampo('Sobrenome', 'Duarte Lima');
      cy.contains('button', 'Salvar').should('not.be.disabled').click();

      cy.location('pathname', { timeout: 20000 }).should('include', '/accounts');
      cy.contains('.account-row', 'Marina Duarte Lima').should('be.visible');

      cy.listarContasPelaApi(instituicao.idTenant, login).then((contas) => {
        const conta = contas.find((c) => c.login === login);
        expect(conta?.lastName, 'sobrenome atualizado no banco').to.eq('Duarte Lima');
      });
    });
  });

  it('editar um usuário sem digitar senha nova preserva a senha antiga', () => {
    const login = `ALUNO${Date.now()}`;
    const senha = 'SenhaOriginal123';

    cy.criarInstituicao().then((instituicao) => {
      cy.criarConta(instituicao.idTenant, login, 'Paulo', 'Reis', senha);

      cy.entrarPelaInterface(instituicao);
      cy.irParaUsuarios();

      cy.acaoDaLinha(login, 'Editar Usuário');
      cy.location('pathname', { timeout: 20000 }).should('include', '/edit-account/');

      // Só o nome muda; o campo Senha fica em branco, como a tela entrega.
      cy.substituirCampo('Nome', 'Paulo Cesar');
      cy.contains('button', 'Salvar').click();
      cy.location('pathname', { timeout: 20000 }).should('include', '/accounts');

      // A senha antiga continua valendo: a conta entra com ela.
      cy.sairPelaInterface();
      cy.entrarPelaInterface(instituicao, login, senha);
      cy.location('pathname').should('include', '/dashboard');
    });
  });

  it('deletar um usuário pela lista some com ele da tela e do banco', () => {
    const login = `ALUNO${Date.now()}`;

    cy.criarInstituicao().then((instituicao) => {
      cy.criarConta(instituicao.idTenant, login, 'Bruno', 'Alves', 'Senha123');

      cy.entrarPelaInterface(instituicao);
      cy.irParaUsuarios();
      cy.contains('.account-row', login).should('be.visible');

      cy.acaoDaLinha(login, 'Deletar Usuário');

      cy.contains('.account-row', login).should('not.exist');

      cy.listarContasPelaApi(instituicao.idTenant).then((contas) => {
        expect(
          contas.find((c) => c.login === login),
          'a conta deletada pela tela não pode continuar no banco'
        ).to.be.undefined;
      });
    });
  });

  it('o botão Salvar do usuário fica desabilitado enquanto os campos obrigatórios estão vazios', () => {
    cy.criarInstituicao().then((instituicao) => {
      cy.entrarPelaInterface(instituicao);
      cy.irParaUsuarios();

      cy.contains('button', 'Criar novo usuário').click();
      cy.location('pathname', { timeout: 20000 }).should('include', '/create-account');

      cy.contains('button', 'Salvar').should('be.disabled');

      cy.preencherCampo('Nome', 'Marina');
      cy.contains('button', 'Salvar').should('be.disabled');

      cy.preencherCampo('Sobrenome', 'Duarte');
      cy.contains('button', 'Salvar').should('be.disabled');

      cy.preencherCampo('Username', `ALUNO${Date.now()}`);
      // Na criação a senha é obrigatória, diferente da edição.
      cy.contains('button', 'Salvar').should('be.disabled');

      cy.preencherCampo('Senha', 'SenhaDoAluno123');
      cy.contains('button', 'Salvar').should('not.be.disabled');
    });
  });

  it('um usuário de outra instituição não aparece na tabela', () => {
    const login = `EXCLUSIVO${Date.now()}`;

    cy.criarInstituicao().then((instituicaoA) => {
      cy.criarConta(instituicaoA.idTenant, login, 'Ana', 'Souza', 'Senha123');

      cy.criarInstituicao().then((instituicaoB) => {
        cy.entrarPelaInterface(instituicaoB);
        cy.irParaUsuarios();

        // A instituição nova só enxerga o próprio ADMIN.
        cy.contains('.account-row', 'ADMIN').should('be.visible');
        cy.contains('.account-row', login).should('not.exist');
      });
    });
  });
});
