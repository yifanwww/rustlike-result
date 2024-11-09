import type { Result } from './Result';
import type { ResultAsync } from './ResultAsync';
// eslint-disable-next-line import/no-cycle
import { RustlikeResultAsync } from './RustlikeResultAsync';
import type { Optional, ResultType } from './types.internal';

/**
 * DO NOT USE THIS CLASS. This is for internal use.
 */
export class RustlikeResult<T, E> implements Result<T, E> {
    private readonly _type: ResultType;
    private readonly _value?: T;
    private readonly _error?: E;

    constructor(type: 'ok', value: T);
    constructor(type: 'err', error: E);
    constructor(type: ResultType, value: T | E) {
        this._type = type;
        if (type === 'ok') {
            this._value = value as T;
            this._error = undefined;
        } else {
            this._value = undefined;
            this._error = value as E;
        }
    }

    /**
     * Creates a `Result` that contains the success value.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static Ok<T, E = never>(value: T): Result<T, E> {
        return new RustlikeResult<T, E>('ok', value);
    }

    /**
     * Creates a `Result` that contains the error value.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static Err<E, T = never>(error: E): Result<T, E> {
        return new RustlikeResult<T, E>('err', error);
    }

    isOk(): this is Result<T, never> {
        return this._type === 'ok';
    }

    isOkAnd(fn: (value: T) => boolean): boolean {
        return this.isOk() && fn(this._value!);
    }

    isErr(): this is Result<never, E> {
        return this._type === 'err';
    }

    isErrAnd(fn: (err: E) => boolean): boolean {
        return this.isErr() && fn(this._error!);
    }

    ok(): Optional<T> {
        return this.isOk() ? this._value : undefined;
    }

    err(): Optional<E> {
        return this.isOk() ? undefined : this._error;
    }

    map<U>(op: (value: T) => U): Result<U, E> {
        return this.isOk() ? RustlikeResult.Ok(op(this._value!)) : RustlikeResult.Err(this._error!);
    }

    mapOr<U>(fallback: U, map: (value: T) => U): U {
        return this.isOk() ? map(this._value!) : fallback;
    }

    mapOrElse<U>(fallback: (err: E) => U, map: (value: T) => U): U {
        return this.isOk() ? map(this._value!) : fallback(this._error!);
    }

    mapErr<F>(op: (err: E) => F): Result<T, F> {
        return this.isOk() ? RustlikeResult.Ok(this._value!) : RustlikeResult.Err(op(this._error!));
    }

    inspect(fn: (value: T) => void): this {
        if (this.isOk()) {
            fn(this._value!);
        }
        return this;
    }

    inspectErr(fn: (err: E) => void): this {
        if (this.isErr()) {
            fn(this._error!);
        }
        return this;
    }

    private _unwrapFailed(msg: string, err: unknown): never {
        throw new Error(`${msg}: ${String(err)}`);
    }

    expect(msg: string): T {
        return this.isOk() ? this._value! : this._unwrapFailed(msg, this._error!);
    }

    unwrap(): T {
        if (this.isOk()) return this._value!;
        throw new Error(String(this._error!));
    }

    expectErr(msg: string): E {
        return this.isErr() ? this._error! : this._unwrapFailed(msg, this._value!);
    }

    unwrapErr(): E {
        if (this.isErr()) return this._error!;
        throw new Error(String(this._value!));
    }

    unwrapOr(fallback: T): T {
        return this.isOk() ? this._value! : fallback;
    }

    unwrapOrElse(op: (err: E) => T): T {
        return this.isOk() ? this._value! : op(this._error!);
    }

    // TODO: find a way to do the check in debug/development mode.
    unwrapUnchecked(): T {
        return this._value!;
    }

    // TODO: find a way to do the check in debug/development mode.
    unwrapErrUnchecked(): E {
        return this._error!;
    }

    and<U>(res: Result<U, E>): Result<U, E> {
        return this.isOk() ? res : RustlikeResult.Err(this._error!);
    }

    andThen<U>(op: (value: T) => Result<U, E>): Result<U, E> {
        return this.isOk() ? op(this._value!) : RustlikeResult.Err(this._error!);
    }

    or<F>(res: Result<T, F>): Result<T, F> {
        return this.isOk() ? RustlikeResult.Ok(this._value!) : res;
    }

    orElse<F>(op: (err: E) => Result<T, F>): Result<T, F> {
        return this.isOk() ? RustlikeResult.Ok(this._value!) : op(this._error!);
    }

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

    equal(other: Result<unknown, unknown>): boolean {
        const isOk = this.isOk();
        if (isOk !== other.isOk()) return false;
        return isOk
            ? RustlikeResult._equal(this._value, other.unwrapUnchecked())
            : RustlikeResult._equal(this._error, other.unwrapErrUnchecked());
    }

    async(): ResultAsync<T, E> {
        return new RustlikeResultAsync(this);
    }
}
