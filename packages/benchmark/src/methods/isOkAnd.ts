import { Err, Ok } from '@rustresult/result';
import { Exit } from 'effect';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok(1);
const resultErr = Err('error message');
const ntResultOk = ntOk(1);
const ntResultErr = ntErr('error message');
const exitSucceed = Exit.succeed(1);
const exitFail = Exit.fail('error message');

logTestCases([
    ['@rustresult/result Ok.isOkAnd', resultOk.isOkAnd((value) => value === 1)],
    ['@rustresult/result Err.isOkAnd', resultErr.isOkAnd((value) => value === 1)],
    ['neverthrow ok.isOkAnd simulation', ntResultOk.isOk() && ntResultOk.value === 1],
    ['neverthrow err.isOkAnd simulation', ntResultErr.isOk() && ntResultErr.value === 1],
    ['effect Exit.succeed.isOkAnd simulation', Exit.isSuccess(exitSucceed) && exitSucceed.value === 1],
    ['effect Exit.fail.isOkAnd simulation', Exit.isSuccess(exitFail) && exitFail.value === 1],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.isOkAnd', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = resultOk.isOkAnd((value) => value === 1);
        }
        return result!;
    })
    .add('@rustresult/result Err.isOkAnd', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = resultErr.isOkAnd((value) => value === 1);
        }
        return result!;
    })
    .add('neverthrow ok.isOkAnd simulation', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.isOk() && ntResultOk.value === 1;
        }
        return result!;
    })
    .add('neverthrow err.isOkAnd simulation', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.isOk() && ntResultErr.value === 1;
        }
        return result!;
    })
    .add('effect Exit.succeed.isOkAnd simulation', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = Exit.isSuccess(exitSucceed) && exitSucceed.value === 1;
        }
        return result!;
    })
    .add('effect Exit.fail.isOkAnd simulation', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = Exit.isSuccess(exitFail) && exitFail.value === 1;
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.isOkAnd:
true

> @rustresult/result Err.isOkAnd:
false

> neverthrow ok.isOkAnd simulation:
true

> neverthrow err.isOkAnd simulation:
false

> effect Exit.succeed.isOkAnd simulation:
true

> effect Exit.fail.isOkAnd simulation:
false

Loop N: 100,000
┌─────────┬──────────────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                                │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼──────────────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.isOkAnd'          │ '73508.31 ± 0.09%'   │ '73300.00'          │ '13623 ± 0.05%'            │ '13643'                   │ 13604   │
│ 1       │ '@rustresult/result Err.isOkAnd'         │ '73518.32 ± 0.06%'   │ '73399.90'          │ '13612 ± 0.04%'            │ '13624'                   │ 13603   │
│ 2       │ 'neverthrow ok.isOkAnd simulation'       │ '24379.53 ± 0.03%'   │ '24299.98'          │ '41049 ± 0.02%'            │ '41152'                   │ 41019   │
│ 3       │ 'neverthrow err.isOkAnd simulation'      │ '24334.25 ± 0.02%'   │ '24299.98'          │ '41110 ± 0.02%'            │ '41152'                   │ 41095   │
│ 4       │ 'effect Exit.succeed.isOkAnd simulation' │ '98565.97 ± 0.03%'   │ '98400.00'          │ '10147 ± 0.02%'            │ '10163'                   │ 10146   │
│ 5       │ 'effect Exit.fail.isOkAnd simulation'    │ '74019.54 ± 0.03%'   │ '73800.09'          │ '13513 ± 0.02%'            │ '13550'                   │ 13510   │
└─────────┴──────────────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
