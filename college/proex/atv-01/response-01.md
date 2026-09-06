# PROEX — Documentação do Projeto

## Integrantes do Grupo

- Guilherme Harmatiuk Arantes

## Nome do Projeto

**Synergia**

## Breve Descrição do Projeto

O Synergia é uma plataforma web voltada a instituições de ensino superior que conecta alunos de diferentes cursos para a formação de equipes multidisciplinares e a colaboração em projetos acadêmicos, como os desenvolvidos para eventos do tipo Summit, Startup Garage, ECCI e TCC.

O que foi desenvolvido até o momento:

- **Documentação completa do projeto:** documento de requisitos, casos de uso e casos de teste, diagramas UML (classes, atividades e casos de uso), Business Model Canvas, análise de mercado, pesquisa de cores e pitch.
- **Protótipo de interface no Figma**, cobrindo a visão completa da experiência do usuário.
- **Protótipo funcional em código**, com o núcleo do sistema já operante: login com conta institucional, exploração de projetos e eventos com busca e filtros, criação de projetos próprios, solicitação de entrada em projetos e mensagens integradas entre os membros da equipe.
- **Arquitetura técnica definida:** front-end em TypeScript, back-end em Kotlin com APIs REST protegidas por JWT, bancos PostgreSQL e MongoDB, e infraestrutura pensada para escalar (Kubernetes e Prometheus), com criptografia dos dados sensíveis dos usuários.

O desenvolvimento seguiu metodologia ágil com SCRUM (backlog, sprints e revisões), e a solução foi validada com pesquisa junto a alunos e com o feedback recebido de professores e da banca no evento *Ideias para Transformar*.

## Foco Principal do Projeto para a Comunidade

### Necessidade / problema atendido

A comunidade acadêmica atendida é a de alunos e docentes de instituições de ensino superior, com foco inicial na FAG (Faculdade Assis Gurgacz), em Cascavel.

Atualmente, a articulação entre alunos de cursos distintos para a formação de equipes de projeto é feita de maneira informal e fragmentada, por meio de grupos de WhatsApp e planilhas. Um aluno propõe uma ideia, o professor repassa a proposta aos grupos dos demais cursos, e ali ela se perde em meio a avisos institucionais. Isso gera dois problemas centrais:

1. **Mensagens que se perdem:** as propostas raramente são vistas pelos alunos que poderiam contribuir, pois disputam espaço com outros comunicados nos mesmos canais.
2. **Falta de visibilidade:** como os contatos ocorrem por mensagem privada, nem alunos nem professores conseguem acompanhar quais grupos já formaram equipe e quais ainda precisam de integrantes.

Esse diagnóstico foi confirmado por pesquisa realizada com 17 alunos: cerca de **60% (10 alunos)** relataram dificuldade em formular e estruturar projetos para eventos acadêmicos e TCC, e afirmaram que suas ideias teriam se beneficiado da colaboração de estudantes de outras áreas — seja por falta de conhecimento técnico ou prático em um domínio abrangido pelo projeto.

### Impacto esperado

- **Para os alunos:** um ambiente único para encontrar parceiros de outros cursos, formar equipes multidisciplinares, dividir tarefas, comunicar-se e acompanhar o andamento dos projetos, sem depender de canais improvisados.
- **Para os professores e orientadores:** visibilidade centralizada sobre projetos, equipes, prazos e entregas, reduzindo o esforço de intermediação manual entre turmas.
- **Para a instituição:** organização simplificada de eventos interdisciplinares como Startup Garage, Summit e ECCI, com maior participação e melhor aproveitamento dos projetos submetidos.

Em termos formativos, o projeto busca promover a **interdisciplinaridade**, o desenvolvimento de **habilidades socioemocionais** (trabalho em equipe, comunicação e negociação) e o enriquecimento da **experiência acadêmica** dos envolvidos.

O Synergia é um projeto **sem fins lucrativos e de código aberto**, disponibilizado a qualquer instituição interessada em adotá-lo, cabendo a ela apenas os custos de manutenção e hospedagem. O objetivo do projeto é o impacto na comunidade acadêmica, não a geração de receita.
