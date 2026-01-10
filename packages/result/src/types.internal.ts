/**
 * DO NOT USE THIS TYPE! This is for internal use.
 */
export type ResultType = 'ok' | 'err';

/**
 * JavaScript ECMAScript 2020 contains two new proposals that can help us deal with undefined/null more easily:
 * - https://github.com/tc39/proposal-optional-chaining
 * - https://github.com/tc39/proposal-nullish-coalescing
 *
 * We don't need Rust-like Option anymore in most cases unless we want functional programming.
 *
 * This type doesn't use the name `Option` to let us distinguish it from the Rust `Option`.
 *
 * This type is not exported since there's no convention for using `Optional` type in TypeScript world.
 * People just simply write `T | undefined`.
 */
export type Optional<T> = T | undefined;
