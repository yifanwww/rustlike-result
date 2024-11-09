import { Err, Ok } from './factory';
import type { Result } from './Result';
import type { ResultAsync } from './ResultAsync';
import { RustlikeResultAsync } from './RustlikeResultAsync';

type NoVoid<T> = T extends void ? undefined : T;

/**
 * Takes a promise and returns an async `Result`.
 *
 * Examples:
 * ```ts
 * import { resultifyPromise } from 'rustlike-result';
 *
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
 * import { resultifySync } from 'rustlike-result';
 *
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
 * This overloaded function allows you to easily specify the error type.
 *
 * Examples:
 * ```ts
 * import { resultifySync } from 'rustlike-result';
 *
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

type CurriedResultifyAsync<E> = <T, Args extends unknown[]>(
    fn: (...args: Args) => T | Promise<T>,
) => (...args: Args) => ResultAsync<NoVoid<Awaited<T>>, E>;

/**
 * Takes a function and returns a version that returns results asynchronously.
 *
 * Examples:
 * ```ts
 * import fs from 'node:fs/promises';
 * import { resultifyAsync } from 'rustlike-result';
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
 * This overloaded function allows you to easily specify the error type.
 *
 * Examples:
 * ```ts
 * import fs from 'node:fs/promises';
 * import { resultifyAsync } from 'rustlike-result';
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
