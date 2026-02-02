import { Ok } from '@rustresult/result';
import { Bench, hrtimeNow } from 'tinybench';
import { formatTinybenchTask } from '../tinybench.js';
import { formatNum, logEnvironment, logTestCases } from '../utils.js';

await logEnvironment();

const N = 100_000;

const resultOk = Ok<number, number>(200);

logTestCases([
    ['rustresult Result.unwrap', resultOk.unwrap()],
    ['rustresult Result.unwrapUnchecked', resultOk.unwrapUnchecked()],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.unwrap', () => {
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
    .add('rustresult Result.unwrapUnchecked', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultOk.unwrapUnchecked();
        }
        return result!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
