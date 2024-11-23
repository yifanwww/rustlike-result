import { Ok } from '@rustresult/result';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, number>(200);

logTestCases([['@rustresult/result Ok.expect', resultOk.expect('error message')]]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench.add('@rustresult/result Ok.expect', () => {
    let result: number;
    for (let i = 0; i < N; i++) {
        try {
            result = resultOk.expect('error message');
        } catch {
            // do nothing
        }
    }
    return result!;
});
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.expect:
200

Loop N: 100,000
┌─────────┬────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                      │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.expect' │ '147902.06 ± 0.03%'  │ '147600.05'         │ '6762 ± 0.03%'             │ '6775'                    │ 6762    │
└─────────┴────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
