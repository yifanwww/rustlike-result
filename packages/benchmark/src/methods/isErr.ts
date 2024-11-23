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
    ['@rustresult/result Ok.isErr', resultOk.isErr()],
    ['@rustresult/result Err.isErr', resultErr.isErr()],
    ['neverthrow ok.isErr', ntResultOk.isErr()],
    ['neverthrow err.isErr', ntResultErr.isErr()],
    ['effect Exit.succeed.isFailure', Exit.isFailure(exitSucceed)],
    ['effect Exit.fail.isFailure', Exit.isFailure(exitFail)],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.isErr', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = resultOk.isErr();
        }
        return result!;
    })
    .add('@rustresult/result Err.isErr', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = resultErr.isErr();
        }
        return result!;
    })
    .add('neverthrow ok.isErr', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.isErr();
        }
        return result!;
    })
    .add('neverthrow err.isErr', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.isErr();
        }
        return result!;
    })
    .add('effect Exit.succeed.isFailure', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = Exit.isFailure(exitSucceed);
        }
        return result!;
    })
    .add('effect Exit.fail.isFailure', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = Exit.isFailure(exitFail);
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.isErr:
false

> @rustresult/result Err.isErr:
true

> neverthrow ok.isErr:
false

> neverthrow err.isErr:
true

> effect Exit.succeed.isErr simulation:
false

> effect Exit.fail.isErr simulation:
true

Loop N: 100,000
┌─────────┬─────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                       │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼─────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.isErr'   │ '24426.17 ± 0.04%'   │ '24300.10'          │ '40983 ± 0.03%'            │ '41152'                   │ 40940   │
│ 1       │ '@rustresult/result Err.isErr'  │ '24701.90 ± 0.11%'   │ '24299.98'          │ '40753 ± 0.06%'            │ '41152'                   │ 40483   │
│ 2       │ 'neverthrow ok.isErr'           │ '24473.07 ± 0.07%'   │ '24299.98'          │ '40981 ± 0.04%'            │ '41152'                   │ 40862   │
│ 3       │ 'neverthrow err.isErr'          │ '24841.52 ± 0.14%'   │ '24299.98'          │ '40655 ± 0.07%'            │ '41152'                   │ 40256   │
│ 4       │ 'effect Exit.succeed.isFailure' │ '74612.30 ± 0.12%'   │ '73800.09'          │ '13442 ± 0.07%'            │ '13550'                   │ 13403   │
│ 5       │ 'effect Exit.fail.isFailure'    │ '74025.60 ± 0.03%'   │ '73800.09'          │ '13513 ± 0.03%'            │ '13550'                   │ 13509   │
└─────────┴─────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
