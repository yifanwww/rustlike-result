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
    ['@rustresult/result Ok.or', resultOk.or(Ok(100))],
    ['@rustresult/result Err.or', resultErr.or(Ok(100))],
    ['neverthrow ok.or simulation', ntResultOk.orElse(() => ntOk(100))],
    ['neverthrow err.or simulation', ntResultErr.orElse(() => ntOk(100))],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.or', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            result = resultOk.or(Ok(100));
        }
        return result!;
    })
    .add('@rustresult/result Err.or', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            result = resultErr.or(Ok(100));
        }
        return result!;
    })
    .add('neverthrow ok.or simulation', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.orElse(() => ntOk(100));
        }
        return result!;
    })
    .add('neverthrow err.or simulation', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.orElse(() => ntOk(100));
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.or:
RustlikeResult { _type: 'ok', _value: 1, _error: undefined }

> @rustresult/result Err.or:
RustlikeResult { _type: 'ok', _value: 100, _error: undefined }

> neverthrow ok.or simulation:
Ok { value: 1 }

> neverthrow err.or simulation:
Ok { value: 100 }

Loop N: 100,000
┌─────────┬────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                      │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.or'     │ '351682.70 ± 0.96%'  │ '331900.00'         │ '2892 ± 0.34%'             │ '3013'                    │ 2844    │
│ 1       │ '@rustresult/result Err.or'    │ '341476.61 ± 0.23%'  │ '330600.02'         │ '2939 ± 0.21%'             │ '3025'                    │ 2929    │
│ 2       │ 'neverthrow ok.or simulation'  │ '191653.45 ± 0.57%'  │ '181199.91'         │ '5402 ± 0.49%'             │ '5519'                    │ 5218    │
│ 3       │ 'neverthrow err.or simulation' │ '590790.55 ± 0.54%'  │ '568499.92'         │ '1711 ± 0.46%'             │ '1759'                    │ 1693    │
└─────────┴────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
