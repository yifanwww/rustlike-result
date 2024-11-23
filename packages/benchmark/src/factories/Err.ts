import type { Result } from '@rustresult/result';
import { Err } from '@rustresult/result';
import { Effect, Exit } from 'effect';
import type { Err as NTErr } from 'neverthrow';
import { err as ntErr } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

logTestCases([
    ['@rustresult/result Err', Err('error message')],
    ['neverthrow err', ntErr('error message')],
    ['effect Effect.fail', Effect.fail('error message')],
    ['effect Exit.fail', Exit.fail('error message')],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Err', () => {
        let result: Result<never, string>;
        for (let i = 0; i < N; i++) {
            result = Err('error message');
        }
        return result!;
    })
    .add('neverthrow err', () => {
        let result: NTErr<never, string>;
        for (let i = 0; i < N; i++) {
            result = ntErr('error message');
        }
        return result!;
    })
    .add('effect Effect.fail', () => {
        let effect: Effect.Effect<never, string>;
        for (let i = 0; i < N; i++) {
            effect = Effect.fail('error message');
        }
        return effect!;
    })
    .add('effect Exit.fail', () => {
        let effect: Exit.Exit<never, string>;
        for (let i = 0; i < N; i++) {
            effect = Exit.fail('error message');
        }
        return effect!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Err:
RustlikeResult {
  _type: 'err',
  _value: undefined,
  _error: 'error message'
}

> neverthrow err:
Err { error: 'error message' }

> effect Effect.fail:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'error message' }
}

> effect Exit.fail:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'error message' }
}

Loop N: 100,000
┌─────────┬──────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼──────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Err' │ '388064.42 ± 0.55%'  │ '362199.90'         │ '2622 ± 0.48%'             │ '2761'                    │ 2577    │
│ 1       │ 'neverthrow err'         │ '259314.39 ± 0.48%'  │ '239699.96'         │ '3934 ± 0.41%'             │ '4172'                    │ 3857    │
│ 2       │ 'effect Effect.fail'     │ '1115973.58 ± 0.39%' │ '1110100.03'        │ '899 ± 0.36%'              │ '901'                     │ 897     │
│ 3       │ 'effect Exit.fail'       │ '1088751.47 ± 0.37%' │ '1082700.01'        │ '921 ± 0.35%'              │ '924'                     │ 919     │
└─────────┴──────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
