import { RustlikeResult } from './result.class';
import type { Result } from './result.interface';

/**
 * Creates a `Result` that contains the success value.
 */
export function Ok<T>(value: T): Result<T, never>;
/**
 * Creates a `Result` that contains the success value.
 */
export function Ok<T, E>(value: T): Result<T, E>;
export function Ok<T, E>(value: T): Result<T, E> {
    return RustlikeResult.Ok(value);
}

/**
 * Creates a `Result` that contains the error value.
 */
export function Err<E>(error: E): Result<never, E>;
/**
 * Creates a `Result` that contains the error value.
 */
export function Err<T, E>(error: E): Result<T, E>;
export function Err<T, E>(error: E): Result<T, E> {
    return RustlikeResult.Err(error);
}
