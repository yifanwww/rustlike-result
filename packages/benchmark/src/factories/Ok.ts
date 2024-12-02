import type { Result } from '@rustresult/result';
import { Ok } from '@rustresult/result';
import { Effect, Exit } from 'effect';
import type { Ok as NTOk } from 'neverthrow';
import { ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

logTestCases([
    ['rustresult Ok', Ok(1)],
    ['neverthrow ok', ntOk(1)],
    ['effect Effect.succeed', Effect.succeed(1)],
    ['effect Exit.succeed', Exit.succeed(1)],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Ok', () => {
        let ret: Result<number, never>;
        for (let i = 0; i < N; i++) {
            ret = Ok(1);
        }
        return ret!;
    })
    .add('neverthrow ok', () => {
        let ret: NTOk<number, never>;
        for (let i = 0; i < N; i++) {
            ret = ntOk(1);
        }
        return ret!;
    })
    .add('effect Effect.succeed', () => {
        let ret: Effect.Effect<number, never>;
        for (let i = 0; i < N; i++) {
            ret = Effect.succeed(1);
        }
        return ret!;
    })
    .add('effect Exit.succeed', () => {
        let ret: Exit.Exit<number, never>;
        for (let i = 0; i < N; i++) {
            ret = Exit.succeed(1);
        }
        return ret!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Ok:
RustlikeResult { _type: 'ok', _value: 1, _error: undefined }

> neverthrow ok:
Ok { value: 1 }

> effect Effect.succeed:
{ _id: 'Exit', _tag: 'Success', value: 1 }

> effect Exit.succeed:
{ _id: 'Exit', _tag: 'Success', value: 1 }

Loop N: 100,000
┌─────────┬─────────────────────────┬─────────────────────┬──────────────────────┬────────────────┬───────────────┬─────────┐
│ (index) │ task                    │ mean (ns)           │ median (ns)          │ mean (op/s)    │ median (op/s) │ samples │
├─────────┼─────────────────────────┼─────────────────────┼──────────────────────┼────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Ok'         │ '395020.66 ± 0.49%' │ '371800.01'          │ '2568 ± 0.45%' │ '2690'        │ 2532    │
│ 1       │ 'neverthrow ok'         │ '269472.49 ± 0.52%' │ '248399.97'          │ '3795 ± 0.44%' │ '4026'        │ 3711    │
│ 2       │ 'effect Effect.succeed' │ '684643.12 ± 0.47%' │ '690699.99'          │ '1472 ± 0.45%' │ '1448'        │ 1461    │
│ 3       │ 'effect Exit.succeed'   │ '678484.60 ± 0.45%' │ '684549.99 ± 150.02' │ '1485 ± 0.43%' │ '1461'        │ 1474    │
└─────────┴─────────────────────────┴─────────────────────┴──────────────────────┴────────────────┴───────────────┴─────────┘

*/
