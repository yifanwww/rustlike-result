import child from 'node:child_process';
import semver from 'semver';

function getNpmTag(prerelease) {
    const type = typeof prerelease?.[0] !== 'string' ? null : prerelease[0];

    switch (type) {
        case null:
            return 'latest';

        case 'alpha':
        case 'beta':
        case 'next':
        case 'rc':
            return type;

        default:
            return 'next';
    }
}

const ALLOWED_PACKAGE_NAMES = [
    '@rustresult/json',
    '@rustresult/json-serializr',
    '@rustresult/result',
    '@rustresult/typeorm',
];

function release() {
    // This environment variable is injected in Github Actions
    //
    // ```yml
    // - name: Publish
    //   run: node scripts/release.js
    //   env:
    //     GITHUB_REF_NAME: ${{ github.ref_name }}
    // ```
    const tag = process.env.GITHUB_REF_NAME;
    if (!tag) return;

    // The tag name format is: `{package_name}_{version}`
    // for example: @scope/name_v0.0.0, @scope/name_v0.0.0-alpha.1
    const [packageName, version] = tag.split('_');

    if (!ALLOWED_PACKAGE_NAMES.includes(packageName)) return;

    const prerelease = semver.prerelease(version);
    const npmTag = getNpmTag(prerelease);

    const cmd = `pnpm publish --filter ${packageName} --tag ${npmTag} --access public --no-git-checks`;
    console.info(cmd);
    child.execSync(cmd, { encoding: 'utf-8', stdio: 'inherit' });
}

release();
