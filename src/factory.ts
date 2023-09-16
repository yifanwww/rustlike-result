import { RustlikeResult } from './result';
import type { Result } from './types';

/**
 * Creates a `Result` that contains the success value.
 *
 * Examples:
 * ```ts
 * const result = Ok(1);
 * ```
 */
export function Ok<T>(value: T): Result<T, never>;
/**
 * Creates a `Result` that contains the success value.
 *
 * Examples:
 * ```ts
 * const result1 = Ok<number, string>(1);
 * const result2: Result<number, string> = Ok(2);
 * ```
 */
export function Ok<T, E>(value: T): Result<T, E>;
export function Ok<T, E>(value: T): Result<T, E> {
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
