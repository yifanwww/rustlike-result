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
    ['rustresult Result.isOk', [resultOk.isOk(), resultErr.isOk()]],
    ['neverthrow Result.isOk', [ntResultOk.isOk(), ntResultErr.isOk()]],
    ['effect Exit.isSuccess', [Exit.isSuccess(exitSucceed), Exit.isSuccess(exitFail)]],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.isOk', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = resultOk.isOk();
            ret = resultErr.isOk();
        }
        return ret!;
    })
    .add('neverthrow Result.isOk', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = ntResultOk.isOk();
            ret = ntResultErr.isOk();
        }
        return ret!;
    })
    .add('effect Exit.isSuccess', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = Exit.isSuccess(exitSucceed);
            ret = Exit.isSuccess(exitFail);
        }
        return ret!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.isOk:
[ true, false ]

> neverthrow Result.isOk:
[ true, false ]

> effect Exit.isSuccess:
[ true, false ]

Loop N: 100,000
┌─────────┬──────────────────────────┬────────────────────┬─────────────┬─────────────────┬───────────────┬─────────┐
│ (index) │ task                     │ mean (ns)          │ median (ns) │ mean (op/s)     │ median (op/s) │ samples │
├─────────┼──────────────────────────┼────────────────────┼─────────────┼─────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.isOk' │ '24618.63 ± 0.25%' │ '24500.01'  │ '40710 ± 0.02%' │ '40816'       │ 40620   │
│ 1       │ 'neverthrow Result.isOk' │ '24764.41 ± 0.12%' │ '24500.01'  │ '40591 ± 0.05%' │ '40816'       │ 40381   │
│ 2       │ 'effect Exit.isSuccess'  │ '74430.41 ± 0.29%' │ '74299.99'  │ '13458 ± 0.03%' │ '13459'       │ 13436   │
└─────────┴──────────────────────────┴────────────────────┴─────────────┴─────────────────┴───────────────┴─────────┘

*/
