import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const repo = path.join(import.meta.dirname, '../..');

const resolve = (p) => url.fileURLToPath(import.meta.resolve(p));

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
                resolve('@swc/jest'),
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
        moduleNameMapper: {
            // Pure ESM packages needs this, to make the relative import works with TypeScript source files
            '^(.*)\\.js$': ['$1.js', '$1.ts'],
        },
        moduleFileExtensions: ['js', 'json', 'node', 'ts'],

        extensionsToTreatAsEsm: ['.ts'],

        // https://jestjs.io/docs/configuration/#resetmocks-boolean
        resetMocks: true,
        // https://jestjs.io/docs/configuration/#restoremocks-boolean
        restoreMocks: true,
    };
}

export default getConfig();
