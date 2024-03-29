import type { Result } from './types';
import type { Optional, ResultType } from './types.internal';

/**
 * The default implementation of interface `Result`.
 *
 * ref:
 * - https://doc.rust-lang.org/std/result/index.html
 * - https://doc.rust-lang.org/std/result/enum.Result.html
 */
export class RustlikeResult<T, E> implements Result<T, E> {
    private readonly _type: ResultType;
    private _value?: T;
    private _error?: E;

    constructor(type: 'ok', value: T);
    constructor(type: 'err', error: E);
    constructor(type: ResultType, value: T | E) {
        if (type === 'ok') {
            this._type = 'ok';
            this._value = value as T;
        } else {
            this._type = 'err';
            this._error = value as E;
        }
    }

    /**
     * Creates a `Result` that contains the success value.
     */
    static Ok<T, E = never>(value: T): Result<T, E> {
        return new RustlikeResult<T, E>('ok', value);
    }

    /**
     * Creates a `Result` that contains the error value.
     */
    static Err<E, T = never>(error: E): Result<T, E> {
        return new RustlikeResult<T, E>('err', error);
    }

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
    isOk(): boolean {
        return this._type === 'ok';
    }

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
    isOkAnd(fn: (value: T) => boolean): boolean {
        return this.isOk() && fn(this._value!);
    }

    /**
     * Asynchronously returns `true` if the result is `Ok` and the value inside of it matches a predicate.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const x: Result<number, string> = Ok(2);
     * assert((await x.isOkAndAsync((value) => Promise.resolve(value > 1))) === true);
     *
     * const y: Result<number, string> = Ok(0);
     * assert((await y.isOkAndAsync((value) => Promise.resolve(value > 1))) === false);
     *
     * const z: Result<number, string> = Err('Some error message');
     * assert((await z.isOkAndAsync((value) => Promise.resolve(value > 1))) === false);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_ok_and
     */
    async isOkAndAsync(fn: (value: T) => boolean | Promise<boolean>): Promise<boolean> {
        return this.isOk() && fn(this._value!);
    }

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
    isErr(): boolean {
        return this._type === 'err';
    }

    /**
     * Returns `true` if the result is `Err` and the value inside of it matches a predicate.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * enum ErrorKind {
     *   NOT_FOUND,
     *   PERMISSION_DENIED,
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
    isErrAnd(fn: (err: E) => boolean): boolean {
        return this.isErr() && fn(this._error!);
    }

    /**
     * Asynchronously returns `true` if the result is `Err` and the value inside of it matches a predicate.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * enum ErrorKind {
     *   NOT_FOUND,
     *   PERMISSION_DENIED,
     * }
     *
     * const x: Result<number, ErrorKind> = Err(ErrorKind.NOT_FOUND);
     * assert((await x.isErrAndAsync((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === true);
     *
     * const y: Result<number, ErrorKind> = Err(ErrorKind.PERMISSION_DENIED);
     * assert((await y.isErrAndAsync((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === false);
     *
     * const z: Result<number, ErrorKind> = Ok(123);
     * assert((await z.isErrAndAsync((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === false);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_err_and
     */
    async isErrAndAsync(fn: (err: E) => boolean | Promise<boolean>): Promise<boolean> {
        return this.isErr() && fn(this._error!);
    }

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
    ok(): Optional<T> {
        return this.isOk() ? this._value : undefined;
    }

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
    err(): Optional<E> {
        return this.isOk() ? undefined : this._error;
    }

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
    map<U>(op: (value: T) => U): Result<U, E> {
        return this.isOk() ? RustlikeResult.Ok(op(this._value!)) : RustlikeResult.Err(this._error!);
    }

    /**
     * Asynchronously maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value,
     * leaving an `Err` value untouched.
     *
     * This function can be used to compose the results of two functions.
     *
     * Examples:
     *
     * ```
     * import { Ok } from 'rustlike-result';
     *
     * const x = await Ok<string, string>('foo').mapAsync((value) => Promise.resolve(value.length));
     * assert(x.ok() === 3);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map
     */
    async mapAsync<U>(op: (value: T) => U | Promise<U>): Promise<Result<U, E>> {
        return this.isOk() ? RustlikeResult.Ok(await op(this._value!)) : RustlikeResult.Err(this._error!);
    }

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
    mapOr<U>(fallback: U, map: (value: T) => U): U {
        return this.isOk() ? map(this._value!) : fallback;
    }

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
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const x: Result<string, string> = Ok('foo');
     * assert((await x.mapOrAsync(42, (value) => value.length)) === 3);
     *
     * const y: Result<string, string> = Err('bar');
     * assert((await y.mapOrAsync(42, (value) => value.length)) === 42);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or
     */
    async mapOrAsync<U>(fallback: U, map: (value: T) => U | Promise<U>): Promise<U> {
        return this.isOk() ? map(this._value!) : fallback;
    }

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
    mapOrElse<U>(fallback: (err: E) => U, map: (value: T) => U): U {
        return this.isOk() ? map(this._value!) : fallback(this._error!);
    }

    /**
     * Asynchronously maps a `Result<T, E>` to `U` by applying fallback function `fallback` to a contained `Err` value,
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
     * assert((await x.mapOrElseAsync(() => Promise.resolve(k * 2), (value) => Promise.resolve(value.length))) === 3);
     *
     * const y: Result<string, string> = Err('bar');
     * assert((await y.mapOrElseAsync(() => Promise.resolve(k * 2), (value) => Promise.resolve(value.length))) === 42);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or_else
     */
    async mapOrElseAsync<U>(fallback: (err: E) => U | Promise<U>, map: (value: T) => U | Promise<U>): Promise<U> {
        return this.isOk() ? map(this._value!) : fallback(this._error!);
    }

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
    mapErr<F>(op: (err: E) => F): Result<T, F> {
        return this.isOk() ? RustlikeResult.Ok(this._value!) : RustlikeResult.Err(op(this._error!));
    }

    /**
     * Asynchronously maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value,
     * leaving an `Ok` value untouched.
     *
     * This function can be used to pass through a successful result while handling an error.
     *
     * Examples:
     *
     * ```
     * import { Err } from 'rustlike-result';
     *
     * const x = await Err(new Error('Some error message')).mapErrAsync((err) => Promise.resolve(err.message));
     * assert(x.err() === 'Some error message');
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_err
     */
    async mapErrAsync<F>(op: (err: E) => F | Promise<F>): Promise<Result<T, F>> {
        return this.isOk() ? RustlikeResult.Ok(this._value!) : RustlikeResult.Err(await op(this._error!));
    }

    /**
     * Calls the provided closure with a reference to the contained value if `Ok`.
     *
     * Examples:
     *
     * ```
     * import { resultify } from 'rustlike-result';
     *
     * const num = resultify
     *     .sync<SyntaxError>()(JSON.parse)('4')
     *     .inspect((value: number) => console.log(`original: ${value}`))
     *     .map((value) => value ** 3)
     *     .expect('failed to parse number');
     * assert(num === 64);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect
     */
    inspect(fn: (value: T) => void): this {
        if (this.isOk()) {
            fn(this.unwrapUnchecked());
        }
        return this;
    }

    /**
     * Asynchronously calls the provided closure with a reference to the contained value if `Ok`.
     *
     * Examples:
     *
     * ```
     * import { resultify } from 'rustlike-result';
     *
     * const num = await resultify
     *     .sync<SyntaxError>()(JSON.parse)('4')
     *     .inspectAsync((value: number) => {
     *         console.log(`original: ${value}`);
     *         return Promise.resolve();
     *     })
     *     .then((result) => result.map((value) => value ** 3))
     *     .then((result) => result.expect('failed to parse number'));
     * assert(num === 64);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect
     */
    async inspectAsync(fn: (value: T) => void | Promise<void>): Promise<this> {
        if (this.isOk()) {
            await fn(this.unwrapUnchecked());
        }
        return this;
    }

    /**
     * Calls the provided closure with a reference to the contained value if `Err`.
     *
     * Examples:
     *
     * ```
     * import { resultify } from 'rustlike-result';
     *
     * const num = resultify
     *     .sync<SyntaxError>()(JSON.parse)('asdf')
     *     .inspectErr((err) => console.log(`failed to parse json string: ${err.message}`));
     * assert(num.err() instanceof SyntaxError);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect_err
     */
    inspectErr(fn: (err: E) => void): this {
        if (this.isErr()) {
            fn(this.unwrapErrUnchecked());
        }
        return this;
    }

    /**
     * Asynchronously calls the provided closure with a reference to the contained value if `Err`.
     *
     * Examples:
     *
     * ```
     * import { resultify } from 'rustlike-result';
     *
     * const num = await resultify
     *     .sync<SyntaxError>()(JSON.parse)('asdf')
     *     .inspectErrAsync((err) => {
     *         console.log(`failed to parse json string: ${err.message}`);
     *         return Promise.resolve();
     *     });
     * assert(num.err() instanceof SyntaxError);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect_err
     */
    async inspectErrAsync(fn: (err: E) => void | Promise<void>): Promise<this> {
        if (this.isErr()) {
            await fn(this.unwrapErrUnchecked());
        }
        return this;
    }

    private _unwrapFailed(msg: string, err: unknown): never {
        throw new Error(`${msg}: ${String(err)}`);
    }

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
    expect(msg: string): T {
        return this.isOk() ? this._value! : this._unwrapFailed(msg, this._error!);
    }

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
    unwrap(): T {
        if (this.isOk()) return this._value!;
        throw new Error(String(this._error!));
    }

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
    expectErr(msg: string): E {
        return this.isErr() ? this._error! : this._unwrapFailed(msg, this._value!);
    }

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
    unwrapErr(): E {
        if (this.isErr()) return this._error!;
        throw new Error(String(this._value!));
    }

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
    unwrapOr(fallback: T): T {
        return this.isOk() ? this._value! : fallback;
    }

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
    unwrapOrElse(op: (err: E) => T): T {
        return this.isOk() ? this._value! : op(this._error!);
    }

    /**
     * Asynchronously returns the contained `Ok` value or computes it from a closure.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok } from 'rustlike-result';
     *
     * const count = (err: string) => Promise.resolve(err.length);
     * assert((await Ok<number, string>(2).unwrapOrElseAsync(count)) === 2);
     * assert((await Err<number, string>('foo').unwrapOrElseAsync(count)) === 3);
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_or_else
     */
    async unwrapOrElseAsync(op: (err: E) => T | Promise<T>): Promise<T> {
        return this.isOk() ? this._value! : op(this._error!);
    }

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
    // TODO: find a way to do the check in debug/development mode.
    unwrapUnchecked(): T {
        return this._value!;
    }

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
    // TODO: find a way to do the check in debug/development mode.
    unwrapErrUnchecked(): E {
        return this._error!;
    }

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
    and<U>(res: Result<U, E>): Result<U, E> {
        return this.isOk() ? res : RustlikeResult.Err(this._error!);
    }

    /**
     * Calls `op` if itself is `Ok`, otherwise returns the `Err` value of itself.
     *
     * This function can be used for control flow based on Result values.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok } from 'rustlike-result';
     *
     * const parseJSON = (json: string) =>
     *     resultify
     *        .sync<SyntaxError>()(JSON.parse)(json)
     *         .mapErr((err) => err.message);
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
    andThen<U>(op: (value: T) => Result<U, E>): Result<U, E> {
        return this.isOk() ? op(this._value!) : RustlikeResult.Err(this._error!);
    }

    /**
     * Asynchronously calls `op` if itself is `Ok`, otherwise returns the `Err` value of itself.
     *
     * This function can be used for control flow based on Result values.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok } from 'rustlike-result';
     *
     * const parseJSON = (json: string) =>
     *     Promise.resolve(
     *         resultify
     *             .sync<SyntaxError>()(JSON.parse)(json)
     *             .mapErr((err) => err.message),
     *     );
     *
     * const x = await Ok<string, string>('2').andThenAsync(parseJSON);
     * assert(x.equal(Ok(2)));
     *
     * const y = await Ok<string, string>('asdf').andThenAsync(parseJSON);
     * assert(y.equal(Err('Unexpected token \'a\', "asdf" is not valid JSON')));
     *
     * const z = await Err('not a valid json string').andThenAsync(parseJSON);
     * assert(z.equal(Err('not a valid json string')));
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.and_then
     */
    async andThenAsync<U>(op: (value: T) => Result<U, E> | Promise<Result<U, E>>): Promise<Result<U, E>> {
        return this.isOk() ? op(this._value!) : RustlikeResult.Err(this._error!);
    }

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
     * assert(x.and(y).equal(Ok('different result type')));
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.or
     */
    or<F>(res: Result<T, F>): Result<T, F> {
        return this.isOk() ? RustlikeResult.Ok(this._value!) : res;
    }

    /**
     * Calls `op` if the result is `Err`, otherwise returns the `Ok` value of self.
     *
     * This function can be used for control flow based on result values.
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
    orElse<F>(op: (err: E) => Result<T, F>): Result<T, F> {
        return this.isOk() ? RustlikeResult.Ok(this._value!) : op(this._error!);
    }

    /**
     * Asynchronously calls `op` if the result is `Err`, otherwise returns the `Ok` value of self.
     *
     * This function can be used for control flow based on result values.
     *
     * Examples:
     *
     * ```
     * import { Err, Ok, type Result } from 'rustlike-result';
     *
     * const sq = (num: number): Promise<Result<number, number>> => Promise.resolve(Ok(num * num));
     * const err = (num: number): Promise<Result<number, number>> => Promise.resolve(Err(num));
     *
     * const x = await Ok(2)
     *     .orElseAsync(sq)
     *     .then((result) => result.orElseAsync(sq));
     * assert(x.equal(Ok(2)));
     *
     * const y = await Err<number, number>(3)
     *     .orElseAsync(sq)
     *     .then((result) => result.orElseAsync(err));
     * assert(y.equal(Ok(9)));
     *
     * const z = await Err<number, number>(3)
     *     .orElseAsync(err)
     *     .then((result) => result.orElseAsync(err));
     * assert(z.equal(Err(3)));
     * ```
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.or_else
     */
    async orElseAsync<F>(op: (err: E) => Result<T, F> | Promise<Result<T, F>>): Promise<Result<T, F>> {
        return this.isOk() ? RustlikeResult.Ok(this._value!) : op(this._error!);
    }

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
    transpose(): Optional<Result<T & NonNullable<unknown>, E>> {
        if (this.isOk()) {
            return this._value === undefined || this._value === null ? undefined : RustlikeResult.Ok(this._value);
        }
        return RustlikeResult.Err(this._error!);
    }

    private static _equal(self: unknown, other: unknown): boolean {
        const isSelfResult = self instanceof RustlikeResult;
        const isOtherResult = other instanceof RustlikeResult;

        if (isSelfResult && isOtherResult) {
            const _self: Result<unknown, unknown> = self;
            const _other: Result<unknown, unknown> = other;

            const isOk = _self.isOk();
            if (isOk !== _other.isOk()) return false;
            return isOk
                ? RustlikeResult._equal(_self.unwrapUnchecked(), _other.unwrapUnchecked())
                : RustlikeResult._equal(_self.unwrapErrUnchecked(), _other.unwrapErrUnchecked());
        }

        return self === other || (Number.isNaN(self) && Number.isNaN(other));
    }

    /**
     * Returns `true` if `self` equals to `other`.
     */
    equal(other: Result<unknown, unknown>): boolean {
        const isOk = this.isOk();
        if (isOk !== other.isOk()) return false;
        return isOk
            ? RustlikeResult._equal(this._value, other.unwrapUnchecked())
            : RustlikeResult._equal(this._error, other.unwrapErrUnchecked());
    }
}
