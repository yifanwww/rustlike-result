import { Ok } from '@rustresult/result';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logEnvironment, logTestCases } from '../utils.js';

logEnvironment();

const N = 100_000;

const resultOk = Ok<number, number>(200);

logTestCases([['rustresult Result.expect', resultOk.expect('error message')]]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench.add('rustresult Result.expect', () => {
    let result: number;
    for (let i = 0; i < N; i++) {
        try {
            result = resultOk.expect('error message');
        } catch {
            // do nothing
        }
    }
    return result!;
});
await bench.run();
console.table(bench.table(formatTinybenchTask));
