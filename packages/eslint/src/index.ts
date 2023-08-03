const recommended: { [key: string]: unknown } = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/jsx-runtime',
    'plugin:prettier/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
      },
      typescript: {},
    },
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['dist', '@dope-js/runtime', 'scripts/*.js', '**/*.js', '**/*.cjs'],
  plugins: ['@typescript-eslint', 'react', 'import', 'prettier'],
  rules: {
    'import/order': [
      'warn',
      {
        groups: [
          ['external', 'builtin'],
          ['internal', 'sibling', 'parent', 'index'],
        ],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'external',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/ban-types': 'off',
  },
};

export const configs = { recommended };
