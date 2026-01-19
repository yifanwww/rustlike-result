import { defineConfig } from 'eslint/config';
import jest from 'eslint-plugin-jest';

export default defineConfig([
    {
        name: '@easy-config/eslint-config/rules-jest',
        extends: [jest.configs['flat/recommended'], jest.configs['flat/style']],
        rules: {
            // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/expect-expect.md
            'jest/expect-expect': ['error', { assertFunctionNames: ['expect', 'expect*'] }],

            // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-commented-out-tests.md
            'jest/no-commented-out-tests': 'off',

            // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/prefer-strict-equal.md
            'jest/prefer-strict-equal': 'error',
        },
    },
]);
