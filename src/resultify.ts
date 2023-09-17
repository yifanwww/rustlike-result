import { Err, Ok } from './factory';
import type { Result } from './types';

type NoVoid<T> = T extends void ? undefined : T;

/**
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
async function resultifyPromise<T, E>(promise: Promise<T>): Promise<Result<NoVoid<T>, E>> {
    try {
        return Ok((await promise) as NoVoid<T>);
    } catch (err) {
        return Err(err as E);
    }
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
 * const fn1 = resultify.sync(fn);
 * ```
 *
 * In the context where async functions are not allowed, you can use this function to resultify the sync function.
 * If you want to resultify an async function, please use `resultify` instead.
 *
 * If you need the error value and want to specify its type, please use another overloaded function.
 */
function resultifySync<T, E, Args extends unknown[]>(fn: (...args: Args) => T): (...args: Args) => Result<NoVoid<T>, E>;
/**
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
 */
function resultifySync<E>(): CurriedResultifySync<E>;

function resultifySync<T, E, Args extends unknown[]>(
    fn?: (...args: Args) => T,
): CurriedResultifySync<E> | ((...args: Args) => Result<NoVoid<T>, E>) {
    function curriedResultify<TT, TArgs extends unknown[]>(_fn: (...args: TArgs) => TT) {
        return function resultifiedFn(...args: TArgs): Result<NoVoid<TT>, E> {
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

/**
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
function resultify<T, E, Args extends unknown[]>(
    fn: (...args: Args) => T | Promise<T>,
): (...args: Args) => Promise<Result<NoVoid<Awaited<T>>, E>>;
/**
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
function resultify<E>(): CurriedResultify<E>;

function resultify<T, E, Args extends unknown[]>(
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

resultify.sync = resultifySync;
resultify.promise = resultifyPromise;

export { resultify };
