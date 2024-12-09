import { Err, Ok } from '@rustresult/result';
import { Cause, Exit } from 'effect';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, string>(1);
const resultErr = Err<number, string>('bar');
const ntResultOk = ntOk<number, string>(1);
const ntResultErr = ntErr<number, string>('bar');
const exitSucceed: Exit.Exit<number, string> = Exit.succeed(1);
const exitFail: Exit.Exit<number, string> = Exit.fail('bar');

logTestCases([
    [
        'rustresult Result.unwrapOrElse',
        [resultOk.unwrapOrElse((err) => err.length), resultErr.unwrapOrElse((err) => err.length)],
    ],
    [
        'neverthrow Result.unwrapOrElse sim',
        [
            ntResultOk.match(
                (value) => value,
                (err) => err.length,
            ),
            ntResultErr.match(
                (value) => value,
                (err) => err.length,
            ),
        ],
    ],
    [
        'effect Exit.unwrapOrElse sim',
        [
            Exit.match(exitSucceed, {
                onSuccess: (value) => value,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
            }),
            Exit.match(exitFail, {
                onSuccess: (value) => value,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
            }),
        ],
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.unwrapOrElse', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultOk.unwrapOrElse((err) => err.length);
            result = resultErr.unwrapOrElse((err) => err.length);
        }
        return result!;
    })
    .add('neverthrow Result.unwrapOrElse sim', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.match(
                (value) => value,
                (err) => err.length,
            );
            result = ntResultErr.match(
                (value) => value,
                (err) => err.length,
            );
        }
        return result!;
    })
    .add('effect Exit.unwrapOrElse sim', () => {
        let result: number | undefined;
        for (let i = 0; i < N; i++) {
            result = Exit.match(exitSucceed, {
                onSuccess: (value) => value,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
            });
            result = Exit.match(exitFail, {
                onSuccess: (value) => value,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
            });
        }
        return result;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
