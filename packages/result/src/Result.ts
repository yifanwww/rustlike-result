import type { ResultAsync } from './ResultAsync';
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
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const x: Result<number, string> = Ok(2);
     * assert(x.isOk() === true);
     *
     * const y: Result<number, string> = Err('Some error message');
     * assert(y.isOk() === false);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_ok
     */
    isOk(): this is Result<T, never>;

    /**
     * Returns `true` if the result is `Ok` and the value inside of it matches a predicate.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const x: Result<number, string> = Ok(2);
     * assert(x.isOkAnd((value) => value > 1) === true);
     *
     * const y: Result<number, string> = Ok(0);
     * assert(y.isOkAnd((value) => value > 1) === false);
     *
     * const z: Result<number, string> = Err('Some error message');
     * assert(z.isOkAnd((value) => value > 1) === false);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_ok_and
     */
    isOkAnd(fn: (value: T) => boolean): boolean;

    /**
     * Returns `true` if the result is `Err`.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const x: Result<number, string> = Ok(-3);
     * assert(x.isErr() === false);
     *
     * const y: Result<number, string> = Err('Some error message');
     * assert(y.isErr() === true);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_err
     */
    isErr(): this is Result<never, E>;

    /**
     * Returns `true` if the result is `Err` and the value inside of it matches a predicate.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * enum ErrorKind {
     *     NOT_FOUND,
     *     PERMISSION_DENIED,
     * }
     *
     * const x: Result<number, ErrorKind> = Err(ErrorKind.NOT_FOUND);
     * assert(x.isErrAnd((value) => value === ErrorKind.NOT_FOUND) === true);
     *
     * const y: Result<number, ErrorKind> = Err(ErrorKind.PERMISSION_DENIED);
     * assert(y.isErrAnd((value) => value === ErrorKind.NOT_FOUND) === false);
     *
     * const z: Result<number, ErrorKind> = Ok(123);
     * assert(z.isErrAnd((value) => value === ErrorKind.NOT_FOUND) === false);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_err_and
     */
    isErrAnd(fn: (err: E) => boolean): boolean;

    /**
     * Converts from `Result<T, E>` to `Optional<T>` and discarding the error, if any.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const x: Result<number, string> = Ok(2);
     * assert(x.ok() === 2);
     *
     * const y: Result<number, string> = Err('Some error message');
     * assert(y.ok() === undefined);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.ok
     */
    ok(): Optional<T>;

    /**
     * Converts from `Result<T, E>` to `Optional<E>` and discarding the success value, if any.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const x: Result<number, string> = Ok(2);
     * assert(x.err() === undefined);
     *
     * const y: Result<number, string> = Err('Some error message');
     * assert(y.err() === 'Some error message');
     * ```
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
     * Examples:
     *
     * ```
     * import { Ok, type Result } from 'rustlike-result';
     *
     * const x: Result<string, string> = Ok('foo');
     * assert(x.map((value) => value.length).ok() === 3);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map
     */
    map<U>(op: (value: T) => U): Result<U, E>;

    /**
     * Returns the provided `fallback` (if `Err`), or applies a function to the contained value (if `Ok`).
     *
     * Arguments passed to `mapOr` are eagerly evaluated;
     * if you are passing the result of a function call,
     * it is recommended to use `mapOrElse`, which is lazily evaluated.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const x: Result<string, string> = Ok('foo');
     * assert(x.mapOr(42, (value) => value.length) === 3);
     *
     * const y: Result<string, string> = Err('bar');
     * assert(y.mapOr(42, (value) => value.length) === 42);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or
     */
    mapOr<U>(fallback: U, map: (value: T) => U): U;

    /**
     * Maps a `Result<T, E>` to `U` by applying fallback function `fallback` to a contained `Err` value,
     * or function `map` to a contained `Ok` value.
     *
     * This function can be used to unpack a successful result while handling an error.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const k = 21;
     *
     * const x: Result<string, string> = Ok('foo');
     * assert(x.mapOrElse((err) => k * 2, (value) => value.length) === 3);
     *
     * const y: Result<string, string> = Err('bar');
     * assert(y.mapOrElse((err) => k * 2, (value) => value.length) === 42);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or_else
     */
    mapOrElse<U>(fallback: (err: E) => U, map: (value: T) => U): U;

    /**
     * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value,
     * leaving an `Ok` value untouched.
     *
     * This function can be used to pass through a successful result while handling an error.
     *
     * Examples:
     *
     * ```
     * import { Err, type Result } from 'rustlike-result';
     *
     * const x: Result<number, Error> = Err(new Error('Some error message'));
     * assert(x.mapErr((err) => err.message).err() === 'Some error message');
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_err
     */
    mapErr<F>(op: (err: E) => F): Result<T, F>;

    /**
     * Calls the provided closure with a reference to the contained value if `Ok`.
     *
     * Examples:
     *
     * ```
     * import { resultifySync } from 'rustlike-result';
     *
     * const num = resultifySync<SyntaxError>()(JSON.parse)('4')
     *     .inspect((value: number) => console.log(`original: ${value}`))
     *     .map((value) => value ** 3)
     *     .expect('failed to parse number');
     * assert(num === 64);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect
     */
    inspect(fn: (value: T) => void): this;

    /**
     * Calls the provided closure with a reference to the contained value if `Err`.
     *
     * Examples:
     *
     * ```
     * import { resultifySync } from 'rustlike-result';
     *
     * const num = resultifySync<SyntaxError>()(JSON.parse)('asdf')
     *     .inspectErr((err) => console.log(`failed to parse json string: ${err.message}`));
     * assert(num.err() instanceof SyntaxError);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect_err
     */
    inspectErr(fn: (err: E) => void): this;

    /**
     * Returns the contained `Ok` value.
     *
     * Because this function may throw an error, its use is generally discouraged.
     * Instead, prefer to call `unwrapOr`, `unwrapOrElse`.
     *
     * Throws an Error if itself is `Err`,
     * with an error message including the passed message, and the content of the `Err`.
     *
     * Examples:
     *
     * ```
     * import { Err, type Result } from 'rustlike-result';
     *
     * const x: Result<number, string> = Err('emergency failure');
     * x.expect('Failed to operate'); // throws Error('Failed to operate: emergency failure')
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.expect
     */
    expect(msg: string): T;

    /**
     * Returns the contained `Ok` value.
     *
     * Because this function may throw an error, its use is generally discouraged.
     * Instead, prefer to call `unwrapOr`, `unwrapOrElse`.
     *
     * Throws an Error if itself is `Err`, with an error message provided by the `Err`'s value.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const x: Result<number, string> = Ok(2);
     * assert(x.unwrap() === 2);
     *
     * const y: Result<number, string> = Err('emergency failure');
     * y.unwrap(); // throws Error('emergency failure')
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap
     */
    unwrap(): T;

    /**
     * Returns the contained `Err` value.
     *
     * Throws an Error if itself is `Err`, with an error message provided by the `Ok`'s value.
     *
     * Examples:
     *
     * ```
     * import { Ok, type Result } from 'rustlike-result';
     *
     * const x: Result<number, string> = Ok(10);
     * x.expectErr('Testing expectErr'); // throws Error('Testing expectErr: 10')
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.expect_err
     */
    expectErr(msg: string): E;

    /**
     * Returns the contained `Err` value.
     *
     * Throws an Error if itself is `Ok`, with an error message provided by the `Ok`'s value.
     *
     * Examples:
     *
     * ```
     * import { Ok, type Result } from 'rustlike-result';
     *
     * const x: Result<number, string> = Err('emergency failure');
     * assert(x.unwrapErr() === 'emergency failure');
     *
     * const y: Result<number, string> = Ok(2);
     * y.unwrapErr(); // throws Error(2)
     * ```
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
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const $default = 2;
     * const x: Result<number, string> = Ok(9);
     * assert(x.unwrapOr($default) === 9);
     *
     * const y: Result<number, string> = Err('error');
     * assert(y.unwrapOr($default) === $default);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_or
     */
    unwrapOr(fallback: T): T;

    /**
     * Returns the contained `Ok` value or computes it from a closure.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok } from 'rustlike-result';
     *
     * const count = (err: string) => err.length;
     * assert(Ok<number, string>(2).unwrapOrElse(count) === 2);
     * assert(Err<number, string>('foo').unwrapOrElse(count) === 3);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_or_else
     */
    unwrapOrElse(op: (err: E) => T): T;

    /**
     * Returns the contained `Ok` value, without checking that the value is not an `Err`.
     *
     * **SAFETY**: Calling this method on an `Err` is undefined behavior.
     * The safety contract must be upheld by the caller.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const x: Result<number, string> = Ok(2);
     * assert(x.unwrapUnchecked() === 2);
     *
     * const y: Result<number, string> = Err('emergency failure');
     * y.unwrapUnchecked();
     * ```
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
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const x: Result<number, string> = Ok(2);
     * x.unwrapErrUnchecked();
     *
     * const y: Result<number, string> = Err('emergency failure');
     * assert(y.unwrapErrUnchecked() === 'emergency failure');
     * ```
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
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * let x: Result<number, string>;
     * let y: Result<string, string>;
     *
     * x = Ok(2);
     * y = Err('late error');
     * assert(x.and(y).equal(Err('late error')));
     *
     * x = Err('early error');
     * y = Ok('foo');
     * assert(x.and(y).equal(Err('early error')));
     *
     * x = Err('not a 2');
     * y = Err('late error');
     * assert(x.and(y).equal(Err('not a 2')));
     *
     * x = Ok(2);
     * y = Ok('different result type');
     * assert(x.and(y).equal(Ok('different result type')));
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.and
     */
    and<U>(res: Result<U, E>): Result<U, E>;

    /**
     * Calls `op` if itself is `Ok`, otherwise returns the `Err` value of itself.
     *
     * This function can be used for control flow based on `Result` values.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, resultifySync } from 'rustlike-result';
     *
     * const parseJSON = (json: string) =>
     *     resultifySync<SyntaxError>()(JSON.parse)(json).mapErr((err) => err.message);
     *
     * assert(Ok<string, string>('2').andThen(parseJSON).equal(Ok(2)));
     * assert(
     *     Ok<string, string>('asdf')
     *         .andThen(parseJSON)
     *         .equal(Err('Unexpected token \'a\', "asdf" is not valid JSON')),
     * );
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.and_then
     */
    andThen<U>(op: (value: T) => Result<U, E>): Result<U, E>;

    /**
     * Returns `res` if itself is `Err`, otherwise returns the `Ok` value of itself.
     *
     * Arguments passed to `or` are eagerly evaluated;
     * if you are passing the result of a function call, it is recommended to use `orElse`, which is lazily evaluated.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * let x: Result<number, string>;
     * let y: Result<number, string>;
     *
     * x = Ok(2);
     * y = Err('late error');
     * assert(x.or(y).equal(Ok(2)));
     *
     * x = Err('early error');
     * y = Ok(2);
     * assert(x.or(y).equal(Ok(2)));
     *
     * x = Err('not a 2');
     * y = Err('late error');
     * assert(x.or(y).equal(Err('late error')));
     *
     * x = Ok(2);
     * y = Ok(100);
     * assert(x.or(y).equal(Ok(2)));
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.or
     */
    or<F>(res: Result<T, F>): Result<T, F>;

    /**
     * Calls `op` if the result is `Err`, otherwise returns the `Ok` value of self.
     *
     * This function can be used for control flow based on `Result` values.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const sq = (num: number): Result<number, number> => Ok(num * num);
     * const err = (num: number): Result<number, number> => Err(num);
     *
     * assert(Ok(2).orElse(sq).orElse(sq).equal(Ok(2)));
     * assert(Ok(2).orElse(err).orElse(sq).equal(Ok(2)));
     * assert(Err<number, number>(3).orElse(sq).orElse(err).equal(Ok(9)));
     * assert(Err<number, number>(3).orElse(err).orElse(err).equal(Err(3)));
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.or_else
     */
    orElse<F>(op: (err: E) => Result<T, F>): Result<T, F>;

    /**
     * Transposes a `Result` of an optional value into an optional of a `Result`.
     *
     * `Ok(undefined | null)` will be mapped to `undefined`.
     * `Ok(_)` and `Err(_)` will be mapped to `Ok(_)` and `Err(_)`.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * type SomeErr = unknown;
     *
     * let x: Result<number | undefined | null, SomeErr>;
     * let y: Result<number, SomeErr> | undefined;
     *
     * x = Ok(5);
     * y = Ok(5);
     * assert(x.transpose()!.equal(y));
     *
     * x = Ok(undefined);
     * y = undefined;
     * assert(x.transpose() === y);
     *
     * x = Ok(null);
     * y = undefined;
     * assert(x.transpose() === y);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.transpose
     */
    transpose(): Optional<Result<T & {}, E>>;

    /**
     * Returns `true` if `self` equals to `other`.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok } from 'rustlike-result';
     *
     * assert(Ok(1).equal(Ok(1)));
     * assert(Ok(NaN).equal(Ok(NaN)));
     * assert(Err('err').equal(Err('err')));
     *
     * assert(Ok(1).equal(Ok(2)) === false);
     * assert(Err('err 1').equal(Err(-1)) === false);
     *
     * assert(Ok(Ok(1)).equal(Ok(Ok(1))));
     * assert(Ok(Err('err')).equal(Ok(Err('err'))));
     * assert(Err(Err('err')).equal(Err(Err('err'))));
     * assert(Err(Ok(1)).equal(Err(Ok(1))));
     *
     * assert(Ok(Ok(1)).equal(Ok(Ok(2))) === false);
     * assert(Ok(Ok(1)).equal(Ok(Err('err'))) === false);
     * assert(Err(Ok(1)).equal(Err(Err('err'))) === false);
     *
     * assert(Ok([1]).equal(Ok([1])) === false);
     * assert(Ok({ foo: 1 }).equal(Ok({ foo: 1 })) === false);
     * assert(Ok(Ok([1])).equal(Ok(Ok([1]))) === false);
     * assert(Ok(Ok({ foo: 1 })).equal(Ok(Ok({ foo: 1 }))) === false);
     * ```
     */
    equal(other: Result<unknown, unknown>): boolean;

    /**
     * Converts this result to an async `Result` so it can work in asynchronous code.
     *
     * Examples:
     *
     * ```
     * import { Ok } from 'rustlike-result';
     *
     * function fn(value: number): Promise<number> {
     *     // do something asynchronously
     *     return Promise.resolve(value ** 2);
     * }
     *
     * const num = await Ok<number, string>(3)
     *     .async()
     *     .map(fn)
     *     .inspectErr((err) => {
     *         console.log(err);
     *     })
     *     .ok();
     * assert(num === 9);
     * ```
     */
    async(): ResultAsync<T, E>;
}
