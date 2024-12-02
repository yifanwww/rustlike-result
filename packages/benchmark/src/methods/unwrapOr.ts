import { Err, Ok } from '@rustresult/result';
import { Exit } from 'effect';
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
    ['rustresult Result.unwrapOr', [resultOk.unwrapOr(100), resultErr.unwrapOr(100)]],
    ['neverthrow Result.unwrapOr', [ntResultOk.unwrapOr(100), ntResultErr.unwrapOr(100)]],
    [
        'effect Exit.unwrapOr sim',
        [
            Exit.match(exitSucceed, {
                onSuccess: (value) => value,
                onFailure: () => 100,
            }),
            Exit.match(exitFail, {
                onSuccess: (value) => value,
                onFailure: () => 100,
            }),
        ],
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.unwrapOr', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultOk.unwrapOr(100);
            result = resultErr.unwrapOr(100);
        }
        return result!;
    })
    .add('neverthrow Result.unwrapOr', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.unwrapOr(100);
            result = ntResultErr.unwrapOr(100);
        }
        return result!;
    })
    .add('effect Exit.unwrapOr sim', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = Exit.match(exitSucceed, {
                onSuccess: (value) => value,
                onFailure: () => 100,
            });
            result = Exit.match(exitFail, {
                onSuccess: (value) => value,
                onFailure: () => 100,
            });
        }
        return result!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.unwrapOr:
[ 1, 100 ]

> neverthrow Result.unwrapOr:
[ 1, 100 ]

> effect Exit.unwrapOr sim:
[ 1, 100 ]

Loop N: 100,000
┌─────────┬──────────────────────────────┬──────────────────────┬───────────────────────┬─────────────────┬───────────────┬─────────┐
│ (index) │ task                         │ mean (ns)            │ median (ns)           │ mean (op/s)     │ median (op/s) │ samples │
├─────────┼──────────────────────────────┼──────────────────────┼───────────────────────┼─────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.unwrapOr' │ '24530.68 ± 0.05%'   │ '24400.00'            │ '40824 ± 0.03%' │ '40984'       │ 40766   │
│ 1       │ 'neverthrow Result.unwrapOr' │ '24478.08 ± 0.03%'   │ '24400.00'            │ '40886 ± 0.02%' │ '40984'       │ 40853   │
│ 2       │ 'effect Exit.unwrapOr sim'   │ '1788351.43 ± 0.68%' │ '1750499.99 ± 399.98' │ '563 ± 0.62%'   │ '571'         │ 560     │
└─────────┴──────────────────────────────┴──────────────────────┴───────────────────────┴─────────────────┴───────────────┴─────────┘

*/
