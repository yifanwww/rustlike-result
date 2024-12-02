import { Err, Ok } from '@rustresult/result';
import { Cause, Exit } from 'effect';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, string>(1);
const resultErr = Err<number, string>('foo');
const ntResultOk = ntOk<number, string>(1);
const ntResultErr = ntErr<number, string>('foo');
const exitSucceed: Exit.Exit<number, string> = Exit.succeed(1);
const exitFail: Exit.Exit<number, string> = Exit.fail('foo');

logTestCases([
    [
        'rustresult Result.mapOrElse',
        [
            resultOk.mapOrElse(
                (err) => err.length,
                (value) => value * 2,
            ),
            resultErr.mapOrElse(
                (err) => err.length,
                (value) => value * 2,
            ),
        ],
    ],
    [
        'neverthrow Result.match',
        [
            ntResultOk.match(
                (value) => value * 2,
                (err) => err.length,
            ),
            ntResultErr.match(
                (value) => value * 2,
                (err) => err.length,
            ),
        ],
    ],
    [
        'effect Exit.match',
        [
            Exit.match(exitSucceed, {
                onSuccess: (value) => value * 2,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
            }),
            Exit.match(exitFail, {
                onSuccess: (value) => value * 2,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
            }),
        ],
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.mapOrElse', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultOk.mapOrElse(
                (err) => err.length,
                (value) => value * 2,
            );
            result = resultErr.mapOrElse(
                (err) => err.length,
                (value) => value * 2,
            );
        }
        return result!;
    })
    .add('neverthrow Result.match', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.match(
                (value) => value * 2,
                (err) => err.length,
            );
            result = ntResultErr.match(
                (value) => value * 2,
                (err) => err.length,
            );
        }
        return result!;
    })
    .add('effect Exit.match', () => {
        let result: number | undefined;
        for (let i = 0; i < N; i++) {
            result = Exit.match(exitSucceed, {
                onSuccess: (value) => value * 2,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
            });
            result = Exit.match(exitFail, {
                onSuccess: (value) => value * 2,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
            });
        }
        return result!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.mapOrElse:
[ 2, 3 ]

> neverthrow Result.match:
[ 2, 3 ]

> effect Exit.match:
[ 2, 3 ]

Loop N: 100,000
┌─────────┬───────────────────────────────┬──────────────────────┬──────────────┬─────────────────┬───────────────┬─────────┐
│ (index) │ task                          │ mean (ns)            │ median (ns)  │ mean (op/s)     │ median (op/s) │ samples │
├─────────┼───────────────────────────────┼──────────────────────┼──────────────┼─────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.mapOrElse' │ '73778.35 ± 0.03%'   │ '73799.97'   │ '13558 ± 0.03%' │ '13550'       │ 13555   │
│ 1       │ 'neverthrow Result.match'     │ '73980.98 ± 0.06%'   │ '73800.03'   │ '13525 ± 0.03%' │ '13550'       │ 13517   │
│ 2       │ 'effect Exit.match'           │ '1934694.78 ± 0.56%' │ '1907799.96' │ '519 ± 0.51%'   │ '524'         │ 517     │
└─────────┴───────────────────────────────┴──────────────────────┴──────────────┴─────────────────┴───────────────┴─────────┘

*/
