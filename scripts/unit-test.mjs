import chalk from 'chalk';
import child from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const _dirname = path.dirname(fileURLToPath(import.meta.url));

function main() {
    const argv = process.argv.slice(2);

    const command = ['jest', '--config', path.join(_dirname, '../configs/jest/jest.config.js'), ...argv].join(' ');

    const env = {
        ...process.env,
        NODE_ENV: 'test',
        NODE_OPTIONS: [process.env.NODE_OPTIONS, '--experimental-vm-modules'].filter(Boolean).join(' '),
    };

    console.info(chalk.yellow(command));
    child.execSync(command, { env, stdio: 'inherit' });
}

main();
