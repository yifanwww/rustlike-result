# rustlike-result

Rust-like Result for Javascript

## Install

```sh
npm install rustlike-result
yarn add rustlike-result
pnpm install rustlike-result
```

## Usage

This package implement a Rust-like `Result`, nearly all methods are similar to the [Result].

```ts
const ok = Ok(1);
const err = Err('Some error message');

// TODO: complex examples
```

[result]: https://doc.rust-lang.org/std/result/enum.Result.html

### About Rust `Option`

This package doesn't implement Rust-like `Option`. Handling `undefined`/`null` is not as hard as it was a few years ago, because right now we already have [proposal-optional-chaining] and [proposal-nullish-coalescing] to help handle it.

[proposal-optional-chaining]: https://github.com/tc39/proposal-optional-chaining
[proposal-nullish-coalescing]: https://github.com/tc39/proposal-nullish-coalescing

## The Implementations for `Result`

The Rust-like `Result` implements the following methods:

| Rust-like `Result` method | Rust `Result` method   |
| :------------------------ | :--------------------- |
| isOk                      | [is_ok]                |
| isOkAnd                   | [is_ok_and]            |
| isErr                     | [is_err]               |
| isErrAnd                  | [is_err_and]           |
| ok                        | [ok]                   |
| err                       | [err]                  |
| map                       | [map]                  |
| mapOr                     | [map_or]               |
| mapOrElse                 | [map_or_else]          |
| mapErr                    | [map_err]              |
| expect                    | [expect]               |
| unwrap                    | [unwrap]               |
| expectErr                 | [expect_err]           |
| unwrapErr                 | [unwrap_err]           |
| unwrapOr                  | [unwrap_or]            |
| unwrapOrElse              | [unwrap_or_else]       |
| unwrapUnchecked           | [unwrap_unchecked]     |
| unwrapErrUnchecked        | [unwrap_err_unchecked] |
| and                       | [and]                  |
| andThen                   | [and_then]             |
| or                        | [or]                   |
| orElse                    | [or_else]              |
| transpose                 | [transpose]            |

Unlike Rust, JavaScript doesn't have the 'Ownership' feature, so some API like `as_ref` are not necessary. These implementations are not implemented:

```md
<!-- implementations -->
as_ref
as_mut
inspect (unstable)
inspect_err (unstable)
as_deref
as_deref_mut
iter
iter_mut
unwrap_or_default
into_ok (unstable)
into_err (unstable)
copied
cloned
flatten (unstable)

<!-- some of trait implementations -->
clone
clone_from
fmt
hash
```

[is_ok]: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_ok
[is_ok_and]: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_ok_and
[is_err]: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_err
[is_err_and]: https://doc.rust-lang.org/std/result/enum.Result.html#method.is_err_and
[ok]: https://doc.rust-lang.org/std/result/enum.Result.html#method.ok
[err]: https://doc.rust-lang.org/std/result/enum.Result.html#method.err
[map]: https://doc.rust-lang.org/std/result/enum.Result.html#method.map
[map_or]: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or
[map_or_else]: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or_else
[map_err]: https://doc.rust-lang.org/std/result/enum.Result.html#method.map_err
[expect]: https://doc.rust-lang.org/std/result/enum.Result.html#method.expect
[unwrap]: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap
[expect_err]: https://doc.rust-lang.org/std/result/enum.Result.html#method.expect_err
[unwrap_err]: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_err
[unwrap_or]: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_or
[unwrap_or_else]: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_or_else
[unwrap_unchecked]: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_unchecked
[unwrap_err_unchecked]: https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_err_unchecked
[and]: https://doc.rust-lang.org/std/result/enum.Result.html#method.and
[and_then]: https://doc.rust-lang.org/std/result/enum.Result.html#method.and_then
[or]: https://doc.rust-lang.org/std/result/enum.Result.html#method.or
[or_else]: https://doc.rust-lang.org/std/result/enum.Result.html#method.or_else
[transpose]: https://doc.rust-lang.org/std/result/enum.Result.html#method.transpose

## More Methods
### equal

You can not just use `===` or `==` to compare `Result`, so `Result` itself provides an method call `equal` for that.

```javascript
expect(Ok(1).equal(Ok(1))).toBe(true);
expect(Ok('hello').equal(Ok('hello'))).toBe(true);

expect(Ok({ foo: 1 }).equal(Ok({ foo: 1 }))).toBe(false);
expect(Ok([1]).equal(Ok([1]))).toBe(false);
```

There is no built-in deep-equal support in this package for array, object and some built-in classes like `Date`. If you do want to deeply compare those complex structures, you will have to write your own helper functions.

There is a [proposal] (stage 2) that introduces `Record` and `Tuple` which are compared by content rather than identity. In the future, we can use `Record` and `Tuple` in `Result` so that we don't need to implement custom equality comparison function.

[proposal]: https://github.com/tc39/proposal-record-tuple

## More Helper Functions
### resultify

Takes a function and returns a version that returns results asynchronously.

```ts
import fs from 'node:fs/promises';

const copyFile1 = resultify(fs.copyFile);
const copyFile2 = resultify<Error>()(fs.copyFile);
```

### resultify.sync

Takes a function and returns a version that returns results synchronously.

```ts
/**
 * @throws {Error} Some error messages
 */
function fn(): string {
    // do something
}

const fn1 = resultify.sync(fn);
const fn1 = resultify.sync<Error>()(fn);
```

In the context where async functions are not allowed, you can use this function to resultify the sync function.

### resultify.promise

Takes a promise and returns a new promise that contains a result.

```ts
const result = await resultify.promise(promise);
```

## License

MIT
