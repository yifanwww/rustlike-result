import { Err, Ok } from '@rustresult/result';
import { Cause, Exit } from 'effect';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok(1);
const resultErr = Err('error message');
const ntResultOk = ntOk(1);
const ntResultErr = ntErr('error message');
const exitSucceed = Exit.succeed(1);
const exitFail = Exit.fail('error message');

logTestCases([
    ['rustresult Result.err', [resultOk.err(), resultErr.err()]],
    [
        'neverthrow Result.err sim',
        [
            ntResultOk.match(
                () => undefined,
                (err) => err,
            ),
            ntResultErr.match(
                () => undefined,
                (err) => err,
            ),
        ],
    ],
    [
        'effect Exit.err sim',
        [
            Exit.match(exitSucceed, {
                onSuccess: () => undefined,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error : undefined),
            }),
            Exit.match(exitFail, {
                onSuccess: () => undefined,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error : undefined),
            }),
        ],
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.err', () => {
        let ret: string | undefined;
        for (let i = 0; i < N; i++) {
            ret = resultOk.err();
            ret = resultErr.err();
        }
        return ret;
    })
    .add('neverthrow Result.err sim', () => {
        let ret: string | undefined;
        for (let i = 0; i < N; i++) {
            ret = ntResultOk.match(
                () => undefined,
                (err) => err,
            );
            ret = ntResultErr.match(
                () => undefined,
                (err) => err,
            );
        }
        return ret;
    })
    .add('effect Exit.err sim', () => {
        let ret: string | undefined;
        for (let i = 0; i < N; i++) {
            ret = Exit.match(exitSucceed, {
                onSuccess: () => undefined,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error : undefined),
            });
            ret = Exit.match(exitFail, {
                onSuccess: () => undefined,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error : undefined),
            });
        }
        return ret;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.err:
[ undefined, 'error message' ]

> neverthrow Result.err sim:
[ undefined, 'error message' ]

> effect Exit.err sim:
[ undefined, 'error message' ]

Loop N: 100,000
┌─────────┬─────────────────────────────┬──────────────────────┬──────────────┬─────────────────┬───────────────┬─────────┐
│ (index) │ task                        │ mean (ns)            │ median (ns)  │ mean (op/s)     │ median (op/s) │ samples │
├─────────┼─────────────────────────────┼──────────────────────┼──────────────┼─────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.err'     │ '24487.67 ± 0.07%'   │ '24400.00'   │ '40886 ± 0.02%' │ '40984'       │ 40837   │
│ 1       │ 'neverthrow Result.err sim' │ '73595.85 ± 0.04%'   │ '73400.02'   │ '13593 ± 0.03%' │ '13624'       │ 13588   │
│ 2       │ 'effect Exit.err sim'       │ '1890170.00 ± 0.58%' │ '1862400.00' │ '531 ± 0.54%'   │ '537'         │ 530     │
└─────────┴─────────────────────────────┴──────────────────────┴──────────────┴─────────────────┴───────────────┴─────────┘

*/
