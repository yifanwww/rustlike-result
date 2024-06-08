import { Err, Ok } from './factory';
import type { ResultAsync } from './ResultAsync';
import { RustlikeResultAsync } from './RustlikeResultAsync';

/**
 * Creates a `Result` that contains the success value.
 *
 * Examples:
 * ```ts
 * const result1 = OkAsync(1);
 * const result2 = OkAsync<number, string>(1);
 * const result3: ResultAsync<number, string> = OkAsync(2);
 * ```
 */
export function OkAsync<T, E = never>(value: T | Promise<T>): ResultAsync<T, E> {
    return new RustlikeResultAsync(Promise.resolve(value).then(Ok));
}

/**
 * Creates a `Result` that contains the error value.
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
