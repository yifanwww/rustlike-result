import { Err, Ok } from './factory';
import type { Result } from './types';

type NoVoid<T> = T extends void ? undefined : T;

type ResultifiedFn<T, E, Args extends unknown[]> = (...args: Args) => Promise<Result<NoVoid<Awaited<T>>, E>>;
type CurriedResultify<E> = <T, Args extends unknown[]>(
    fn: (...args: Args) => T | Promise<T>,
) => ResultifiedFn<T, E, Args>;

/**
 * Takes a function and returns a version that returns results.
 *
 * ```ts
 * import fs from 'node:fs/promises';
 *
 * const copyFile = resultify(fs.copyFile);
 * ```
 *
 * If you need the error value the want to specify its type, please use another overloaded function.
 */
function resultify<T, E, Args extends unknown[]>(fn: (...args: Args) => T | Promise<T>): ResultifiedFn<T, E, Args>;
/**
 * Takes a function and returns a version that returns results.
 * This overloaded function allows you to specify the error type.
 *
 * ```ts
 * import fs from 'node:fs/promises';
 *
 * const copyFile = resultify<Error>()(fs.copyFile);
 * ```
 */
function resultify<E>(): CurriedResultify<E>;

function resultify<T, E, Args extends unknown[]>(
    fn?: (...args: Args) => T | Promise<T>,
): CurriedResultify<E> | ResultifiedFn<T, E, Args> {
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

resultify.async = resultify;

export { resultify };
