import { Err } from '@rustresult/result';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultErr = Err<number, number>(404);

logTestCases([
    ['@rustresult/result Err.unwrapErr', resultErr.unwrapErr()],
    ['@rustresult/result Err.unwrapErrUnchecked', resultErr.unwrapErrUnchecked()],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Err.unwrapErr', () => {
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
    .add('@rustresult/result Err.unwrapErrUnchecked', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultErr.unwrapErrUnchecked();
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Err.unwrapErr:
404

> @rustresult/result Err.unwrapErrUnchecked:
404

Loop N: 100,000
┌─────────┬─────────────────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                                   │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼─────────────────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Err.unwrapErr'          │ '173451.25 ± 0.03%'  │ '173200.01'         │ '5766 ± 0.02%'             │ '5774'                    │ 5766    │
│ 1       │ '@rustresult/result Err.unwrapErrUnchecked' │ '24729.69 ± 0.18%'   │ '24400.00'          │ '40718 ± 0.05%'            │ '40984'                   │ 40438   │
└─────────┴─────────────────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
