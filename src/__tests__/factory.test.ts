import { describe, it } from '@jest/globals';

import { Err, Ok } from '../factory';
import type { Result } from '../Result';

import { expectResult } from './_helpers';

describe(`Test fn \`${Ok.name}\``, () => {
    it('should create `Ok` result', () => {
        const result1 = Ok(1);
        const result2 = Ok<number, string>(1);
        const result3: Result<number, string> = Ok(2);

        expectResult(result1, { type: 'ok', value: 1, error: undefined });
        expectResult(result2, { type: 'ok', value: 1, error: undefined });
        expectResult(result3, { type: 'ok', value: 2, error: undefined });
    });
});

describe(`Test fn \`${Err.name}\``, () => {
    it('should create `Err` result', () => {
        const result1 = Err('Some error message');
        const result2 = Err<number, string>('Some error message');
        const result3: Result<number, string> = Err('Some error message');

        expectResult(result1, { type: 'err', value: undefined, error: 'Some error message' });
        expectResult(result2, { type: 'err', value: undefined, error: 'Some error message' });
        expectResult(result3, { type: 'err', value: undefined, error: 'Some error message' });
    });
});
