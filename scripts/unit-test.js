import chalk from 'chalk';
import child from 'node:child_process';
import url from 'node:url';

const resolve = (p) => url.fileURLToPath(import.meta.resolve(p));

function main() {
    const argv = process.argv.slice(2);

    const command = ['jest', '--config', resolve('../configs/jest/jest.config.js'), ...argv].join(' ');

    const env = {
        ...process.env,
        NODE_ENV: 'test',
        NODE_OPTIONS: [process.env.NODE_OPTIONS, '--experimental-vm-modules'].filter(Boolean).join(' '),
    };

    console.info(chalk.yellow(command));
    child.execSync(command, { env, stdio: 'inherit' });
}

main();
