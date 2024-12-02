import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, number>(2);
const resultErr = Err<number, number>(3);
const ntResultOk = ntOk<number, number>(2);
const ntResultErr = ntErr<number, number>(3);

logTestCases([
    ['rustresult Result.orElse', [resultOk.orElse((err) => Ok(err * 2)), resultErr.orElse((err) => Ok(err * 2))]],
    [
        'neverthrow Result.orElse',
        [ntResultOk.orElse((err) => ntOk(err * 2)), ntResultErr.orElse((err) => ntOk(err * 2))],
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.orElse', () => {
        let result: Result<number, number>;
        for (let i = 0; i < N; i++) {
            result = resultOk.orElse((err) => Ok(err * 2));
            result = resultErr.orElse((err) => Ok(err * 2));
        }
        return result!;
    })
    .add('neverthrow Result.orElse', () => {
        let result: NTResult<number, number>;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.orElse((err) => ntOk(err * 2));
            result = ntResultErr.orElse((err) => ntOk(err * 2));
        }
        return result!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.orElse:
[
  RustlikeResult { _type: 'ok', _value: 2, _error: undefined },
  RustlikeResult { _type: 'ok', _value: 6, _error: undefined }
]

> neverthrow Result.orElse:
[ Ok { value: 2 }, Ok { value: 6 } ]

Loop N: 100,000
┌─────────┬────────────────────────────┬─────────────────────┬─────────────────────┬────────────────┬───────────────┬─────────┐
│ (index) │ task                       │ mean (ns)           │ median (ns)         │ mean (op/s)    │ median (op/s) │ samples │
├─────────┼────────────────────────────┼─────────────────────┼─────────────────────┼────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.orElse' │ '693036.94 ± 0.13%' │ '686800.00'         │ '1444 ± 0.12%' │ '1456'        │ 1443    │
│ 1       │ 'neverthrow Result.orElse' │ '459624.63 ± 0.45%' │ '440650.02 ± 49.98' │ '2193 ± 0.32%' │ '2269'        │ 2176    │
└─────────┴────────────────────────────┴─────────────────────┴─────────────────────┴────────────────┴───────────────┴─────────┘

*/
