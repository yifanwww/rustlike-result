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
    ['rustresult Result.ok', [resultOk.ok(), resultErr.ok()]],
    ['neverthrow Result.ok sim', [ntResultOk.unwrapOr(undefined), ntResultErr.unwrapOr(undefined)]],
    ['effect Exit.ok sim', [Exit.getOrElse(exitSucceed, () => undefined), Exit.getOrElse(exitFail, () => undefined)]],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.ok', () => {
        let ret: number | undefined;
        for (let i = 0; i < N; i++) {
            ret = resultOk.ok();
            ret = resultErr.ok();
        }
        return ret;
    })
    .add('neverthrow Result.ok sim', () => {
        let ret: number | undefined;
        for (let i = 0; i < N; i++) {
            ret = ntResultOk.unwrapOr(undefined);
            ret = ntResultErr.unwrapOr(undefined);
        }
        return ret;
    })
    .add('effect Exit.ok sim', () => {
        let ret: number | undefined;
        for (let i = 0; i < N; i++) {
            ret = Exit.getOrElse(exitSucceed, () => undefined);
            ret = Exit.getOrElse(exitFail, () => undefined);
        }
        return ret;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
