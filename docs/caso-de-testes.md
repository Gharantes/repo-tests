https://docs.google.com/document/d/18cKmcMZ8iK3gstJpSlFB_3trUuoFSxTFMimhnmV7VfA/edit?usp=sharing

# Casos de Testes

- **Usuário Primário:**
- **Usuário Secundário:**
- **Usuário Terciário:**

---

## CT01 — BUSCA_PROJETO

**Ator:** Qualquer tipo de usuário

**Pré-Requisitos:**

- Estar logado no sistema.
- Existe ao menos um projeto cadastrado no sistema.

**Passos para Executar:**

1. Clicar em "Explorar" na barra de navegação.
2. Clicar em "Projetos".
3. Aplicar filtro por evento (opcional).
4. Aplicar filtro por curso (opcional).
5. Digitar o nome de um projeto (opcional).
6. Ordenar os resultados por ordem alfabética ou por mais recente (opcional).
7. Localizar um projeto de interesse na listagem.
8. Clicar no card do projeto para visualizar mais detalhes.

**Resultados Esperados:**

1. O sistema redireciona o usuário para a página de Explorar.
2. A aba de Projetos é exibida com a listagem de projetos disponíveis.
3. A listagem é filtrada pelos eventos selecionados.
4. A listagem é filtrada pelo curso selecionado.
5. A listagem exibe apenas projetos cujo título contém o texto digitado.
6. Os resultados são ordenados conforme a opção escolhida.
7. O projeto de interesse aparece na listagem.
8. O cartão do projeto é aberto, exibindo os detalhes completos.

---

## CT02 — BUSCA_EVENTO

**Ator:** Qualquer tipo de usuário

**Pré-Requisitos:**

- Estar logado no sistema.
- Existe ao menos um evento cadastrado no sistema.

**Passos para Executar:**

1. Clicar em "Explorar" na barra de navegação.
2. Clicar em "Eventos".
3. Aplicar filtro por título (opcional).
4. Aplicar filtro por ano (opcional).
5. Ordenar os resultados por ordem alfabética ou por mais recente (opcional).
6. Localizar um evento de interesse na listagem.
7. Clicar no card do evento para visualizar mais detalhes.

**Resultados Esperados:**

1. O sistema redireciona o usuário para a página de Explorar.
2. A aba de Eventos é exibida com a listagem de eventos disponíveis.
3. A listagem é filtrada pelos títulos que correspondem ao filtro aplicado.
4. A listagem exibe apenas eventos do ano selecionado.
5. Os resultados são ordenados conforme a opção escolhida.
6. O evento de interesse aparece na listagem.
7. O cartão do evento é aberto, exibindo os detalhes completos.

---

## CT03 — MANDAR_PEDIDO_PARA_ENTRAR_EM_GRUPO

**Ator:** Usuário Secundário

**Pré-Requisitos:**

- Estar logado no sistema.
- Ter selecionado um projeto na página de "Explorar".
- Estar com o cartão do projeto aberto.

**Passos para Executar:**

1. Visualizar os detalhes do projeto no cartão aberto.
2. Clicar no botão "Mandar Pedido".
3. Clicar no "X" ou pressionar "ESC" para fechar o cartão do projeto.

**Resultados Esperados:**

1. Os detalhes do projeto são exibidos corretamente no cartão.
2. O sistema registra o pedido de entrada e envia a solicitação ao grupo. O botão "Mandar Pedido" passa a indicar que o pedido foi enviado.
3. O cartão do projeto é fechado e o usuário retorna à listagem de projetos.

---

## CT04 — ENTRAR_EM_EVENTO (Evento Público)

**Ator:** Usuário Secundário

**Pré-Requisitos:**

- Estar logado no sistema.
- Ter selecionado um evento na página de "Explorar".
- Estar com o cartão do evento aberto.

**Passos para Executar:**

1. Visualizar os detalhes do evento no cartão aberto.
2. Clicar no botão "Entrar no Evento" (disponível pois o evento é público).
3. Selecionar a opção de inscrever um projeto existente no evento.
4. Clicar no "X" para fechar o cartão do evento.

**Resultados Esperados:**

1. Os detalhes do evento público são exibidos com o botão "Entrar no Evento" habilitado.
2. O sistema exibe as opções: inscrever projeto existente, criar novo projeto ou explorar projetos.
3. O projeto existente do aluno é inscrito no evento com sucesso.
4. O cartão é fechado e o usuário retorna à listagem de eventos.

---

## CT05 — ENTRAR_EM_EVENTO (Evento Privado)

**Ator:** Usuário Secundário

**Pré-Requisitos:**

- Estar logado no sistema.
- Ter selecionado um evento na página "Explorar".
- O aluno deve ter sido incluído nesse evento pelo professor ou atender às condições de entrada.
- Estar com o cartão do evento aberto.

**Passos para Executar:**

1. Visualizar os detalhes do evento no cartão aberto.
2. Verificar que o botão "Entrar no Evento" está disponível (aluno atende às condições).
3. Clicar no botão "Entrar no Evento".
4. Selecionar a opção de criar um novo projeto para participar do evento.
5. Clicar no "X" para fechar o cartão.

**Resultados Esperados:**

1. Os detalhes do evento privado são exibidos corretamente.
2. O botão "Entrar no Evento" está habilitado, pois o aluno atende às condições.
3. O sistema exibe as opções de entrada no evento.
4. O sistema direciona o aluno para o fluxo de Criar Projeto.
5. O cartão é fechado e o usuário retorna à listagem de eventos.

---

## CT06 — ALTERAR_CONFIGURACOES (Salvar)

**Ator:** Usuário Secundário

**Pré-Requisitos:**

- Estar logado no sistema.

**Passos para Executar:**

1. Clicar no botão "Configurações" presente na Sidebar.
2. Alternar entre "Light" e "Dark" mode.
3. Alterar o tamanho das fontes do sistema.
4. Clicar no botão "Salvar".

**Resultados Esperados:**

1. A tela de configurações é exibida corretamente.
2. A interface do sistema alterna visualmente para o modo selecionado.
3. O tamanho das fontes é ajustado conforme a escolha do usuário.
4. As configurações são salvas e o usuário é direcionado de volta à tela principal com as alterações aplicadas.

---

## CT07 — ALTERAR_CONFIGURACOES (Descartar)

**Ator:** Usuário Secundário

**Pré-Requisitos:**

- Estar logado no sistema.
- Ter a tela de Configurações com ao menos uma alteração realizada.

**Passos para Executar:**

1. Realizar ao menos uma alteração nas configurações.
2. Clicar no botão "Voltar" ou pressionar a tecla "ESC".
3. Confirmar que deseja descartar as alterações na mensagem de confirmação exibida.

**Resultados Esperados:**

1. A alteração é refletida na tela de configurações.
2. O sistema exibe uma mensagem de confirmação perguntando se o usuário deseja descartar as alterações.
3. As alterações são descartadas e o usuário é direcionado de volta à tela principal sem nenhuma mudança aplicada.

---

## CT08 — ENVIAR_MENSAGENS_ALUNO

**Ator:** Usuário Secundário

**Pré-Requisitos:**

- Estar logado no sistema.
- Fazer parte de ao menos um projeto.
- O projeto deve estar inscrito em ao menos um evento com professor vinculado.

**Passos para Executar:**

1. Clicar no nome do projeto na Sidebar, abaixo de "Meus Projetos".
2. Clicar no botão "Mensagens" na página do projeto.
3. Selecionar um destinatário (membro do grupo ou professor do evento).
4. Digitar uma mensagem no campo de texto.
5. Pressionar o botão "Enviar" ou o atalho "Enter".

**Resultados Esperados:**

1. O usuário é direcionado à página do projeto selecionado.
2. A tela de mensagens é exibida com a lista de destinatários disponíveis.
3. O chat com o destinatário selecionado é aberto.
4. A mensagem digitada aparece no campo de texto.
5. A mensagem é enviada e exibida no chat.

---

## CT09 — ENVIAR_MENSAGENS_PROFESSOR

**Ator:** Usuário Primário

**Pré-Requisitos:**

- Estar logado no sistema.
- Possuir ao menos um evento com projetos inscritos.

**Passos para Executar:**

1. Clicar no nome do evento na Sidebar, abaixo de "Meus Eventos".
2. Clicar na aba "Projetos Inscritos".
3. Localizar e selecionar um projeto (usando os filtros disponíveis, se necessário).
4. Clicar no projeto para abrir seu cartão e clicar em "Mensagens".
5. Digitar uma mensagem no campo de texto.
6. Pressionar o botão "Enviar" ou o atalho "Enter".

**Resultados Esperados:**

1. O usuário é direcionado à página do evento selecionado.
2. A aba de projetos inscritos é exibida com a listagem de projetos.
3. O projeto é localizado e selecionado corretamente.
4. O cartão do projeto é aberto e o usuário é direcionado ao chat do grupo.
5. A mensagem digitada aparece no campo de texto.
6. A mensagem é enviada e exibida no chat do grupo.

---

## CT10 — CRIAR_PROJETO

**Ator:** Usuário Primário

**Pré-Requisitos:**

- Estar logado no sistema.

**Passos para Executar:**

1. Clicar em "Explorar" e depois em "Projetos".
2. Clicar no botão "Criar Projeto".
3. Preencher o campo obrigatório "Título" do projeto.
4. Preencher o campo obrigatório "Descrição" do projeto.
5. Selecionar um ou mais eventos para incluir o projeto (opcional).
6. Inserir e-mails de outros alunos para convidá-los (opcional).
7. Clicar no botão "Criar Projeto".

**Resultados Esperados:**

1. O usuário é direcionado à página de Projetos.
2. O formulário de criação do projeto é exibido.
3. O campo de título aceita a entrada do usuário.
4. O campo de descrição aceita a entrada do usuário.
5. Os eventos selecionados são vinculados ao projeto.
6. Os convites são registrados para os e-mails informados.
7. O projeto é criado e o usuário é direcionado para a página do novo projeto.

---

## CT11 — CRIAR_EVENTO

**Ator:** Usuário Primário

**Pré-Requisitos:**

- Estar logado no sistema.
- Ter permissão para criar evento.

**Passos para Executar:**

1. Clicar no botão "Eventos" na Sidebar.
2. Clicar no botão "Criar Evento".
3. Preencher o campo obrigatório "Título" do evento.
4. Preencher o campo obrigatório "Descrição" do evento.
5. Definir o evento como "Público" ou "Privado".
6. Definir datas para o evento (opcional).
7. Definir requerimentos para o evento e suas prioridades (opcional).
8. Clicar no botão "Salvar".

**Resultados Esperados:**

1. O usuário é direcionado para a página Eventos.
2. O formulário de criação do evento é exibido.
3. O campo de título aceita a entrada do usuário.
4. O campo de descrição aceita a entrada do usuário.
5. A visibilidade do evento é configurada conforme escolhida. Se privado, o sistema habilita os campos de definição de membros ou condições de entrada.
6. As datas são vinculadas ao evento (únicas ou por período).
7. Os requerimentos são salvos com as prioridades definidas.
8. O evento é criado e o usuário é direcionado para a página do novo evento.

---

## CT12 — ADICIONAR_USUARIO_A_UM_EVENTO

**Ator:** Usuário Primário

**Pré-Requisitos:**

- Estar logado no sistema.
- Deve existir o evento.
- O usuário primário deve possuir permissão para fazer alterações neste evento.
- Deve existir pelo menos um usuário secundário no Tenant.

**Passos para Executar:**

1. Clicar no botão "Eventos" na Sidebar.
2. Selecionar o evento privado desejado.
3. Clicar em "Participantes" para acessar a aba de participantes.
4. Clicar no botão "Adicionar Participantes" e selecionar a opção "Alunos".
5. Localizar e selecionar o(s) aluno(s) desejado(s).
6. Clicar em "Salvar".

**Resultados Esperados:**

1. O usuário é direcionado para a página de eventos.
2. O usuário é direcionado para a página do evento selecionado.
3. A aba de participantes é exibida.
4. A tela de seleção de alunos é exibida.
5. Os alunos selecionados são destacados/marcados corretamente. É possível selecionar múltiplos alunos.
6. Os alunos são adicionados ao evento e o usuário é redirecionado à tela de participantes do evento.

---

## CT13 — ADICIONAR_CONDICOES_DE_ENTRADA_A_UM_EVENTO

**Ator:** Usuário Primário

**Pré-Requisitos:**

- Estar logado no sistema.
- O evento deve existir.
- O usuário deve ter permissão para editar este evento.

**Passos para Executar:**

1. Clicar no botão "Eventos" na Sidebar.
2. Selecionar o evento privado desejado.
3. Clicar em "Participantes" para acessar a aba de participantes.
4. Clicar no botão "Adicionar Condições de Entrada".
5. Definir o ano de ingresso na universidade como condição (ex.: a partir de 2023).
6. Definir o curso que o aluno deve estar cursando como condição.
7. Clicar em "Salvar".

**Resultados Esperados:**

1. O usuário é direcionado para a página de eventos.
2. O usuário é direcionado para a página do evento selecionado.
3. A aba de participantes é exibida.
4. A tela de definição de condições de entrada é exibida.
5. A condição de ano de ingresso é registrada (mínimo, máximo ou exato).
6. A condição de curso é registrada (todos os membros ou ao menos um membro do projeto).
7. As condições são salvas e o usuário é redirecionado à tela de participantes do evento.
