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
const ntResultOk = ntOk<number, string>(1);
const ntResultErr = ntErr<number, string>('error message');

logTestCases([
    [
        'rustresult Result.andThen',
        [resultOk.andThen((value) => Ok(value * 2)), resultErr.andThen((value) => Ok(value * 2))],
    ],
    [
        'neverthrow Result.andThen',
        [ntResultOk.andThen((value) => ntOk(value * 2)), ntResultErr.andThen((value) => ntOk(value * 2))],
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.andThen', () => {
        let ret: Result<number, string>;
        for (let i = 0; i < N; i++) {
            ret = resultOk.andThen((value) => Ok(value * 2));
            ret = resultErr.andThen((value) => Ok(value * 2));
        }
        return ret!;
    })
    .add('neverthrow Result.andThen', () => {
        let ret: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            ret = ntResultOk.andThen((value) => ntOk(value * 2));
            ret = ntResultErr.andThen((value) => ntOk(value * 2));
        }
        return ret!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
