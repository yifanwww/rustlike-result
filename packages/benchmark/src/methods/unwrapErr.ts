import { Err } from '@rustresult/result';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultErr = Err<number, number>(404);

logTestCases([
    ['rustresult Err.unwrapErr', resultErr.unwrapErr()],
    ['rustresult Err.unwrapErrUnchecked', resultErr.unwrapErrUnchecked()],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Err.unwrapErr', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            try {
                result = resultErr.unwrapErr();
            } catch {
                // do nothing
            }
        }
        return result!;
    })
    .add('rustresult Err.unwrapErrUnchecked', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultErr.unwrapErrUnchecked();
        }
        return result!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
