import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginImport from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginPerfectionist from 'eslint-plugin-perfectionist';
import tsParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    ignores: ['node_modules'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',

      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      '@typescript-eslint/no-empty-function': 'off',

      'no-unsafe-finally': 'error',
      'no-control-regex': 'error',
      'no-dupe-class-members': 'error',
      'no-func-assign': 'error',
      'no-misleading-character-class': 'error',
      'no-redeclare': 'error',
      'no-loss-of-precision': 'error',
      'no-global-assign': 'error',
      'no-shadow-restricted-names': 'error',
      'no-prototype-builtins': 'error',
      'no-cond-assign': 'error',
      'no-setter-return': 'error',
      'no-empty-function': 'off',
      'getter-return': 'error',
      'no-self-assign': 'error',
      'valid-typeof': 'error',
      'no-sparse-arrays': 'error',
      'no-undef': 'error',
      'import/no-cycle': 'error',
      'import/no-unresolved': 'error',

      '@typescript-eslint/ban-ts-comment': 'error',
      
      'no-constant-condition': 'error',
      'no-extra-semi': 'error',
      'no-useless-escape': 'error',
      'no-empty': 'error',
      'no-fallthrough': 'error',
      'no-extra-boolean-cast': 'error',
      'no-unreachable': 'error',
      'no-inner-declarations': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      camelcase: 'off',

      indent: 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
          singleQuote: true,
        },
      ],

      'perfectionist/sort-objects': [
        'warn',
        {
          type: 'natural',
          order: 'asc',
        },
      ],
      'perfectionist/sort-imports': [
        'warn',
        {
          type: 'natural',
          order: 'asc',
          internalPattern: ['^@/.+'],
          groups: [
            ['builtin', 'builtin-type', 'external', 'external-type'],
            'utils',
            'components',
            'assets',
            'types',
            'internal',
            'internal-type',
            ['parent', 'sibling', 'index'],
            ['parent-type', 'sibling-type', 'index-type'],
            'styles',
            'object',
            'unknown',
          ],
          customGroups: {
            value: {
              utils: ['^@/utils.+'],
              components: ['^@/components.+', '^@/providers.+', '^@/layouts.+'],
              assets: ['^@/assets.+'],
              types: ['^@/types.+'],
              styles: ['.+\.style\.ts', '.+\.styles.+'],
            },
            type: {
              utils: 'utils',
              components: 'components',
              assets: 'assets',
              types: 'types',
              styles: 'styles',
            },
          },
          newlinesBetween: 'always',
        },
      ],
    },
    plugins: {
      import: pluginImport,
      'jsx-a11y': pluginJsxA11y,
      prettier: pluginPrettier,
      perfectionist: pluginPerfectionist,
    },
  },
  {
    files: ['*.ts', '*.tsx'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': ['error'],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: [],
    rules: {},
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
    },
  },
];
