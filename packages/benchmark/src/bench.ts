import child from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const _dirname = path.dirname(url.fileURLToPath(import.meta.url));
const packageDirectory = path.resolve(_dirname, '..');

const distDirectory = path.join(packageDirectory, 'dist');
const srcDirectory = path.join(packageDirectory, 'src');

const benchTaskFolders = ['factories', 'methods'];

const taskPaths = benchTaskFolders
    .map((folder) =>
        fs
            .readdirSync(path.join(distDirectory, folder), { withFileTypes: true })
            .filter((dirent) => dirent.isFile())
            .map((dirent) => path.join(folder, dirent.name)),
    )
    .flat();

console.log(`Found ${taskPaths.length} bench tasks`);
for (const taskPath of taskPaths) {
    console.log(`- ${taskPath}`);
}

for (const taskPath of taskPaths) {
    const jsFilePath = path.join(distDirectory, taskPath);
    const logFileName = path.format({
        ...path.parse(taskPath),
        base: undefined,
        ext: '.log',
    });
    const logFilePath = path.join(srcDirectory, logFileName);

    console.log(`node ${jsFilePath} > ${logFilePath}`);
    child.execSync(`node ${jsFilePath} > ${logFilePath}`);
}
