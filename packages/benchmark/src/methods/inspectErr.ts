import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../helpers/tinybench.js';
import { formatNum, logEnvironment, logTestCases } from '../utils.js';

logEnvironment();

const N = 100_000;

const resultOk = Ok<number, string>(1);
const resultErr = Err('error message');
const ntResultOk = ntOk<number, string>(1);
const ntResultErr = ntErr('error message');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let log: string | undefined;

logTestCases([
    [
        'rustresult Result.inspectErr',
        [
            resultOk.inspectErr((err) => {
                log = `log something: ${err}`;
            }),
            resultErr.inspectErr((err) => {
                log = `log something: ${err}`;
            }),
        ],
    ],
    [
        'neverthrow Result.inspectErr sim',
        [
            ntResultOk.mapErr((err) => {
                log = `log something: ${err}`;
                return err;
            }),
            ntResultErr.mapErr((err) => {
                log = `log something: ${err}`;
                return err;
            }),
        ],
    ],
]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.inspectErr', () => {
        let result: Result<number, string>;
        for (let i = 0; i < N; i++) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = resultOk.inspectErr((err) => {
                log = `log something: ${err}`;
            });
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = resultErr.inspectErr((err) => {
                log = `log something: ${err}`;
            });
        }
        return result!;
    })
    .add('neverthrow Resulit.inspectErr sim', () => {
        let result: NTResult<number, string>;
        for (let i = 0; i < N; i++) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = ntResultOk.mapErr((err) => {
                log = `log something: ${err}`;
                return err;
            });
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            result = ntResultErr.mapErr((err) => {
                log = `log something: ${err}`;
                return err;
            });
        }
        return result!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
