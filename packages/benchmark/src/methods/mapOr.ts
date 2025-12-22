import { Err, Ok } from '@rustresult/result';
import { Exit } from 'effect';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logEnvironment, logTestCases } from '../utils.js';

logEnvironment();

const N = 100_000;

const resultOk = Ok<string, string>('foo');
const resultErr = Err<string, string>('bar');
const ntResultOk = ntOk<string, string>('foo');
const ntResultErr = ntErr<string, string>('bar');
const exitSucceed: Exit.Exit<string, string> = Exit.succeed('foo');
const exitFail: Exit.Exit<string, string> = Exit.fail('bar');

logTestCases([
    [
        'rustresult Result.mapOr',
        [resultOk.mapOr(40, (value) => value.length), resultErr.mapOr(40, (value) => value.length)],
    ],
    [
        'neverthrow Result.mapOr sim',
        [ntResultOk.map((value) => value.length).unwrapOr(40), ntResultErr.map((value) => value.length).unwrapOr(40)],
    ],
    [
        'effect Exit.mapOr sim',
        [
            Exit.match(exitSucceed, {
                onSuccess: (value) => value.length,
                onFailure: () => 40,
            }),
            Exit.match(exitFail, {
                onSuccess: (value) => value.length,
                onFailure: () => 40,
            }),
        ],
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.mapOr', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = resultOk.mapOr(40, (value) => value.length);
            result = resultErr.mapOr(40, (value) => value.length);
        }
        return result!;
    })
    .add('neverthrow Result.mapOr sim', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = ntResultOk.map((value) => value.length).unwrapOr(40);
            result = ntResultErr.map((value) => value.length).unwrapOr(40);
        }
        return result!;
    })
    .add('effect Exit.mapOr sim', () => {
        let result: number;
        for (let i = 0; i < N; i++) {
            result = Exit.match(exitSucceed, {
                onSuccess: (value) => value.length,
                onFailure: () => 40,
            });
            result = Exit.match(exitFail, {
                onSuccess: (value: string) => value.length,
                onFailure: () => 40,
            });
        }
        return result!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
