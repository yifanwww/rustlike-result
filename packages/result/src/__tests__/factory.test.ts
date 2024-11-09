import { describe, it } from '@jest/globals';

import { Err, Ok } from '../factory';
import type { Result } from '../Result';

import { expectResult } from './_helpers';

describe(`Test fn \`${Ok.name}\``, () => {
    it('should create `Ok` result', () => {
        const result1 = Ok(1);
        const result2 = Ok<number, string>(1);
        const result3: Result<number, string> = Ok(1);

        const expected = { type: 'ok', value: 1, error: undefined } as const;
        expectResult(result1, expected);
        expectResult(result2, expected);
        expectResult(result3, expected);
    });
});

describe(`Test fn \`${Err.name}\``, () => {
    it('should create `Err` result', () => {
        const result1 = Err('Some error message');
        const result2 = Err<number, string>('Some error message');
        const result3: Result<number, string> = Err('Some error message');

        const expected = { type: 'err', value: undefined, error: 'Some error message' } as const;
        expectResult(result1, expected);
        expectResult(result2, expected);
        expectResult(result3, expected);
    });
});
