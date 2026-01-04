import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../tinybench.js';
import { formatNum, logEnvironment, logTestCases } from '../utils.js';

await logEnvironment();

const N = 100_000;

const resultOk = Ok<number, number>(2);
const resultErr = Err<number, number>(3);
const ntResultOk = ntOk<number, number>(2);
const ntResultErr = ntErr<number, number>(3);

logTestCases([
    ['rustresult Result.orElse', [resultOk.orElse((err) => Ok(err * 2)), resultErr.orElse((err) => Ok(err * 2))]],
    [
        'neverthrow Result.orElse',
        [ntResultOk.orElse((err) => ntOk(err * 2)), ntResultErr.orElse((err) => ntOk(err * 2))],
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.orElse', () => {
        let result: Result<number, number>;
        for (let i = 0; i < N; i++) {
            result = resultOk.orElse((err) => Ok(err * 2));
            result = resultErr.orElse((err) => Ok(err * 2));
        }
        return result!;
    })
    .add('neverthrow Result.orElse', () => {
        let result: NTResult<number, number>;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.orElse((err) => ntOk(err * 2));
            result = ntResultErr.orElse((err) => ntOk(err * 2));
        }
        return result!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
