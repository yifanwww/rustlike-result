import { Err, Ok } from '@rustresult/result';
import { Exit } from 'effect';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok(1);
const resultErr = Err('error message');
const ntResultOk = ntOk(1);
const ntResultErr = ntErr('error message');
const exitSucceed = Exit.succeed(1);
const exitFail = Exit.fail('error message');

logTestCases([
    ['@rustresult/result Ok.ok', resultOk.ok()],
    ['@rustresult/result Err.ok', resultErr.ok()],
    ['neverthrow ok.ok simulation', ntResultOk.unwrapOr(undefined)],
    ['neverthrow err.ok simulation', ntResultErr.unwrapOr(undefined)],
    ['effect Exit.succeed.ok simulation', Exit.getOrElse(exitSucceed, () => undefined)],
    ['effect Exit.fail.ok simulation', Exit.getOrElse(exitFail, () => undefined)],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.ok', () => {
        let result: number | undefined;
        for (let i = 0; i < N; i++) {
            result = resultOk.ok();
        }
        return result;
    })
    .add('@rustresult/result Err.ok', () => {
        let result: undefined;
        for (let i = 0; i < N; i++) {
            result = resultErr.ok();
        }
        return result;
    })
    .add('neverthrow ok.ok simulation', () => {
        let result: number | undefined;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.unwrapOr(undefined);
        }
        return result;
    })
    .add('neverthrow err.ok simulation', () => {
        let result: undefined;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.unwrapOr(undefined);
        }
        return result;
    })
    .add('effect Exit.succeed.ok simulation', () => {
        let result: number | undefined;
        for (let i = 0; i < N; i++) {
            result = Exit.getOrElse(exitSucceed, () => undefined);
        }
        return result;
    })
    .add('effect Exit.fail.ok simulation', () => {
        let result: undefined;
        for (let i = 0; i < N; i++) {
            result = Exit.getOrElse(exitFail, () => undefined);
        }
        return result;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.ok:
1

> @rustresult/result Err.ok:
undefined

> neverthrow ok.ok simulation:
1

> neverthrow err.ok simulation:
undefined

> effect Exit.succeed.ok simulation:
1

> effect Exit.fail.ok simulation:
undefined

Loop N: 100,000
┌─────────┬─────────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                           │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼─────────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.ok'          │ '24372.27 ± 0.04%'   │ '24299.98'          │ '41071 ± 0.02%'            │ '41152'                   │ 41031   │
│ 1       │ '@rustresult/result Err.ok'         │ '24431.75 ± 0.06%'   │ '24299.98'          │ '41020 ± 0.03%'            │ '41152'                   │ 40931   │
│ 2       │ 'neverthrow ok.ok simulation'       │ '24398.62 ± 0.05%'   │ '24299.98'          │ '41043 ± 0.03%'            │ '41152'                   │ 40986   │
│ 3       │ 'neverthrow err.ok simulation'      │ '24374.68 ± 0.05%'   │ '24200.08'          │ '41087 ± 0.03%'            │ '41322'                   │ 41027   │
│ 4       │ 'effect Exit.succeed.ok simulation' │ '529423.77 ± 0.43%'  │ '501700.04'         │ '1905 ± 0.40%'             │ '1993'                    │ 1889    │
│ 5       │ 'effect Exit.fail.ok simulation'    │ '246393.35 ± 0.04%'  │ '245900.03'         │ '4059 ± 0.03%'             │ '4067'                    │ 4059    │
└─────────┴─────────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
