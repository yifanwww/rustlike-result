import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../tinybench.js';
import { formatNum, logEnvironment, logTestCases } from '../utils.js';

await logEnvironment();

const N = 100_000;

const resultOk = Ok<number, string>(1);
const resultErr = Err<number, string>('error message');
const resultRhs = Ok(100);
const ntResultOk = ntOk<number, string>(1);
const ntResultErr = ntErr<number, string>('error message');
const ntResultRhs = ntOk(100);

logTestCases([
    ['rustresult Result.or', [resultOk.or(resultRhs), resultErr.or(resultRhs)]],
    ['neverthrow Result.or simulation', [ntResultOk.orElse(() => ntResultRhs), ntResultErr.orElse(() => ntResultRhs)]],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.or', () => {
        let ret: Result<number, string>;
        for (let i = 0; i < N; i++) {
            ret = resultOk.or(resultRhs);
            ret = resultErr.or(resultRhs);
        }
        return ret!;
    })
    .add('neverthrow Result.or sim', () => {
        let ret: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            ret = ntResultOk.orElse(() => ntResultRhs);
            ret = ntResultErr.orElse(() => ntResultRhs);
        }
        return ret!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
