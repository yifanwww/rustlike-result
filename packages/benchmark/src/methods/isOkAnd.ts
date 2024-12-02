import { Err, Ok } from '@rustresult/result';
import { Exit } from 'effect';
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
    [
        'rustresult Result.isOkAnd',
        [resultOk.isOkAnd((value) => value === 1), resultErr.isOkAnd((value) => value === 1)],
    ],
    [
        'rustresult Result.isOkAnd sim',
        [resultOk.isOk() && resultOk.unwrapUnchecked() === 1, resultErr.isOk() && resultErr.unwrapUnchecked() === 1],
    ],
    [
        'neverthrow Result.isOkAnd sim',
        [ntResultOk.isOk() && ntResultOk.value === 1, ntResultErr.isOk() && ntResultErr.value === 1],
    ],
    [
        'effect Exit.isOkAnd sim',
        [Exit.isSuccess(exitSucceed) && exitSucceed.value === 1, Exit.isSuccess(exitFail) && exitFail.value === 1],
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.isOkAnd', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = resultOk.isOkAnd((value) => value === 1);
            ret = resultErr.isOkAnd((value) => value === 1);
        }
        return ret!;
    })
    .add('rustresult Result.isOkAnd sim', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = resultOk.isOk() && resultOk.unwrapUnchecked() === 1;
            ret = resultErr.isOk() && resultErr.unwrapUnchecked() === 1;
        }
        return ret!;
    })
    .add('neverthrow Result.isOkAnd sim', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = ntResultOk.isOk() && ntResultOk.value === 1;
            ret = ntResultErr.isOk() && ntResultErr.value === 1;
        }
        return ret!;
    })
    .add('effect Exit.isOkAnd sim', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = Exit.isSuccess(exitSucceed) && exitSucceed.value === 1;
            ret = Exit.isSuccess(exitFail) && exitFail.value === 1;
        }
        return ret!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.isOkAnd:
[ true, false ]

> rustresult Result.isOkAnd sim:
[ true, false ]

> neverthrow Result.isOkAnd sim:
[ true, false ]

> effect Exit.isOkAnd sim:
[ true, false ]

Loop N: 100,000
┌─────────┬─────────────────────────────────┬────────────────────┬─────────────┬─────────────────┬───────────────┬─────────┐
│ (index) │ task                            │ mean (ns)          │ median (ns) │ mean (op/s)     │ median (op/s) │ samples │
├─────────┼─────────────────────────────────┼────────────────────┼─────────────┼─────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.isOkAnd'     │ '74387.88 ± 0.17%' │ '73400.02'  │ '13506 ± 0.08%' │ '13624'       │ 13444   │
│ 1       │ 'rustresult Result.isOkAnd sim' │ '24589.37 ± 0.06%' │ '24499.95'  │ '40765 ± 0.04%' │ '40816'       │ 40668   │
│ 2       │ 'neverthrow Result.isOkAnd sim' │ '24658.56 ± 0.08%' │ '24500.01'  │ '40700 ± 0.04%' │ '40816'       │ 40554   │
│ 3       │ 'effect Exit.isOkAnd sim'       │ '86558.06 ± 0.04%' │ '86100.04'  │ '11558 ± 0.03%' │ '11614'       │ 11553   │
└─────────┴─────────────────────────────────┴────────────────────┴─────────────┴─────────────────┴───────────────┴─────────┘

*/
