# Roteiro de Apresentação — Synergia (~10 min)

**Como usar este roteiro:** o texto entre aspas é para **falar/ler**. Os blocos **[AÇÃO]** são instruções para você (trocar de tela, avançar slide) — *não leia em voz alta*. Os horários são alvos; se estiver adiantado, alongue a demo; se atrasado, encurte o Figma e passe rápido pelos slides 6 e 10.

**Você vai alternar entre três coisas:** (1) estes slides · (2) a aplicação rodando (demo) · (3) o protótipo no Figma.

**Distribuição do tempo:** slides de abertura ~2:45 · demo ~2:30 · Figma ~1:15 · slides de fechamento ~2:45 · encerramento ~0:20.

---

### SLIDE 1 — Capa · `0:00 – 0:40`
**[AÇÃO: comece com o Slide 1 na tela.]**

> "Bom dia a todos. Meu nome é Guilherme Harmatiuk Arantes, e vou apresentar o **Synergia** — uma plataforma que conecta alunos de diferentes cursos para colaborarem em projetos multidisciplinares. Este trabalho é apresentado como alternativa ao TCC, e reúne desde a documentação de requisitos até um protótipo já funcional, que eu vou mostrar rodando daqui a pouco."

### SLIDE 2 — Clientes · `0:40 – 1:05`
**[AÇÃO: avançar para o Slide 2.]**

> "O Synergia é voltado principalmente para **instituições de ensino superior** e, dentro delas, para os **alunos e professores**. A mesma ideia serve também para organizações menores que precisam organizar projetos, mas o foco do trabalho é o ambiente acadêmico — como aqui na FAG."

### SLIDE 3 — O problema · `1:05 – 1:40`
**[AÇÃO: Slide 3.]**

> "E qual problema ele resolve? Hoje, unir alunos de cursos diferentes para um projeto é mais difícil do que deveria. Na prática, isso acontece pelo **WhatsApp**: um aluno tem uma ideia, o professor repassa nos grupos dos outros cursos, e ali a proposta se perde no meio de vários avisos. Ninguém sabe direito quais grupos já encontraram ajuda e quais ainda estão procurando."

### SLIDE 4 — O dado · `1:40 – 2:10`
**[AÇÃO: Slide 4.]**

> "E isso não é só percepção minha. Numa pesquisa que fiz, **60% dos alunos entrevistados — 10 de 17** — relataram dificuldade em montar seus projetos, e disseram que teriam se beneficiado da ajuda de colegas de outras áreas. Os dois motivos principais são estes: **mensagens que se perdem** e **falta de visibilidade** de quem precisa de quem."

### SLIDE 5 — A solução + ponte para a demo · `2:10 – 2:45`
**[AÇÃO: Slide 5.]**

> "A proposta do Synergia é resolver isso com uma plataforma simples para **encontrar, conectar e colaborar**: login com a conta da universidade, busca e filtro de projetos e eventos, criação de projetos próprios e comunicação integrada. E o melhor é que isso não é só conceito — já existe um protótipo funcionando. Deixem eu mostrar."

---

### 💻 [DEMO AO VIVO] · `2:45 – 5:15` (~2min30)
**[AÇÃO: trocar para a APLICAÇÃO rodando. Fale enquanto navega — sugestão de roteiro, ajuste ao seu:]**

- Login com a conta da universidade.
- Explorar **projetos** e **eventos**; aplicar um filtro (por curso ou evento).
- Abrir o **cartão de um projeto** e mandar um **pedido para entrar**.
- **Criar um projeto novo** (título, descrição, evento).
- Mostrar as **mensagens / chat** do grupo.

**[AÇÃO: fique de olho no relógio — não passe de ~5:15.]** Fecho da demo:

> "Esse é o núcleo do sistema já funcionando."

### 🎨 [FIGMA] · `5:15 – 6:30` (~1min15)
**[AÇÃO: trocar para o protótipo no FIGMA.]**

> "No código eu priorizei o núcleo. No Figma está a **visão completa** da experiência — como o sistema fica quando todas as funcionalidades estão no lugar."

**[AÇÃO: mostre 2 ou 3 telas de maior impacto — por exemplo, o feed/dashboard, a criação de evento com condições de entrada, e a tela de mensagens. Não detalhe tudo; dê a visão geral. Ao terminar, volte para os slides.]**

---

### SLIDE 6 — Funcionalidades · `6:30 – 6:55`
**[AÇÃO: Slide 6.]**

> "Resumindo o que vocês acabaram de ver: login único, exploração e filtros, criação de projetos e eventos, mensagens integradas e um feed de notificações. Tudo pensado para tirar essa colaboração do WhatsApp e colocar em um lugar só."

### SLIDE 7 — Proposta de valor · `6:55 – 7:20`
**[AÇÃO: Slide 7.]**

> "Mas o valor vai além da ferramenta. Ao juntar alunos de áreas diferentes, o Synergia promove **interdisciplinaridade**, desenvolve **habilidades socioemocionais** — trabalho em equipe, comunicação — e enriquece a **experiência acadêmica** de todos os envolvidos."

### SLIDE 8 — Análise de mercado · `7:20 – 7:50`
**[AÇÃO: Slide 8.]**

> "Em termos de escala: só a FAG já teve cerca de **12 mil alunos** em formação, e **4,7 mil candidatos** no vestibular de 2023. E isso é uma instituição — somando as outras universidades de Cascavel, a demanda potencial é bem grande."

### SLIDE 9 — Tecnologia · `7:50 – 8:25`
**[AÇÃO: Slide 9. Este slide a banca técnica valoriza — não corra.]**

> "Por baixo, a arquitetura foi pensada para crescer. **Front-end em TypeScript**, **back-end em Kotlin** com APIs REST protegidas por JWT, **PostgreSQL e MongoDB** para os dados, **Cloudflare Stream** para os vídeos de pitch, e **Kubernetes com Prometheus** para escalar e monitorar sob demanda — além de criptografia para proteger os dados dos usuários."

### SLIDE 10 — Processo e metodologia · `8:25 – 9:00`
**[AÇÃO: Slide 10.]**

> "Do lado do processo, o desenvolvimento seguiu **metodologia ágil, com SCRUM**: backlog, sprints e revisões. E gerou a documentação formal que embasa tudo isso — **documento de requisitos, casos de uso e de teste, diagramas UML e Canvas** — validada com o protótipo no Figma e com a aplicação em código."

### SLIDE 11 — Monetização · `9:00 – 9:25`
**[AÇÃO: Slide 11.]**

> "Sobre sustentabilidade: o Synergia é um projeto **sem fins lucrativos e Open Source**. Qualquer instituição pode adotar e adaptar; ela só arca com os custos de manutenção, como hospedagem e servidores. O objetivo aqui é impacto, não receita."

### SLIDE 12 — Encerramento · `9:25 – 9:45`
**[AÇÃO: Slide 12.]**

> "Para encerrar: o Synergia mostra que, com a ferramenta certa, a colaboração entre cursos deixa de ser um obstáculo e vira uma vantagem para toda a instituição. Muito obrigado pela atenção — fico à disposição para as perguntas da banca."

---

## Dicas de ritmo
- **Adiantado?** Alongue a demo (é o momento mais forte). **Atrasado?** Encurte o Figma e passe rápido pelos slides 6 e 10.
- **Não corra** nos slides 9 (tecnologia) e 10 (metodologia) — é o que diferencia um TCC de um pitch comum.
- Respire nas transições **demo → Figma → slides**; é onde o tempo mais escapa.

## Possíveis perguntas da banca (preparação)
- **"Por que não usar Discord, Teams ou uma planilha?"** → Essas ferramentas não resolvem descoberta e visibilidade. O Synergia centraliza busca, filtros por curso/evento e o status de cada grupo, com login institucional.
- **"E a segurança dos dados?"** → Requisições protegidas por JWT, criptografia das senhas (ex.: pgcrypto) e opção de autenticação em dois fatores; o sistema armazena o mínimo necessário (nome, e-mail, telefone).
- **"O que já está pronto e o que é planejado?"** → O núcleo está funcional em código (login, explorar, criar projeto, mensagens); recursos como vídeos de pitch, dashboards e notificações estão especificados e no Figma, em evolução.
- **"Como o sistema escala?"** → Kubernetes + Prometheus alocam recursos só quando necessário (picos de fim de semana e madrugada), evitando custo ocioso.
- **"Houve validação com usuários?"** → Sim: pesquisa com 17 alunos e o feedback de professores e da banca no evento *Ideias para Transformar*, que foi incorporado ao backlog.
