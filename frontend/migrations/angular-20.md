# Angular 19 -> 20

Feito em 2026-09-10. Angular `19.2.25` -> `20.3.9`, Nx `20.7.2` -> `21.6.11`.

Este é um workspace Nx, então a atualização passa pelo `nx migrate`, não pelo
`ng update`: é o `@nx/angular` que sabe qual versão do Angular combina com
qual versão do Nx e carrega as migrações das duas famílias.

O par de versões não é escolha: o `@nx/angular@20.7.2` declara
`@angular-devkit/build-angular >= 17.0.0 < 20.0.0`, ou seja, não aceita o
Angular 20. Quem quer Angular 20 precisa do Nx 21.

## Comandos

```sh
cd frontend
npx nx migrate 21.6.11          # reescreve package.json e gera migrations.json
# @angular/cli ficou de fora e foi corrigido à mão (ver abaixo)
rm -rf node_modules package-lock.json
npm install
npx nx migrate --run-migrations # aplica as migrações de código
```

## Passos

1. `npx nx migrate 21.6.11` subiu os pacotes do Angular, do Nx e do
   `@angular-eslint` no `package.json`, mais `typescript` 5.7.3 -> 5.9.3
   (exigência do `build-angular@20`, que pede `>=5.8 <6.0`),
   `cypress` 13 -> 14.5.4 e `jest-preset-angular` 14.4.2 -> 14.6.2.

2. `@angular/cli` foi corrigido à mão, de `~19.2.0` para `~20.3.0`. O
   `nx migrate` não o incluiu na primeira passada; a migração
   `update-angular-cli-version-20-3-0` depois confirmou o mesmo valor.

3. `rm -rf node_modules package-lock.json` antes do `npm install`. Sem isso o
   `npm install` falha com `ERESOLVE`, e o erro engana: ele reclama de conflito
   de peer citando `@nx/angular@20.7.2`, a versão *antiga*, porque o resolvedor
   ancora na árvore que já está em disco em vez de nas faixas declaradas no
   `package.json`. Nenhuma faixa estava de fato em conflito. Regerar a árvore
   resolve; `--legacy-peer-deps` e `--force` não foram usados.

4. `npx nx migrate --run-migrations` aplicou 21 migrações. As que mexeram em
   código:

   - **Control flow migration**: `*ngFor` virou `@for` nos templates. Com isso
     `NgForOf` e `CommonModule` ficaram sem uso e saíram da lista `imports`
     de 24 componentes.
   - `project.json` e os `project.json` das libs: `continuous: true` no target
     `serve` e `tsConfig` explícito no target `test`.
   - `nx.json`: defaults de `type`/`typeSeparator` para os schematics.
   - `cypress.config.ts` (raiz e `e2e/`): a migração do Cypress 14 acrescentou
     `injectDocumentDomain: true`. É um remendo de compatibilidade, não uma
     melhoria - o certo é usar `cy.origin()` e tirar a opção. Ficou como está
     porque a suíte atual não navega entre domínios.

## Verificação

- `npx nx build synergia-frontend` passa. Segue de pé o aviso de orçamento de
  bundle que já existia antes (906 kB contra o limite de 500 kB; eram 891 kB).
- `npx nx test synergia-frontend` não roda nada: o frontend não tem teste de
  unidade nenhum.
- `npx nx lint synergia-frontend` falha, e falhava igual antes: 513 problemas
  (234 erros, 279 avisos) nos dois lados, número por número. Conferido rodando
  o lint num worktree no commit anterior. O CI não roda lint.
- `npm audit`: 63 -> 62, e a única vulnerabilidade crítica que restava
  (`websocket-driver`) saiu. As 8 que chegam ao navegador continuam: são XSS no
  `@angular/core`, `/common` e `/compiler` sem correção nem na linha 20.

O `migrations.json` na raiz do frontend é rascunho do `nx migrate` e é
reescrito a cada atualização. Depois de rodar as migrações ele não serve mais
para nada.
