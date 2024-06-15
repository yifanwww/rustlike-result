import { Err, Ok } from './factory';
import type { Result } from './Result';
import type { ResultAsync } from './ResultAsync';
import { RustlikeResultAsync } from './RustlikeResultAsync';

/**
 * Creates a `ResultAsync` that contains the success value.
 *
 * Examples:
 * ```ts
 * const result1 = OkAsync(1);
 * const result2 = OkAsync<number, string>(1);
 * const result3: ResultAsync<number, string> = OkAsync(1);
 * ```
 */
export function OkAsync<T, E = never>(value: T | Promise<T>): ResultAsync<T, E> {
    return new RustlikeResultAsync(Promise.resolve(value).then(Ok));
}

/**
 * Creates a `ResultAsync` that contains the error value.
 *
 * Examples:
 * ```ts
 * const result = ErrAsync('Some error message');
 * ```
 */
export function ErrAsync<E>(error: E | Promise<E>): ResultAsync<never, E>;
/**
 * Creates a `ResultAsync` that contains the error value.
 *
 * Examples:
 * ```ts
 * const result1 = ErrAsync<number, string>('Some error message');
 * const result2: ResultAsync<number, string> = ErrAsync('Some error message');
 * ```
 */
export function ErrAsync<T, E>(error: E | Promise<E>): ResultAsync<T, E>;
export function ErrAsync<T, E>(error: E | Promise<E>): ResultAsync<T, E> {
    return new RustlikeResultAsync(Promise.resolve(error).then(Err<T, E>));
}

/**
 * Creates a `ResultAsync` from a promiseable `Result`.
 *
 * Examples:
 * ```ts
 * const result1 = fromPromiseableResult<number, string>(Ok(1));
 * const result2 = fromPromiseableResult<number, string>(Err('Some error message'));
 * const result3 = fromPromiseableResult<number, string>(Promise.resolve(Ok(1)));
 * const result4 = fromPromiseableResult<number, string>(Promise.resolve(Err('Some error message')));
 * const result5 = fromPromiseableResult<number, string>(OkAsync(1));
 * const result6 = fromPromiseableResult<number, string>(ErrAsync('Some error message'));
 * ```
 */
export function fromPromiseableResult<T, E>(
    result: Result<T, E> | Promise<Result<T, E>> | ResultAsync<T, E>,
): ResultAsync<T, E> {
    return new RustlikeResultAsync(result);
}
