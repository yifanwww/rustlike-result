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

/*

> rustresult Result.expectErr:
404

Loop N: 100,000
┌─────────┬───────────────────────────────┬─────────────────────┬─────────────┬────────────────┬───────────────┬─────────┐
│ (index) │ task                          │ mean (ns)           │ median (ns) │ mean (op/s)    │ median (op/s) │ samples │
├─────────┼───────────────────────────────┼─────────────────────┼─────────────┼────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.expectErr' │ '148056.27 ± 0.04%' │ '147600.00' │ '6756 ± 0.03%' │ '6775'        │ 6755    │
└─────────┴───────────────────────────────┴─────────────────────┴─────────────┴────────────────┴───────────────┴─────────┘

*/
