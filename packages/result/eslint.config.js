import { defineConfig, globalIgnores } from 'eslint/config';

import { recommended } from '../../configs/eslint/eslint.config.js';

export default defineConfig([
    globalIgnores(['coverage/', 'dist/']),
    recommended.basic,
    {
        files: ['src/**/__tests__/*.ts', 'src/**/*.{spec,test}.ts'],
        rules: {
            // https://eslint.org/docs/latest/rules/no-console
            'no-console': 'off',
        },
    },
]);
