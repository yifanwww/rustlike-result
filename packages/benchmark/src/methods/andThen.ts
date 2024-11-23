import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, string>(1);
const resultErr = Err<number, string>('error message');
const ntResultOk = ntOk<number, string>(1);
const ntResultErr = ntErr<number, string>('error message');

logTestCases([
    ['@rustresult/result Ok.andThen', resultOk.andThen((value) => Ok(value * 2))],
    ['@rustresult/result Err.andThen', resultErr.andThen((value) => Ok(value * 2))],
    ['neverthrow ok.andThen', ntResultOk.andThen((value) => ntOk(value * 2))],
    ['neverthrow err.andThen', ntResultErr.andThen((value) => ntOk(value * 2))],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.andThen', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            result = resultOk.andThen((value) => Ok(value * 2));
        }
        return result!;
    })
    .add('@rustresult/result Err.andThen', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            result = resultErr.andThen((value) => Ok(value * 2));
        }
        return result!;
    })
    .add('neverthrow ok.andThen', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.andThen((value) => ntOk(value * 2));
        }
        return result!;
    })
    .add('neverthrow err.andThen', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.andThen((value) => ntOk(value * 2));
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.andThen:
RustlikeResult { _type: 'ok', _value: 2, _error: undefined }

> @rustresult/result Err.andThen:
RustlikeResult {
  _type: 'err',
  _value: undefined,
  _error: 'error message'
}

> neverthrow ok.andThen:
Ok { value: 2 }

> neverthrow err.andThen:
Err { error: 'error message' }

Loop N: 100,000
┌─────────┬──────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                        │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼──────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.andThen'  │ '602016.55 ± 0.35%'  │ '601799.96'         │ '1669 ± 0.31%'             │ '1662'                    │ 1662    │
│ 1       │ '@rustresult/result Err.andThen' │ '363957.53 ± 0.29%'  │ '352200.03'         │ '2760 ± 0.23%'             │ '2839'                    │ 2748    │
│ 2       │ 'neverthrow ok.andThen'          │ '459393.43 ± 0.44%'  │ '441999.91'         │ '2192 ± 0.30%'             │ '2262'                    │ 2177    │
│ 3       │ 'neverthrow err.andThen'         │ '206035.58 ± 0.47%'  │ '189499.97'         │ '4981 ± 0.43%'             │ '5277'                    │ 4854    │
└─────────┴──────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
