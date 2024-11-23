import { Err, Ok } from '@rustresult/result';
import { Cause, Exit } from 'effect';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

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
        '@rustresult/result Ok.mapOrElse',
        resultOk.mapOrElse(
            (err) => err.length,
            (value) => value * 2,
        ),
    ],
    [
        '@rustresult/result Err.mapOrElse',
        resultErr.mapOrElse(
            (err) => err.length,
            (value) => value * 2,
        ),
    ],
    [
        'neverthrow ok.match',
        ntResultOk.match(
            (value) => value * 2,
            (err) => err.length,
        ),
    ],
    [
        'neverthrow err.match',
        ntResultErr.match(
            (value) => value * 2,
            (err) => err.length,
        ),
    ],
    [
        'effect Exit.succeed.match',
        Exit.match(exitSucceed, {
            onSuccess: (value) => value * 2,
            onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
        }),
    ],
    [
        'effect Exit.fail.match',
        Exit.match(exitFail, {
            onSuccess: (value) => value * 2,
            onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
        }),
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.mapOrElse', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultOk.mapOrElse(
                (err) => err.length,
                (value) => value * 2,
            );
        }
        return result!;
    })
    .add('@rustresult/result Err.mapOrElse', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultErr.mapOrElse(
                (err) => err.length,
                (value) => value * 2,
            );
        }
        return result!;
    })
    .add('neverthrow ok.match', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.match(
                (value) => value * 2,
                (err) => err.length,
            );
        }
        return result!;
    })
    .add('neverthrow err.match', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.match(
                (value) => value * 2,
                (err) => err.length,
            );
        }
        return result!;
    })
    .add('effect Exit.succeed.match', () => {
        let result: number | undefined;
        for (let i = 0; i < N; i++) {
            result = Exit.match(exitSucceed, {
                onSuccess: (value) => value * 2,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
            });
        }
        return result!;
    })
    .add('effect Exit.fail.match', () => {
        let result: number | undefined;
        for (let i = 0; i < N; i++) {
            result = Exit.match(exitFail, {
                onSuccess: (value) => value * 2,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error.length : undefined),
            });
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.mapOrElse:
2

> @rustresult/result Err.mapOrElse:
3

> neverthrow ok.match:
2

> neverthrow err.match:
3

> effect Exit.succeed.match:
2

> effect Exit.fail.match:
3

Loop N: 100,000
┌─────────┬────────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                          │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼────────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.mapOrElse'  │ '73485.03 ± 0.04%'   │ '73399.90'          │ '13614 ± 0.03%'            │ '13624'                   │ 13609   │
│ 1       │ '@rustresult/result Err.mapOrElse' │ '73472.49 ± 0.04%'   │ '73399.90'          │ '13617 ± 0.03%'            │ '13624'                   │ 13611   │
│ 2       │ 'neverthrow ok.match'              │ '73436.84 ± 0.05%'   │ '73399.90'          │ '13626 ± 0.03%'            │ '13624'                   │ 13618   │
│ 3       │ 'neverthrow err.match'             │ '74462.68 ± 0.08%'   │ '73400.02'          │ '13452 ± 0.06%'            │ '13624'                   │ 13430   │
│ 4       │ 'effect Exit.succeed.match'        │ '949783.19 ± 0.44%'  │ '949099.90'         │ '1058 ± 0.42%'             │ '1054'                    │ 1053    │
│ 5       │ 'effect Exit.fail.match'           │ '1045735.32 ± 0.41%' │ '1048099.99'        │ '960 ± 0.39%'              │ '954'                     │ 957     │
└─────────┴────────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
