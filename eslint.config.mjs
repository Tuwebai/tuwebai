import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';

const firebaseSdkRestriction = [
  'error',
  {
    patterns: [
      {
        group: ['firebase/*', 'firebase-admin', 'firebase-admin/*'],
        message:
          'Firebase es legacy temporal en TuWebAI. Importalo solo desde adapters o wrappers autorizados.',
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
  {
    files: [
      'client/src/lib/firebase.ts',
      'client/src/core/auth/auth-client.ts',
      'client/src/features/auth/services/auth-avatar.ts',
      'client/src/features/auth/context/AuthContext.tsx',
      'client/src/features/auth/context/public-navbar-auth-provider.tsx',
      'server/src/infrastructure/firebase/**/*.ts',
      'server/src/infrastructure/auth/firebase-admin-provider.ts',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
];
