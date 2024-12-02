import type { Result } from '@rustresult/result';
import { Err } from '@rustresult/result';
import { Effect, Exit } from 'effect';
import type { Err as NTErr } from 'neverthrow';
import { err as ntErr } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

logTestCases([
    ['rustresult Err', Err('error message')],
    ['neverthrow err', ntErr('error message')],
    ['effect Effect.fail', Effect.fail('error message')],
    ['effect Exit.fail', Exit.fail('error message')],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Err', () => {
        let ret: Result<never, string>;
        for (let i = 0; i < N; i++) {
            ret = Err('error message');
        }
        return ret!;
    })
    .add('neverthrow err', () => {
        let ret: NTErr<never, string>;
        for (let i = 0; i < N; i++) {
            ret = ntErr('error message');
        }
        return ret!;
    })
    .add('effect Effect.fail', () => {
        let ret: Effect.Effect<never, string>;
        for (let i = 0; i < N; i++) {
            ret = Effect.fail('error message');
        }
        return ret!;
    })
    .add('effect Exit.fail', () => {
        let ret: Exit.Exit<never, string>;
        for (let i = 0; i < N; i++) {
            ret = Exit.fail('error message');
        }
        return ret!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Err:
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
┌─────────┬──────────────────────┬──────────────────────┬──────────────┬────────────────┬───────────────┬─────────┐
│ (index) │ task                 │ mean (ns)            │ median (ns)  │ mean (op/s)    │ median (op/s) │ samples │
├─────────┼──────────────────────┼──────────────────────┼──────────────┼────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Err'     │ '393274.20 ± 0.53%'  │ '371400.00'  │ '2585 ± 0.48%' │ '2693'        │ 2543    │
│ 1       │ 'neverthrow err'     │ '272867.02 ± 0.89%'  │ '248600.01'  │ '3781 ± 0.49%' │ '4023'        │ 3666    │
│ 2       │ 'effect Effect.fail' │ '1162188.39 ± 0.46%' │ '1148000.00' │ '864 ± 0.44%'  │ '871'         │ 861     │
│ 3       │ 'effect Exit.fail'   │ '1127193.58 ± 0.47%' │ '1110300.00' │ '891 ± 0.44%'  │ '901'         │ 888     │
└─────────┴──────────────────────┴──────────────────────┴──────────────┴────────────────┴───────────────┴─────────┘

*/
