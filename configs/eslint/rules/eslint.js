import js from '@eslint/js';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        name: '@easy-config/eslint-config/rules-eslint',
        extends: [js.configs.recommended],
        rules: {
            // https://eslint.org/docs/latest/rules/default-case
            'default-case': 'error',

            // https://eslint.org/docs/latest/rules/default-case-last
            'default-case-last': 'error',

            // https://eslint.org/docs/latest/rules/eqeqeq
            eqeqeq: ['error', 'always', { null: 'ignore' }],

            // https://eslint.org/docs/latest/rules/func-names
            'func-names': 'warn',

            // https://eslint.org/docs/latest/rules/for-direction
            'for-direction': 'off',

            // https://eslint.org/docs/latest/rules/logical-assignment-operators
            'logical-assignment-operators': ['error', 'always', { enforceForIfStatements: true }],

            // https://eslint.org/docs/latest/rules/no-cond-assign
            'no-cond-assign': ['error', 'always'],

            // https://eslint.org/docs/latest/rules/no-console
            'no-console': 'error',

            // https://eslint.org/docs/latest/rules/no-eval
            'no-eval': 'error',

            // https://eslint.org/docs/latest/rules/no-extend-native
            'no-extend-native': 'error',

            // https://eslint.org/docs/latest/rules/no-extra-label
            'no-extra-label': 'error',

            // Turn on TypeScript's `noFallthroughCasesInSwitch` instead
            // https://eslint.org/docs/latest/rules/no-fallthrough
            'no-fallthrough': 'off',

            // https://eslint.org/docs/latest/rules/no-label-var
            'no-label-var': 'error',

            // https://eslint.org/docs/latest/rules/no-lone-blocks
            'no-lone-blocks': 'error',

            // https://eslint.org/docs/latest/rules/no-multi-assign
            'no-multi-assign': 'error',

            // https://eslint.org/docs/latest/rules/no-multi-str
            'no-multi-str': 'error',

            // https://eslint.org/docs/latest/rules/no-nested-ternary
            'no-nested-ternary': 'error',

            // https://eslint.org/docs/latest/rules/no-new-func
            'no-new-func': 'error',

            // https://eslint.org/docs/latest/rules/no-new-wrappers
            'no-new-wrappers': 'error',

            // TypeScript already forbids this
            // https://eslint.org/docs/latest/rules/no-nonoctal-decimal-escape
            'no-nonoctal-decimal-escape': 'off',

            // TypeScript already forbids this
            // https://eslint.org/docs/latest/rules/no-octal
            'no-octal': 'off',

            // https://github.com/immerjs/immer/issues/189#issuecomment-703083451
            // https://eslint.org/docs/latest/rules/no-param-reassign
            'no-param-reassign': ['error', { props: true, ignorePropertyModificationsForRegex: ['^draft'] }],

            // https://eslint.org/docs/latest/rules/no-promise-executor-return
            'no-promise-executor-return': 'error',

            // https://eslint.org/docs/latest/rules/no-proto
            'no-proto': 'error',

            // https://eslint.org/docs/latest/rules/no-restricted-exports
            'no-restricted-exports': [
                'error',
                {
                    // this will cause tons of confusion when your module is dynamically `import()`ed, and will break in most node ESM versions
                    restrictedNamedExports: ['then'],
                },
            ],

            // https://eslint.org/docs/latest/rules/no-return-assign
            'no-return-assign': ['error', 'always'],

            // https://eslint.org/docs/latest/rules/no-script-url
            'no-script-url': 'error',

            // https://eslint.org/docs/latest/rules/no-sequences
            'no-sequences': 'error',

            // https://eslint.org/docs/latest/rules/no-template-curly-in-string
            'no-template-curly-in-string': 'error',

            // https://eslint.org/docs/latest/rules/no-undef-init
            'no-undef-init': 'error',

            // https://eslint.org/docs/latest/rules/no-unneeded-ternary
            'no-unneeded-ternary': ['error', { defaultAssignment: false }],

            // https://eslint.org/docs/latest/rules/no-unsafe-optional-chaining
            'no-unsafe-optional-chaining': ['error', { disallowArithmeticOperators: true }],

            // https://eslint.org/docs/latest/rules/no-useless-computed-key
            'no-useless-computed-key': 'error',

            // https://eslint.org/docs/latest/rules/no-useless-concat
            'no-useless-concat': 'error',

            // https://eslint.org/docs/latest/rules/no-useless-rename
            'no-useless-rename': 'error',

            // https://eslint.org/docs/latest/rules/no-useless-return
            'no-useless-return': 'error',

            // https://eslint.org/docs/latest/rules/object-shorthand
            'object-shorthand': ['error', 'always', { ignoreConstructors: false, avoidQuotes: true }],

            // https://eslint.org/docs/latest/rules/one-var
            'one-var': ['error', 'never'],

            // https://eslint.org/docs/latest/rules/operator-assignment
            'operator-assignment': ['error', 'always'],

            // https://eslint.org/docs/latest/rules/prefer-const
            'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: true }],

            // https://eslint.org/docs/latest/rules/prefer-destructuring
            'prefer-destructuring': [
                'error',
                {
                    VariableDeclarator: { array: false, object: true },
                    AssignmentExpression: { array: false, object: false },
                },
                { enforceForRenamedProperties: false },
            ],

            // https://eslint.org/docs/latest/rules/prefer-exponentiation-operator
            'prefer-exponentiation-operator': 'error',

            // https://eslint.org/docs/latest/rules/prefer-numeric-literals
            'prefer-numeric-literals': 'error',

            // https://eslint.org/docs/latest/rules/prefer-object-has-own
            'prefer-object-has-own': 'error',

            // https://eslint.org/docs/latest/rules/prefer-object-spread
            'prefer-object-spread': 'error',

            // https://eslint.org/docs/latest/rules/prefer-promise-reject-errors
            'prefer-promise-reject-errors': ['error'],

            // https://eslint.org/docs/latest/rules/prefer-regex-literals
            'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],

            // https://eslint.org/docs/latest/rules/prefer-template
            'prefer-template': 'error',

            // https://eslint.org/docs/latest/rules/radix
            radix: 'error',

            // https://eslint.org/docs/latest/rules/symbol-description
            'symbol-description': 'error',
        },
    },
]);
