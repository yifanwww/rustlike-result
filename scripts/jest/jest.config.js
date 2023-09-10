const fs = require('node:fs');
const path = require('node:path');

const repository = path.join(__dirname, '../..');
const nodeModules = path.resolve(repository, 'node_modules');

/** @returns {import('@jest/types').Config.InitialOptions} */
function getConfig() {
    const testSetup = path.resolve(repository, 'src/test.setup.ts');
    const hasTestSetup = fs.existsSync(testSetup);

    return {
        rootDir: repository,
        roots: ['<rootDir>/src'],
        cacheDirectory: path.resolve(nodeModules, '.cache/jest'),

        setupFilesAfterEnv: hasTestSetup ? [testSetup] : [],

        collectCoverageFrom: [
            'src/**/*.ts',
            '!src/**/__mocks__/**/*.ts',
            '!src/**/__tests__/**/*.ts',
            '!src/**/*.{spec.test}.ts',
            '!src/**/*.d.ts',
            '!src/test.setup.ts',
        ],
        testMatch: ['<rootDir>/src/**/*.{spec,test}.ts'],

        transform: {
            '^.+\\.(js|mjs|cjs|ts)$': [
                require.resolve('@swc/jest'),
                {
                    jsc: {
                        transform: {
                            react: { runtime: 'automatic' },
                            useDefineForClassFields: true,
                        },
                    },
                    isModule: true,
                },
            ],
        },
        transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$'],

        modulePaths: [],
        moduleFileExtensions: ['js', 'json', 'node', 'ts'],

        // https://jestjs.io/docs/configuration/#resetmocks-boolean
        resetMocks: true,
        // https://jestjs.io/docs/configuration/#restoremocks-boolean
        restoreMocks: true,
    };
}

module.exports = getConfig();
