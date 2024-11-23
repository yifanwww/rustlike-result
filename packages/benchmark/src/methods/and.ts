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
    ['@rustresult/result Ok.and', resultOk.and(Ok(100))],
    ['@rustresult/result Err.and', resultErr.and(Ok(100))],
    ['neverthrow ok.and simulation', ntResultOk.andThen(() => ntOk(100))],
    ['neverthrow err.and simulation', ntResultErr.andThen(() => ntOk(100))],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.and', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            result = resultOk.and(Ok(100));
        }
        return result!;
    })
    .add('@rustresult/result Err.and', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            result = resultErr.and(Ok(100));
        }
        return result!;
    })
    .add('neverthrow ok.and simulation', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.andThen(() => ntOk(100));
        }
        return result!;
    })
    .add('neverthrow err.and simulation', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.andThen(() => ntOk(100));
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.and:
RustlikeResult { _type: 'ok', _value: 100, _error: undefined }

> @rustresult/result Err.and:
RustlikeResult {
  _type: 'err',
  _value: undefined,
  _error: 'error message'
}

> neverthrow ok.and simulation:
Ok { value: 100 }

> neverthrow err.and simulation:
Err { error: 'error message' }

Loop N: 100,000
┌─────────┬─────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                       │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼─────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.and'     │ '337508.64 ± 0.22%'  │ '327300.07'         │ '2973 ± 0.20%'             │ '3055'                    │ 2963    │
│ 1       │ '@rustresult/result Err.and'    │ '368078.69 ± 0.87%'  │ '352900.03'         │ '2746 ± 0.27%'             │ '2834'                    │ 2717    │
│ 2       │ 'neverthrow ok.and simulation'  │ '476937.53 ± 0.57%'  │ '468799.95'         │ '2122 ± 0.42%'             │ '2133'                    │ 2097    │
│ 3       │ 'neverthrow err.and simulation' │ '207994.22 ± 0.49%'  │ '192900.06'         │ '4943 ± 0.45%'             │ '5184'                    │ 4808    │
└─────────┴─────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
