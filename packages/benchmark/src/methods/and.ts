import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, string>(1);
const resultErr = Err<number, string>('error message');
const resultRhs = Ok(100);
const ntResultOk = ntOk<number, string>(1);
const ntResultErr = ntErr<number, string>('error message');
const ntResultRhs = ntOk(100);

logTestCases([
    ['rustresult Result.and', [resultOk.and(resultRhs), resultErr.and(resultRhs)]],
    ['neverthrow Result.and sim', [ntResultOk.andThen(() => ntResultRhs), ntResultErr.andThen(() => ntResultRhs)]],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.and', () => {
        let ret: Result<number, string>;
        for (let i = 0; i < N; i++) {
            ret = resultOk.and(resultRhs);
            ret = resultErr.and(resultRhs);
        }
        return ret!;
    })
    .add('neverthrow Result.and sim', () => {
        let ret: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            ret = ntResultOk.andThen(() => ntResultRhs);
            ret = ntResultErr.andThen(() => ntResultRhs);
        }
        return ret!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.and:
[
  RustlikeResult { _type: 'ok', _value: 100, _error: undefined },
  RustlikeResult {
    _type: 'err',
    _value: undefined,
    _error: 'error message'
  }
]

> neverthrow Result.and sim:
[ Ok { value: 100 }, Err { error: 'error message' } ]

Loop N: 100,000
┌─────────┬─────────────────────────────┬─────────────────────┬─────────────┬────────────────┬───────────────┬─────────┐
│ (index) │ task                        │ mean (ns)           │ median (ns) │ mean (op/s)    │ median (op/s) │ samples │
├─────────┼─────────────────────────────┼─────────────────────┼─────────────┼────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.and'     │ '288184.39 ± 0.34%' │ '273200.04' │ '3499 ± 0.29%' │ '3660'        │ 3471    │
│ 1       │ 'neverthrow Result.and sim' │ '192495.82 ± 0.31%' │ '199799.95' │ '5268 ± 0.34%' │ '5005'        │ 5195    │
└─────────┴─────────────────────────────┴─────────────────────┴─────────────┴────────────────┴───────────────┴─────────┘

*/
