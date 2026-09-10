import { defineConfig } from 'cypress';

/**
 * Testes de sistema (end-to-end) do Synergia.
 *
 * Rodam contra a pilha real: navegador de verdade -> aplicação Angular servida
 * de verdade -> API Spring Boot de verdade -> PostgreSQL de verdade. Não há
 * `cy.intercept` nem resposta simulada em lugar nenhum da suíte: se o banco
 * estiver fora do ar, estes testes falham, e é essa a intenção.
 */
export default defineConfig({
  e2e: {
    baseUrl: process.env['CYPRESS_BASE_URL'] ?? 'http://localhost:4201',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: false,
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    // O Angular sobe com dev-server; a primeira navegação de cada spec pode
    // esperar a compilação inicial.
    defaultCommandTimeout: 12000,
    pageLoadTimeout: 90000,
    requestTimeout: 20000,
    retries: { runMode: 1, openMode: 0 },
    env: {
      // Endereço da API. O dev-server do Angular já faz proxy de /api para o
      // backend, mas as chamadas de preparação de massa vão direto, para não
      // depender do proxy.
      apiUrl: process.env['CYPRESS_API_URL'] ?? 'http://localhost:8080',
    },
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
  },
});
