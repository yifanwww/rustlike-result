import type { Result } from '@rustresult/result';
import { Ok } from '@rustresult/result';
import { Effect, Exit } from 'effect';
import type { Ok as NTOk } from 'neverthrow';
import { ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../tinybench.js';
import { formatNum, logEnvironment, logTestCases } from '../utils.js';

await logEnvironment();

const N = 100_000;

logTestCases([
    ['rustresult Ok', Ok(1)],
    ['neverthrow ok', ntOk(1)],
    ['effect Effect.succeed', Effect.succeed(1)],
    ['effect Exit.succeed', Exit.succeed(1)],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Ok', () => {
        let ret: Result<number, never>;
        for (let i = 0; i < N; i++) {
            ret = Ok(1);
        }
        return ret!;
    })
    .add('neverthrow ok', () => {
        let ret: NTOk<number, never>;
        for (let i = 0; i < N; i++) {
            ret = ntOk(1);
        }
        return ret!;
    })
    .add('effect Effect.succeed', () => {
        let ret: Effect.Effect<number, never>;
        for (let i = 0; i < N; i++) {
            ret = Effect.succeed(1);
        }
        return ret!;
    })
    .add('effect Exit.succeed', () => {
        let ret: Exit.Exit<number, never>;
        for (let i = 0; i < N; i++) {
            ret = Exit.succeed(1);
        }
        return ret!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
