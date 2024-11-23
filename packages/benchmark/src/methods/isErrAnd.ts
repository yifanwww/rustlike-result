import { Err, Ok } from '@rustresult/result';
import { Cause, Exit } from 'effect';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok(200);
const resultErr = Err(404);
const ntResultOk = ntOk(200);
const ntResultErr = ntErr(404);
const exitSucceed = Exit.succeed(200);
const exitFail = Exit.fail(404);

logTestCases([
    ['@rustresult/result Ok.isErrAnd', resultOk.isErrAnd((err) => err === 404)],
    ['@rustresult/result Err.isErrAnd', resultErr.isErrAnd((err) => err === 404)],
    ['neverthrow ok.isErrAnd simulation', ntResultOk.isErr() && ntResultOk.error === 404],
    ['neverthrow err.isErrAnd simulation', ntResultErr.isErr() && ntResultErr.error === 404],
    [
        'effect Exit.succeed.isErrAnd simulation',
        Exit.isFailure(exitSucceed) && Cause.isFailType(exitSucceed.cause) && exitSucceed.cause.error === 404,
    ],
    [
        'effect Exit.fail.isErrAnd simulation',
        Exit.isFailure(exitFail) && Cause.isFailType(exitFail.cause) && exitFail.cause.error === 404,
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.isErrAnd', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = resultOk.isErrAnd((err) => err === 400);
        }
        return result!;
    })
    .add('@rustresult/result Err.isErrAnd', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = resultErr.isErrAnd((err) => err === 400);
        }
        return result!;
    })
    .add('neverthrow ok.isErrAnd simulation', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.isErr() && ntResultOk.error === 404;
        }
        return result!;
    })
    .add('neverthrow err.isErrAnd simulation', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.isErr() && ntResultErr.error === 404;
        }
        return result!;
    })
    .add('effect Exit.succeed.isErrAnd simulation', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result =
                Exit.isFailure(exitSucceed) && Cause.isFailType(exitSucceed.cause) && exitSucceed.cause.error === 404;
        }
        return result!;
    })
    .add('effect Exit.fail.isErrAnd simulation', () => {
        let result: boolean;
        for (let i = 0; i < N; i++) {
            result = Exit.isFailure(exitFail) && Cause.isFailType(exitFail.cause) && exitFail.cause.error === 404;
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.isErrAnd:
false

> @rustresult/result Err.isErrAnd:
true

> neverthrow ok.isErrAnd simulation:
false

> neverthrow err.isErrAnd simulation:
true

> effect Exit.succeed.isErrAnd simulation:
false

> effect Exit.fail.isErrAnd simulation:
true

Loop N: 100,000
┌─────────┬───────────────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                                 │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼───────────────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.isErrAnd'          │ '73563.46 ± 0.04%'   │ '73400.02'          │ '13599 ± 0.03%'            │ '13624'                   │ 13594   │
│ 1       │ '@rustresult/result Err.isErrAnd'         │ '73657.58 ± 0.08%'   │ '73400.02'          │ '13586 ± 0.03%'            │ '13624'                   │ 13577   │
│ 2       │ 'neverthrow ok.isErrAnd simulation'       │ '24365.86 ± 0.09%'   │ '24200.08'          │ '41104 ± 0.03%'            │ '41322'                   │ 41042   │
│ 3       │ 'neverthrow err.isErrAnd simulation'      │ '24335.75 ± 0.04%'   │ '24299.98'          │ '41123 ± 0.02%'            │ '41152'                   │ 41092   │
│ 4       │ 'effect Exit.succeed.isErrAnd simulation' │ '73925.21 ± 0.03%'   │ '73799.97'          │ '13530 ± 0.02%'            │ '13550'                   │ 13528   │
│ 5       │ 'effect Exit.fail.isErrAnd simulation'    │ '271823.40 ± 0.04%'  │ '270799.99'         │ '3679 ± 0.03%'             │ '3693'                    │ 3679    │
└─────────┴───────────────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
