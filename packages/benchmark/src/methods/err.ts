import { Err, Ok } from '@rustresult/result';
import { Cause, Exit } from 'effect';
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
    ['@rustresult/result Ok.err', resultOk.err()],
    ['@rustresult/result Err.err', resultErr.err()],
    [
        'neverthrow ok.err simulation',
        ntResultOk.match(
            () => undefined,
            (err) => err,
        ),
    ],
    [
        'neverthrow err.err simulation',
        ntResultErr.match(
            () => undefined,
            (err) => err,
        ),
    ],
    [
        'effect Exit.succeed.err simulation',
        Exit.match(exitSucceed, {
            onSuccess: () => undefined,
            onFailure: (cause) => (Cause.isFailType(cause) ? cause.error : undefined),
        }),
    ],
    [
        'effect Exit.fail.err simulation',
        Exit.match(exitFail, {
            onSuccess: () => undefined,
            onFailure: (cause) => (Cause.isFailType(cause) ? cause.error : undefined),
        }),
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.err', () => {
        let result: undefined;
        for (let i = 0; i < N; i++) {
            result = resultOk.err();
        }
        return result;
    })
    .add('@rustresult/result Err.err', () => {
        let result: string | undefined;
        for (let i = 0; i < N; i++) {
            result = resultErr.err();
        }
        return result;
    })
    .add('neverthrow ok.err simulation', () => {
        let result: undefined;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.match(
                () => undefined,
                (err) => err,
            );
        }
        return result;
    })
    .add('neverthrow err.err simulation', () => {
        let result: string | undefined;
        for (let i = 0; i < N; i++) {
            result = ntResultErr.match(
                () => undefined,
                (err) => err,
            );
        }
        return result;
    })
    .add('effect Exit.succeed.err simulation', () => {
        let result: undefined;
        for (let i = 0; i < N; i++) {
            result = Exit.match(exitSucceed, {
                onSuccess: () => undefined,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error : undefined),
            });
        }
        return result;
    })
    .add('effect Exit.fail.err simulation', () => {
        let result: string | undefined;
        for (let i = 0; i < N; i++) {
            result = Exit.match(exitFail, {
                onSuccess: () => undefined,
                onFailure: (cause) => (Cause.isFailType(cause) ? cause.error : undefined),
            });
        }
        return result;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.err:
undefined

> @rustresult/result Err.err:
error message

> neverthrow ok.err simulation:
undefined

> neverthrow err.err simulation:
error message

> effect Exit.succeed.err simulation:
undefined

> effect Exit.fail.err simulation:
error message

Loop N: 100,000
┌─────────┬──────────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                            │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼──────────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.err'          │ '24345.79 ± 0.03%'   │ '24299.98'          │ '41102 ± 0.02%'            │ '41152'                   │ 41075   │
│ 1       │ '@rustresult/result Err.err'         │ '24398.85 ± 0.06%'   │ '24299.98'          │ '41063 ± 0.03%'            │ '41152'                   │ 40986   │
│ 2       │ 'neverthrow ok.err simulation'       │ '73268.34 ± 0.03%'   │ '72999.95'          │ '13653 ± 0.03%'            │ '13699'                   │ 13649   │
│ 3       │ 'neverthrow err.err simulation'      │ '73663.74 ± 0.03%'   │ '73400.02'          │ '13579 ± 0.02%'            │ '13624'                   │ 13576   │
│ 4       │ 'effect Exit.succeed.err simulation' │ '965309.84 ± 0.43%'  │ '967200.04'         │ '1041 ± 0.41%'             │ '1034'                    │ 1037    │
│ 5       │ 'effect Exit.fail.err simulation'    │ '1028719.63 ± 0.40%' │ '1032399.89'        │ '976 ± 0.39%'              │ '969'                     │ 973     │
└─────────┴──────────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
