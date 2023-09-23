const naming = [
    'error',
    { selector: 'accessor', modifiers: ['static'], format: ['UPPER_CASE'], leadingUnderscore: 'forbid' },
    { selector: 'accessor', format: ['camelCase'], leadingUnderscore: 'forbid' },

    {
        selector: ['class', 'enum', 'interface', 'typeAlias', 'typeParameter'],
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
    },

    { selector: 'enumMember', format: ['UPPER_CASE'], leadingUnderscore: 'forbid' },

    { selector: 'function', format: null, filter: { regex: '^(Ok|Err)$', match: true } },
    { selector: 'function', format: ['camelCase'], leadingUnderscore: 'allow' },

    { selector: 'method', modifiers: ['static'], format: null, filter: { regex: '^(Ok|Err)$', match: true } },
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

module.exports = {
    root: true,
    env: {
        browser: true,
        es2018: true,
        jest: true,
        node: true,
    },
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'prettier',
        'prettier/prettier',
        'plugin:jest/recommended',
        'plugin:jest/style',
    ],
    ignorePatterns: ['*.cjs', '*.js', '*.mjs', '/coverage', '/lib', '/lib-commonjs', '/scripts'],
    plugins: ['@typescript-eslint', 'import', 'jest', 'prettier'],
    parserOptions: {
        project: './tsconfig.json',
    },
    settings: {
        // Append 'ts' extensions to Airbnb 'import/extensions' setting
        // Original: ['.js', '.mjs', '.jsx']
        'import/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.d.ts'],

        // Resolve type definition packages
        'import/external-module-folders': ['node_modules', 'node_modules/@types'],

        'import/internal-regex': '^src',

        // Apply special parsing for TypeScript files
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
        },

        // Append 'ts' extensions to Airbnb 'import/resolver' setting
        // Original: ['.js', '.jsx', '.json']
        'import/resolver': {
            node: {
                extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx', '.d.ts'],
            },
        },
    },
    rules: {
        // -------------------- ESLint Built-In Rules --------------------

        // https://eslint.org/docs/latest/rules/camelcase
        camelcase: 'off',

        // https://eslint.org/docs/latest/rules/class-methods-use-this
        'class-methods-use-this': 'off',

        // https://eslint.org/docs/latest/rules/consistent-return
        'consistent-return': 'off',

        // https://eslint.org/docs/latest/rules/default-param-last
        'default-param-last': 'off',

        // Disable and use rule `prettier/prettier` instead.
        // https://eslint.org/docs/latest/rules/function-paren-newline
        'function-paren-newline': 'off',

        // https://eslint.org/docs/latest/rules/guard-for-in
        'guard-for-in': 'off',

        // https://eslint.org/docs/latest/rules/implicit-arrow-linebreak
        'implicit-arrow-linebreak': 'off',

        // https://eslint.org/docs/latest/rules/lines-between-class-members
        'lines-between-class-members': 'off',

        // This rule is disabled by `eslint-config-prettier`, enable it here for better eslint error information.
        // https://github.com/prettier/eslint-config-prettier/#max-len
        // https://eslint.org/docs/latest/rules/max-len
        'max-len': [
            'error',
            {
                code: 120,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            },
        ],

        // https://eslint.org/docs/latest/rules/no-await-in-loop
        'no-await-in-loop': 'off',

        // Allows bitwise operators, but be CAREFUL for not using them in most case.
        // https://eslint.org/docs/latest/rules/no-bitwise
        'no-bitwise': 'off',

        // https://eslint.org/docs/latest/rules/no-console
        'no-console': ['error', {}],

        // https://eslint.org/docs/latest/rules/no-constant-condition
        'no-constant-condition': 'off',

        // https://eslint.org/docs/latest/rules/no-continue
        'no-continue': 'off',

        // https://eslint.org/docs/latest/rules/no-else-return
        'no-else-return': 'off',

        // https://eslint.org/docs/latest/rules/no-lonely-if
        'no-lonely-if': 'off',

        // https://eslint.org/docs/latest/rules/no-loop-func
        'no-loop-func': 'off',

        // https://github.com/immerjs/immer/issues/189#issuecomment-703083451
        // https://eslint.org/docs/latest/rules/no-param-reassign
        'no-param-reassign': ['error', { props: true, ignorePropertyModificationsForRegex: ['^draft'] }],

        // https://eslint.org/docs/latest/rules/no-plusplus
        'no-plusplus': 'off',

        // https://eslint.org/docs/latest/rules/no-restricted-exports
        'no-restricted-exports': [
            'error',
            {
                restrictedNamedExports: [
                    'then', // this will cause tons of confusion when your module is dynamically `import()`ed, and will break in most node ESM versions
                ],
            },
        ],

        // https://eslint.org/docs/latest/rules/no-restricted-syntax
        'no-restricted-syntax': 'off',

        // https://eslint.org/docs/latest/rules/no-shadow
        'no-shadow': 'off',

        // This rule is disabled by `eslint-config-prettier`, enable it here for better eslint error informantion.
        // https://github.com/prettier/eslint-config-prettier/#no-tabs
        // https://eslint.org/docs/latest/rules/no-tabs
        'no-tabs': 'error',

        // Disabled for underscore prefix.
        // https://eslint.org/docs/latest/rules/no-underscore-dangle
        'no-underscore-dangle': 'off',

        // This rule is disabled by `eslint-config-prettier`, enable it here for better eslint error informantion.
        // https://github.com/prettier/eslint-config-prettier/#no-unexpected-multiline
        // https://eslint.org/docs/latest/rules/no-unexpected-multiline
        'no-unexpected-multiline': 'error',

        // https://eslint.org/docs/latest/rules/no-unused-expressions
        'no-unused-expressions': 'off',

        // https://eslint.org/docs/latest/rules/no-use-before-define
        'no-use-before-define': 'off',

        // https://eslint.org/docs/latest/rules/no-void
        'no-void': 'off',

        // Disable and use rule `prettier/prettier` instead.
        // https://eslint.org/docs/latest/rules/object-curly-newline
        'object-curly-newline': 'off',

        // Disable and use rule `prettier/prettier` instead.
        // https://eslint.org/docs/latest/rules/operator-linebreak
        'operator-linebreak': 'off',

        // Only enable object variable declarator.
        // https://eslint.org/docs/latest/rules/prefer-destructuring
        'prefer-destructuring': [
            'error',
            {
                VariableDeclarator: { array: false, object: true },
                AssignmentExpression: { array: false, object: false },
            },
            { enforceForRenamedProperties: false },
        ],

        // This rule is disabled by `eslint-config-prettier`, enable it here for better eslint error informantion.
        // https://github.com/prettier/eslint-config-prettier/#quotes
        // https://eslint.org/docs/latest/rules/quotes
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],

        // -------------------- TypeScript ESLint Rules --------------------

        // https://typescript-eslint.io/rules/consistent-type-exports
        '@typescript-eslint/consistent-type-exports': 'error',

        // https://typescript-eslint.io/rules/consistent-type-imports
        '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],

        // https://typescript-eslint.io/rules/default-param-last
        '@typescript-eslint/default-param-last': 'error',

        // https://typescript-eslint.io/rules/explicit-member-accessibility
        '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],

        // https://typescript-eslint.io/rules/naming-convention
        '@typescript-eslint/naming-convention': naming,

        // https://typescript-eslint.io/rules/no-empty-function
        '@typescript-eslint/no-empty-function': [
            'error',
            {
                allow: [
                    // base
                    'arrowFunctions',
                    'functions',
                    'methods',
                    // extends
                    'decoratedFunctions',
                    'private-constructors',
                    'protected-constructors',
                ],
            },
        ],

        // https://typescript-eslint.io/rules/no-empty-interface
        '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],

        // https://typescript-eslint.io/rules/no-loop-func
        '@typescript-eslint/no-loop-func': 'error',

        // https://typescript-eslint.io/rules/no-misused-promises
        '@typescript-eslint/no-misused-promises': [
            'error',
            {
                checksConditionals: true,
                checksSpreads: true,
                checksVoidReturn: { attributes: false },
            },
        ],

        // https://typescript-eslint.io/rules/no-shadow
        '@typescript-eslint/no-shadow': 'error',

        // https://typescript-eslint.io/rules/no-unused-expressions
        '@typescript-eslint/no-unused-expressions': 'error',

        // https://typescript-eslint.io/rules/no-use-before-define
        '@typescript-eslint/no-use-before-define': 'error',

        // https://typescript-eslint.io/rules/restrict-template-expressions
        '@typescript-eslint/restrict-template-expressions': [
            'error',
            { allowAny: false, allowBoolean: true, allowNullish: true, allowNumber: true, allowRegExp: true },
        ],

        // https://typescript-eslint.io/rules/return-await
        '@typescript-eslint/return-await': 'error',

        // -------------------- Eslint-Plugin-Import Rules --------------------

        // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/extensions.md
        'import/extensions': 'off',

        // Disabled in TypeScript projects.
        // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/named.md
        'import/named': 'off',

        // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md
        'import/no-cycle': 'error',

        // Disabled for import-statement of dev dependencies.
        // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md
        'import/no-extraneous-dependencies': 'off',

        // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-named-as-default-member.md
        'import/no-named-as-default-member': 'off',

        // Disable `import/no-unresolved`, see https://github.com/iamturns/eslint-config-airbnb-typescript#why-is-importno-unresolved-disabled
        // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unresolved.md
        'import/no-unresolved': 'off',

        // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
        'import/order': [
            'error',
            {
                groups: [['builtin', 'external'], 'internal', 'parent', 'sibling'],
                alphabetize: {
                    caseInsensitive: true,
                    order: 'asc',
                },
                'newlines-between': 'always',
            },
        ],

        // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/prefer-default-export.md
        'import/prefer-default-export': 'off',

        // -------------------- Eslint-Plugin-Jest Rules --------------------

        // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/expect-expect.md
        'jest/expect-expect': ['error', { assertFunctionNames: ['expect', '_expect*'] }],

        // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-alias-methods.md
        'jest/no-alias-methods': 'error',

        // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-commented-out-tests.md
        'jest/no-commented-out-tests': 'off',

        // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/prefer-strict-equal.md
        'jest/prefer-strict-equal': 'error',

        // -------------------- Eslint-Plugin-Prettier Rules --------------------

        // Enables prettier rules.
        'prettier/prettier': 'error',
    },
    overrides: [
        {
            files: ['*.d.ts'],
            rules: {
                // https://typescript-eslint.io/rules/naming-convention
                '@typescript-eslint/naming-convention': 'off',
            },
        },
        {
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
        {
            files: ['src/**/__tests__/*.{ts,tsx}', 'src/**/*.{spec,test}.{ts,tsx}'],
            rules: {
                'no-console': 'off',
            },
        },
    ],
};
