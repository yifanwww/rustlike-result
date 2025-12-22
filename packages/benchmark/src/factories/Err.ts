import type { Result } from '@rustresult/result';
import { Err } from '@rustresult/result';
import { Effect, Exit } from 'effect';
import type { Err as NTErr } from 'neverthrow';
import { err as ntErr } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logEnvironment, logTestCases } from '../utils.js';

logEnvironment();

const N = 100_000;

logTestCases([
    ['rustresult Err', Err('error message')],
    ['neverthrow err', ntErr('error message')],
    ['effect Effect.fail', Effect.fail('error message')],
    ['effect Exit.fail', Exit.fail('error message')],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Err', () => {
        let ret: Result<never, string>;
        for (let i = 0; i < N; i++) {
            ret = Err('error message');
        }
        return ret!;
    })
    .add('neverthrow err', () => {
        let ret: NTErr<never, string>;
        for (let i = 0; i < N; i++) {
            ret = ntErr('error message');
        }
        return ret!;
    })
    .add('effect Effect.fail', () => {
        let ret: Effect.Effect<never, string>;
        for (let i = 0; i < N; i++) {
            ret = Effect.fail('error message');
        }
        return ret!;
    })
    .add('effect Exit.fail', () => {
        let ret: Exit.Exit<never, string>;
        for (let i = 0; i < N; i++) {
            ret = Exit.fail('error message');
        }
        return ret!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
