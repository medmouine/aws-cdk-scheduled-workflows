module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  ignorePatterns: ['**/*.d.ts', '**/*.test.ts', '*.js', '**/cdk.out/**/*'],
  plugins: ['eslint-plugin-import', 'eslint-plugin-jsdoc', '@typescript-eslint', 'unused-imports'],
  rules: {
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/type-annotation-spacing': 'error',
    'brace-style': ['error', '1tbs'],
    curly: 'error',
    'eol-last': 'error',
    eqeqeq: ['error', 'smart'],
    '@typescript-eslint/no-shadow': 'error',
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'parent', 'index', 'sibling'],
        // TODO: Eventually enable this in the future for consistency
        // 'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: '~/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'jsdoc/check-alignment': 'error',
    'linebreak-style': ['error', 'unix'],
    'no-duplicate-imports': 'error',
    'no-return-await': 'error',
    'no-trailing-spaces': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-const': 'warn',
    'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
  },
}
