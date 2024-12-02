import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import { Exit } from 'effect';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, string>(1);
const resultErr = Err<number, string>('error message');
const ntResultOk = ntOk<number, string>(1);
const ntResultErr = ntErr<number, string>('error message');
const exitSucceed: Exit.Exit<number, string> = Exit.succeed(1);
const exitFail: Exit.Exit<number, string> = Exit.fail('error message');

logTestCases([
    ['rustresult Result.map', [resultOk.map((value) => value * 2), resultErr.map((value) => value * 2)]],
    ['neverthrow Result.map', [ntResultOk.map((value) => value * 2), ntResultErr.map((value) => value * 2)]],
    ['effect Exit.map', [Exit.map(exitSucceed, (value) => value * 2), Exit.map(exitFail, (value) => value * 2)]],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.map', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            result = resultOk.map((value) => value * 2);
            result = resultErr.map((value) => value * 2);
        }
        return result!;
    })
    .add('neverthrow Result.map', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.map((value) => value * 2);
            result = ntResultErr.map((value) => value * 2);
        }
        return result!;
    })
    .add('effect Exit.map', () => {
        let result: Exit.Exit<number, string>;
        for (let i = 0; i < N; i++) {
            result = Exit.map(exitSucceed, (value) => value * 2);
            result = Exit.map(exitFail, (value) => value * 2);
        }
        return result!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.map:
[
  RustlikeResult { _type: 'ok', _value: 2, _error: undefined },
  RustlikeResult {
    _type: 'err',
    _value: undefined,
    _error: 'error message'
  }
]

> neverthrow Result.map:
[ Ok { value: 2 }, Err { error: 'error message' } ]

> effect Exit.map:
[
  { _id: 'Exit', _tag: 'Success', value: 2 },
  {
    _id: 'Exit',
    _tag: 'Failure',
    cause: { _id: 'Cause', _tag: 'Fail', failure: 'error message' }
  }
]

Loop N: 100,000
┌─────────┬─────────────────────────┬──────────────────────┬────────────────────┬────────────────┬───────────────┬─────────┐
│ (index) │ task                    │ mean (ns)            │ median (ns)        │ mean (op/s)    │ median (op/s) │ samples │
├─────────┼─────────────────────────┼──────────────────────┼────────────────────┼────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.map' │ '421045.33 ± 0.49%'  │ '396400.00 ± 0.03' │ '2407 ± 0.45%' │ '2523'        │ 2376    │
│ 1       │ 'neverthrow Result.map' │ '257972.04 ± 0.54%'  │ '238299.97'        │ '3973 ± 0.45%' │ '4196'        │ 3877    │
│ 2       │ 'effect Exit.map'       │ '1843112.89 ± 0.56%' │ '1817899.94'       │ '545 ± 0.50%'  │ '550'         │ 543     │
└─────────┴─────────────────────────┴──────────────────────┴────────────────────┴────────────────┴───────────────┴─────────┘

*/
