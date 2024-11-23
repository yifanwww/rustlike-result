import type { Result } from '@rustresult/result';
import { Ok } from '@rustresult/result';
import { Effect, Exit } from 'effect';
import type { Ok as NTOk } from 'neverthrow';
import { ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

logTestCases([
    ['@rustresult/result Ok', Ok(1)],
    ['neverthrow ok', ntOk(1)],
    ['effect Effect.succeed', Effect.succeed(1)],
    ['effect Exit.succeed', Exit.succeed(1)],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok', () => {
        let result: Result<number, never>;
        for (let i = 0; i < N; i++) {
            result = Ok(1);
        }
        return result!;
    })
    .add('neverthrow ok', () => {
        let result: NTOk<number, never>;
        for (let i = 0; i < N; i++) {
            result = ntOk(1);
        }
        return result!;
    })
    .add('effect Effect.succeed', () => {
        let effect: Effect.Effect<number, never>;
        for (let i = 0; i < N; i++) {
            effect = Effect.succeed(1);
        }
        return effect!;
    })
    .add('effect Exit.succeed', () => {
        let effect: Exit.Exit<number, never>;
        for (let i = 0; i < N; i++) {
            effect = Exit.succeed(1);
        }
        return effect!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok:
RustlikeResult { _type: 'ok', _value: 1, _error: undefined }

> neverthrow ok:
Ok { value: 1 }

> effect Effect.succeed:
{ _id: 'Exit', _tag: 'Success', value: 1 }

> effect Exit.succeed:
{ _id: 'Exit', _tag: 'Success', value: 1 }

Loop N: 100,000
┌─────────┬─────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name               │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼─────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok' │ '386097.84 ± 0.45%'  │ '362499.95'         │ '2623 ± 0.42%'             │ '2759'                    │ 2591    │
│ 1       │ 'neverthrow ok'         │ '259904.26 ± 0.48%'  │ '241099.95'         │ '3926 ± 0.42%'             │ '4148'                    │ 3848    │
│ 2       │ 'effect Effect.succeed' │ '670446.05 ± 0.51%'  │ '675599.99 ± 0.06'  │ '1505 ± 0.47%'             │ '1480'                    │ 1492    │
│ 3       │ 'effect Exit.succeed'   │ '670574.87 ± 0.48%'  │ '675899.98'         │ '1503 ± 0.44%'             │ '1480'                    │ 1492    │
└─────────┴─────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
