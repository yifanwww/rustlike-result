import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const NAMING = [
    'error',
    { selector: 'accessor', modifiers: ['static'], format: ['UPPER_CASE'], leadingUnderscore: 'forbid' },
    { selector: 'accessor', format: ['camelCase'], leadingUnderscore: 'forbid' },

    {
        selector: ['class', 'enum', 'interface', 'typeAlias', 'typeParameter'],
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
    },

    { selector: 'enumMember', format: ['UPPER_CASE'], leadingUnderscore: 'forbid' },

    { selector: 'function', format: ['camelCase', 'PascalCase'], leadingUnderscore: 'allow' },

    { selector: 'method', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'require' },
    { selector: 'method', modifiers: ['protected'], format: ['camelCase'], leadingUnderscore: 'require' },
    { selector: 'method', format: ['camelCase'], leadingUnderscore: 'forbid' },

    { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },

    {
        selector: 'property',
        modifiers: ['private', 'static'],
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'require',
    },
    {
        selector: 'property',
        modifiers: ['protected', 'static'],
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'require',
    },
    { selector: 'property', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'require' },
    { selector: 'property', modifiers: ['protected'], format: ['camelCase'], leadingUnderscore: 'require' },
    { selector: 'property', modifiers: ['static'], format: ['camelCase', 'UPPER_CASE'], leadingUnderscore: 'forbid' },
    { selector: 'property', format: ['camelCase'], leadingUnderscore: 'forbid' },

    { selector: 'objectLiteralProperty', format: null },

    { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'], leadingUnderscore: 'allow' },
];

export default defineConfig([
    {
        name: '@easy-config/eslint-config/rules-typescript',
        extends: [
            tseslint.configs.recommendedTypeChecked,
            // tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked,
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
        rules: {
            // https://typescript-eslint.io/rules/consistent-type-exports
            '@typescript-eslint/consistent-type-exports': 'error',

            // https://typescript-eslint.io/rules/consistent-type-imports
            '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],

            // https://typescript-eslint.io/rules/default-param-last
            '@typescript-eslint/default-param-last': 'error',

            // https://typescript-eslint.io/rules/explicit-member-accessibility
            '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],

            // https://typescript-eslint.io/rules/naming-convention
            '@typescript-eslint/naming-convention': NAMING,

            // https://typescript-eslint.io/rules/no-empty-function
            '@typescript-eslint/no-empty-function': [
                'error',
                {
                    allow: [
                        'arrowFunctions',
                        'decoratedFunctions',
                        'functions',
                        'methods',
                        'private-constructors',
                        'protected-constructors',
                    ],
                },
            ],

            // https://typescript-eslint.io/rules/no-empty-object-type
            '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],

            // https://typescript-eslint.io/rules/no-loop-func
            '@typescript-eslint/no-loop-func': 'error',

            // https://typescript-eslint.io/rules/no-misused-promises
            '@typescript-eslint/no-misused-promises': [
                'error',
                { checksConditionals: true, checksSpreads: true, checksVoidReturn: { attributes: false } },
            ],

            // https://typescript-eslint.io/rules/no-shadow
            '@typescript-eslint/no-shadow': 'error',

            // https://typescript-eslint.io/rules/no-unused-vars
            '@typescript-eslint/no-unused-vars': [
                'error',
                { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
            ],

            // https://typescript-eslint.io/rules/no-use-before-define
            '@typescript-eslint/no-use-before-define': ['error', { functions: false }],

            // https://typescript-eslint.io/rules/no-useless-constructor
            '@typescript-eslint/no-useless-constructor': 'error',

            // https://typescript-eslint.io/rules/prefer-string-starts-ends-with
            '@typescript-eslint/prefer-string-starts-ends-with': ['error', { allowSingleElementEquality: 'always' }],

            // https://typescript-eslint.io/rules/restrict-template-expressions
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                { allowAny: false, allowBoolean: true, allowNullish: true, allowNumber: true, allowRegExp: true },
            ],

            // https://typescript-eslint.io/rules/return-await
            '@typescript-eslint/return-await': 'error',
        },
    },
    {
        name: '@easy-config/eslint-config/rules-typescript-overrides-d.ts',
        files: ['**/*.d.ts'],
        rules: {
            // https://typescript-eslint.io/rules/naming-convention
            '@typescript-eslint/naming-convention': 'off',
        },
    },
    {
        name: '@easy-config/eslint-config/rules-typescript-overrides-test',
        files: ['src/**/__tests__/*.{ts,tsx}', 'src/**/*.{spec,test}.{ts,tsx}', 'test/**/*.{ts,tsx}'],
        rules: {
            // https://typescript-eslint.io/rules/dot-notation
            '@typescript-eslint/dot-notation': [
                'error',
                {
                    allowPrivateClassPropertyAccess: true,
                    allowProtectedClassPropertyAccess: true,
                    allowIndexSignaturePropertyAccess: true,
                },
            ],

            // https://typescript-eslint.io/rules/unbound-method/
            '@typescript-eslint/unbound-method': 'off',
        },
    },
]);
