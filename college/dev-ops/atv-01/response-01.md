# Documento de Requisitos: Synergia (recorte MVP)

**Disciplina:** DevOps, Aula 05, Projeto Integrador (Parte 1)
**Autor:** Guilherme Harmatiuk Arantes
**Versão:** 1.0
**Data:** 07/09/2026

---

## 1. Visão e objetivo do sistema

O Synergia é uma plataforma para alunos de uma mesma universidade acharem parceiros de outros
cursos para seus projetos. Um aluno publica o projeto dizendo de quais áreas precisa; quem se
interessa encontra esse projeto por busca e filtro e pede para entrar; o dono do projeto
aceita ou recusa. É isso.

### Quem usa e o que atrapalha hoje

O público são alunos de graduação que precisam montar equipe para os eventos da faculdade,
como Startup Garage, Summit, ECCI, ou para o próprio TCC. Hoje isso acontece no WhatsApp: o
aluno leva a ideia para um professor, o professor repassa nos grupos dos outros cursos, e a
proposta some no meio dos avisos da turma. Como o contato seguinte é no privado, ninguém
enxerga o quadro geral, nem os alunos, nem os professores, e é comum um grupo continuar
procurando gente enquanto outro já fechou.

Isso não é impressão nossa. Na pesquisa feita para o TCC, 10 dos 17 alunos entrevistados
disseram que tiveram dificuldade para montar seus projetos e que teriam se saído melhor com
a ajuda de colegas de outras áreas.

### O que muda com o sistema

Em vez de a proposta circular por repasse manual, ela fica em um lugar só, pesquisável por
curso e por evento, e recebe pedidos de entrada que ficam registrados. O professor deixa de
ser o intermediário e o aluno para de depender de sorte para ver a mensagem certa na hora
certa.

### Como saberemos que funcionou

O teste é simples: um aluno do público-alvo, que não participou do desenvolvimento, entra no
sistema sem ninguém guiando o clique dele, acha um projeto que combina com o curso dele e
manda o pedido; do outro lado, o dono do projeto vê esse pedido e aprova. Se o vínculo
continuar lá depois de fechar e reabrir a página, funcionou.

---

## 2. Escopo mínimo (MVP)

O Synergia do TCC é bem maior do que o que cabe nesta atividade, então em vez de documentar o
sistema inteiro por cima, recortamos um pedaço que se sustenta sozinho: publicar um projeto,
encontrá-lo e entrar nele. É pouca coisa, mas é um ciclo completo, que alguém de fora
consegue usar de ponta a ponta.

### O que é essencial

1. **Autenticação com e-mail institucional.** Sem saber quem é o aluno e de que curso ele é,
   não dá para filtrar nada nem registrar um pedido.
2. **Criar projeto.** É de onde vem todo o conteúdo do sistema.
3. **Explorar projetos com busca e filtro.** É exatamente o que substitui o repasse por
   WhatsApp.
4. **Enviar pedido de entrada.** É a ação que interessa a quem está procurando equipe.
5. **Aprovar ou recusar pedido.** Fecha o ciclo. Sem isso o pedido vira só mais uma mensagem
   sem resposta.

### O que fica para depois

Tudo abaixo já existe no escopo do TCC e continua no plano, só não entra nesta versão:

- Criação e administração de eventos. Aqui o evento é só um dado de catálogo, para leitura e
  filtro (RN08).
- Condições de entrada em evento, como ano de ingresso e curso obrigatório.
- Adicionar participantes a um evento pelo professor.
- Mensagens e chat entre membros e com o professor.
- Perfil do professor e acompanhamento dos projetos inscritos.
- Configurações de usuário, como tema claro e escuro e tamanho de fonte.
- Vídeos de pitch, dashboards, feed de notificações e convite por e-mail.
- Convite direto a colegas na hora de criar o projeto. Nesta versão o projeto nasce só com o
  dono e os outros entram por pedido.
- Dois fatores e login federado da universidade. Por enquanto é e-mail institucional e senha,
  com validação de domínio.

### Quem interage com o sistema

- **Aluno autor:** criou um projeto e decide quem entra nele.
- **Aluno participante:** procura projeto e manda pedidos de entrada.
- **Visitante:** ainda não entrou; só vê login e cadastro.

Autor e participante são a mesma conta. O papel muda conforme o projeto: quem é autor do seu
próprio projeto é participante no projeto dos outros.

---

## 3. Requisitos funcionais

**RF01. Cadastrar conta.** O sistema deve permitir que um visitante crie uma conta informando
nome completo, e-mail institucional, senha e curso, escolhido a partir da lista de cursos
cadastrados.

**RF02. Autenticar usuário.** O sistema deve permitir que um usuário cadastrado entre com
e-mail e senha, e deve recusar a tentativa quando as credenciais não corresponderem a uma
conta existente.

**RF03. Encerrar sessão.** O sistema deve permitir que o usuário saia da conta, deixando as
telas internas inacessíveis até que ele entre de novo.

**RF04. Listar projetos.** O sistema deve mostrar ao usuário autenticado os projetos com
status aberto, exibindo título, cursos procurados, evento vinculado, quantos membros o
projeto tem e qual é o limite.

**RF05. Filtrar e buscar projetos.** O sistema deve permitir filtrar os projetos por curso
procurado e por evento, e buscar por texto contido no título, com os três critérios podendo
ser combinados.

**RF06. Ver detalhes do projeto.** O sistema deve exibir a página do projeto com título,
descrição completa, evento, cursos procurados, autor, lista de membros e vagas restantes.

**RF07. Criar projeto.** O sistema deve permitir que um usuário autenticado crie um projeto
informando título, descrição, evento (opcional), um ou mais cursos procurados e o limite de
membros, registrando quem criou como autor e primeiro membro.

**RF08. Enviar pedido de entrada.** O sistema deve permitir que um usuário autenticado peça
para entrar em um projeto do qual ainda não é membro, com uma mensagem opcional de até 300
caracteres.

**RF09. Listar pedidos recebidos.** O sistema deve mostrar ao autor do projeto os pedidos
pendentes, com nome, curso e mensagem de quem pediu.

**RF10. Aprovar ou recusar pedido.** O sistema deve permitir que o autor decida cada pedido
pendente. Ao aprovar, quem pediu passa a constar como membro do projeto.

**RF11. Listar meus projetos.** O sistema deve mostrar ao usuário os projetos em que ele é
autor ou membro, deixando claro qual dos dois papéis ele exerce em cada um.

**RF12. Consultar meus pedidos.** O sistema deve mostrar ao usuário o status de cada pedido
que ele enviou: pendente, aprovado ou recusado.

---

## 4. Histórias de usuário e critérios de aceite

### HU01. Encontrar um projeto compatível

> Como aluno participante, quero filtrar os projetos abertos por curso e por evento, para
> achar rápido um projeto que precisa de alguém da minha área.

Critérios de aceite:

- Com o filtro de curso "Design" ligado, a lista traz só projetos que têm Design entre os
  cursos procurados.
- Com filtro de curso e de evento ligados ao mesmo tempo, a lista traz só os projetos que
  atendem aos dois.
- Ao digitar um texto na busca, a lista traz só os projetos cujo título contém aquele texto,
  sem diferenciar maiúsculas de minúsculas nem acentuação.
- Quando nada corresponde aos filtros, aparece a mensagem "Nenhum projeto encontrado", e não
  uma tela vazia sem explicação.
- Projetos fechados não aparecem na listagem padrão.

### HU02. Publicar meu projeto

> Como aluno autor, quero publicar meu projeto dizendo de quais cursos preciso, para que
> alunos dessas áreas me encontrem sem eu depender do grupo de WhatsApp.

Critérios de aceite:

- O projeto não é criado se o título estiver vazio ou tiver menos de 5 caracteres, e o erro
  aparece no campo em questão.
- O projeto não é criado se a descrição tiver menos de 20 caracteres.
- O projeto não é criado se nenhum curso procurado for selecionado.
- O projeto não é criado se o limite de membros for menor que 2 ou maior que 10.
- Criado o projeto, o autor já aparece como membro e o contador marca 1.
- Criado o projeto, ele aparece na listagem de projetos abertos e em "Meus projetos".

### HU03. Pedir para entrar em um projeto

> Como aluno participante, quero pedir para entrar em um projeto, para me candidatar à equipe
> sem ter que caçar o autor no privado.

Critérios de aceite:

- Em um projeto do qual não sou membro e que ainda tem vaga, o botão "Pedir para entrar" está
  habilitado.
- Depois de enviar, o botão passa a "Pedido enviado" e fica desabilitado, e o pedido aparece
  como pendente na minha lista.
- Se eu tentar mandar um segundo pedido para o mesmo projeto, o sistema recusa e não cria um
  novo registro.
- Em projeto do qual já sou membro, o botão nem aparece.
- Em projeto sem vagas, o botão nem aparece.
- A mensagem opcional é recusada se passar de 300 caracteres.

### HU04. Decidir quem entra na minha equipe

> Como aluno autor, quero aprovar ou recusar os pedidos que recebo, para controlar quem entra
> na minha equipe.

Critérios de aceite:

- A lista mostra todos os pedidos pendentes do projeto, com nome e curso de quem pediu.
- Ao aprovar, a pessoa entra na lista de membros, o contador sobe em 1 e o pedido sai dos
  pendentes como aprovado.
- Ao recusar, ninguém é adicionado, o contador não muda e o pedido fica como recusado.
- Quem não é o autor não consegue aprovar nem recusar, nem chamando a operação direto pela
  API: a resposta é 403.
- Aprovar um pedido que já foi decidido não muda nada no projeto e retorna erro.
- Se a aprovação faz o projeto bater o limite de membros, ele passa a fechado, e os pedidos
  pendentes que sobraram continuam visíveis, mas não podem mais ser aprovados.

### HU05. Acompanhar minha situação

> Como aluno participante, quero ver de quais projetos faço parte e como estão meus pedidos,
> para saber onde já fui aceito e o que ainda está em análise.

Critérios de aceite:

- "Meus projetos" lista os projetos em que sou autor ou membro, e nenhum outro.
- Cada item diz se sou autor ou membro.
- "Meus pedidos" mostra cada pedido enviado como pendente, aprovado ou recusado.
- Assim que sou aprovado, o projeto aparece em "Meus projetos", sem precisar sair e entrar de
  novo.

---

## 5. Casos de uso principais

### UC01. Buscar projeto

**Ator principal:** aluno participante

**Pré-condição:** usuário autenticado e pelo menos um projeto aberto cadastrado.

**Fluxo principal:**

1. O usuário acessa "Explorar".
2. O sistema mostra os projetos abertos.
3. O usuário escolhe um curso e/ou um evento no filtro, ou digita um texto na busca.
4. O sistema mostra só os projetos que atendem aos critérios.
5. O usuário abre um projeto da lista.
6. O sistema mostra a página de detalhes do projeto.

**Fluxo alternativo:**

- 4a. Nada corresponde aos critérios: o sistema exibe "Nenhum projeto encontrado" e mantém os
  filtros aplicados, para o usuário ajustar.

**Pós-condição:** nada muda no banco; o usuário está na página do projeto que escolheu.

### UC02. Criar projeto

**Ator principal:** aluno autor

**Pré-condição:** usuário autenticado.

**Fluxo principal:**

1. O usuário aciona "Criar projeto".
2. O sistema mostra o formulário.
3. O usuário preenche título, descrição, cursos procurados, limite de membros e, se quiser, o
   evento.
4. O usuário confirma.
5. O sistema valida os campos, salva o projeto como aberto, registra o autor como membro e
   leva o usuário para a página do projeto.

**Fluxo alternativo:**

- 5a. Algum campo está inválido (RN06): nada é salvo, o usuário continua no formulário com o
  que já digitou e o sistema aponta o campo com problema.

**Pós-condição:** projeto salvo no banco com um membro, o autor, e visível na listagem de
projetos abertos.

### UC03. Enviar pedido de entrada

**Ator principal:** aluno participante

**Pré-condição:** usuário autenticado, ainda não membro do projeto, e projeto aberto com vaga
disponível.

**Fluxo principal:**

1. O usuário abre a página do projeto.
2. O usuário aciona "Pedir para entrar".
3. O usuário escreve uma mensagem opcional e confirma.
4. O sistema salva o pedido como pendente e confirma o envio na tela.

**Fluxos alternativos:**

- 2a. Já existe um pedido pendente desse usuário para esse projeto (RN02): o botão não é
  oferecido e a API recusa a operação com 409.
- 2b. O usuário já é membro (RN03): o botão não é oferecido.
- 2c. O projeto está fechado (RN05): o botão não é oferecido e a API recusa a operação.

**Pós-condição:** pedido salvo como pendente, visível para o autor do projeto e em "Meus
pedidos" de quem pediu.

### UC04. Aprovar ou recusar pedido de entrada

**Ator principal:** aluno autor

**Pré-condição:** usuário autenticado, autor do projeto, com pelo menos um pedido pendente.

**Fluxo principal:**

1. O autor abre a página do projeto e vai em "Pedidos".
2. O sistema lista os pedidos pendentes.
3. O autor aciona "Aprovar" em um deles.
4. O sistema registra a pessoa como membro, marca o pedido como aprovado e atualiza o
   contador de membros.

**Fluxos alternativos:**

- 3a. O autor aciona "Recusar": o pedido fica como recusado e nenhum vínculo é criado.
- 3b. Quem chamou a operação não é o autor (RN04): o sistema responde 403 e não altera nada.
- 3c. O pedido já tinha sido decidido (RN07): o sistema recusa a operação e mantém o estado
  anterior.
- 4a. A aprovação bate o limite de membros (RN05): o projeto passa a fechado.

**Pós-condição:** pedido com status final, aprovado ou recusado. Se aprovado, o vínculo de
membro fica salvo e o projeto pode ter passado a fechado.

---

## 6. Regras de negócio

**RN01.** Só é possível criar conta com e-mail do domínio institucional (`@fag.edu.br`).
Outros domínios são recusados no cadastro.

**RN02.** Um usuário não pode ter mais de um pedido pendente para o mesmo projeto.

**RN03.** Quem já é membro de um projeto não pode pedir para entrar nele.

**RN04.** Só o autor do projeto aprova ou recusa os pedidos daquele projeto.

**RN05.** Projeto que bateu o limite de membros definido na criação passa a fechado e não
aceita mais pedidos nem aprovações.

**RN06.** Um projeto só é criado com título de 5 a 80 caracteres, descrição de no mínimo 20
caracteres, ao menos um curso procurado e limite de membros entre 2 e 10.

**RN07.** Um pedido só muda de status enquanto está pendente. Aprovado e recusado são
finais.

**RN08.** Um projeto se vincula a no máximo um evento, escolhido entre os já cadastrados.
Criar evento não faz parte desta versão.

**RN09.** O autor conta como membro do projeto e não pode sair dele nesta versão.

**RN10.** Cada projeto pertence à instituição do autor, e o usuário só enxerga projetos da
própria instituição.

---

## 7. Requisitos não funcionais

**RNF01. Responsividade.** As telas do MVP precisam continuar utilizáveis tanto no navegador
do computador quanto em uma tela de 360 px de largura, sem perder nenhuma função. Verificamos
rodando os quatro casos de uso nas duas larguras.

**RNF02. Senha protegida.** As senhas ficam salvas com hash, via bcrypt ou pgcrypto, nunca em
texto puro. Basta abrir a tabela de usuários no Supabase e conferir que não há senha legível.

**RNF03. Escrita só com sessão válida.** Toda operação que grava dados (RF07, RF08 e RF10)
exige sessão válida, e uma requisição sem token recebe HTTP 401. Testamos chamando a API
direto, sem o cabeçalho de autenticação.

**RNF04. Listagem rápida.** A listagem filtrada de projetos responde em até 2 segundos com
200 projetos na base. Medimos no ambiente publicado, com massa de dados carregada por seed.

**RNF05. Deploy vindo do repositório.** A aplicação fica publicada na Vercel e o banco no
Supabase, com o deploy saindo do repositório no GitHub, nunca de arquivo enviado à mão.
Verificamos alterando a `main` e conferindo se a mudança aparece na URL pública depois do
build automático.

**RNF06. Persistência de verdade.** O que a aplicação publicada cria fica salvo no banco
remoto e continua lá depois de recarregar a página ou entrar de novo. Criamos um projeto,
saímos, voltamos e procuramos o registro.

**RNF07. Ambiente reproduzível.** Aplicação e banco sobem com um comando de Docker Compose
documentado no README. A prova é clonar o repositório em uma máquina limpa e rodar esse
comando.

**RNF08. Integração contínua.** Cada push e cada Pull Request disparam os testes
automaticamente, com o resultado visível no próprio PR.

**RNF09. Contraste.** O texto mantém contraste de pelo menos 4,5:1 com o fundo, seguindo a
WCAG 2.1 AA, conferido por verificação automatizada nas telas principais.

**RNF10. Erro que ajuda.** As mensagens de validação dizem qual campo está com problema e
preservam o que o usuário já tinha digitado, como nos fluxos alternativos de UC02 e UC03.

---

## 8. Tabela de rastreabilidade

Cada linha liga uma história a um requisito, à regra que ele precisa respeitar e ao teste que
vai comprovar isso na Parte 2. É essa ligação que define o que testar, em vez de escolher os
testes na hora de escrevê-los.

**HU01. Encontrar um projeto compatível**

- RF04 e RF05, regras RN05 e RN10. Teste de unidade: a função de filtro por curso, evento e
  texto sobre uma lista conhecida.
- RF04 e RF05, regra RN05. Teste de integração: a consulta na API com filtros combinados
  traz só os projetos abertos que correspondem.
- RF04 e RF05. Teste de sistema: o aluno aplica o filtro de curso e acha o projeto esperado
  na listagem.

**HU02. Publicar meu projeto**

- RF07, regra RN06. Teste de unidade: validação de título, descrição, cursos e limite de
  membros, com casos válidos e inválidos.
- RF07, regras RN06, RN08 e RN09. Teste de integração: um POST válido salva o projeto e cria
  o vínculo de membro do autor.
- RF07, regra RN06. Teste de sistema: criar um projeto pela interface e encontrá-lo na
  listagem e em "Meus projetos".

**HU03. Pedir para entrar em um projeto**

- RF08, regras RN02 e RN03. Teste de unidade: a regra que decide se um usuário pode pedir
  entrada em um projeto.
- RF08, regra RN02. Teste de integração: o segundo pedido do mesmo usuário para o mesmo
  projeto é recusado com 409 e não gera registro.
- RF08, regra RN05. Teste de integração: pedido em projeto fechado é recusado.
- RF08 e RF12, regra RN02. Teste de sistema: o aluno manda o pedido e o vê como pendente em
  "Meus pedidos".

**HU04. Decidir quem entra na minha equipe**

- RF10, regra RN04. Teste de integração: quem não é o autor recebe 403 ao tentar aprovar.
- RF10, regra RN07. Teste de unidade: a transição de status do pedido, de pendente para
  aprovado ou recusado, e o erro ao tentar mexer em um pedido já decidido.
- RF09 e RF10, regra RN05. Teste de integração: a aprovação que bate o limite passa o projeto
  para fechado.
- RF09 e RF10, regras RN04 e RN07. Teste de sistema: o autor aprova um pedido e quem pediu
  passa a constar como membro.

**HU05. Acompanhar minha situação**

- RF11 e RF12, regras RN09 e RN10. Teste de integração: "Meus projetos" traz apenas os
  projetos em que o usuário é autor ou membro.
- RF11. Teste de sistema: depois da aprovação, o projeto aparece em "Meus projetos" de quem
  pediu.

**Acesso ao sistema, sem história dedicada**

- RF01 e RF02, regra RN01. Teste de unidade: validação do domínio do e-mail institucional.
- RF02 e RF03. Teste de integração: rota protegida sem token responde 401, como pede o RNF03.

São 18 testes. Os de unidade cobrem as regras isoladas, RN01, RN02, RN06 e RN07; os de
integração cobrem API e banco juntos, que é onde permissão e unicidade valem de fato, caso de
RN04 e RN05; os de sistema percorrem os quatro casos de uso de ponta a ponta. A ideia é essa
mesmo: poucos testes que protegem comportamento importante.

---

## 9. Divisão de responsabilidades da equipe

O projeto é individual, então os quatro papéis ficam comigo. Para que isso não vire "uma
pessoa faz tudo", separei os papéis pelo que cada um entrega: cada função tem uma saída que
dá para olhar e cobrar. Responsável em todos eles: Guilherme Harmatiuk Arantes.

**Product Owner.** Decidiu o recorte do MVP, o que era essencial e o que ficava para depois,
escreveu as histórias HU01 a HU05 e assumiu a escolha de deixar eventos e mensagens fora
desta versão.

**Backend.** API de projetos e pedidos, as regras RN01 a RN10 aplicadas no servidor e a
integração com o banco no Supabase.

**Frontend.** Telas de login, explorar e filtrar, detalhes do projeto, criação de projeto e
lista de pedidos, junto com as validações de formulário e os estados de erro do RNF10.

**Qualidade.** Escreveu os critérios de aceite de forma testável, montou a rastreabilidade da
seção 8 e cuida da suíte de testes nas três camadas, do pipeline de CI, da proteção da `main`
e da evidência com o cliente real.

Falta acertar um ponto com o professor: a atividade prevê grupos de 4 a 5 pessoas com esses
papéis distribuídos, e aqui eles estão todos na mesma pessoa. Preciso confirmar se essa
divisão por entregável resolve ou se vou precisar formar grupo. Isso também mexe com a regra
de exigir uma aprovação no Pull Request, já que o GitHub não deixa o autor aprovar o próprio
PR.
