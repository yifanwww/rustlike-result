import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok(1);
const resultErr = Err<number, string>('error message');
const ntResultOk = ntOk(1);
const ntResultErr = ntErr<number, string>('error message');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let log: string | undefined;

logTestCases([
    [
        '@rustresult/result Ok.inspect',
        resultOk.inspect((value) => {
            log = `log something: ${value}`;
        }),
    ],
    [
        '@rustresult/result Err.inspect',
        resultErr.inspect((value) => {
            log = `log something: ${value}`;
        }),
    ],
    [
        'neverthrow ok.inspect simulation',
        ntResultOk.andTee((value) => {
            log = `log something: ${value}`;
        }),
    ],
    [
        'neverthrow err.inspect simulation',
        ntResultErr.andTee((value) => {
            log = `log something: ${value}`;
        }),
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.inspect', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = resultOk.inspect((value) => {
                log = `log something: ${value}`;
            });
        }
        return result!;
    })
    .add('@rustresult/result Err.inspect', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = resultErr.inspect((value) => {
                log = `log something: ${value}`;
            });
        }
        return result!;
    })
    .add('neverthrow ok.inspect simulation', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = ntResultOk.andTee((value) => {
                log = `log something: ${value}`;
            });
        }
        return result!;
    })
    .add('neverthrow err.inspect simulation', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = ntResultErr.andTee((value) => {
                log = `log something: ${value}`;
            });
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.inspect:
RustlikeResult { _type: 'ok', _value: 1, _error: undefined }

> @rustresult/result Err.inspect:
RustlikeResult {
  _type: 'err',
  _value: undefined,
  _error: 'error message'
}

> neverthrow ok.inspect simulation:
Ok { value: 1 }

> neverthrow err.inspect simulation:
Err { error: 'error message' }

Loop N: 100,000
┌─────────┬─────────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                           │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼─────────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.inspect'     │ '421456.21 ± 0.36%'  │ '421700.00'         │ '2388 ± 0.31%'             │ '2371'                    │ 2373    │
│ 1       │ '@rustresult/result Err.inspect'    │ '73312.98 ± 0.04%'   │ '72999.95'          │ '13647 ± 0.03%'            │ '13699'                   │ 13641   │
│ 2       │ 'neverthrow ok.inspect simulation'  │ '501486.97 ± 0.21%'  │ '491299.99'         │ '1998 ± 0.18%'             │ '2035'                    │ 1995    │
│ 3       │ 'neverthrow err.inspect simulation' │ '204093.43 ± 0.77%'  │ '199700.00'         │ '5073 ± 0.45%'             │ '5008'                    │ 4900    │
└─────────┴─────────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
