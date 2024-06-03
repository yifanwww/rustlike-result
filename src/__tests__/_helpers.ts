import { expect } from '@jest/globals';

import type { Result } from '../Result';
import type { RustlikeResult } from '../RustlikeResult';
import type { ResultType } from '../types.internal';

interface ResultTestDescription {
    type: ResultType;
    value: unknown;
    error: unknown;
}

export function expectResult(result: Result<unknown, unknown>, description: ResultTestDescription) {
    const _result = result as RustlikeResult<unknown, unknown>;
    expect(_result['_type']).toBe(description.type);
    if (typeof description.value === 'object' && description.value !== null) {
        expect(_result['_value']).toStrictEqual(description.value);
    } else {
        expect(_result['_value']).toBe(description.value);
    }
    if (typeof description.error === 'object' && description.error !== null) {
        expect(_result['_error']).toStrictEqual(description.error);
    } else {
        expect(_result['_error']).toBe(description.error);
    }
}
