import child from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import prompts from 'prompts';

const pkgRoot = path.join(import.meta.dirname, '..');
const dist = path.join(pkgRoot, 'dist');
const src = path.join(pkgRoot, 'src');

async function main() {
    const taskGroups = await fs
        .readdir(dist, { withFileTypes: true })
        .then((entries) => entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name));

    const groupResult = await prompts({
        type: 'select',
        name: 'value',
        message: 'Pick a benchmark group',
        choices: [{ title: 'all', value: 'all' }, ...taskGroups.map((item) => ({ title: item, value: item }))],
    });
    const selectedGroup = groupResult.value as string;
    if (selectedGroup === 'all') {
        await runBenchmarks(taskGroups);
        return;
    }

    const tasks = await readGroupTasks(selectedGroup);
    const taskResult = await prompts({
        type: 'select',
        name: 'value',
        message: 'Pick a benchmark task',
        choices: [{ title: 'all', value: 'all' }, ...tasks.map((item) => ({ title: item, value: item }))],
    });
    const selectedTask = taskResult.value as string;
    if (selectedTask === 'all') {
        await runBenchmarks([selectedGroup]);
    } else {
        run(selectedTask);
    }
}

void main();

async function runBenchmarks(groups: string[]) {
    const tasks = await Promise.all(groups.map((group) => readGroupTasks(group))).then((result) => result.flat());

    console.log(`Found ${tasks.length} bench tasks`);
    for (const task of tasks) {
        run(task);
    }
}

function run(task: string) {
    const file = path.join(dist, task);
    const log = path.join(
        src,
        path.format({
            ...path.parse(task),
            base: undefined,
            ext: '.log',
        }),
    );

    console.log(`node ${file} > ${log}`);
    child.execSync(`node ${file} > ${log}`);
}

async function readGroupTasks(group: string): Promise<string[]> {
    return fs
        .readdir(path.join(dist, group), { withFileTypes: true })
        .then((entries) => entries.filter((entry) => entry.isFile()).map((entry) => path.join(group, entry.name)));
}
