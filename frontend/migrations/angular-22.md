# Angular 21 -> 22

Feito em 2026-09-10. Angular `21.2.9` -> `22.1.6`, Nx `22.7.11` -> `23.2.1`.

O salto mais pesado dos três. Além do Angular, vieram dois majors de
ferramenta que quebram configuração: **TypeScript 6** e **ESLint 9**.

## Comandos

```sh
cd frontend
npx nx migrate 23.2.1

# ts-jest teve de sair antes do install (ver passo 2)
rm -rf node_modules package-lock.json
npm install

# o ESLint 9 tem de ser resolvido ANTES das migrações (ver passo 4)
python3 -c "..."                       # tira @nx/eslint/plugin do nx.json
npx nx g @nx/eslint:convert-to-flat-config
python3 -c "..."                       # devolve @nx/eslint/plugin ao nx.json

npx nx migrate --run-migrations
```

## Passos

1. **`pnpm-lock.yaml` teve de ser removido primeiro.** Havia um
   `pnpm-lock.yaml` no `frontend/`, nunca versionado, ao lado do
   `package-lock.json` que o CI usa no `npm ci`. O `nx migrate` enxerga esse
   arquivo, decide que o projeto é pnpm e roda `pnpm install` por conta
   própria: no meio da atualização a árvore em disco virou uma árvore pnpm
   (`node_modules/.pnpm/`) enquanto o `package-lock.json` dizia outra coisa.
   O arquivo foi apagado e a árvore refeita com `npm install`. Se alguém rodar
   `pnpm install` aqui de novo, o mesmo problema volta.

2. **`ts-jest` foi removido do `package.json`.** O `npm install` falhava com
   `ERESOLVE` de verdade, não por árvore velha: o `ts-jest@29.4.12` declara
   peer `@babel/core >=7.0.0-beta.0 <8`, e nesta combinação o `@babel/core` 8
   é hoisted. Não existe `ts-jest` 30 - a 29.4.12 é a última publicada. Mas o
   `jest-preset-angular@17` não lista mais `ts-jest` como peer, o `@nx/jest`
   lista como *peerOptional*, e nenhum `jest.config` do projeto o referencia:
   os transforms apontam para `jest-preset-angular` direto. Era dependência
   declarada e não usada, sobra de quando o `jest-preset-angular` exigia. Saiu
   em vez de ser forçada com `--legacy-peer-deps`.

3. **TypeScript 5.9.3 -> 6.0.3.** A migração `23-1-0-add-ignore-deprecations-for-ts6`
   e a `23-1-0-set-tsconfig-root-dir-for-ts6` não precisaram mudar nada nos
   tsconfig deste projeto. `npx tsc -p tsconfig.app.json --noEmit` passa sem
   nenhum erro.

4. **ESLint 8.57 -> 9, e isto travou tudo.** O ESLint 9 usa flat config por
   padrão e o `@angular-eslint` 22 não publica mais os presets no formato
   eslintrc, então o `.eslintrc.json` do projeto passou a não carregar. O
   problema não fica contido no lint: o `@nx/eslint/plugin` lê os configs de
   ESLint para inferir os targets `lint`, e falhando isso **o grafo de
   projetos do Nx não monta**, o que aborta as migrações do Angular e do
   Material com "Failed to process project graph".

   A ordem que funciona:

   1. tirar `@nx/eslint/plugin` do `nx.json` (o gerador de conversão também
      precisa do grafo, e o grafo precisa que o plugin esteja fora);
   2. `npx nx g @nx/eslint:convert-to-flat-config`, que converteu os nove
      `.eslintrc.json` em `eslint.config.mjs` mais um
      `eslint.base.config.mjs`, preservando as regras que existiam;
   3. devolver o plugin ao `nx.json`;
   4. só então `npx nx migrate --run-migrations`.

   O gerador não converteu `e2e/.eslintrc.json` - ele estendia
   `plugin:cypress/recommended` e o `../.eslintrc.base.json`, que a conversão
   apagou. Foi escrito à mão como `e2e/eslint.config.mjs`, usando a entrada
   nativa `eslint-plugin-cypress/flat` que a versão 3 do plugin publica.

5. **`changeDetection: ChangeDetectionStrategy.Eager` em 55 componentes.** O
   Angular 22 mudou a estratégia padrão de detecção de mudanças, e a migração
   fixa `Eager` em cada componente para preservar o comportamento de antes.
   Não é melhoria, é congelamento: o valor foi escrito para que nada mude de
   comportamento agora. Adotar o padrão novo é trabalho à parte, com risco de
   comportamento, componente por componente.

## Verificação

- `npx nx build synergia-frontend` passa. O aviso de orçamento de bundle
  continua, como nos dois saltos anteriores (962 kB contra o limite de 500 kB).
- `npx tsc -p tsconfig.app.json --noEmit` passa, zero erro, com TypeScript 6.
- `npm audit`: 52 -> 17. **As dependências de produção chegaram a zero
  vulnerabilidade** (`npm audit --omit=dev`), o que era o objetivo de toda a
  sequência: as 8 XSS do `@angular/core`, `/common` e `/compiler` que não tinham
  correção nas linhas 19, 20 e 21 saíram aqui. As 17 que sobram são todas de
  ferramental de build e teste.
- `npx nx lint` **carrega** - a flat config funciona, nenhum erro de
  carregamento de config. Continua falhando, como falhava antes: 548 problemas
  (276 erros, 272 avisos) contra 513 (234 erros, 279 avisos) na base. Todo o
  aumento vem de regra recém-habilitada, nenhuma de código novo:
  `@angular-eslint/prefer-on-push-component-change-detection` (43),
  `@angular-eslint/template/click-events-have-key-events`,
  `template/interactive-supports-focus` e
  `@typescript-eslint/no-unused-expressions`.

  Vale registrar a contradição: essas 43 ocorrências de `prefer-on-push` são o
  lint reclamando exatamente do `Eager` que a migração do Angular acabou de
  escrever (passo 5). As duas ferramentas discordam. Nada foi silenciado e
  nenhum fonte foi editado para calar regra - resolver isso é adotar `OnPush`
  de verdade, que é a mesma tarefa do passo 5.
- **A suíte de Cypress não foi exercida.** O `npx cypress verify` falha nesta
  máquina com `bad option: --no-sandbox`, e falha igual na base com o Cypress
  13 (`bad option: --ping`): é problema de ambiente local, não da atualização.
  Como o frontend também não tem teste de unidade, **nenhum teste funcional
  rodou em nenhum dos três saltos**. O que está verificado é: compila,
  typecheck limpo, lint carrega. O veredito de comportamento é o CI.

## Pendências que esta atualização deixou

1. Rodar o CI. É o único lugar onde a suíte de Cypress roda de fato.
2. Adotar `ChangeDetectionStrategy.OnPush` e tirar o `Eager` dos 55
   componentes. Resolve junto os 43 erros de lint.
3. `ignoreDeprecations` não foi necessário agora, mas o TypeScript 7 remove o
   que o 6 apenas depreciou.
