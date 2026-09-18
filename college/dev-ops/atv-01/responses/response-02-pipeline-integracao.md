# Pipeline de integração contínua: Synergia

**Disciplina:** DevOps, Aula 05, Projeto Integrador (Parte 3)
**Autor:** Guilherme Harmatiuk Arantes
**Data:** 07/09/2026

---

## 1. O que foi entregue

Um workflow do GitHub Actions, `.github/workflows/ci.yml`, que roda os 150
testes da parte 2 a cada push (em qualquer branch) e a cada pull request para a
`main`:

```yaml
on:
  push:
    branches: ['**']
  pull_request:
    branches: [main]
```

## 2. Jobs

| Job | O que roda | Infraestrutura |
| --- | --- | --- |
| Testes de unidade | `./gradlew unitTest` (30) | JDK 21 |
| Testes de integração | `./gradlew integrationTest` (70) | + PostgreSQL 16 em contêiner |
| Testes de sistema (Cypress) | `npm run e2e` (50) | + PostgreSQL, backend e frontend |
| Resultado dos testes | confere os três acima | — |

- Integração e sistema só começam se a unidade passar, e rodam em paralelo.
- Cada job levanta o próprio PostgreSQL, que é descartado no fim.
- **Resultado dos testes** falha se qualquer camada falhar. É o check exigido
  pela proteção da `main` (parte 4).
- Pushes seguidos na mesma branch cancelam a execução anterior.

---

## 3. Como acompanhar

- Aba **Actions** do repositório, ou `gh run watch` no terminal.
- Num PR, os checks aparecem no fim da conversa.
- Quando algo falha, a página da execução traz os artefatos
  `relatorio-unidade`, `relatorio-integracao`, `capturas-cypress` e
  `logs-sistema`.
- Os comandos do pipeline são os mesmos da parte 2, então qualquer falha pode
  ser reproduzida localmente.

---

## 4. Resultado

Execução [34179005650](https://github.com/Gharantes/repo-tests/actions/runs/34179005650),
08/09/2026:

| Job | Resultado | Tempo |
| --- | --- | --- |
| Testes de unidade | 30/30 | 50s |
| Testes de integração | 70/70 | 1min18 |
| Testes de sistema | 50/50 | 4min56 |
| Resultado dos testes | passou | 2s |
