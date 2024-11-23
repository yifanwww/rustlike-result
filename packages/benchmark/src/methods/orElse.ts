import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, number>(2);
const resultErr = Err<number, number>(3);
const ntResultOk = ntOk<number, number>(2);
const ntResultErr = ntErr<number, number>(3);

logTestCases([
    ['@rustresult/result Ok.orElse', resultOk.orElse((err) => Ok(err * 2))],
    ['@rustresult/result Err.orElse', resultErr.orElse((err) => Ok(err * 2))],
    ['neverthrow ok.orElse', ntResultOk.orElse((err) => ntOk(err * 2))],
    ['neverthrow err.orElse', ntResultErr.orElse((err) => ntOk(err * 2))],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.orElse', () => {
        let result: Result<number, number>;
        for (let i = 0; i < N; i++) {
            result = resultOk.orElse((err) => Ok(err * 2));
        }
        return result!;
    })
    .add('@rustresult/result Err.orElse', () => {
        let result: Result<number, number>;
        for (let i = 0; i < N; i++) {
            result = resultErr.orElse((err) => Ok(err * 2));
        }
        return result!;
    })
    .add('neverthrow ok.orElse', () => {
        let result: NTResult<number, number>;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.orElse((err) => ntOk(err * 2));
        }
        return result!;
    })
    .add('neverthrow err.orElse', () => {
        let result: NTResult<number, number>;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.orElse((err) => ntOk(err * 2));
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.orElse:
RustlikeResult { _type: 'ok', _value: 2, _error: undefined }

> @rustresult/result Err.orElse:
RustlikeResult { _type: 'ok', _value: 6, _error: undefined }

> neverthrow ok.orElse:
Ok { value: 2 }

> neverthrow err.orElse:
Ok { value: 6 }

Loop N: 100,000
┌─────────┬─────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                       │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼─────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.orElse'  │ '420072.32 ± 0.44%'  │ '410200.00'         │ '2400 ± 0.33%'             │ '2438'                    │ 2381    │
│ 1       │ '@rustresult/result Err.orElse' │ '662216.88 ± 0.52%'  │ '648000.00'         │ '1524 ± 0.46%'             │ '1543'                    │ 1511    │
│ 2       │ 'neverthrow ok.orElse'          │ '210121.24 ± 0.46%'  │ '210699.98 ± 0.06'  │ '4863 ± 0.41%'             │ '4746'                    │ 4760    │
│ 3       │ 'neverthrow err.orElse'         │ '666547.37 ± 0.99%'  │ '660200.00'         │ '1544 ± 0.81%'             │ '1515'                    │ 1501    │
└─────────┴─────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
