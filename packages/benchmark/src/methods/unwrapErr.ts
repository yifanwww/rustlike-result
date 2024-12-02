import { Err } from '@rustresult/result';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultErr = Err<number, number>(404);

logTestCases([
    ['rustresult Err.unwrapErr', resultErr.unwrapErr()],
    ['rustresult Err.unwrapErrUnchecked', resultErr.unwrapErrUnchecked()],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Err.unwrapErr', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            try {
                result = resultErr.unwrapErr();
            } catch {
                // do nothing
            }
        }
        return result!;
    })
    .add('rustresult Err.unwrapErrUnchecked', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultErr.unwrapErrUnchecked();
        }
        return result!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Err.unwrapErr:
404

> rustresult Err.unwrapErrUnchecked:
404

Loop N: 100,000
┌─────────┬─────────────────────────────────────┬─────────────────────┬─────────────┬─────────────────┬───────────────┬─────────┐
│ (index) │ task                                │ mean (ns)           │ median (ns) │ mean (op/s)     │ median (op/s) │ samples │
├─────────┼─────────────────────────────────────┼─────────────────────┼─────────────┼─────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Err.unwrapErr'          │ '174067.69 ± 0.04%' │ '173300.03' │ '5746 ± 0.03%'  │ '5770'        │ 5745    │
│ 1       │ 'rustresult Err.unwrapErrUnchecked' │ '24846.18 ± 0.10%'  │ '24500.01'  │ '40490 ± 0.06%' │ '40816'       │ 40248   │
└─────────┴─────────────────────────────────────┴─────────────────────┴─────────────┴─────────────────┴───────────────┴─────────┘

*/
