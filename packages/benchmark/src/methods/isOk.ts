import { Err, Ok } from '@rustresult/result';
import { Exit } from 'effect';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';
import { formatTinybenchTask } from '../tinybench.js';
import { formatNum, logEnvironment, logTestCases } from '../utils.js';

await logEnvironment();

const N = 100_000;

const resultOk = Ok(1);
const resultErr = Err('error message');
const ntResultOk = ntOk(1);
const ntResultErr = ntErr('error message');
const exitSucceed = Exit.succeed(1);
const exitFail = Exit.fail('error message');

logTestCases([
    ['rustresult Result.isOk', [resultOk.isOk(), resultErr.isOk()]],
    ['neverthrow Result.isOk', [ntResultOk.isOk(), ntResultErr.isOk()]],
    ['effect Exit.isSuccess', [Exit.isSuccess(exitSucceed), Exit.isSuccess(exitFail)]],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.isOk', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = resultOk.isOk();
            ret = resultErr.isOk();
        }
        return ret!;
    })
    .add('neverthrow Result.isOk', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = ntResultOk.isOk();
            ret = ntResultErr.isOk();
        }
        return ret!;
    })
    .add('effect Exit.isSuccess', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = Exit.isSuccess(exitSucceed);
            ret = Exit.isSuccess(exitFail);
        }
        return ret!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
