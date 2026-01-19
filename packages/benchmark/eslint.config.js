import { defineConfig, globalIgnores } from 'eslint/config';

import { recommended } from '../../configs/eslint/eslint.config.js';

export default defineConfig([
    globalIgnores(['dist/']),
    recommended.node,
    {
        rules: {
            // https://eslint.org/docs/latest/rules/no-console
            'no-console': 'off',
        },
    },
]);
