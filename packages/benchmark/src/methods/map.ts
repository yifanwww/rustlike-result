import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import { Exit } from 'effect';
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
const exitSucceed: Exit.Exit<number, string> = Exit.succeed(1);
const exitFail: Exit.Exit<number, string> = Exit.fail('error message');

logTestCases([
    ['rustresult Result.map', [resultOk.map((value) => value * 2), resultErr.map((value) => value * 2)]],
    ['neverthrow Result.map', [ntResultOk.map((value) => value * 2), ntResultErr.map((value) => value * 2)]],
    ['effect Exit.map', [Exit.map(exitSucceed, (value) => value * 2), Exit.map(exitFail, (value) => value * 2)]],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.map', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            result = resultOk.map((value) => value * 2);
            result = resultErr.map((value) => value * 2);
        }
        return result!;
    })
    .add('neverthrow Result.map', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.map((value) => value * 2);
            result = ntResultErr.map((value) => value * 2);
        }
        return result!;
    })
    .add('effect Exit.map', () => {
        let result: Exit.Exit<number, string>;
        for (let i = 0; i < N; i++) {
            result = Exit.map(exitSucceed, (value) => value * 2);
            result = Exit.map(exitFail, (value) => value * 2);
        }
        return result!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
