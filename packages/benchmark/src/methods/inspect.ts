import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logTestCases } from '../utils.js';

const N = 100_000;

const resultOk = Ok(1);
const resultErr = Err<number, string>('error message');
const ntResultOk = ntOk(1);
const ntResultErr = ntErr<number, string>('error message');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let log: string | undefined;

logTestCases([
    [
        'rustresult Result.inspect',
        [
            resultOk.inspect((value) => {
                log = `log something: ${value}`;
            }),
            resultErr.inspect((value) => {
                log = `log something: ${value}`;
            }),
        ],
    ],
    [
        'neverthrow Result.inspect sim',
        [
            ntResultOk.andTee((value) => {
                log = `log something: ${value}`;
            }),
            ntResultErr.andTee((value) => {
                log = `log something: ${value}`;
            }),
        ],
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.inspect', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = resultOk.inspect((value) => {
                log = `log something: ${value}`;
            });
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = resultErr.inspect((value) => {
                log = `log something: ${value}`;
            });
        }
        return result!;
    })
    .add('neverthrow Result.inspect sim', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = ntResultOk.andTee((value) => {
                log = `log something: ${value}`;
            });
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = ntResultErr.andTee((value) => {
                log = `log something: ${value}`;
            });
        }
        return result!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
