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
    ['rustresult Result.isErr', [resultOk.isErr(), resultErr.isErr()]],
    ['neverthrow Result.isErr', [ntResultOk.isErr(), ntResultErr.isErr()]],
    ['effect Exit.isFailure', [Exit.isFailure(exitSucceed), Exit.isFailure(exitFail)]],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.isErr', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = resultOk.isErr();
            ret = resultErr.isErr();
        }
        return ret!;
    })
    .add('neverthrow Result.isErr', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = ntResultOk.isErr();
            ret = ntResultErr.isErr();
        }
        return ret!;
    })
    .add('effect Exit.isFailure', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = Exit.isFailure(exitSucceed);
            ret = Exit.isFailure(exitFail);
        }
        return ret!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.isErr:
[ false, true ]

> neverthrow Result.isErr:
[ false, true ]

> effect Exit.isFailure:
[ false, true ]

Loop N: 100,000
┌─────────┬───────────────────────────┬────────────────────┬─────────────┬─────────────────┬───────────────┬─────────┐
│ (index) │ task                      │ mean (ns)          │ median (ns) │ mean (op/s)     │ median (op/s) │ samples │
├─────────┼───────────────────────────┼────────────────────┼─────────────┼─────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.isErr' │ '24764.70 ± 0.08%' │ '24500.01'  │ '40538 ± 0.05%' │ '40816'       │ 40381   │
│ 1       │ 'neverthrow Result.isErr' │ '24562.31 ± 0.03%' │ '24500.01'  │ '40742 ± 0.02%' │ '40816'       │ 40713   │
│ 2       │ 'effect Exit.isFailure'   │ '74318.06 ± 0.03%' │ '74200.03'  │ '13460 ± 0.03%' │ '13477'       │ 13456   │
└─────────┴───────────────────────────┴────────────────────┴─────────────┴─────────────────┴───────────────┴─────────┘

*/
