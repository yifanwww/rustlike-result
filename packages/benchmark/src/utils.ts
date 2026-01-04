import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const pkgRoot = path.join(import.meta.dirname, '..');

export function formatNum(num: number) {
    const formatter = Intl.NumberFormat('en', { notation: 'standard' });
    return formatter.format(num);
}

export function logTestCases(testCases: [string, unknown][]) {
    for (const [name, value] of testCases) {
        console.log(`> ${name}:`);
        console.log(value);
        console.log();
    }
}

export async function logEnvironment() {
    console.log('System Environment');
    console.log('======================');
    console.log(`CPU: ${os.cpus()[0].model}`);
    console.log(`OS: ${os.type()} ${os.release()} (${os.platform()} ${os.arch()})`);
    console.log(`Node.js: ${process.version}`);
    console.log();

    console.log('Package Versions');
    console.log('======================');
    const dependencies = ['@rustresult/result', 'neverthrow', 'effect'];
    for (const dep of dependencies) {
        const version = await readPackageVersion(path.join(pkgRoot, 'node_modules', dep, 'package.json'));
        console.log(`${dep}: ${version}`);
    }
    console.log();
}

async function readPackageVersion(file: string) {
    const pkgJson = await fs.readFile(file, 'utf-8');
    const pkg = JSON.parse(pkgJson) as { version: string };
    return pkg.version;
}
