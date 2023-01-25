module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        project: './tsconfig.json'
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    env: {
        es6: true,
        browser: true,
        node: true,
    },
    rules: {
        'indent': ['error', 4, { 'SwitchCase': 1, 'ignoredNodes': ['PropertyDefinition[decorators]'] }],
        'quotes': ['error', 'single'],
        'jest/no-done-callback': 'off',
        'jest/expect-expect': 'off',
        'jest-dom/prefer-to-have-style': 'off',
        'jest-dom/prefer-to-have-class': 'off',

        'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
        'eol-last': ['error', 'always'],

        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/consistent-type-assertions': 'warn',
        '@typescript-eslint/consistent-type-exports': 'warn',
        '@typescript-eslint/consistent-type-imports': 'warn',
        '@typescript-eslint/dot-notation': 'warn',
        '@typescript-eslint/member-ordering': 'warn',

        'no-extra-parens': 'off',
        '@typescript-eslint/no-extra-parens': 'warn',

        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'warn',

        'space-before-blocks': 'off',
        '@typescript-eslint/space-before-blocks': 'warn',

        'space-before-function-paren': 'off',
        '@typescript-eslint/space-before-function-paren': 'warn',

        'semi': 'off',
        '@typescript-eslint/semi': ['warn', 'never'],

        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-non-null-assertion': 0,

        'no-console': [ 'warn',
            {
              allow: [
                  'warn',
                  'error',
                  'time',
                  'timeEnd',
                  'info'
              ],
            },
        ]
    }
}
