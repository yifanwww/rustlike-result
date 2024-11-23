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
    ['@rustresult/result Ok.isOk', resultOk.isOk()],
    ['@rustresult/result Err.isOk', resultErr.isOk()],
    ['neverthrow ok.isOk', ntResultOk.isOk()],
    ['neverthrow err.isOk', ntResultErr.isOk()],
    ['effect Exit.succeed.isSuccess', Exit.isSuccess(exitSucceed)],
    ['effect Exit.fail.isSuccess', Exit.isSuccess(exitFail)],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.isOk', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = resultOk.isOk();
        }
        return result!;
    })
    .add('@rustresult/result Err.isOk', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = resultErr.isOk();
        }
        return result!;
    })
    .add('neverthrow ok.isOk', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.isOk();
        }
        return result!;
    })
    .add('neverthrow err.isOk', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.isOk();
        }
        return result!;
    })
    .add('effect Exit.succeed.isSuccess', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = Exit.isSuccess(exitSucceed);
        }
        return result!;
    })
    .add('effect Exit.fail.isSuccess', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = Exit.isSuccess(exitFail);
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.isOk:
true

> @rustresult/result Err.isOk:
false

> neverthrow ok.isOk:
true

> neverthrow err.isOk:
false

> effect Exit.succeed.isOk simulation:
true

> effect Exit.fail.isOk simulation:
false

Loop N: 100,000
┌─────────┬─────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                       │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼─────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.isOk'    │ '24516.61 ± 0.07%'   │ '24400.00'          │ '40832 ± 0.02%'            │ '40984'                   │ 40789   │
│ 1       │ '@rustresult/result Err.isOk'   │ '24442.44 ± 0.06%'   │ '24299.98'          │ '40988 ± 0.03%'            │ '41152'                   │ 40913   │
│ 2       │ 'neverthrow ok.isOk'            │ '24690.79 ± 0.09%'   │ '24400.00'          │ '40677 ± 0.05%'            │ '40984'                   │ 40501   │
│ 3       │ 'neverthrow err.isOk'           │ '24362.80 ± 0.03%'   │ '24299.98'          │ '41078 ± 0.02%'            │ '41152'                   │ 41047   │
│ 4       │ 'effect Exit.succeed.isSuccess' │ '74020.39 ± 0.04%'   │ '73799.97'          │ '13514 ± 0.03%'            │ '13550'                   │ 13510   │
│ 5       │ 'effect Exit.fail.isSuccess'    │ '73999.38 ± 0.03%'   │ '73799.97'          │ '13518 ± 0.03%'            │ '13550'                   │ 13514   │
└─────────┴─────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
