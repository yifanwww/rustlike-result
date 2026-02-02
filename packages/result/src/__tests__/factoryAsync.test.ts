import { describe, it } from '@jest/globals';
import { Err, Ok } from '../factory.js';
import { ErrAsync, fromPromiseableResult, OkAsync } from '../factoryAsync.js';
import type { ResultAsync } from '../ResultAsync.js';
import { expectResultAsync } from './_helpers.js';

describe(`Test fn \`${OkAsync.name}\``, () => {
    it('should create `OkAsync` result', async () => {
        const result1 = OkAsync(1);
        const result2 = OkAsync<number, string>(1);
        const result3: ResultAsync<number, string> = OkAsync(1);

        const expected = { type: 'ok', value: 1, error: undefined } as const;
        await expectResultAsync(result1, expected);
        await expectResultAsync(result2, expected);
        await expectResultAsync(result3, expected);
    });
});

describe(`Test fn \`${ErrAsync.name}\``, () => {
    it('should create `ErrAsync` result', async () => {
        const result1 = ErrAsync('Some error message');
        const result2 = ErrAsync<number, string>('Some error message');
        const result3: ResultAsync<number, string> = ErrAsync('Some error message');

        const expected = { type: 'err', value: undefined, error: 'Some error message' } as const;
        await expectResultAsync(result1, expected);
        await expectResultAsync(result2, expected);
        await expectResultAsync(result3, expected);
    });
});

describe(`Test fn \`${fromPromiseableResult.name}\``, () => {
    it('should create a `ResultAsync`', async () => {
        const result1 = fromPromiseableResult<number, string>(Ok(1));
        const result2 = fromPromiseableResult<number, string>(Err('Some error message'));
        const result3 = fromPromiseableResult<number, string>(Promise.resolve(Ok(1)));
        const result4 = fromPromiseableResult<number, string>(Promise.resolve(Err('Some error message')));
        const result5 = fromPromiseableResult<number, string>(OkAsync(1));
        const result6 = fromPromiseableResult<number, string>(ErrAsync('Some error message'));

        const expectedOk = { type: 'ok', value: 1, error: undefined } as const;
        const expectedErr = { type: 'err', value: undefined, error: 'Some error message' } as const;
        await expectResultAsync(result1, expectedOk);
        await expectResultAsync(result2, expectedErr);
        await expectResultAsync(result3, expectedOk);
        await expectResultAsync(result4, expectedErr);
        await expectResultAsync(result5, expectedOk);
        await expectResultAsync(result6, expectedErr);
    });
});
