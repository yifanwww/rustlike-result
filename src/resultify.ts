import { Err, Ok } from './factory';
import type { Result } from './Result';
import type { ResultAsync } from './ResultAsync';
import { RustlikeResultAsync } from './RustlikeResultAsync';

type NoVoid<T> = T extends void ? undefined : T;

async function resultifyPromiseLegacy<T, E>(promise: Promise<T>): Promise<Result<NoVoid<T>, E>> {
    try {
        return Ok((await promise) as NoVoid<T>);
    } catch (err) {
        return Err(err as E);
    }
}

/**
 * Takes a promise and returns an async `Result`.
 *
 * Examples:
 * ```ts
 * const result = await resultifyPromise(promise);
 * ```
 *
 * Due to the limit of TypeScript,it's impossible to resultify overloaded functions perfectly that
 * the returned functions are still overloaded.
 * This function allows you to resultify the promise that the overloaded functions return.
 */
export function resultifyPromise<T, E>(promise: Promise<T>): ResultAsync<NoVoid<T>, E> {
    return new RustlikeResultAsync(
        promise.then(
            (value) => Ok<NoVoid<T>, E>(value as NoVoid<T>),
            (err) => Err<NoVoid<T>, E>(err as E),
        ),
    );
}

type CurriedResultifySync<E> = <T, Args extends unknown[]>(
    fn: (...args: Args) => T,
) => (...args: Args) => Result<NoVoid<T>, E>;

/**
 * Takes a function and returns a version that returns results synchronously.
 *
 * Examples:
 * ```ts
 * function fn(): string {
 *   // throws error if failed
 * }
 * const fn1 = resultifySync(fn);
 * ```
 *
 * In the context where async functions are not allowed, you can use this function to resultify the sync function.
 * If you want to resultify an async function, please use `resultify` instead.
 *
 * If you need the error value and want to specify its type, please use another overloaded function.
 */
export function resultifySync<T, E, Args extends unknown[]>(
    fn: (...args: Args) => T,
): (...args: Args) => Result<NoVoid<T>, E>;
/**
 * Takes a function and returns a version that returns results synchronously.
 *
 * Examples:
 * ```ts
 * function fn(): string {
 *   // throws error if failed
 * }
 * const fn1 = resultifySync<Error>()(fn);
 * ```
 *
 * In the context where async functions are not allowed, you can use this function to resultify the sync function.
 * If you want to resultify an async function, please use `resultify` instead.
 */
export function resultifySync<E>(): CurriedResultifySync<E>;

export function resultifySync<T, E, Args extends unknown[]>(
    fn?: (...args: Args) => T,
): CurriedResultifySync<E> | ((...args: Args) => Result<NoVoid<T>, E>) {
    function curriedResultify<TT, TArgs extends unknown[]>(_fn: (...args: TArgs) => TT) {
        return function resultifiedSyncFn(...args: TArgs): Result<NoVoid<TT>, E> {
            try {
                return Ok(_fn(...args) as NoVoid<TT>);
            } catch (err) {
                return Err(err as E);
            }
        };
    }

    return fn ? curriedResultify(fn) : curriedResultify;
}

type CurriedResultify<E> = <T, Args extends unknown[]>(
    fn: (...args: Args) => T | Promise<T>,
) => (...args: Args) => Promise<Result<NoVoid<Awaited<T>>, E>>;

interface ResultifySignature {
    /**
     * @deprecated Please use `resultifyAsync` instead.
     *
     * Takes a function and returns a version that returns results asynchronously.
     *
     * Examples:
     * ```ts
     * import fs from 'node:fs/promises';
     *
     * const copyFile = resultify(fs.copyFile);
     * ```
     *
     * If you need the error value and want to specify its type, please use another overloaded function.
     */
    <T, E, Args extends unknown[]>(
        fn: (...args: Args) => T | Promise<T>,
    ): (...args: Args) => Promise<Result<NoVoid<Awaited<T>>, E>>;
    /**
     * @deprecated Please use `resultifyAsync` instead.
     *
     * Takes a function and returns a version that returns results asynchronously.
     * This overloaded function allows you to specify the error type.
     *
     * Examples:
     * ```ts
     * import fs from 'node:fs/promises';
     *
     * const copyFile = resultify<Error>()(fs.copyFile);
     * ```
     */
    <E>(): CurriedResultify<E>;

    /**
     * @deprecated Please use `resultifySync` instead.
     *
     * Takes a function and returns a version that returns results synchronously.
     *
     * Examples:
     * ```ts
     * function fn(): string {
     *   // throws error if failed
     * }
     * const fn1 = resultify.sync(fn);
     * ```
     *
     * In the context where async functions are not allowed, you can use this function to resultify the sync function.
     * If you want to resultify an async function, please use `resultify` instead.
     *
     * If you need the error value and want to specify its type, please use another overloaded function.
     */
    sync<T, E, Args extends unknown[]>(fn: (...args: Args) => T): (...args: Args) => Result<NoVoid<T>, E>;
    /**
     * @deprecated Please use `resultifySync` instead.
     *
     * Takes a function and returns a version that returns results synchronously.
     *
     * Examples:
     * ```ts
     * function fn(): string {
     *   // throws error if failed
     * }
     * const fn1 = resultify.sync<Error>()(fn);
     * ```
     *
     * In the context where async functions are not allowed, you can use this function to resultify the sync function.
     * If you want to resultify an async function, please use `resultify` instead.
     */
    sync<E>(): CurriedResultifySync<E>;

    /**
     * @deprecated Please use `resultifyPromise` instead.
     *
     * Takes a promise and returns a new promise that contains a result.
     *
     * Examples:
     * ```ts
     * const result = await resultify.promise(promise);
     * ```
     *
     * Due to the limit of TypeScript,it's impossible to resultify overloaded functions perfectly that
     * the returned functions are still overloaded.
     * This function allows you to resultify the promise that the overloaded functions return.
     */
    promise<T, E>(promise: Promise<T>): Promise<Result<NoVoid<T>, E>>;
}

function resultifyLegacy<T, E, Args extends unknown[]>(
    fn: (...args: Args) => T | Promise<T>,
): (...args: Args) => Promise<Result<NoVoid<Awaited<T>>, E>>;

function resultifyLegacy<E>(): CurriedResultify<E>;
function resultifyLegacy<T, E, Args extends unknown[]>(
    fn?: (...args: Args) => T | Promise<T>,
): CurriedResultify<E> | ((...args: Args) => Promise<Result<NoVoid<Awaited<T>>, E>>) {
    function curriedResultify<TT, TArgs extends unknown[]>(_fn: (...args: TArgs) => TT | Promise<TT>) {
        return async function resultifiedFn(...args: TArgs): Promise<Result<NoVoid<Awaited<TT>>, E>> {
            try {
                return Ok((await _fn(...args)) as NoVoid<Awaited<TT>>);
            } catch (err) {
                return Err(err as E);
            }
        };
    }

    return fn ? curriedResultify(fn) : curriedResultify;
}

export const resultify = resultifyLegacy as ResultifySignature;
resultify.sync = resultifySync;
resultify.promise = resultifyPromiseLegacy;

type CurriedResultifyAsync<E> = <T, Args extends unknown[]>(
    fn: (...args: Args) => T | Promise<T>,
) => (...args: Args) => ResultAsync<NoVoid<Awaited<T>>, E>;

/**
 * Takes a function and returns a version that returns results asynchronously.
 *
 * Examples:
 * ```ts
 * import fs from 'node:fs/promises';
 *
 * const copyFile = resultifyAsync(fs.copyFile);
 * ```
 *
 * If you need the error value and want to specify its type, please use another overloaded function.
 */
export function resultifyAsync<T, E, Args extends unknown[]>(
    fn: (...args: Args) => T | Promise<T>,
): (...args: Args) => ResultAsync<NoVoid<Awaited<T>>, E>;
/**
 * Takes a function and returns a version that returns results asynchronously.
 * This overloaded function allows you to specify the error type.
 *
 * Examples:
 * ```ts
 * import fs from 'node:fs/promises';
 *
 * const copyFile = resultifyAsync<Error>()(fs.copyFile);
 * ```
 */
export function resultifyAsync<E>(): CurriedResultifyAsync<E>;

export function resultifyAsync<T, E, Args extends unknown[]>(
    fn?: (...args: Args) => T | Promise<T>,
): CurriedResultifyAsync<E> | ((...args: Args) => ResultAsync<NoVoid<Awaited<T>>, E>) {
    function curriedResultify<TT, TArgs extends unknown[]>(_fn: (...args: TArgs) => TT | Promise<TT>) {
        return function resultifiedAsyncFn(...args: TArgs): ResultAsync<NoVoid<Awaited<TT>>, E> {
            try {
                // `resultifyPromise` handles ok value and async err
                return resultifyPromise(Promise.resolve(_fn(...args)) as Promise<Awaited<TT>>);
            } catch (err) {
                // handles sync err
                return new RustlikeResultAsync(Err(err as E));
            }
        };
    }

    return fn ? curriedResultify(fn) : curriedResultify;
}
