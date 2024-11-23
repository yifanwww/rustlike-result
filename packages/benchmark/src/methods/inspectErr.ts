import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, string>(1);
const resultErr = Err('error message');
const ntResultOk = ntOk<number, string>(1);
const ntResultErr = ntErr('error message');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let log: string | undefined;

logTestCases([
    [
        '@rustresult/result Ok.inspectErr',
        resultOk.inspectErr((err) => {
            log = `log something: ${err}`;
        }),
    ],
    [
        '@rustresult/result Err.inspectErr',
        resultErr.inspectErr((err) => {
            log = `log something: ${err}`;
        }),
    ],
    [
        'neverthrow ok.inspectErr simulation',
        ntResultOk.mapErr((err) => {
            log = `log something: ${err}`;
            return err;
        }),
    ],
    [
        'neverthrow err.inspectErr simulation',
        ntResultErr.mapErr((err) => {
            log = `log something: ${err}`;
            return err;
        }),
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.inspectErr', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = resultOk.inspectErr((err) => {
                log = `log something: ${err}`;
            });
        }
        return result!;
    })
    .add('@rustresult/result Err.inspectErr', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = resultErr.inspectErr((err) => {
                log = `log something: ${err}`;
            });
        }
        return result!;
    })
    .add('neverthrow ok.inspectErr simulation', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = ntResultOk.mapErr((err) => {
                log = `log something: ${err}`;
                return err;
            });
        }
        return result!;
    })
    .add('neverthrow err.inspectErr simulation', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = ntResultErr.mapErr((err) => {
                log = `log something: ${err}`;
                return err;
            });
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.inspectErr:
RustlikeResult { _type: 'ok', _value: 1, _error: undefined }

> @rustresult/result Err.inspectErr:
RustlikeResult {
  _type: 'err',
  _value: undefined,
  _error: 'error message'
}

> neverthrow ok.inspectErr simulation:
Ok { value: 1 }

> neverthrow err.inspectErr simulation:
Err { error: 'error message' }

Loop N: 100,000
┌─────────┬────────────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                              │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼────────────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.inspectErr'     │ '73241.94 ± 0.04%'   │ '72900.06'          │ '13659 ± 0.03%'            │ '13717'                   │ 13654   │
│ 1       │ '@rustresult/result Err.inspectErr'    │ '409490.05 ± 0.25%'  │ '393400.07'         │ '2451 ± 0.24%'             │ '2542'                    │ 2443    │
│ 2       │ 'neverthrow ok.inspectErr simulation'  │ '167210.12 ± 0.31%'  │ '175300.00'         │ '6084 ± 0.36%'             │ '5705'                    │ 5981    │
│ 3       │ 'neverthrow err.inspectErr simulation' │ '529828.07 ± 0.50%'  │ '517600.06'         │ '1904 ± 0.38%'             │ '1932'                    │ 1888    │
└─────────┴────────────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
