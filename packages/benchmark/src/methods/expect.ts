import { Ok } from '@rustresult/result';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, number>(200);

logTestCases([['rustresult Result.expect', resultOk.expect('error message')]]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench.add('rustresult Result.expect', () => {
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
console.table(bench.table(formatTinybenchTask));

/*

> rustresult Result.expect:
200

Loop N: 100,000
┌─────────┬────────────────────────────┬─────────────────────┬─────────────┬────────────────┬───────────────┬─────────┐
│ (index) │ task                       │ mean (ns)           │ median (ns) │ mean (op/s)    │ median (op/s) │ samples │
├─────────┼────────────────────────────┼─────────────────────┼─────────────┼────────────────┼───────────────┼─────────┤
│ 0       │ 'rustresult Result.expect' │ '148517.45 ± 0.05%' │ '148399.95' │ '6735 ± 0.04%' │ '6739'        │ 6734    │
└─────────┴────────────────────────────┴─────────────────────┴─────────────┴────────────────┴───────────────┴─────────┘

*/
