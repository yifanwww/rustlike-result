import { Err, Ok } from '@rustresult/result';
import { Cause, Exit } from 'effect';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';
import { formatTinybenchTask } from '../tinybench.js';
import { formatNum, logEnvironment, logTestCases } from '../utils.js';

await logEnvironment();

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
