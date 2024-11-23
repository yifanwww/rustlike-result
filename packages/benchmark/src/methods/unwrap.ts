import { Ok } from '@rustresult/result';
import { Bench, hrtimeNow } from 'tinybench';

import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok<number, number>(200);

logTestCases([
    ['@rustresult/result Ok.unwrap', resultOk.unwrap()],
    ['@rustresult/result Ok.unwrapUnchecked', resultOk.unwrapUnchecked()],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('@rustresult/result Ok.unwrap', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            try {
                result = resultOk.unwrap();
            } catch {
                // do nothing
            }
        }
        return result!;
    })
    .add('@rustresult/result Ok.unwrapUnchecked', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultOk.unwrapUnchecked();
        }
        return result!;
    });
await bench.run();
console.table(bench.table());

/*

> @rustresult/result Ok.unwrap:
200

> @rustresult/result Ok.unwrapUnchecked:
200

Loop N: 100,000
┌─────────┬─────────────────────────────────────────┬──────────────────────┬─────────────────────┬────────────────────────────┬───────────────────────────┬─────────┐
│ (index) │ Task name                               │ Latency average (ns) │ Latency median (ns) │ Throughput average (ops/s) │ Throughput median (ops/s) │ Samples │
├─────────┼─────────────────────────────────────────┼──────────────────────┼─────────────────────┼────────────────────────────┼───────────────────────────┼─────────┤
│ 0       │ '@rustresult/result Ok.unwrap'          │ '173718.71 ± 0.03%'  │ '173300.03'         │ '5757 ± 0.03%'             │ '5770'                    │ 5757    │
│ 1       │ '@rustresult/result Ok.unwrapUnchecked' │ '24527.98 ± 0.09%'   │ '24299.98'          │ '40938 ± 0.04%'            │ '41152'                   │ 40770   │
└─────────┴─────────────────────────────────────────┴──────────────────────┴─────────────────────┴────────────────────────────┴───────────────────────────┴─────────┘

*/
