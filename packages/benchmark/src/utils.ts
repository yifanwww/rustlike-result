import os from 'node:os';

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

export function logEnvironment() {
    console.log('Environment Information');
    console.log('======================');
    console.log(`CPU: ${os.cpus()[0].model}`);
    console.log(`OS: ${os.type()} ${os.release()} (${os.platform()} ${os.arch()})`);
    console.log(`Node.js: ${process.version}`);
    console.log();
}
