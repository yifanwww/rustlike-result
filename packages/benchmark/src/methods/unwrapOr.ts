import { Err, Ok } from '@rustresult/result';
import { Exit } from 'effect';
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
    ['@rustresult/result Ok.unwrapOr', resultOk.unwrapOr(100)],
    ['@rustresult/result Err.unwrapOr', resultErr.unwrapOr(100)],
    ['neverthrow ok.unwrapOr', ntResultOk.unwrapOr(100)],
    ['neverthrow err.unwrapOr', ntResultErr.unwrapOr(100)],
    [
        'effect Exit.succeed.unwrapOr simulation',
        Exit.match(exitSucceed, {
            onSuccess: (value) => value,
            onFailure: () => 100,
        }),
    ],
    [
        'effect Exit.fail.unwrapOr simulation',
        Exit.match(exitFail, {
            onSuccess: (value) => value,
            onFailure: () => 100,
        }),
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.unwrapOr', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultOk.unwrapOr(100);
        }
        return result!;
    })
    .add('@rustresult/result Err.unwrapOr', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultErr.unwrapOr(100);
        }
        return result!;
    })
    .add('neverthrow ok.unwrapOr', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.unwrapOr(100);
        }
        return result!;
    })
    .add('neverthrow err.unwrapOr', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.unwrapOr(100);
        }
        return result!;
    })
    .add('effect Exit.succeed.unwrapOr simulation', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = Exit.match(exitSucceed, {
                onSuccess: (value) => value,
                onFailure: () => 100,
            });
        }
        return result!;
    })
    .add('effect Exit.fail.unwrapOr simulation', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = Exit.match(exitFail, {
                onSuccess: (value) => value,
                onFailure: () => 100,
            });
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.unwrapOr:
1

> @rustresult/result Err.unwrapOr:
100

> neverthrow ok.unwrapOr:
1

> neverthrow err.unwrapOr:
100

> effect Exit.succeed.unwrapOr simulation:
1

> effect Exit.fail.unwrapOr simulation:
100

Loop N: 100,000
┌─────────┬───────────────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                                 │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼───────────────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.unwrapOr'          │ '24461.13 ± 0.07%'   │ '24299.98'          │ '40983 ± 0.04%'            │ '41152'                   │ 40882   │
│ 1       │ '@rustresult/result Err.unwrapOr'         │ '24442.34 ± 0.06%'   │ '24299.98'          │ '40998 ± 0.03%'            │ '41152'                   │ 40913   │
│ 2       │ 'neverthrow ok.unwrapOr'                  │ '24417.62 ± 0.06%'   │ '24299.98'          │ '41039 ± 0.03%'            │ '41152'                   │ 40955   │
│ 3       │ 'neverthrow err.unwrapOr'                 │ '24373.09 ± 0.07%'   │ '24299.98'          │ '41070 ± 0.02%'            │ '41152'                   │ 41029   │
│ 4       │ 'effect Exit.succeed.unwrapOr simulation' │ '908891.10 ± 0.41%'  │ '911300.06'         │ '1105 ± 0.40%'             │ '1097'                    │ 1101    │
│ 5       │ 'effect Exit.fail.unwrapOr simulation'    │ '878940.77 ± 0.40%'  │ '883349.96 ± 50.01' │ '1143 ± 0.39%'             │ '1132'                    │ 1138    │
└─────────┴───────────────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
