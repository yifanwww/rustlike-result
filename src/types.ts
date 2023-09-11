/**
 * JavaScript ECMAScript 2020 contains two new proposals that can help us deal with undefined/null more easily:
 * - https://github.com/tc39/proposal-optional-chaining
 * - https://github.com/tc39/proposal-nullish-coalescing
 *
 * We don't need Rust-like Option anymore in most cases.
 *
 * This type doesn't use the name `Option`,
 * by giving it a different name we can easily know that this is not Rust-like Option.
 */
export type Optional<T> = T | undefined;
