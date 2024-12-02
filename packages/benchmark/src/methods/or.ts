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
    ['rustresult Result.or', [resultOk.or(resultRhs), resultErr.or(resultRhs)]],
    ['neverthrow Result.or simulation', [ntResultOk.orElse(() => ntResultRhs), ntResultErr.orElse(() => ntResultRhs)]],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.or', () => {
        let ret: Result<number, string>;
        for (let i = 0; i < N; i++) {
            ret = resultOk.or(resultRhs);
            ret = resultErr.or(resultRhs);
        }
        return ret!;
    })
    .add('neverthrow Result.or sim', () => {
        let ret: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            ret = ntResultOk.orElse(() => ntResultRhs);
            ret = ntResultErr.orElse(() => ntResultRhs);
        }
        return ret!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.or:
[
  RustlikeResult { _type: 'ok', _value: 1, _error: undefined },
  RustlikeResult { _type: 'ok', _value: 100, _error: undefined }
]

> neverthrow Result.or simulation:
[ Ok { value: 1 }, Ok { value: 100 } ]

Loop N: 100,000
┌─────────┬────────────────────────────┬─────────────────────┬─────────────┬─────────────────┬───────────────┬─────────┐
│ (index) │ task                       │ mean (ns)           │ median (ns) │ mean (op/s)     │ median (op/s) │ samples │
├─────────┼────────────────────────────┼─────────────────────┼─────────────┼─────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.or'     │ '125168.57 ± 0.80%' │ '123000.03' │ '8057 ± 0.11%'  │ '8130'        │ 7990    │
│ 1       │ 'neverthrow Result.or sim' │ '73858.29 ± 0.05%'  │ '73799.97'  │ '13546 ± 0.03%' │ '13550'       │ 13540   │
└─────────┴────────────────────────────┴─────────────────────┴─────────────┴─────────────────┴───────────────┴─────────┘

*/
