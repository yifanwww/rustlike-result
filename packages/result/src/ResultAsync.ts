import type { Result } from './Result';
import type { Optional } from './types.internal';

/**
 * The interface of async `Result` that defines the methods that async `Result` should support.
 *
 * This package includes a default implementation of async `Result` and factory functions `OkAsync` and `ErrAsync`,
 * which should meet your requirements in most cases.
 *
 * ref:
 * - https://doc.rust-lang.org/std/result/index.html
 * - https://doc.rust-lang.org/std/result/enum.Result.html
 */
export interface ResultAsync<T, E> extends PromiseLike<Result<T, E>> {
    /**
     * Asynchornously returns `true` if the result is `Ok`.
     *
     * Examples:
     *
     * ```
     * import { ErrAsync, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const x: ResultAsync<number, string> = OkAsync(2);
     * assert((await x.isOk()) === true);
     *
     * const y: ResultAsync<number, string> = ErrAsync('Some error message');
     * assert((await y.isOk()) === false);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_ok
     */
    isOk(): Promise<boolean>;

    /**
     * Asynchronously returns `true` if the result is `Ok` and the value inside of it matches a predicate.
     *
     * Examples:
     *
     * ```
     * import { ErrAsync, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const x: ResultAsync<number, string> = OkAsync(2);
     * assert((await x.isOkAnd((value) => Promise.resolve(value > 1))) === true);
     *
     * const y: ResultAsync<number, string> = OkAsync(0);
     * assert((await y.isOkAnd((value) => Promise.resolve(value > 1))) === false);
     *
     * const z: ResultAsync<number, string> = ErrAsync('Some error message');
     * assert((await z.isOkAnd((value) => Promise.resolve(value > 1))) === false);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_ok_and
     */
    isOkAnd(fn: (value: T) => boolean | Promise<boolean>): Promise<boolean>;

    /**
     * Asynchornously returns `true` if the result is `Err`.
     *
     * Examples:
     *
     * ```
     * import { ErrAsync, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const x: ResultAsync<number, string> = OkAsync(-3);
     * assert((await x.isErr()) === false);
     *
     * const y: ResultAsync<number, string> = ErrAsync('Some error message');
     * assert((await y.isErr()) === true);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_err
     */
    isErr(): Promise<boolean>;

    /**
     * Asynchronously returns `true` if the result is `Err` and the value inside of it matches a predicate.
     *
     * Examples:
     *
     * ```
     * import { ErrAsync, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * enum ErrorKind {
     *     NOT_FOUND,
     *     PERMISSION_DENIED,
     * }
     *
     * const x: ResultAsync<number, ErrorKind> = ErrAsync(ErrorKind.NOT_FOUND);
     * assert((await x.isErrAnd((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === true);
     *
     * const y: ResultAsync<number, ErrorKind> = ErrAsync(ErrorKind.PERMISSION_DENIED);
     * assert((await y.isErrAnd((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === false);
     *
     * const z: ResultAsync<number, ErrorKind> = OkAsync(123);
     * assert((await z.isErrAnd((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === false);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_err_and
     */
    isErrAnd(fn: (err: E) => boolean | Promise<boolean>): Promise<boolean>;

    /**
     * Asynchornously converts from `ResultAsync<T, E>` to `Optional<T>` and discarding the error, if any.
     *
     * Examples:
     *
     * ```
     * import { ErrAsync, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const x: ResultAsync<number, string> = OkAsync(2);
     * assert((await x.ok()) === 2);
     *
     * const y: ResultAsync<number, string> = ErrAsync('Some error message');
     * assert((await y.ok()) === undefined);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.ok
     */
    ok(): Promise<Optional<T>>;

    /**
     * Asynchornously converts from `ResultAsync<T, E>` to `Optional<E>` and discarding the success value, if any.
     *
     * Examples:
     *
     * ```
     * import { ErrAsync, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const x: ResultAsync<number, string> = OkAsync(2);
     * assert((await x.err()) === undefined);
     *
     * const y: ResultAsync<number, string> = ErrAsync('Some error message');
     * assert((await y.err()) === 'Some error message');
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.err
     */
    err(): Promise<Optional<E>>;

    /**
     * Asynchronously maps a `ResultAsync<T, E>` to `ResultAsync<U, E>` by applying a function to a contained `Ok`
     * value, leaving an `Err` value untouched.
     *
     * This function can be used to compose the results of two functions.
     *
     * Examples:
     *
     * ```
     * import { OkAsync } from 'rustlike-result';
     *
     * const x = OkAsync<string, string>('foo').map((value) => Promise.resolve(value.length));
     * assert((await x.ok()) === 3);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map
     */
    map<U>(op: (value: T) => U | Promise<U>): ResultAsync<U, E>;

    /**
     * Asynchronously returns the provided `fallback` (if `Err`),
     * or applies a function to the contained value (if `Ok`).
     *
     * Arguments passed to `mapOr` are eagerly evaluated;
     * if you are passing the result of a function call,
     * it is recommended to use `mapOrElse`, which is lazily evaluated.
     *
     * Examples:
     *
     * ```
     * import { ErrAsync, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const x: ResultAsync<string, string> = OkAsync('foo');
     * assert((await x.mapOr(42, (value) => value.length)) === 3);
     *
     * const y: ResultAsync<string, string> = ErrAsync('bar');
     * assert((await y.mapOr(42, (value) => value.length)) === 42);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or
     */
    mapOr<U>(fallback: U, map: (value: T) => U | Promise<U>): Promise<U>;

    /**
     * Asynchronously maps a `ResultAsync<T, E>` to `U` by applying fallback function `fallback` to a contained `Err`
     * value, or function `map` to a contained `Ok` value.
     *
     * This function can be used to unpack a successful result while handling an error.
     *
     * Examples:
     *
     * ```
     * import { ErrAsync, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const k = 21;
     *
     * const x: ResultAsync<string, string> = OkAsync('foo');
     * assert((await x.mapOrElse(() => Promise.resolve(k * 2), (value) => Promise.resolve(value.length))) === 3);
     *
     * const y: ResultAsync<string, string> = ErrAsync('bar');
     * assert((await y.mapOrElse(() => Promise.resolve(k * 2), (value) => Promise.resolve(value.length))) === 42);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or_else
     */
    mapOrElse<U>(fallback: (err: E) => U | Promise<U>, map: (value: T) => U | Promise<U>): Promise<U>;

    /**
     * Asynchronously maps a `ResultAsync<T, E>` to `ResultAsync<T, F>` by applying a function to a contained `Err`
     * value, leaving an `Ok` value untouched.
     *
     * This function can be used to pass through a successful result while handling an error.
     *
     * Examples:
     *
     * ```
     * import { ErrAsync } from 'rustlike-result';
     *
     * const x = ErrAsync(new Error('Some error message')).mapErr((err) => Promise.resolve(err.message));
     * assert((await x.err()) === 'Some error message');
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_err
     */
    mapErr<F>(op: (err: E) => F | Promise<F>): ResultAsync<T, F>;

    /**
     * Asynchronously calls the provided closure with a reference to the contained value if `Ok`.
     *
     * Examples:
     *
     * ```
     * const num = await OkAsync(4)
     *     .inspect((value) => {
     *         console.log(`original: ${value}`);
     *     })
     *     .map((value) => value ** 3)
     *     .expect('Some error message');
     * assert(num === 64);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect
     */
    inspect(fn: (value: T) => void | Promise<void>): ResultAsync<T, E>;

    /**
     * Asynchronously calls the provided closure with a reference to the contained value if `Err`.
     *
     * Examples:
     *
     * ```
     * const result = ErrAsync(new SyntaxError('Some error message')).inspectErr((err) => {
     *     console.log(`failed to do something: ${err.message}`);
     * });
     * assert((await result.err()) instanceof SyntaxError);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect_err
     */
    inspectErr(fn: (err: E) => void | Promise<void>): ResultAsync<T, E>;

    /**
     * Asynchronously returns the contained `Ok` value.
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
     * import { ErrAsync, type ResultAsync } from 'rustlike-result';
     *
     * const x: ResultAsync<number, string> = ErrAsync('emergency failure');
     * await x.expect('Failed to operate'); // throws Error('Failed to operate: emergency failure')
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.expect
     */
    expect(msg: string): Promise<T>;

    /**
     * Asynchronously returns the contained `Ok` value.
     *
     * Because this function may throw an error, its use is generally discouraged.
     * Instead, prefer to call `unwrapOr`, `unwrapOrElse`.
     *
     * Throws an Error if itself is `Err`, with an error message provided by the `Err`'s value.
     *
     * Examples:
     *
     * ```
     * import { ErrAsync, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const x: ResultAsync<number, string> = OkAsync(2);
     * assert((await x.unwrap()) === 2);
     *
     * const y: ResultAsync<number, string> = ErrAsync('emergency failure');
     * await y.unwrap(); // throws Error('emergency failure')
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap
     */
    unwrap(): Promise<T>;

    /**
     * Asynchronously returns the contained `Err` value.
     *
     * Throws an Error if itself is `Err`, with an error message provided by the `Ok`'s value.
     *
     * Examples:
     *
     * ```
     * import { OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const x: ResultAsync<number, string> = OkAsync(10);
     * await x.expectErr('Testing expectErr'); // throws Error('Testing expectErr: 10')
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.expect_err
     */
    expectErr(msg: string): Promise<E>;

    /**
     * Asynchronously returns the contained `Err` value.
     *
     * Throws an Error if itself is `Ok`, with an error message provided by the `Ok`'s value.
     *
     * Examples:
     *
     * ```
     * import { OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const x: ResultAsync<number, string> = Err('emergency failure');
     * assert((await x.unwrapErr()) === 'emergency failure');
     *
     * const y: ResultAsync<number, string> = OkAsync(2);
     * await y.unwrapErr(); // throws Error(2)
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_err
     */
    unwrapErr(): Promise<E>;

    /**
     * Asynchronously returns the contained `Ok` value or a provided default.
     *
     * Arguments passed to `unwrapOr` are eagerly evaluated;
     * if you are passing the result of a function call,
     * it is recommended to use `unwrapOrElse`, which is lazily evaluated.
     *
     * Examples:
     *
     * ```
     * import { ErrAsync, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const $default = 2;
     * const x: ResultAsync<number, string> = OkAsync(9);
     * assert((await x.unwrapOr($default)) === 9);
     *
     * const y: ResultAsync<number, string> = ErrAsync('error');
     * assert((await y.unwrapOr($default)) === $default);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_or
     */
    unwrapOr(fallback: T): Promise<T>;

    /**
     * Asynchronously returns the contained `Ok` value or computes it from a closure.
     *
     * Examples:
     *
     * ```
     * import { ErrAsync, OkAsync } from 'rustlike-result';
     *
     * const count = (err: string) => Promise.resolve(err.length);
     * assert((await OkAsync<number, string>(2).unwrapOrElse(count)) === 2);
     * assert((await ErrAsync<number, string>('foo').unwrapOrElse(count)) === 3);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_or_else
     */
    unwrapOrElse(op: (err: E) => T | Promise<T>): Promise<T>;

    /**
     * Asynchronously returns the contained `Ok` value, without checking that the value is not an `Err`.
     *
     * **SAFETY**: Calling this method on an `Err` is undefined behavior.
     * The safety contract must be upheld by the caller.
     *
     * Examples:
     *
     * ```
     * import { ErrAsync, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const x: ResultAsync<number, string> = OkAsync(2);
     * assert((await x.unwrapUnchecked()) === 2);
     *
     * const y: ResultAsync<number, string> = ErrAsync('emergency failure');
     * await y.unwrapUnchecked();
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_unchecked
     */
    unwrapUnchecked(): Promise<T>;

    /**
     * Asynchronously returns the contained `Err` value, without checking that the value is not an `Ok`.
     *
     * **SAFETY**: Calling this method on an `Ok` is undefined behavior.
     * The safety contract must be upheld by the caller.
     *
     * Examples:
     *
     * ```
     * import { ErrAsync, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const x: ResultAsync<number, string> = OkAsync(2);
     * await x.unwrapErrUnchecked();
     *
     * const y: ResultAsync<number, string> = ErrAsync('emergency failure');
     * assert((await y.unwrapErrUnchecked()) === 'emergency failure');
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_err_unchecked
     */
    unwrapErrUnchecked(): Promise<E>;

    /**
     * Asynchronously returns `res` if itself is `Ok`, otherwise returns the `Err` value of itself.
     *
     * Arguments passed to `and` are eagerly evaluated;
     * if you are passing the result of a function call, it is recommended to use `andThen`, which is lazily evaluated.
     *
     * Examples:
     *
     * ```
     * import { Err, ErrAsync, Ok, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * let x: ResultAsync<number, string>;
     * let y: ResultAsync<string, string>;
     *
     * x = OkAsync(2);
     * y = ErrAsync('late error');
     * assert(await x.and(y).equal(Err('late error')));
     *
     * x = ErrAsync('early error');
     * y = OkAsync('foo');
     * assert(await x.and(y).equal(Err('early error')));
     *
     * x = ErrAsync('not a 2');
     * y = ErrAsync('late error');
     * assert(await x.and(y).equal(Err('not a 2')));
     *
     * x = OkAsync(2);
     * y = OkAsync('different result type');
     * assert(await x.and(y).equal(Ok('different result type')));
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.and
     */
    and<U>(res: Result<U, E> | Promise<Result<U, E>> | ResultAsync<U, E>): ResultAsync<U, E>;

    /**
     * Asynchronously calls `op` if itself is `Ok`, otherwise returns the `Err` value of itself.
     *
     * This function can be used for control flow based on `ResultAsync` values.
     *
     * Examples:
     *
     * ```
     * import { Err, ErrAsync, Ok, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const sq = (num: number): ResultAsync<number, number> => OkAsync(num * num);
     * const err = (num: number): ResultAsync<number, number> => ErrAsync(num);
     *
     * const x = OkAsync<number, number>(2).andThen(sq).andThen(sq);
     * assert(await x.equal(Ok(16)));
     *
     * const y = OkAsync<number, number>(2).andThen(sq).andThen(err);
     * assert(await y.equal(Err(4)));
     *
     * const z = OkAsync<number, number>(2).andThen(err).andThen(err);
     * assert(await z.equal(Err(2)));
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.and_then
     */
    andThen<U>(op: (value: T) => Result<U, E> | Promise<Result<U, E>> | ResultAsync<U, E>): ResultAsync<U, E>;

    /**
     * Asynchronously returns `res` if itself is `Err`, otherwise returns the `Ok` value of itself.
     *
     * Arguments passed to `or` are eagerly evaluated;
     * if you are passing the result of a function call, it is recommended to use `orElse`, which is lazily evaluated.
     *
     * Examples:
     *
     * ```
     * import { Err, ErrAsync, Ok, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * let x: ResultAsync<number, string>;
     * let y: ResultAsync<number, string>;
     *
     * x = OkAsync(2);
     * y = ErrAsync('late error');
     * assert(await x.or(y).equal(Ok(2)));
     *
     * x = ErrAsync('early error');
     * y = OkAsync(2);
     * assert(await x.or(y).equal(Ok(2)));
     *
     * x = ErrAsync('not a 2');
     * y = ErrAsync('late error');
     * assert(await x.or(y).equal(Err('late error')));
     *
     * x = OkAsync(2);
     * y = OkAsync(100);
     * assert(await x.or(y).equal(Ok(2)));
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.or
     */
    or<F>(res: Result<T, F> | Promise<Result<T, F>> | ResultAsync<T, F>): ResultAsync<T, F>;

    /**
     * Asynchronously calls `op` if the result is `Err`, otherwise returns the `Ok` value of self.
     *
     * This function can be used for control flow based on `ResultAsync` values.
     *
     * Examples:
     *
     * ```
     * import { Err, ErrAsync, Ok, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * const sq = (num: number): ResultAsync<number, number> => OkAsync(num * num);
     * const err = (num: number): ResultAsync<number, number> => ErrAsync(num);
     *
     * const x = OkAsync(2).orElse(sq).orElse(sq);
     * assert(await x.equal(Ok(2)));
     *
     * const y = ErrAsync<number, number>(3).orElse(sq).orElse(err);
     * assert(await y.equal(Ok(9)));
     *
     * const z = ErrAsync<number, number>(3).orElse(err).orElse(err);
     * assert(await z.equal(Err(3)));
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.or_else
     */
    orElse<F>(op: (err: E) => Result<T, F> | Promise<Result<T, F>> | ResultAsync<T, F>): ResultAsync<T, F>;

    /**
     * Asynchronously transposes a `ResultAsync` of an optional value into an optional of a `ResultAsync`.
     *
     * `OkAsync(undefined | null)` will be mapped to `Promise<undefined>`.
     * `OkAsync(_)` and `ErrAsync(_)` will be mapped to `OkAsync(_)` and `ErrAsync(_)`.
     *
     * Examples:
     *
     * ```
     * import { OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * type SomeErr = unknown;
     *
     * let x: ResultAsync<number | undefined | null, SomeErr>;
     * let y: ResultAsync<number, SomeErr> | undefined;
     *
     * x = OkAsync(5);
     * y = OkAsync(5);
     * assert(await x.transpose()!.equal(y));
     *
     * x = OkAsync(undefined);
     * y = undefined;
     * assert((await x.transpose()) === y);
     *
     * x = OkAsync(null);
     * y = undefined;
     * assert((await x.transpose()) === y);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.transpose
     */
    transpose(): Promise<Optional<Result<T & {}, E>>>;

    /**
     * Asynchronously returns `true` if `self` equals to `other`.
     *
     * Examples:
     *
     * ```
     * import { Err, ErrAsync, Ok, OkAsync, type ResultAsync } from 'rustlike-result';
     *
     * assert(await OkAsync(1).equal(Ok(1)));
     * assert(await OkAsync(1).equal(Promise.resolve(Ok(1))));
     * assert(await OkAsync(1).equal(OkAsync(1)));
     *
     * assert((await OkAsync(1).equal(Ok(2))) === false);
     * assert((await OkAsync(1).equal(Promise.resolve(Ok(2)))) === false);
     * assert((await OkAsync(1).equal(OkAsync(2))) === false);
     *
     * assert(await OkAsync(Ok(1)).equal(Ok(Ok(1))));
     * assert(await OkAsync(Ok(1)).equal(Ok(OkAsync(1))));
     * assert(await OkAsync(Ok(1)).equal(OkAsync(OkAsync(1))));
     * assert(await OkAsync(OkAsync(1)).equal(OkAsync(Ok(1))));
     *
     * assert((await OkAsync([1]).equal(Ok([1]))) === false);
     * assert((await OkAsync({ foo: 1 }).equal(Promise.resolve(Ok({ foo: 1 })))) === false);
     * assert((await ErrAsync({ msg: 'err' }).equal(ErrAsync({ msg: 'err' }))) === false);
     *
     * assert((await OkAsync(Ok([1])).equal(Ok(Ok([1])))) === false);
     * assert((await OkAsync(Ok([1])).equal(OkAsync(OkAsync([1])))) === false);
     * assert((await OkAsync(OkAsync({ foo: 1 })).equal(OkAsync(OkAsync({ foo: 1 })))) === false);
     * ```
     */
    equal(
        other: Result<unknown, unknown> | Promise<Result<unknown, unknown>> | ResultAsync<unknown, unknown>,
    ): Promise<boolean>;
}
