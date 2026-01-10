import { expect } from '@jest/globals';

import type { Result } from '../Result.js';
import type { ResultAsync } from '../ResultAsync.js';
import type { RustlikeResult } from '../RustlikeResult.js';
import type { RustlikeResultAsync } from '../RustlikeResultAsync.js';
import type { ResultType } from '../types.internal.js';

type ResultInstance = RustlikeResult<unknown, unknown>;

interface ExpectedResult {
    type: ResultType;
    value: unknown;
    error: unknown;
}

export function expectResult(result: Result<unknown, unknown>, expected: ExpectedResult) {
    const _result = result as ResultInstance;

    expect(_result['_type']).toBe(expected.type);

    if (typeof expected.value === 'object' && expected.value !== null) {
        expect(_result['_value']).toStrictEqual(expected.value);
    } else {
        expect(_result['_value']).toBe(expected.value);
    }

    if (typeof expected.error === 'object' && expected.error !== null) {
        expect(_result['_error']).toStrictEqual(expected.error);
    } else {
        expect(_result['_error']).toBe(expected.error);
    }
}

export async function expectResultAsync(result: ResultAsync<unknown, unknown>, expected: ExpectedResult) {
    const instance = result as RustlikeResultAsync<unknown, unknown>;

    const type = ((await instance) as ResultInstance)['_type'];
    expect(type).toBe(expected.type);

    const value = ((await instance) as ResultInstance)['_value'];
    if (typeof expected.value === 'object' && expected.value !== null) {
        expect(value).toStrictEqual(expected.value);
    } else {
        expect(value).toBe(expected.value);
    }

    const error = ((await instance) as ResultInstance)['_error'];
    if (typeof expected.error === 'object' && expected.error !== null) {
        expect(error).toStrictEqual(expected.error);
    } else {
        expect(error).toBe(expected.error);
    }
}
