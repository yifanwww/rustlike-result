import { Err, Ok } from '@rustresult/result';
import { Exit } from 'effect';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<string, string>('foo');
const resultErr = Err<string, string>('bar');
const ntResultOk = ntOk<string, string>('foo');
const ntResultErr = ntErr<string, string>('bar');
const exitSucceed: Exit.Exit<string, string> = Exit.succeed('foo');
const exitFail: Exit.Exit<string, string> = Exit.fail('bar');

logTestCases([
    ['@rustresult/result Ok.mapOr', resultOk.mapOr(40, (value) => value.length)],
    ['@rustresult/result Err.mapOr', resultErr.mapOr(40, (value) => value.length)],
    ['neverthrow ok.mapOr simulation', ntResultOk.map((value) => value.length).unwrapOr(40)],
    ['neverthrow err.mapOr simulation', ntResultErr.map((value) => value.length).unwrapOr(40)],
    [
        'effect Exit.succeed.mapOr simulation',
        Exit.match(exitSucceed, {
            onSuccess: (value) => value.length,
            onFailure: () => 40,
        }),
    ],
    [
        'effect Exit.fail.mapOr simulation',
        Exit.match(exitFail, {
            onSuccess: (value) => value.length,
            onFailure: () => 40,
        }),
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.mapOr', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultOk.mapOr(40, (value) => value.length);
        }
        return result!;
    })
    .add('@rustresult/result Err.mapOr', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultErr.mapOr(40, (value) => value.length);
        }
        return result!;
    })
    .add('neverthrow ok.mapOr simulation', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.map((value) => value.length).unwrapOr(40);
        }
        return result!;
    })
    .add('neverthrow err.mapOr simulation', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.map((value) => value.length).unwrapOr(40);
        }
        return result!;
    })
    .add('effect Exit.succeed.mapOr simulation', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = Exit.match(exitSucceed, {
                onSuccess: (value) => value.length,
                onFailure: () => 40,
            });
        }
        return result!;
    })
    .add('effect Exit.fail.mapOr simulation', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = Exit.match(exitFail, {
                onSuccess: (value: string) => value.length,
                onFailure: () => 40,
            });
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.mapOr:
3

> @rustresult/result Err.mapOr:
40

> neverthrow ok.mapOr simulation:
3

> neverthrow err.mapOr simulation:
40

> effect Exit.succeed.mapOr simulation:
3

> effect Exit.fail.mapOr simulation:
40

Loop N: 100,000
┌─────────┬────────────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                              │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼────────────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.mapOr'          │ '73364.23 ± 0.03%'   │ '73300.00'          │ '13635 ± 0.03%'            │ '13643'                   │ 13631   │
│ 1       │ '@rustresult/result Err.mapOr'         │ '73449.80 ± 0.03%'   │ '73400.02'          │ '13618 ± 0.02%'            │ '13624'                   │ 13615   │
│ 2       │ 'neverthrow ok.mapOr simulation'       │ '73824.39 ± 0.14%'   │ '73399.90'          │ '13586 ± 0.06%'            │ '13624'                   │ 13546   │
│ 3       │ 'neverthrow err.mapOr simulation'      │ '73315.76 ± 0.04%'   │ '73000.07'          │ '13645 ± 0.03%'            │ '13699'                   │ 13640   │
│ 4       │ 'effect Exit.succeed.mapOr simulation' │ '940934.52 ± 0.48%'  │ '936499.95'         │ '1069 ± 0.45%'             │ '1068'                    │ 1063    │
│ 5       │ 'effect Exit.fail.mapOr simulation'    │ '892379.39 ± 0.41%'  │ '894000.05'         │ '1126 ± 0.40%'             │ '1119'                    │ 1121    │
└─────────┴────────────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
