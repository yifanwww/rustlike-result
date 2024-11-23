import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import { Exit } from 'effect';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, number>(200);
const resultErr = Err(400);
const ntResultOk = ntOk<number, number>(200);
const ntResultErr = ntErr(400);
const exitSucceed = Exit.succeed(200);
const exitFail = Exit.fail(400);

logTestCases([
    ['@rustresult/result Ok.mapErr', resultOk.mapErr((err) => `error code: ${err}`)],
    ['@rustresult/result Err.mapErr', resultErr.mapErr((err) => `error code: ${err}`)],
    ['neverthrow ok.mapErr', ntResultOk.mapErr((err) => `error code: ${err}`)],
    ['neverthrow err.mapErr', ntResultErr.mapErr((err) => `error code: ${err}`)],
    ['effect Exit.succeed.mapError', Exit.mapError(exitSucceed, (err: number) => `error code: ${err}`)],
    ['effect Exit.fail.mapError', Exit.mapError(exitFail, (err) => `error code: ${err}`)],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.mapErr', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            result = Ok<number, string>(200).mapErr((err) => `error code: ${err}`);
        }
        return result!;
    })
    .add('@rustresult/result Err.mapErr', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            result = Err(400).mapErr((err) => `error code: ${err}`);
        }
        return result!;
    })
    .add('neverthrow ok.mapErr', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            result = ntOk<number, string>(200).mapErr((err) => `error code: ${err}`);
        }
        return result!;
    })
    .add('neverthrow err.mapErr', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            result = ntErr(400).mapErr((err) => `error code: ${err}`);
        }
        return result!;
    })
    .add('effect Exit.succeed.mapError', () => {
        let result: Exit.Exit<number, string>;
        for (let i = 0; i < N; i++) {
            result = Exit.mapError(exitSucceed, (err: number) => `error code: ${err}`);
        }
        return result!;
    })
    .add('effect Exit.fail.mapError', () => {
        let result: Exit.Exit<number, string>;
        for (let i = 0; i < N; i++) {
            result = Exit.mapError(exitFail, (err) => `error code: ${err}`);
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.mapErr:
RustlikeResult { _type: 'ok', _value: 200, _error: undefined }

> @rustresult/result Err.mapErr:
RustlikeResult {
  _type: 'err',
  _value: undefined,
  _error: 'error code: 400'
}

> neverthrow ok.mapErr:
Ok { value: 200 }

> neverthrow err.mapErr:
Err { error: 'error code: 400' }

> effect Exit.succeed.mapError:
{ _id: 'Exit', _tag: 'Success', value: 200 }

> effect Exit.fail.mapError:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'error code: 400' }
}

Loop N: 100,000
┌─────────┬─────────────────────────────────┬───────────────────────┬──────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                       │ Latency average (ns)  │ Latency median (ns)  │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼─────────────────────────────────┼───────────────────────┼──────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.mapErr'  │ '1111663.00 ± 0.37%'  │ '1100800.04'         │ '902 ± 0.33%'              │ '908'                     │ 900     │
│ 1       │ '@rustresult/result Err.mapErr' │ '1684618.86 ± 0.25%'  │ '1669049.98 ± 49.95' │ '594 ± 0.23%'              │ '599'                     │ 594     │
│ 2       │ 'neverthrow ok.mapErr'          │ '250316.07 ± 0.49%'   │ '230999.95'          │ '4079 ± 0.41%'             │ '4329'                    │ 3995    │
│ 3       │ 'neverthrow err.mapErr'         │ '1258504.28 ± 0.24%'  │ '1254599.93'         │ '796 ± 0.23%'              │ '797'                     │ 795     │
│ 4       │ 'effect Exit.succeed.mapError'  │ '1115966.22 ± 0.31%'  │ '1116699.93'         │ '898 ± 0.31%'              │ '895'                     │ 897     │
│ 5       │ 'effect Exit.fail.mapError'     │ '14170761.97 ± 1.00%' │ '13952700.02'        │ '71 ± 0.90%'               │ '72'                      │ 71      │
└─────────┴─────────────────────────────────┴───────────────────────┴──────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
