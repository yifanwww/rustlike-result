const fs = require('node:fs');
const path = require('node:path');

const repo = path.join(__dirname, '../..');

/** @returns {import('@jest/types').Config.InitialOptions} */
function getConfig() {
    const packageJson = process.env.npm_package_json;
    const packageDir = packageJson ? path.dirname(packageJson) : process.cwd();

    const packageOwnTestSetup = path.resolve(packageDir, 'src/test.setup.ts');
    const hasPackageOwnTestSetup = fs.existsSync(packageOwnTestSetup);

    return {
        rootDir: packageDir,
        roots: ['<rootDir>/src'],
        cacheDirectory: path.resolve(repo, 'node_modules', '.cache/jest'),

        setupFilesAfterEnv: hasPackageOwnTestSetup ? [packageOwnTestSetup] : [],

        collectCoverageFrom: [
            'src/**/*.ts',
            '!src/**/__mocks__/**/*.ts',
            '!src/**/__tests__/**/*.ts',
            '!src/**/*.{spec,test}.ts',
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
                            useDefineForClassFields: false,
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
