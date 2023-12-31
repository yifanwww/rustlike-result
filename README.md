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
```

```ts
import fs, { Dirent, Stats } from 'node:fs/promises';

const result1: Result<Stats, Error> = await fs
    .stat(path)
    .then((value) => Ok(value))
    .catch((err) => Err(err));

const result2: Result<Dirent[], Error> = await fs
    .readdir(path, { withFileTypes: true })
    .then((value) => Ok(value))
    .catch((err) => Err(err));
```

[result]: https://doc.rust-lang.org/std/result/enum.Result.html

### About Rust `Option`

This package doesn't implement Rust-like `Option`. Handling `undefined`/`null` is not as hard as it was a few years ago, because right now we already have [proposal-optional-chaining] and [proposal-nullish-coalescing] to help handle it.

[proposal-optional-chaining]: https://github.com/tc39/proposal-optional-chaining
[proposal-nullish-coalescing]: https://github.com/tc39/proposal-nullish-coalescing

## The Implementations for `Result`

The Rust-like `Result` implements the following methods:

| Rust-like `Result` method        | Rust `Result` method   |
| :------------------------------- | :--------------------- |
| isOk                             | [is_ok]                |
| isOkAnd / isOkAndAsync           | [is_ok_and]            |
| isErr                            | [is_err]               |
| isErrAnd / isErrAndAsync         | [is_err_and]           |
| ok                               | [ok]                   |
| err                              | [err]                  |
| map / mapAsync                   | [map]                  |
| mapOr / mapOrAsync               | [map_or]               |
| mapOrElse / mapOrElseAsync       | [map_or_else]          |
| mapErr / mapErrAsync             | [map_err]              |
| expect                           | [expect]               |
| unwrap                           | [unwrap]               |
| expectErr                        | [expect_err]           |
| unwrapErr                        | [unwrap_err]           |
| unwrapOr                         | [unwrap_or]            |
| unwrapOrElse / unwrapOrElseAsync | [unwrap_or_else]       |
| unwrapUnchecked                  | [unwrap_unchecked]     |
| unwrapErrUnchecked               | [unwrap_err_unchecked] |
| and                              | [and]                  |
| andThen / andThenAsync           | [and_then]             |
| or                               | [or]                   |
| orElse / orElseAsync             | [or_else]              |
| transpose                        | [transpose]            |

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

### Asynchronous Methods

Some of the methods have asynchronous versions to help you handle asynchronous logic, for example:
```ts
const result = await Ok(1)
    .andThenAsync(asyncFn1)
    .then((result) => result.andThenAsync(asyncFn2))
    .then((result) => result.andThenAsync(asyncFn3))
    .then((result) => result.andThenAsync(asyncFn4))
    .then((result) => result.andThenAsync(asyncFn5));
```

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

## Helpers for Resultifying
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

Due to the limit of TypeScript,it's impossible to resultify overloaded functions perfectly that the returned functions are still overloaded.
This function allows you to resultify the promise that the overloaded functions return.

## JSON Serialization & Deserialization

You can always write your (de)serialization implementation for your use cases. But before you write it, you can check following helper functions to see if they can help you.

### Built-in Simple Implementation

This package provides a simple implementation for JSON (de)serialization.

```ts
// serialization
ResultJSON.serialize(Ok(1)) // { type: 'ok', value: 1 }
ResultJSON.serialize(Err('Some error message')) // { type: 'err', value: 'Some error message' }
ResultJSON.serialize(Ok(Ok(2))) // { type: 'ok', value: { type: 'ok', value: 2 } }

// deserialization
ResultJSON.deserialize({ type: 'ok', value: 1 }) // Ok(1)
ResultJSON.deserialize({ type: 'err', value: 'Some error message' }) // Err('Some error message')
ResultJSON.deserialize({ type: 'ok', value: { type: 'ok', value: 2 } }) // Ok({ type: 'ok', value: 2 }) *the nested `Result` won't be deserialized*
```

This simple implementation only covers a few use cases. It may not be suitable if:
- the `Result` has a nested `Result`
- the `Result` is in a complex structure
- the `Result` contains a complex object, such as a class instance, requiring custom (de)serialization

### Community (De)Serialization Solutions

There're some great JSON (de)serialization libraries for complex objects. This package also provides some helper functions to help you use some of them.

#### serializr

Please install `serializr` first, then you can use two helper functions `resultPropSchema` and `createResultModelSchema` as shown in the following example:

```ts
import { createResultModelSchema, resultPropSchema } from 'rustlike-result/serializr';

class User {
    username: string;
    password: string;
}

const userSchema = createModelSchema(User, {
    username: primitive(),
    password: primitive(),
})

// example 1

class Job {
    result: Result<User[], string>;
}

const schema = createModelSchema(Job, {
    result: resultPropSchema({ ok: list(object(userSchema)) }),
});

const job: Job;
serialize(schema, job)
// {
//   result: {
//     type: 'ok',
//     value: [{ username: '<name>', password: '<password>' }, { ... }, ...],
//   },
// }

// example 2

const schema = createResultModelSchema({ ok: list(object(userSchema)) });

const result: Result<User[], string>;
serialize(schema, result)
// {
//   type: 'ok',
//   value: [{ username: '<name>', password: '<password>' }, { ... }, ...],
// }
```

#### class-transformer

TODO.

### JSON Representation Format

The format of the JSON object follows the [adjacently tagged enum representation] in Rust library Serde.
The reason it doesn't follow the [externally tagged enum representation] (the default in Serde) is that, the externally tagged representation of `Ok(undefined)` and `Err(undefined)` are both `{}`, therefore we can't tell whether `{}` should be deserialized to `Ok(undefined)` or `Err(undefined)`.

[adjacently tagged enum representation]: https://serde.rs/enum-representations.html#adjacently-tagged
[externally tagged enum representation]: https://serde.rs/enum-representations.html#externally-tagged

## Write Your Own Implementation of `Result`?

Although you do have the ability to do so, it's not recommended that you write your own implementation.

The default implementation that this package provides should meet your requirements in most cases. If if leaks some abilities please feel free to file an issue.

## License

MIT
