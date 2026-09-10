# Angular 20 -> 21

Feito em 2026-09-10. Angular `20.3.9` -> `21.2.9`, Nx `21.6.11` -> `22.7.11`.

Mesma regra de par de versões do salto anterior: o `@nx/angular@21.6.11`
declara `@angular-devkit/build-angular >= 18.0.0 < 21.0.0` e não aceita o
Angular 21. Angular 21 pede Nx 22.

## Comandos

```sh
cd frontend
npx nx migrate 22.7.11
rm -rf node_modules package-lock.json
npm install
npx nx migrate --run-migrations
```

## Passos

1. `npx nx migrate 22.7.11`. Desta vez o `@angular/cli` veio incluído (21.2.9),
   diferente do salto para o 20, onde ficou de fora e teve de ser corrigido à
   mão.

2. Junto vieram `cypress` 14.5.4 -> 15.9.0, `jest` 29 -> 30.5.1,
   `jest-environment-jsdom` 29 -> 30.5.1 e `jest-preset-angular` 14.6.2 -> 16.0.0.

3. `rm -rf node_modules package-lock.json` antes do `npm install`, pelo mesmo
   motivo do salto anterior: o resolvedor do npm ancora na árvore em disco e
   inventa conflito de peer com as versões antigas.

4. `npx nx migrate --run-migrations`. As sete migrações do `@angular/core` e as
   do `@angular/material` e `@angular/cdk` não acharam nada para mudar - o
   código já estava no formato novo (control flow já tinha sido migrado no
   salto para o 20). O que mexeu em arquivo foi tudo do lado do Jest 30:

   - `convert-jest-config-to-cjs`: os nove `jest.config.ts` passaram de
     `import`/`export default` para `require`/`module.exports`.
   - `test-setup.ts` (nove arquivos): `import 'jest-preset-angular/setup-jest'`
     virou `setupZoneTestEnv()` de `jest-preset-angular/setup-env/zone`. É a
     mudança de API do jest-preset-angular 16.
   - `tsconfig.spec.json`: `module` de `commonjs` para `preserve`, mais
     `moduleResolution: bundler` e `isolatedModules: true`.

## Verificação

- `npx nx build synergia-frontend` passa. Aviso de orçamento de bundle segue,
  como antes de tudo isto (933 kB contra o limite de 500 kB).
- `npx nx test synergia-frontend` passa sem rodar nada: continua não existindo
  teste de unidade no frontend. Vale dizer o que isso significa - toda a
  migração do Jest 30 acima está sintaticamente aplicada e nunca foi exercida,
  porque não há teste para exercer. O primeiro teste de unidade que alguém
  escrever é que vai dizer se ficou de pé.
- `npm audit`: 62 -> 52. As 8 que chegam ao navegador continuam de pé.
