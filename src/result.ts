import type { IResult, Optional } from './types';

type ResultType = 'ok' | 'err';

/**
 * `Result` is a type that represents either success (Ok) or failure (Err).
 *
 * Handle Errors with the `Result` type.
 *
 * `Result<T, E>` is used for returning and propagating errors.
 * It is a type with two kinds:
 * - `Result.Ok(T)`, representing success and containing a value
 * - `Result.Err(E)`, representing error and containing an error value.
 *
 * ref:
 * - https://doc.rust-lang.org/std/result/index.html
 * - https://doc.rust-lang.org/std/result/enum.Result.html
 */
export class Result<T, E> implements IResult<T, E> {
    private readonly _type: ResultType;
    private _value?: T;
    private _error?: E;

    private constructor(type: 'ok', value: T);
    private constructor(type: 'err', error: E);
    private constructor(type: ResultType, value: T | E) {
        if (type === 'ok') {
            this._type = 'ok';
            this._value = value as T;
        } else {
            this._type = 'err';
            this._error = value as E;
        }
    }

    /**
     * Contains the success value.
     */
    static Ok<T, E = never>(value: T): IResult<T, E> {
        return new Result<T, E>('ok', value);
    }

    /**
     * Contains the error value.
     */
    static Err<E, T = never>(error: E): IResult<T, E> {
        return new Result<T, E>('err', error);
    }

    /**
     * Returns `true` if the result is `Ok`.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_ok
     */
    isOk(): boolean {
        return this._type === 'ok';
    }

    /**
     * Returns `true` if the result is `Ok` and the value inside of it matches a predicate.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_ok_and
     */
    isOkAnd(fn: (value: T) => boolean): boolean {
        return this.isOk() && fn(this._value!);
    }

    /**
     * Returns `true` if the result is `Err`.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_err
     */
    isErr(): boolean {
        return this._type === 'err';
    }

    /**
     * Returns `true` if the result is `Err` and the value inside of it matches a predicate.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_err_and
     */
    isErrAnd(fn: (err: E) => boolean): boolean {
        return this.isErr() && fn(this._error!);
    }

    /**
     * Converts from `Result<T, E>` to `Optional<T>` and discarding the error, if any.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.ok
     */
    ok(): Optional<T> {
        return this.isOk() ? this._value : undefined;
    }

    /**
     * Converts from `Result<T, E>` to `Optional<E>` and discarding the success value, if any.
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
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map
     */
    map<U>(op: (value: T) => U): IResult<U, E> {
        return this.isOk() ? Result.Ok(op(this._value!)) : Result.Err(this._error!);
    }

    /**
     * Returns the provided `fallback` (if `Err`), or applies a function to the contained value (if `Ok`).
     *
     * Arguments passed to `mapOr` are eagerly evaluated;
     * if you are passing the result of a function call,
     * it is recommended to use `mapOrElse`, which is lazily evaluated.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or
     */
    mapOr<U>(fallback: U, map: (value: T) => U): U {
        return this.isOk() ? map(this._value!) : fallback;
    }

    /**
     * Maps a `Result<T, E>` to `U` by applying fallback function `fallback` to a contained `Err` value,
     * or function `map` to a contained `Ok` value.
     *
     * This function can be used to unpack a successful result while handling an error.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or_else
     */
    mapOrElse<U>(fallback: (err: E) => U, map: (value: T) => U): U {
        return this.isOk() ? map(this._value!) : fallback(this._error!);
    }

    /**
     * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value,
     * leaving an `Ok` value untouched.
     *
     * This function can be used to pass through a successful result while handling an error.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_err
     */
    mapErr<F>(op: (err: E) => F): IResult<T, F> {
        return this.isOk() ? Result.Ok(this._value!) : Result.Err(op(this._error!));
    }

    private _unwrapFailed(msg: string, error: unknown): never {
        throw new Error(`${msg}: ${String(error)}`);
    }

    /**
     * Returns the contained `Ok` value.
     *
     * Throws Error if itself is `Err`, with a error message provided by the `Err`'s value.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.expect
     */
    expect(msg: string): T {
        return this.isOk() ? this._value! : this._unwrapFailed(msg, this._error!);
    }

    /**
     * Returns the contained `Ok` value.
     *
     * Throws Error if itself is `Err`, with a error message provided by the `Err`'s value.
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
     * Throws Error if itself is `Err`, with a error message provided by the `Err`'s value.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.expect_err
     */
    expectErr(msg: string): E {
        return this.isErr() ? this._error! : this._unwrapFailed(msg, this._value!);
    }

    /**
     * Returns the contained `Err` value.
     *
     * Throws Error if itself is `Ok`, with a error message provided by the `Ok`'s value.
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
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_or
     */
    unwrapOr(fallback: T): T {
        return this.isOk() ? this._value! : fallback;
    }

    /**
     * Returns the contained `Ok` value or computes it from a closure.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_or_else
     */
    unwrapOrElse(op: (err: E) => T): T {
        return this.isOk() ? this._value! : op(this._error!);
    }

    /**
     * Returns `res` if itself is `Ok`, otherwise returns the `Err` value of itself.
     *
     * Arguments passed to `and` are eagerly evaluated;
     * if you are passing the result of a function call, it is recommended to use `andThen`, which is lazily evaluated.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.and
     */
    and<U>(res: IResult<U, E>): IResult<U, E> {
        return this.isOk() ? res : Result.Err(this._error!);
    }

    /**
     * Calls `op` if itself is `Ok`, otherwise returns the `Err` value of itself.
     *
     * This function can be used for control flow based on Result values.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.and_then
     */
    andThen<U>(op: (value: T) => IResult<U, E>): IResult<U, E> {
        return this.isOk() ? op(this._value!) : Result.Err(this._error!);
    }

    /**
     * Returns `res` if itself is `Err`, otherwise returns the `Ok` value of itself.
     *
     * Arguments passed to `or` are eagerly evaluated;
     * if you are passing the result of a function call, it is recommended to use `orElse`, which is lazily evaluated.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.or
     */
    or<F>(res: IResult<T, F>): IResult<T, F> {
        return this.isOk() ? Result.Ok(this._value!) : res;
    }

    /**
     * Calls `op` if the result is `Err`, otherwise returns the `Ok` value of self.
     *
     * This function can be used for control flow based on result values.
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.or_else
     */
    orElse<F>(op: (error: E) => IResult<T, F>): IResult<T, F> {
        return this.isOk() ? Result.Ok(this._value!) : op(this._error!);
    }

    /**
     * Transposes a `Result` of an optional value into an optional of a `Result`.
     * - `Ok(undefined | null)` will be mapped to `undefined`.
     * - `Ok(_)` (`Ok(Some(_))` in Rust) will be mapped to `Ok(_)` (`Some(Ok(_))` in Rust).
     * - `Err(_)` will be mapped to `Err(_)` (`Some(Err(_))` in Rust).
     *
     * ref: https://doc.rust-lang.org/std/result/enum.Result.html#method.transpose
     */
    transpose(): Optional<IResult<T & NonNullable<unknown>, E>> {
        if (this.isOk()) {
            return this._value === undefined || this._value === null ? undefined : Result.Ok(this._value);
        }
        return Result.Err(this._error!);
    }

    private static _equal(self: unknown, other: unknown): boolean {
        const isSelfResult = self instanceof Result;
        const isOtherResult = other instanceof Result;

        if (isSelfResult && isOtherResult) {
            const isOk = self.isOk();
            if (isOk !== other.isOk()) return false;
            return isOk ? Result._equal(self._value, other._value) : Result._equal(self._error, other._error);
        }

        return self === other || (Number.isNaN(self) && Number.isNaN(other));
    }

    /**
     * Returns `true` if `self` equals to `other`.
     */
    equal(other: Result<T, E>): boolean {
        const isOk = this.isOk();
        if (isOk !== other.isOk()) return false;
        return isOk ? Result._equal(this._value, other._value!) : Result._equal(this._error, other._error!);
    }
}

export function Ok<T>(value: T): IResult<T, never>;
export function Ok<T, E>(value: T): IResult<T, E>;
export function Ok<T, E>(value: T): IResult<T, E> {
    return Result.Ok(value);
}

export function Err<E>(error: E): IResult<never, E>;
export function Err<T, E>(error: E): IResult<T, E>;
export function Err<T, E>(error: E): IResult<T, E> {
    return Result.Err(error);
}
