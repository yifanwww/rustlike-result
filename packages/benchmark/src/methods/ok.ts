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
    ['rustresult Result.ok', [resultOk.ok(), resultErr.ok()]],
    ['neverthrow Result.ok sim', [ntResultOk.unwrapOr(undefined), ntResultErr.unwrapOr(undefined)]],
    ['effect Exit.ok sim', [Exit.getOrElse(exitSucceed, () => undefined), Exit.getOrElse(exitFail, () => undefined)]],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.ok', () => {
        let ret: number | undefined;
        for (let i = 0; i < N; i++) {
            ret = resultOk.ok();
            ret = resultErr.ok();
        }
        return ret;
    })
    .add('neverthrow Result.ok sim', () => {
        let ret: number | undefined;
        for (let i = 0; i < N; i++) {
            ret = ntResultOk.unwrapOr(undefined);
            ret = ntResultErr.unwrapOr(undefined);
        }
        return ret;
    })
    .add('effect Exit.ok sim', () => {
        let ret: number | undefined;
        for (let i = 0; i < N; i++) {
            ret = Exit.getOrElse(exitSucceed, () => undefined);
            ret = Exit.getOrElse(exitFail, () => undefined);
        }
        return ret;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.ok:
[ 1, undefined ]

> neverthrow Result.ok sim:
[ 1, undefined ]

> effect Exit.ok sim:
[ 1, undefined ]

Loop N: 100,000
┌─────────┬────────────────────────────┬─────────────────────┬─────────────────────┬─────────────────┬───────────────┬─────────┐
│ (index) │ task                       │ mean (ns)           │ median (ns)         │ mean (op/s)     │ median (op/s) │ samples │
├─────────┼────────────────────────────┼─────────────────────┼─────────────────────┼─────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.ok'     │ '24510.99 ± 0.07%'  │ '24400.00'          │ '40901 ± 0.04%' │ '40984'       │ 40799   │
│ 1       │ 'neverthrow Result.ok sim' │ '24511.67 ± 0.05%'  │ '24400.00'          │ '40859 ± 0.03%' │ '40984'       │ 40797   │
│ 2       │ 'effect Exit.ok sim'       │ '697350.56 ± 0.38%' │ '668450.03 ± 49.98' │ '1441 ± 0.36%'  │ '1496'        │ 1434    │
└─────────┴────────────────────────────┴─────────────────────┴─────────────────────┴─────────────────┴───────────────┴─────────┘

*/
