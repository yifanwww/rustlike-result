import { describe, it } from '@jest/globals';

import { ErrAsync, OkAsync } from '../factoryAsync';
import type { ResultAsync } from '../ResultAsync';

import { expectResultAsync } from './_helpers';

describe(`Test fn \`${OkAsync.name}\``, () => {
    it('should create `OkAsync` result', async () => {
        const result1 = OkAsync(1);
        const result2 = OkAsync<number, string>(1);
        const result3: ResultAsync<number, string> = OkAsync(2);

        await expectResultAsync(result1, { type: 'ok', value: 1, error: undefined });
        await expectResultAsync(result2, { type: 'ok', value: 1, error: undefined });
        await expectResultAsync(result3, { type: 'ok', value: 2, error: undefined });
    });
});

describe(`Test fn \`${ErrAsync.name}\``, () => {
    it('should create `ErrAsync` result', async () => {
        const result1 = ErrAsync('Some error message');
        const result2 = ErrAsync<number, string>('Some error message');
        const result3: ResultAsync<number, string> = ErrAsync('Some error message');

        await expectResultAsync(result1, { type: 'err', value: undefined, error: 'Some error message' });
        await expectResultAsync(result2, { type: 'err', value: undefined, error: 'Some error message' });
        await expectResultAsync(result3, { type: 'err', value: undefined, error: 'Some error message' });
    });
});
