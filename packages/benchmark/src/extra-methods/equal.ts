import { Err, Ok } from '@rustresult/result';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../tinybench.js';
import { formatNum, logEnvironment, logTestCases } from '../utils.js';

await logEnvironment();

const N = 100_000;

const resultOk1 = Ok(100);
const resultOk2 = Ok(100);
const resultOk3 = Ok('hello world');
const resultErr1 = Err(200);
const resultErr2 = Err(200);
const resultErr3 = Err('error message');

const resultOk4 = Ok(Ok(100));
const resultOk5 = Ok(Err(100));
const resultOk6 = Ok(Ok('hello world'));
const resultErr4 = Err(Ok(200));
const resultErr5 = Err(Ok(100));
const resultErr6 = Err(Err('error message'));

logTestCases([['rustresult Result.equal', [resultOk1.equal(resultOk2), resultOk1.equal(resultOk3)]]]);

console.log('Loop N:', formatNum(N));

const bench = new Bench({ now: hrtimeNow });
bench
    .add('rustresult Result.equal #1', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = resultOk1.equal(resultOk2);
            ret = resultOk1.equal(resultOk3);
            ret = resultOk2.equal(resultErr1);
            ret = resultErr1.equal(resultOk3);
            ret = resultErr1.equal(resultErr2);
            ret = resultErr1.equal(resultErr3);
        }
        return ret!;
    })
    .add('rustresult Result.equal #2', () => {
        let ret: boolean;
        for (let i = 0; i < N; i++) {
            ret = resultOk4.equal(resultOk5);
            ret = resultOk4.equal(resultOk6);
            ret = resultOk5.equal(resultErr4);
            ret = resultErr4.equal(resultOk6);
            ret = resultErr4.equal(resultErr5);
            ret = resultErr4.equal(resultErr6);
        }
        return ret!;
    });
await bench.run();
console.table(bench.table(formatTinybenchTask));
