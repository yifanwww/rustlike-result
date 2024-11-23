import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import { Exit } from 'effect';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok(1);
const resultErr = Err('error message');
const ntResultOk = ntOk(1);
const ntResultErr = ntErr('error message');
const exitSucceed = Exit.succeed(1);
const exitFail = Exit.fail('error message');

logTestCases([
    ['@rustresult/result Ok.map', resultOk.map((value) => value * 2)],
    ['@rustresult/result Err.map', resultErr.map((value) => value * 2)],
    ['neverthrow ok.map', ntResultOk.map((value) => value * 2)],
    ['neverthrow err.map', ntResultErr.map((value) => value * 2)],
    ['effect Exit.succeed.map', Exit.map(exitSucceed, (value) => value * 2)],
    ['effect Exit.fail.map', Exit.map(exitFail, (value) => value * 2)],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.map', () => {
        let result: Result<number, never>;
        for (let i = 0; i < N; i++) {
            result = resultOk.map((value) => value * 2);
        }
        return result!;
    })
    .add('@rustresult/result Err.map', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            result = resultErr.map((value) => value * 2);
        }
        return result!;
    })
    .add('neverthrow ok.map', () => {
        let result: NTResult<number, never>;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.map((value) => value * 2);
        }
        return result!;
    })
    .add('neverthrow err.map', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.map((value) => value * 2);
        }
        return result!;
    })
    .add('effect Exit.succeed.map', () => {
        let result: Exit.Exit<number, never>;
        for (let i = 0; i < N; i++) {
            result = Exit.map(exitSucceed, (value) => value * 2);
        }
        return result!;
    })
    .add('effect Exit.fail.map', () => {
        let result: Exit.Exit<number, string>;
        for (let i = 0; i < N; i++) {
            result = Exit.map(exitFail, (value) => value * 2);
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.map:
RustlikeResult { _type: 'ok', _value: 2, _error: undefined }

> @rustresult/result Err.map:
RustlikeResult {
  _type: 'err',
  _value: undefined,
  _error: 'error message'
}

> neverthrow ok.map:
Ok { value: 2 }

> neverthrow err.map:
Err { error: 'error message' }

> effect Exit.succeed.map:
{ _id: 'Exit', _tag: 'Success', value: 2 }

> effect Exit.fail.map:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'error message' }
}

Loop N: 100,000
┌─────────┬──────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                    │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼──────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.map'  │ '390347.50 ± 0.46%'  │ '361750.01 ± 49.95' │ '2595 ± 0.42%'             │ '2764'                    │ 2562    │
│ 1       │ '@rustresult/result Err.map' │ '389463.16 ± 0.45%'  │ '361400.01'         │ '2600 ± 0.41%'             │ '2767'                    │ 2568    │
│ 2       │ 'neverthrow ok.map'          │ '242978.55 ± 0.49%'  │ '222200.04'         │ '4205 ± 0.40%'             │ '4500'                    │ 4116    │
│ 3       │ 'neverthrow err.map'         │ '245270.50 ± 0.51%'  │ '222899.91'         │ '4172 ± 0.42%'             │ '4486'                    │ 4078    │
│ 4       │ 'effect Exit.succeed.map'    │ '777466.20 ± 0.37%'  │ '780500.05'         │ '1292 ± 0.37%'             │ '1281'                    │ 1287    │
│ 5       │ 'effect Exit.fail.map'       │ '1109882.13 ± 0.31%' │ '1109699.96'        │ '903 ± 0.30%'              │ '901'                     │ 901     │
└─────────┴──────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
