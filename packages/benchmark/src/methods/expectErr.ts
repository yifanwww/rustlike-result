import { Err } from '@rustresult/result';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultErr = Err<number, number>(404);

logTestCases([['rustresult Result.expectErr', resultErr.expectErr('error message')]]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench.add('rustresult Result.expectErr', () => {
    let result: number;
    for (let i = 0; i < N; i++) {
        try {
            result = resultErr.expectErr('error message');
        } catch {
            // do nothing
        }
    }
    return result!;
});
await bench.run();
console.table(bench.table(formatTinybenchTask));
