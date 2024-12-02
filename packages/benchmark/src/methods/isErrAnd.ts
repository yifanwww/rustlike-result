import { Err, Ok } from '@rustresult/result';
import { Cause, Exit } from 'effect';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok(200);
const resultErr = Err(404);
const ntResultOk = ntOk(200);
const ntResultErr = ntErr(404);
const exitSucceed = Exit.succeed(200);
const exitFail = Exit.fail(404);

logTestCases([
    ['rustresult Result.isErrAnd', [resultOk.isErrAnd((err) => err === 404), resultErr.isErrAnd((err) => err === 404)]],
    [
        'rustresult Result.isErrAnd sim',
        [
            resultOk.isErr() && resultOk.unwrapErrUnchecked() === 404,
            resultErr.isErr() && resultErr.unwrapErrUnchecked() === 404,
        ],
    ],
    [
        'neverthrow Result.isErrAnd sim',
        [ntResultOk.isErr() && ntResultOk.error === 404, ntResultErr.isErr() && ntResultErr.error === 404],
    ],
    [
        'effect Exit.isErrAnd sim',
        [
            Exit.isFailure(exitSucceed) && Cause.isFailType(exitSucceed.cause) && exitSucceed.cause.error === 404,
            Exit.isFailure(exitFail) && Cause.isFailType(exitFail.cause) && exitFail.cause.error === 404,
        ],
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.isErrAnd', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = resultOk.isErrAnd((err) => err === 404);
            ret = resultErr.isErrAnd((err) => err === 404);
        }
        return ret!;
    })
    .add('rustresult Result.isErrAnd sim', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = resultOk.isErr() && resultOk.unwrapErrUnchecked() === 404;
            ret = resultErr.isErr() && resultErr.unwrapErrUnchecked() === 404;
        }
        return ret!;
    })
    .add('neverthrow Result.isErrAnd sim', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = ntResultOk.isErr() && ntResultOk.error === 404;
            ret = ntResultErr.isErr() && ntResultErr.error === 404;
        }
        return ret!;
    })
    .add('effect Exit.isErrAnd sim', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = Exit.isFailure(exitSucceed) && Cause.isFailType(exitSucceed.cause) && exitSucceed.cause.error === 404;
            ret = Exit.isFailure(exitFail) && Cause.isFailType(exitFail.cause) && exitFail.cause.error === 404;
        }
        return ret!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.isErrAnd:
[ false, true ]

> rustresult Result.isErrAnd sim:
[ false, true ]

> neverthrow Result.isErrAnd sim:
[ false, true ]

> effect Exit.isErrAnd sim:
[ false, true ]

Loop N: 100,000
┌─────────┬──────────────────────────────────┬─────────────────────┬─────────────┬─────────────────┬───────────────┬─────────┐
│ (index) │ task                             │ mean (ns)           │ median (ns) │ mean (op/s)     │ median (op/s) │ samples │
├─────────┼──────────────────────────────────┼─────────────────────┼─────────────┼─────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.isErrAnd'     │ '73866.61 ± 0.04%'  │ '73600.05'  │ '13543 ± 0.03%' │ '13587'       │ 13538   │
│ 1       │ 'rustresult Result.isErrAnd sim' │ '24503.15 ± 0.03%'  │ '24500.01'  │ '40836 ± 0.02%' │ '40816'       │ 40812   │
│ 2       │ 'neverthrow Result.isErrAnd sim' │ '24521.30 ± 0.03%'  │ '24500.01'  │ '40806 ± 0.02%' │ '40816'       │ 40781   │
│ 3       │ 'effect Exit.isErrAnd sim'       │ '276035.05 ± 0.54%' │ '272099.97' │ '3650 ± 0.19%'  │ '3675'        │ 3623    │
└─────────┴──────────────────────────────────┴─────────────────────┴─────────────┴─────────────────┴───────────────┴─────────┘

*/
