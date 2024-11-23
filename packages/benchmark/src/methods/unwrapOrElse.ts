import { Err, Ok } from '@rustresult/result';
import { Cause, Exit } from 'effect';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, string>(1);
const resultErr = Err<number, string>('bar');
const ntResultOk = ntOk<number, string>(1);
const ntResultErr = ntErr<number, string>('bar');
const exitSucceed: Exit.Exit<number, string> = Exit.succeed(1);
const exitFail: Exit.Exit<number, string> = Exit.fail('bar');

logTestCases([
    ['@rustresult/result Ok.unwrapOrElse', resultOk.unwrapOrElse((err) => err.length)],
    ['@rustresult/result Err.unwrapOrElse', resultErr.unwrapOrElse((err) => err.length)],
    [
        'neverthrow ok.unwrapOrElse simulation',
        ntResultOk.match(
            (value) => value,
            (err) => err.length,
        ),
    ],
    [
        'neverthrow err.unwrapOrElse simulation',
        ntResultErr.match(
            (value) => value,
            (err) => err.length,
        ),
    ],
    [
        'effect Exit.succeed.unwrapOrElse simulation',
        Exit.match(exitSucceed, {
            onSuccess: (value) => value,
            onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
        }),
    ],
    [
        'effect Exit.fail.unwrapOrElse simulation',
        Exit.match(exitFail, {
            onSuccess: (value) => value,
            onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
        }),
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.unwrapOrElse', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultOk.unwrapOrElse((err) => err.length);
        }
        return result!;
    })
    .add('@rustresult/result Err.unwrapOrElse', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultErr.unwrapOrElse((err) => err.length);
        }
        return result!;
    })
    .add('neverthrow ok.unwrapOrElse simulation', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.match(
                (value) => value,
                (err) => err.length,
            );
        }
        return result!;
    })
    .add('neverthrow err.unwrapOrElse simulation', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.match(
                (value) => value,
                (err) => err.length,
            );
        }
        return result!;
    })
    .add('effect Exit.succeed.unwrapOrElse simulation', () => {
        let result: number | undefined;
        for (let i = 0; i < N; i++) {
            result = Exit.match(exitSucceed, {
                onSuccess: (value) => value,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
            });
        }
        return result;
    })
    .add('effect Exit.fail.unwrapOrElse simulation', () => {
        let result: number | undefined;
        for (let i = 0; i < N; i++) {
            result = Exit.match(exitFail, {
                onSuccess: (value) => value,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
            });
        }
        return result;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.unwrapOrElse:
1

> @rustresult/result Err.unwrapOrElse:
3

> neverthrow ok.unwrapOrElse simulation:
1

> neverthrow err.unwrapOrElse simulation:
3

> effect Exit.succeed.unwrapOrElse simulation:
1

> effect Exit.fail.unwrapOrElse simulation:
3

Loop N: 100,000
┌─────────┬───────────────────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                                     │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼───────────────────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.unwrapOrElse'          │ '72919.36 ± 0.06%'   │ '72899.94'          │ '13720 ± 0.03%'            │ '13717'                   │ 13714   │
│ 1       │ '@rustresult/result Err.unwrapOrElse'         │ '73456.90 ± 0.05%'   │ '73000.07'          │ '13621 ± 0.04%'            │ '13699'                   │ 13614   │
│ 2       │ 'neverthrow ok.unwrapOrElse simulation'       │ '72944.99 ± 0.04%'   │ '72899.94'          │ '13714 ± 0.03%'            │ '13717'                   │ 13709   │
│ 3       │ 'neverthrow err.unwrapOrElse simulation'      │ '74217.46 ± 0.26%'   │ '72900.06'          │ '13573 ± 0.10%'            │ '13717'                   │ 13474   │
│ 4       │ 'effect Exit.succeed.unwrapOrElse simulation' │ '979975.71 ± 0.42%'  │ '978299.98'         │ '1025 ± 0.41%'             │ '1022'                    │ 1021    │
│ 5       │ 'effect Exit.fail.unwrapOrElse simulation'    │ '1023314.32 ± 0.35%' │ '1030799.98'        │ '980 ± 0.34%'              │ '970'                     │ 978     │
└─────────┴───────────────────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
