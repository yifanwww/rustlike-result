import child from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import prompts from 'prompts';

const pkgRoot = path.join(import.meta.dirname, '..');
const dist = path.join(pkgRoot, 'dist');
const src = path.join(pkgRoot, 'src');

const BENCH_GROUPS = ['extra-methods', 'factories', 'methods', 'scenarios'];

async function main() {
    const groupResp = await prompts({
        type: 'select',
        name: 'value',
        message: 'Pick a benchmark group',
        choices: [{ title: 'all', value: 'all' }, ...BENCH_GROUPS.map((item) => ({ title: item, value: item }))],
    });
    const selectedGroup = groupResp.value as string;
    if (selectedGroup === 'all') {
        runBenchmarks(BENCH_GROUPS);
        return;
    }

    const entries = fs
        .readdirSync(path.join(dist, selectedGroup), { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => path.join(selectedGroup, entry.name));
    const entryResp = await prompts({
        type: 'select',
        name: 'value',
        message: 'Pick a benchmark task',
        choices: [{ title: 'all', value: 'all' }, ...entries.map((item) => ({ title: item, value: item }))],
    });
    const selectedEntry = entryResp.value as string;
    if (selectedEntry === 'all') {
        runBenchmarks([selectedGroup]);
    } else {
        run(selectedEntry);
    }
}

void main();

function runBenchmarks(groups: string[]) {
    const entries = groups
        .map((group) =>
            fs
                .readdirSync(path.join(dist, group), { withFileTypes: true })
                .filter((entry) => entry.isFile())
                .map((entry) => path.join(group, entry.name)),
        )
        .flat();

    console.log(`Found ${entries.length} bench tasks`);
    for (const entry of entries) {
        console.log(`- ${entry}`);
    }

    for (const entry of entries) {
        run(entry);
    }
}

function run(entry: string) {
    const file = path.join(dist, entry);
    const log = path.join(
        src,
        path.format({
            ...path.parse(entry),
            base: undefined,
            ext: '.log',
        }),
    );

    console.log(`node ${file} > ${log}`);
    child.execSync(`node ${file} > ${log}`);
}
