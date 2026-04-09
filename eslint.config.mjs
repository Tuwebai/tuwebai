import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';

const firebaseSdkRestriction = [
  'error',
  {
    patterns: [
      {
        group: ['firebase/*', 'firebase-admin', 'firebase-admin/*'],
        message:
          'Firebase ya no forma parte del runtime de TuWebAI. No importes SDKs ni adapters legacy.',
      },
    ],
  },
];

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
      '@typescript-eslint/no-explicit-any': 'error',
      'no-alert': 'error',
      'no-restricted-globals': ['error', 'alert', 'confirm', 'prompt'],
      'no-restricted-imports': firebaseSdkRestriction,
    },
  },
];
