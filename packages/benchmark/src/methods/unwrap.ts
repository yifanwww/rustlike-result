import { Ok } from '@rustresult/result';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, number>(200);

logTestCases([
    ['rustresult Result.unwrap', resultOk.unwrap()],
    ['rustresult Result.unwrapUnchecked', resultOk.unwrapUnchecked()],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.unwrap', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            try {
                result = resultOk.unwrap();
            } catch {
                // do nothing
            }
        }
        return result!;
    })
    .add('rustresult Result.unwrapUnchecked', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultOk.unwrapUnchecked();
        }
        return result!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.unwrap:
200

> rustresult Result.unwrapUnchecked:
200

Loop N: 100,000
┌─────────┬─────────────────────────────────────┬─────────────────────┬─────────────┬─────────────────┬───────────────┬─────────┐
│ (index) │ task                                │ mean (ns)           │ median (ns) │ mean (op/s)     │ median (op/s) │ samples │
├─────────┼─────────────────────────────────────┼─────────────────────┼─────────────┼─────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.unwrap'          │ '174036.20 ± 0.04%' │ '173300.03' │ '5747 ± 0.03%'  │ '5770'        │ 5746    │
│ 1       │ 'rustresult Result.unwrapUnchecked' │ '24988.41 ± 0.18%'  │ '24500.01'  │ '40398 ± 0.06%' │ '40816'       │ 40019   │
└─────────┴─────────────────────────────────────┴─────────────────────┴─────────────┴─────────────────┴───────────────┴─────────┘

*/
