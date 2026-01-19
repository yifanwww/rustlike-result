import pretter from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

import eslint from './rules/eslint.js';
import $import from './rules/import.js';
import jest from './rules/jest.js';
import typescript from './rules/typescript.js';

export const recommended = {
    basic: defineConfig([
        globalIgnores(['**/*.cjs', '**/*.js', '**/*.mjs'], 'eslint-config/ignores'),
        {
            name: 'eslint-config/basic',
            extends: [eslint, typescript, $import, jest, pretter],
        },
    ]),
    node: defineConfig([
        globalIgnores(['**/*.cjs', '**/*.js', '**/*.mjs'], 'eslint-config/ignores'),
        {
            name: 'eslint-config/node',
            extends: [eslint, typescript, $import, jest, pretter],
            languageOptions: {
                globals: globals.node,
            },
        },
    ]),
};
