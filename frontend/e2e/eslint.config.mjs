import cypress from 'eslint-plugin-cypress/flat';
import baseConfig from '../eslint.base.config.mjs';

export default [
  ...baseConfig,
  // O eslint-plugin-cypress 3 traz entrada nativa de flat config. Antes isto
  // era `extends: ["plugin:cypress/recommended"]`, que o ESLint 9 não carrega.
  cypress.configs.recommended,
];
