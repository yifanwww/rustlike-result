import type { Result } from './Result';
import type { ResultAsync } from './ResultAsync';
import { RESULT_ASYNC_SYMBOL, RESULT_SYMBOL } from './symbols';
import type { InternalResult } from './types.internal';

export function isResult(value: unknown): value is Result<unknown, unknown> {
    return value !== undefined && value !== null && (value as InternalResult)._symbol === RESULT_SYMBOL;
}

export function isResultAsync(value: unknown): value is ResultAsync<unknown, unknown> {
    return value !== undefined && value !== null && (value as InternalResult)._symbol === RESULT_ASYNC_SYMBOL;
}
