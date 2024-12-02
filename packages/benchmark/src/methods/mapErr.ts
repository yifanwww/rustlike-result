import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import { Exit } from 'effect';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, number>(200);
const resultErr = Err<number, number>(400);
const ntResultOk = ntOk<number, number>(200);
const ntResultErr = ntErr<number, number>(400);
const exitSucceed: Exit.Exit<number, number> = Exit.succeed(200);
const exitFail: Exit.Exit<number, number> = Exit.fail(400);

logTestCases([
    [
        'rustresult Result.mapErr',
        [resultOk.mapErr((err) => `error code: ${err}`), resultErr.mapErr((err) => `error code: ${err}`)],
    ],
    [
        'neverthrow Result.mapErr',
        [ntResultOk.mapErr((err) => `error code: ${err}`), ntResultErr.mapErr((err) => `error code: ${err}`)],
    ],
    [
        'effect Exit.mapError',
        [
            Exit.mapError(exitSucceed, (err: number) => `error code: ${err}`),
            Exit.mapError(exitFail, (err) => `error code: ${err}`),
        ],
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.mapErr', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            result = resultOk.mapErr((err) => `error code: ${err}`);
            result = resultErr.mapErr((err) => `error code: ${err}`);
        }
        return result!;
    })
    .add('neverthrow Result.mapErr', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.mapErr((err) => `error code: ${err}`);
            result = ntResultErr.mapErr((err) => `error code: ${err}`);
        }
        return result!;
    })
    .add('effect Exit.mapError', () => {
        let result: Exit.Exit<number, string>;
        for (let i = 0; i < N; i++) {
            result = Exit.mapError(exitSucceed, (err: number) => `error code: ${err}`);
            result = Exit.mapError(exitFail, (err) => `error code: ${err}`);
        }
        return result!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.mapErr:
[
  RustlikeResult { _type: 'ok', _value: 200, _error: undefined },
  RustlikeResult {
    _type: 'err',
    _value: undefined,
    _error: 'error code: 400'
  }
]

> neverthrow Result.mapErr:
[ Ok { value: 200 }, Err { error: 'error code: 400' } ]

> effect Exit.mapError:
[
  { _id: 'Exit', _tag: 'Success', value: 200 },
  {
    _id: 'Exit',
    _tag: 'Failure',
    cause: { _id: 'Cause', _tag: 'Fail', failure: 'error code: 400' }
  }
]

Loop N: 100,000
┌─────────┬────────────────────────────┬───────────────────────┬─────────────────────────┬────────────────┬───────────────┬─────────┐
│ (index) │ task                       │ mean (ns)             │ median (ns)             │ mean (op/s)    │ median (op/s) │ samples │
├─────────┼────────────────────────────┼───────────────────────┼─────────────────────────┼────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.mapErr' │ '418859.51 ± 0.49%'   │ '396900.00'             │ '2421 ± 0.45%' │ '2520'        │ 2388    │
│ 1       │ 'neverthrow Result.mapErr' │ '254431.80 ± 0.51%'   │ '232900.02'             │ '4021 ± 0.43%' │ '4294'        │ 3931    │
│ 2       │ 'effect Exit.mapError'     │ '16207970.31 ± 0.55%' │ '16209450.01 ± 1850.01' │ '62 ± 0.54%'   │ '62'          │ 64      │
└─────────┴────────────────────────────┴───────────────────────┴─────────────────────────┴────────────────┴───────────────┴─────────┘

*/
