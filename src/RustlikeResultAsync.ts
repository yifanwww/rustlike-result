import { Err, Ok } from './factory';
import type { Result } from './Result';
import type { ResultAsync } from './ResultAsync';
import { RustlikeResult } from './RustlikeResult';
import type { Optional } from './types.internal';

/**
 * The default implementation of interface `ResultAsync`.
 */
export class RustlikeResultAsync<T, E> implements ResultAsync<T, E> {
    private readonly _promise: Promise<Result<T, E>>;

    constructor(promise: Result<T, E> | Promise<Result<T, E>> | ResultAsync<T, E>) {
        this._promise = Promise.resolve(promise);
    }

    // async type predicate issue: https://github.com/microsoft/TypeScript/issues/37681
    isOk(): Promise<boolean> {
        return this._promise.then((result) => result.isOk());
    }

    isOkAnd(fn: (value: T) => boolean | Promise<boolean>): Promise<boolean> {
        return this._promise.then((result) => result.isOk() && fn(result.unwrapUnchecked()));
    }

    // async type predicate issue: https://github.com/microsoft/TypeScript/issues/37681
    isErr(): Promise<boolean> {
        return this._promise.then((result) => result.isErr());
    }

    isErrAnd(fn: (err: E) => boolean | Promise<boolean>): Promise<boolean> {
        return this._promise.then((result) => result.isErr() && fn(result.unwrapErrUnchecked()));
    }

    ok(): Promise<Optional<T>> {
        return this._promise.then((result) => result.ok());
    }

    err(): Promise<Optional<E>> {
        return this._promise.then((result) => result.err());
    }

    map<U>(op: (value: T) => U | Promise<U>): ResultAsync<U, E> {
        return new RustlikeResultAsync(
            this._promise.then(async (result) =>
                result.isOk() ? Ok(await op(result.unwrapUnchecked())) : Err(result.unwrapErrUnchecked()),
            ),
        );
    }

    mapOr<U>(fallback: U, map: (value: T) => U | Promise<U>): Promise<U> {
        return this._promise.then((result) => (result.isOk() ? map(result.unwrapUnchecked()) : fallback));
    }

    mapOrElse<U>(fallback: (err: E) => U | Promise<U>, map: (value: T) => U | Promise<U>): Promise<U> {
        return this._promise.then((result) =>
            result.isOk() ? map(result.unwrapUnchecked()) : fallback(result.unwrapErrUnchecked()),
        );
    }

    mapErr<F>(op: (err: E) => F | Promise<F>): ResultAsync<T, F> {
        return new RustlikeResultAsync(
            this._promise.then(async (result) =>
                result.isOk() ? Ok(result.unwrapUnchecked()) : Err(await op(result.unwrapErrUnchecked())),
            ),
        );
    }

    inspect(fn: (value: T) => void | Promise<void>): ResultAsync<T, E> {
        return new RustlikeResultAsync(
            this._promise.then(async (result) => {
                if (result.isOk()) {
                    await fn(result.unwrapUnchecked());
                }
                return result;
            }),
        );
    }

    inspectErr(fn: (err: E) => void | Promise<void>): ResultAsync<T, E> {
        return new RustlikeResultAsync(
            this._promise.then(async (result) => {
                if (result.isErr()) {
                    await fn(result.unwrapErrUnchecked());
                }
                return result;
            }),
        );
    }

    expect(msg: string): Promise<T> {
        return this._promise.then((result) => result.expect(msg));
    }

    unwrap(): Promise<T> {
        return this._promise.then((result) => result.unwrap());
    }

    expectErr(msg: string): Promise<E> {
        return this._promise.then((result) => result.expectErr(msg));
    }

    unwrapErr(): Promise<E> {
        return this._promise.then((result) => result.unwrapErr());
    }

    unwrapOr(fallback: T): Promise<T> {
        return this._promise.then((result) => result.unwrapOr(fallback));
    }

    unwrapOrElse(op: (err: E) => T | Promise<T>): Promise<T> {
        return this._promise.then((result) =>
            result.isOk() ? result.unwrapUnchecked() : op(result.unwrapErrUnchecked()),
        );
    }

    // TODO: find a way to do the check in debug/development mode.
    unwrapUnchecked(): Promise<T> {
        return this._promise.then((result) => result.unwrapUnchecked());
    }

    // TODO: find a way to do the check in debug/development mode.
    unwrapErrUnchecked(): Promise<E> {
        return this._promise.then((result) => result.unwrapErrUnchecked());
    }

    and<U>(res: Result<U, E> | Promise<Result<U, E>> | ResultAsync<U, E>): ResultAsync<U, E> {
        return new RustlikeResultAsync(
            this._promise.then((result) => (result.isOk() ? res : Err(result.unwrapErrUnchecked()))),
        );
    }

    andThen<U>(op: (value: T) => Result<U, E> | Promise<Result<U, E>> | ResultAsync<U, E>): ResultAsync<U, E> {
        return new RustlikeResultAsync(
            this._promise.then((result) =>
                result.isOk() ? op(result.unwrapUnchecked()) : Err(result.unwrapErrUnchecked()),
            ),
        );
    }

    or<F>(res: Result<T, F> | Promise<Result<T, F>> | ResultAsync<T, F>): ResultAsync<T, F> {
        return new RustlikeResultAsync(
            this._promise.then((result) => (result.isOk() ? Ok(result.unwrapUnchecked()) : res)),
        );
    }

    orElse<F>(op: (err: E) => Result<T, F> | Promise<Result<T, F>> | ResultAsync<T, F>): ResultAsync<T, F> {
        return new RustlikeResultAsync(
            this._promise.then((result) =>
                result.isOk() ? Ok(result.unwrapUnchecked()) : op(result.unwrapErrUnchecked()),
            ),
        );
    }

    transpose(): Promise<Optional<Result<T & NonNullable<unknown>, E>>> {
        return this._promise.then((result) => result.transpose());
    }

    private static async _equal(self: unknown, other: unknown): Promise<boolean> {
        const isSelfResult = self instanceof RustlikeResult || self instanceof RustlikeResultAsync;
        const isOtherResult = other instanceof RustlikeResult || other instanceof RustlikeResultAsync;

        if (isSelfResult && isOtherResult) {
            const _self: Result<unknown, unknown> = await self;
            const _other: Result<unknown, unknown> = await other;

            const isOk = _self.isOk();
            if (isOk !== _other.isOk()) return false;
            return isOk
                ? RustlikeResultAsync._equal(_self.unwrapUnchecked(), _other.unwrapUnchecked())
                : RustlikeResultAsync._equal(_self.unwrapErrUnchecked(), _other.unwrapErrUnchecked());
        }

        return self === other || (Number.isNaN(self) && Number.isNaN(other));
    }

    async equal(
        other: Result<unknown, unknown> | Promise<Result<unknown, unknown>> | ResultAsync<unknown, unknown>,
    ): Promise<boolean> {
        const _self = await this._promise;
        const _other = await other;
        const isOk = _self.isOk();
        if (isOk !== _other.isOk()) return false;
        return isOk
            ? RustlikeResultAsync._equal(_self.unwrapUnchecked(), _other.unwrapUnchecked())
            : RustlikeResultAsync._equal(_self.unwrapErrUnchecked(), _other.unwrapErrUnchecked());
    }

    then<TResult1 = Result<T, E>, TResult2 = never>(
        onfulfilled?: ((value: Result<T, E>) => TResult1 | PromiseLike<TResult1>) | null | undefined,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined,
    ): PromiseLike<TResult1 | TResult2> {
        return this._promise.then(onfulfilled, onrejected);
    }
}
