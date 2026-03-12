import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist/**', 'dist-server/**', 'node_modules/**'],
  },
  {
    files: ['client/src/**/*.{ts,tsx}', 'server/**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslintPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-alert': 'error',
      'no-restricted-globals': ['error', 'alert', 'confirm', 'prompt'],
    },
  },
];
