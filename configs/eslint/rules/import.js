import { defineConfig } from 'eslint/config';
import $import from 'eslint-plugin-import';

const TYPESCRIPT_EXTENSIONS = ['.cts', '.mts', '.ts', '.tsx'];
const ALL_EXTENSIONS = [...TYPESCRIPT_EXTENSIONS, '.cjs', '.mjs', '.js', '.jsx'];

export default defineConfig([
    {
        name: '@easy-config/eslint-config/rules-import',
        plugins: {
            import: $import,
        },
        settings: {
            'import/extensions': ALL_EXTENSIONS,
            'import/internal-regex': '^src/',
            'import/parsers': {
                '@typescript-eslint/parser': TYPESCRIPT_EXTENSIONS,
            },
            'import/resolver': {
                node: {
                    extensions: [...ALL_EXTENSIONS, '.json'],
                },
            },
        },
        rules: {
            // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/first.md
            'import/first': 'error',

            // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/newline-after-import.md
            'import/newline-after-import': 'error',

            // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md
            'import/no-cycle': ['error', { maxDepth: '∞' }],

            // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-duplicates.md
            'import/no-duplicates': 'error',

            // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-empty-named-blocks.md
            'import/no-empty-named-blocks': 'error',

            // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-mutable-exports.md
            'import/no-mutable-exports': 'error',

            // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-relative-packages.md
            'import/no-relative-packages': 'error',

            // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-self-import.md
            'import/no-self-import': 'error',

            // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-useless-path-segments.md
            'import/no-useless-path-segments': ['error', { commonjs: true }],

            // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
            'import/order': [
                'error',
                {
                    groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'unknown'],
                    pathGroups: [
                        {
                            pattern: 'src/**/*.{css,scss}',
                            group: 'unknown',
                            position: 'after',
                        },
                        {
                            pattern: './**/*.{css,scss}',
                            group: 'unknown',
                            position: 'after',
                        },
                    ],
                    alphabetize: {
                        caseInsensitive: true,
                        order: 'asc',
                    },
                    distinctGroup: false,
                    'newlines-between': 'always',
                },
            ],
        },
    },
]);
