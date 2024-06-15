import type { Result } from './Result';
// eslint-disable-next-line import/no-cycle
import { RustlikeResult } from './RustlikeResult';

/**
 * Creates a `Result` that contains the success value.
 *
 * Examples:
 * ```ts
 * const result1 = Ok(1);
 * const result2 = Ok<number, string>(1);
 * const result3: Result<number, string> = Ok(1);
 * ```
 */
export function Ok<T, E = never>(value: T): Result<T, E> {
    return RustlikeResult.Ok(value);
}

/**
 * Creates a `Result` that contains the error value.
 *
 * Examples:
 * ```ts
 * const result = Err('Some error message');
 * ```
 */
export function Err<E>(error: E): Result<never, E>;
/**
 * Creates a `Result` that contains the error value.
 *
 * Examples:
 * ```ts
 * const result1 = Err<number, string>('Some error message');
 * const result2: Result<number, string> = Err('Some error message');
 * ```
 */
export function Err<T, E>(error: E): Result<T, E>;
export function Err<T, E>(error: E): Result<T, E> {
    return RustlikeResult.Err(error);
}
