import type { Optional } from './types.internal';

/**
 * The interface of `Result` that defines the methods that `Result` should support.
 *
 * This package includes a default implementation of `Result` and factory functions `Ok` and `Err`,
 * which should meet your requirements in most cases.
 *
 * ref:
 * - https://doc.rust-lang.org/std/result/index.html
 * - https://doc.rust-lang.org/std/result/enum.Result.html
 */
export interface Result<T, E> {
    /**
     * Returns `true` if the result is `Ok`.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_ok
     */
    isOk(): boolean;

    /**
     * Returns `true` if the result is `Ok` and the value inside of it matches a predicate.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_ok_and
     */
    isOkAnd(fn: (value: T) => boolean): boolean;

    /**
     * Asynchronously returns `true` if the result is `Ok` and the value inside of it matches a predicate.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_ok_and
     */
    isOkAndAsync(fn: (value: T) => boolean | Promise<boolean>): Promise<boolean>;

    /**
     * Returns `true` if the result is `Err`.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_err
     */
    isErr(): boolean;

    /**
     * Returns `true` if the result is `Err` and the value inside of it matches a predicate.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_err_and
     */
    isErrAnd(fn: (err: E) => boolean): boolean;

    /**
     * Asynchronously returns `true` if the result is `Err` and the value inside of it matches a predicate.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_err_and
     */
    isErrAndAsync(fn: (err: E) => boolean | Promise<boolean>): Promise<boolean>;

    /**
     * Converts from `Result<T, E>` to `Optional<T>` and discarding the error, if any.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.ok
     */
    ok(): Optional<T>;

    /**
     * Converts from `Result<T, E>` to `Optional<E>` and discarding the success value, if any.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.err
     */
    err(): Optional<E>;

    /**
     * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value,
     * leaving an `Err` value untouched.
     *
     * This function can be used to compose the results of two functions.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map
     */
    map<U>(op: (value: T) => U): Result<U, E>;

    /**
     * Asynchronously maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value,
     * leaving an `Err` value untouched.
     *
     * This function can be used to compose the results of two functions.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map
     */
    mapAsync<U>(op: (value: T) => U | Promise<U>): Promise<Result<U, E>>;

    /**
     * Returns the provided `fallback` (if `Err`), or applies a function to the contained value (if `Ok`).
     *
     * Arguments passed to `mapOr` are eagerly evaluated;
     * if you are passing the result of a function call,
     * it is recommended to use `mapOrElse`, which is lazily evaluated.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or
     */
    mapOr<U>(fallback: U, map: (value: T) => U): U;

    /**
     * Asynchronously returns the provided `fallback` (if `Err`),
     * or applies a function to the contained value (if `Ok`).
     *
     * Arguments passed to `mapOr` are eagerly evaluated;
     * if you are passing the result of a function call,
     * it is recommended to use `mapOrElse`, which is lazily evaluated.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or
     */
    mapOrAsync<U>(fallback: U, map: (value: T) => U | Promise<U>): Promise<U>;

    /**
     * Maps a `Result<T, E>` to `U` by applying fallback function `fallback` to a contained `Err` value,
     * or function `map` to a contained `Ok` value.
     *
     * This function can be used to unpack a successful result while handling an error.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or_else
     */
    mapOrElse<U>(fallback: (err: E) => U, map: (value: T) => U): U;

    /**
     * Asynchronously maps a `Result<T, E>` to `U` by applying fallback function `fallback` to a contained `Err` value,
     * or function `map` to a contained `Ok` value.
     *
     * This function can be used to unpack a successful result while handling an error.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or_else
     */
    mapOrElseAsync<U>(fallback: (err: E) => U | Promise<U>, map: (value: T) => U | Promise<U>): Promise<U>;

    /**
     * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value,
     * leaving an `Ok` value untouched.
     *
     * This function can be used to pass through a successful result while handling an error.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_err
     */
    mapErr<F>(op: (err: E) => F): Result<T, F>;

    /**
     * Asynchronously maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value,
     * leaving an `Ok` value untouched.
     *
     * This function can be used to pass through a successful result while handling an error.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_err
     */
    mapErrAsync<F>(op: (err: E) => F | Promise<F>): Promise<Result<T, F>>;

    /**
     * Calls the provided closure with a reference to the contained value if `Ok`.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect
     */
    inspect(fn: (value: T) => void): this;

    /**
     * Asynchronously calls the provided closure with a reference to the contained value if `Ok`.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect
     */
    inspectAsync(fn: (value: T) => void | Promise<void>): Promise<this>;

    /**
     * Calls the provided closure with a reference to the contained value if `Err`.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect_err
     */
    inspectErr(fn: (err: E) => void): this;

    /**
     * Asynchronously calls the provided closure with a reference to the contained value if `Err`.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect_err
     */
    inspectErrAsync(fn: (err: E) => void | Promise<void>): Promise<this>;

    /**
     * Returns the contained `Ok` value.
     *
     * Throws Error if itself is `Err`, with a error message provided by the `Err`'s value.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.expect
     */
    expect(msg: string): T;

    /**
     * Returns the contained `Ok` value.
     *
     * Throws Error if itself is `Err`, with a error message provided by the `Err`'s value.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap
     */
    unwrap(): T;

    /**
     * Returns the contained `Err` value.
     *
     * Throws Error if itself is `Err`, with a error message provided by the `Err`'s value.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.expect_err
     */
    expectErr(msg: string): E;

    /**
     * Returns the contained `Err` value.
     *
     * Throws Error if itself is `Ok`, with a error message provided by the `Ok`'s value.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_err
     */
    unwrapErr(): E;

    /**
     * Returns the contained `Ok` value or a provided default.
     *
     * Arguments passed to `unwrapOr` are eagerly evaluated;
     * if you are passing the result of a function call,
     * it is recommended to use `unwrapOrElse`, which is lazily evaluated.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_or
     */
    unwrapOr(fallback: T): T;

    /**
     * Returns the contained `Ok` value or computes it from a closure.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_or_else
     */
    unwrapOrElse(op: (err: E) => T): T;

    /**
     * Asynchronously returns the contained `Ok` value or computes it from a closure.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_or_else
     */
    unwrapOrElseAsync(op: (err: E) => T | Promise<T>): Promise<T>;

    /**
     * Returns the contained `Ok` value, without checking that the value is not an `Err`.
     *
     * **SAFETY**: Calling this method on an `Err` is undefined behavior.
     * The safety contract must be upheld by the caller.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_unchecked
     */
    unwrapUnchecked(): T;

    /**
     * Returns the contained `Err` value, without checking that the value is not an `Ok`.
     *
     * **SAFETY**: Calling this method on an `Ok` is undefined behavior.
     * The safety contract must be upheld by the caller.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_err_unchecked
     */
    unwrapErrUnchecked(): E;

    /**
     * Returns `res` if itself is `Ok`, otherwise returns the `Err` value of itself.
     *
     * Arguments passed to `and` are eagerly evaluated;
     * if you are passing the result of a function call, it is recommended to use `andThen`, which is lazily evaluated.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.and
     */
    and<U>(res: Result<U, E>): Result<U, E>;

    /**
     * Calls `op` if itself is `Ok`, otherwise returns the `Err` value of itself.
     *
     * This function can be used for control flow based on Result values.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.and_then
     */
    andThen<U>(op: (value: T) => Result<U, E>): Result<U, E>;

    /**
     * Asynchronously calls `op` if itself is `Ok`, otherwise returns the `Err` value of itself.
     *
     * This function can be used for control flow based on Result values.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.and_then
     */
    andThenAsync<U>(op: (value: T) => Result<U, E> | Promise<Result<U, E>>): Promise<Result<U, E>>;

    /**
     * Returns `res` if itself is `Err`, otherwise returns the `Ok` value of itself.
     *
     * Arguments passed to `or` are eagerly evaluated;
     * if you are passing the result of a function call, it is recommended to use `orElse`, which is lazily evaluated.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.or
     */
    or<F>(res: Result<T, F>): Result<T, F>;

    /**
     * Calls `op` if the result is `Err`, otherwise returns the `Ok` value of self.
     *
     * This function can be used for control flow based on result values.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.or_else
     */
    orElse<F>(op: (err: E) => Result<T, F>): Result<T, F>;

    /**
     * Asynchronously calls `op` if the result is `Err`, otherwise returns the `Ok` value of self.
     *
     * This function can be used for control flow based on result values.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.or_else
     */
    orElseAsync<F>(op: (err: E) => Result<T, F> | Promise<Result<T, F>>): Promise<Result<T, F>>;

    /**
     * Transposes a `Result` of an optional value into an optional of a `Result`.
     * - `Ok(undefined | null)` will be mapped to `undefined`.
     * - `Ok(_)` (`Ok(Some(_))` in Rust) will be mapped to `Ok(_)` (`Some(Ok(_))` in Rust).
     * - `Err(_)` will be mapped to `Err(_)` (`Some(Err(_))` in Rust).
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.transpose
     */
    transpose(): Optional<Result<T & NonNullable<unknown>, E>>;

    /**
     * Returns `true` if `self` equals to `other`.
     */
    equal(other: Result<unknown, unknown>): boolean;
}
