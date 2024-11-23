import { Err } from '@rustresult/result';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultErr = Err<number, number>(404);

logTestCases([['@rustresult/result Err.expectErr', resultErr.expectErr('error message')]]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench.add('@rustresult/result Err.expectErr', () => {
    let result: number;
    for (let i = 0; i < N; i++) {
        try {
            result = resultErr.expectErr('error message');
        } catch {
            // do nothing
        }
    }
    return result!;
});
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Err.expectErr:
404

Loop N: 100,000
┌─────────┬────────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                          │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼────────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Err.expectErr' │ '147638.71 ± 0.04%'  │ '147599.94'         │ '6775 ± 0.03%'             │ '6775'                    │ 6774    │
└─────────┴────────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
