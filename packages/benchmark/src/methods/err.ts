import { Err, Ok } from '@rustresult/result';
import { Cause, Exit } from 'effect';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';
import { formatTinybenchTask } from '../tinybench.js';
import { formatNum, logEnvironment, logTestCases } from '../utils.js';

await logEnvironment();

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
