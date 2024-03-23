# rustlike-result

Rust-like `Result` for JavaScript.

`Result` is a type that represents either success (`Ok`) or `failure` (`Err`).

## Table Of Contents

- [Installation](#installation)
- [Usage](#usage)
- [About Rust `Option`](#about-rust-option)
- [Methods Documentation](#methods-documentation)
  - [Rust `Result` Methods](#rust-result-methods)
    - [isOk](#isok)
    - [isOkAnd](#isokand)
    - [isOkAndAsync](#isokandasync)
    - [isErr](#iserr)
    - [isErrAnd](#iserrand)
    - [isErrAndAsync](#iserrandasync)
    - [ok](#ok)
    - [err](#err)
    - [map](#map)
    - [mapAsync](#mapasync)
    - [mapOr](#mapor)
    - [mapOrAsync](#maporasync)
    - [mapOrElse](#maporelse)
    - [mapOrElseAsync](#maporelseasync)
    - [mapErr](#maperr)
    - [mapErrAsync](#maperrasync)
    - [inspect](#inspect)
    - [inspectAsync](#inspectasync)
    - [inspectErr](#inspecterr)
    - [inspectErrAsync](#inspecterrasync)
    - [expect](#expect)
    - [unwrap](#unwrap)
    - [expectErr](#expecterr)
    - [unwrapErr](#unwraperr)
    - [unwrapOr](#unwrapor)
    - [unwrapOrElse](#unwraporelse)
    - [unwrapOrElseAsync](#unwraporelseasync)
    - [unwrapUnchecked](#unwrapunchecked)
    - [unwrapErrUnchecked](#unwraperrunchecked)
    - [and](#and)
    - [andThen](#andthen)
    - [andThenAsync](#andthenasync)
  - [Additional Methods](#additional-methods)
    - [equal](#equal)
- [Helpers for Resultifying](#helpers-for-resultifying)
  - [resultify](#resultify)
  - [resultify.sync](#resultifysync)
  - [resultify.promise](#resultifypromise)
- [JSON Serialization \& Deserialization](#json-serialization--deserialization)
  - [Built-in Simple Implementation](#built-in-simple-implementation)
  - [Community (De)Serialization Solutions](#community-deserialization-solutions)
    - [serializr](#serializr)
    - [class-transformer](#class-transformer)
  - [JSON Representation Format](#json-representation-format)
- [Write Your Own Implementation of `Result`?](#write-your-own-implementation-of-result)
- [License](#license)

## Installation

```sh
> npm install rustlike-result
> yarn add rustlike-result
> pnpm install rustlike-result
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

## About Rust `Option`

This package doesn't implement Rust-like `Option`. Handling `undefined`/`null` is not as hard as it was a few years ago, because right now we already have [proposal-optional-chaining] and [proposal-nullish-coalescing] to help handle it.

[proposal-optional-chaining]: https://github.com/tc39/proposal-optional-chaining
[proposal-nullish-coalescing]: https://github.com/tc39/proposal-nullish-coalescing

## Methods Documentation
### Rust `Result` Methods

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
| inspect / inspectAsync           | [inspect]              |
| inspectErr / inspectErrAsync     | [inspect_err]          |
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
[inspect]: https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect
[inspect_err]: https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect_err
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

#### `isOk`

Returns `true` if the result is `Ok`.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const x: Result<number, string> = Ok(2);
assert(x.isOk() === true);

const y: Result<number, string> = Err('Some error message');
assert(y.isOk() === false);
```

#### `isOkAnd`

Returns `true` if the result is `Ok` and the value inside of it matches a predicate.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const x: Result<number, string> = Ok(2);
assert(x.isOkAnd((value) => value > 1) === true);

const y: Result<number, string> = Ok(0);
assert(y.isOkAnd((value) => value > 1) === false);

const z: Result<number, string> = Err('Some error message');
assert(z.isOkAnd((value) => value > 1) === false);
```

#### `isOkAndAsync`

Asynchronously returns `true` if the result is `Ok` and the value inside of it matches a predicate.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const x: Result<number, string> = Ok(2);
assert((await x.isOkAndAsync((value) => Promise.resolve(value > 1))) === true);

const y: Result<number, string> = Ok(0);
assert((await y.isOkAndAsync((value) => Promise.resolve(value > 1))) === false);

const z: Result<number, string> = Err('Some error message');
assert((await z.isOkAndAsync((value) => Promise.resolve(value > 1))) === false);
```

#### `isErr`

Returns `true` if the result is `Err`.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const x: Result<number, string> = Ok(-3);
assert(x.isErr() === false);

const y: Result<number, string> = Err('Some error message');
assert(y.isErr() === true);
```

#### `isErrAnd`

Returns `true` if the result is `Err` and the value inside of it matches a predicate.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

enum ErrorKind {
NOT_FOUND,
PERMISSION_DENIED,
}

const x: Result<number, ErrorKind> = Err(ErrorKind.NOT_FOUND);
assert(x.isErrAnd((value) => value === ErrorKind.NOT_FOUND) === true);

const y: Result<number, ErrorKind> = Err(ErrorKind.PERMISSION_DENIED);
assert(y.isErrAnd((value) => value === ErrorKind.NOT_FOUND) === false);

const z: Result<number, ErrorKind> = Ok(123);
assert(z.isErrAnd((value) => value === ErrorKind.NOT_FOUND) === false);
```

#### `isErrAndAsync`

Asynchronously returns `true` if the result is `Err` and the value inside of it matches a predicate.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

enum ErrorKind {
NOT_FOUND,
PERMISSION_DENIED,
}

const x: Result<number, ErrorKind> = Err(ErrorKind.NOT_FOUND);
assert((await x.isErrAndAsync((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === true);

const y: Result<number, ErrorKind> = Err(ErrorKind.PERMISSION_DENIED);
assert((await y.isErrAndAsync((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === false);

const z: Result<number, ErrorKind> = Ok(123);
assert((await z.isErrAndAsync((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === false);
```

#### `ok`

Converts from `Result<T, E>` to `Optional<T>` and discarding the error, if any.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const x: Result<number, string> = Ok(2);
assert(x.ok() === 2);

const y: Result<number, string> = Err('Some error message');
assert(y.ok() === undefined);
```

#### `err`

Converts from `Result<T, E>` to `Optional<E>` and discarding the success value, if any.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const x: Result<number, string> = Ok(2);
assert(x.err() === undefined);

const y: Result<number, string> = Err('Some error message');
assert(y.err() === 'Some error message');
```

#### `map`

Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.

This function can be used to compose the results of two functions.

Examples:

```ts
import { Ok, type Result } from 'rustlike-result';

const x: Result<string, string> = Ok('foo');
assert(x.map((value) => value.length).ok() === 3);
```

#### `mapAsync`

Asynchronously maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.

This function can be used to compose the results of two functions.

Examples:

```ts
import { Ok } from 'rustlike-result';

const x = await Ok<string, string>('foo').mapAsync((value) => Promise.resolve(value.length));
assert(x.ok() === 3);
```

#### `mapOr`

Returns the provided `fallback` (if `Err`), or applies a function to the contained value (if `Ok`).

Arguments passed to `mapOr` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `mapOrElse`, which is lazily evaluated.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const x: Result<string, string> = Ok('foo');
assert(x.mapOr(42, (value) => value.length) === 3);

const y: Result<string, string> = Err('bar');
assert(y.mapOr(42, (value) => value.length) === 42);
```

#### `mapOrAsync`

Asynchronously returns the provided `fallback` (if `Err`), or applies a function to the contained value (if `Ok`).

Arguments passed to `mapOr` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `mapOrElse`, which is lazily evaluated.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const x: Result<string, string> = Ok('foo');
assert((await x.mapOrAsync(42, (value) => value.length)) === 3);

const y: Result<string, string> = Err('bar');
assert((await y.mapOrAsync(42, (value) => value.length)) === 42);
```

#### `mapOrElse`

Maps a `Result<T, E>` to `U` by applying fallback function `fallback` to a contained `Err` value, or function `map` to a contained `Ok` value.

This function can be used to unpack a successful result while handling an error.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const k = 21;

const x: Result<string, string> = Ok('foo');
assert(x.mapOrElse((err) => k * 2, (value) => value.length) === 3);

const y: Result<string, string> = Err('bar');
assert(y.mapOrElse((err) => k * 2, (value) => value.length) === 42);
```

#### `mapOrElseAsync`

Asynchronously maps a `Result<T, E>` to `U` by applying fallback function `fallback` to a contained `Err` value, or function `map` to a contained `Ok` value.

This function can be used to unpack a successful result while handling an error.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const k = 21;

const x: Result<string, string> = Ok('foo');
assert((await x.mapOrElseAsync(() => Promise.resolve(k * 2), (value) => Promise.resolve(value.length))) === 3);

const y: Result<string, string> = Err('bar');
assert((await y.mapOrElseAsync(() => Promise.resolve(k * 2), (value) => Promise.resolve(value.length))) === 42);
```

#### `mapErr`

Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.

This function can be used to pass through a successful result while handling an error.

Examples:

```ts
import { Err, type Result } from 'rustlike-result';

const x: Result<number, Error> = Err(new Error('Some error message'));
assert(x.mapErr((err) => err.message).err() === 'Some error message');
```

#### `mapErrAsync`

Asynchronously maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.

This function can be used to pass through a successful result while handling an error.

Examples:

```ts
import { Err } from 'rustlike-result';

const x = await Err(new Error('Some error message')).mapErrAsync((err) => Promise.resolve(err.message));
assert(x.err() === 'Some error message');
```

#### `inspect`

Calls the provided closure with a reference to the contained value if `Ok`.

Examples:

```ts
import { resultify } from 'rustlike-result';

const num = resultify
    .sync<SyntaxError>()(JSON.parse)('4')
    .inspect((value: number) => console.log(`original: ${value}`))
    .map((value) => value ** 3)
    .expect('failed to parse number');
assert(num === 64);
```

#### `inspectAsync`

Asynchronously calls the provided closure with a reference to the contained value if `Ok`.

Examples:

```ts
import { resultify } from 'rustlike-result';

const num = await resultify
    .sync<SyntaxError>()(JSON.parse)('4')
    .inspectAsync((value: number) => {
        console.log(`original: ${value}`);
        return Promise.resolve();
    })
    .then((result) => result.map((value) => value ** 3))
    .then((result) => result.expect('failed to parse number'));
assert(num === 64);
```

#### `inspectErr`

Calls the provided closure with a reference to the contained value if `Err`.

Examples:

```ts
import { resultify } from 'rustlike-result';

const num = resultify
    .sync<SyntaxError>()(JSON.parse)('asdf')
    .inspectErr((err) => console.log(`failed to parse json string: ${err.message}`));
assert(num.err() instanceof SyntaxError);
```

#### `inspectErrAsync`

Asynchronously calls the provided closure with a reference to the contained value if `Err`.

Examples:

```ts
import { resultify } from 'rustlike-result';

const num = await resultify
    .sync<SyntaxError>()(JSON.parse)('asdf')
    .inspectErrAsync((err) => {
        console.log(`failed to parse json string: ${err.message}`);
        return Promise.resolve();
    });
assert(num.err() instanceof SyntaxError);
```

#### `expect`

Returns the contained `Ok` value.

Because this function may throw an error, its use is generally discouraged. Instead, prefer to call `unwrapOr`, `unwrapOrElse`.

Throws an Error if itself is `Err`, with an error message including the passed message, and the content of the `Err`.

Examples:

```ts
import { Err, type Result } from 'rustlike-result';

const x: Result<number, string> = Err('emergency failure');
x.expect('Failed to operate'); // throws Error('Failed to operate: emergency failure')
```

#### `unwrap`

Returns the contained `Ok` value.

Because this function may throw an error, its use is generally discouraged. Instead, prefer to call `unwrapOr`, `unwrapOrElse`.

Throws an Error if itself is `Err`, with an error message provided by the `Err`'s value.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const x: Result<number, string> = Ok(2);
assert(x.unwrap() === 2);

const y: Result<number, string> = Err('emergency failure');
y.unwrap(); // throws Error('emergency failure')
```

#### `expectErr`

Returns the contained `Err` value.

Throws an Error if itself is `Err`, with an error message provided by the `Ok`'s value.

Examples:

```ts
import { Ok, type Result } from 'rustlike-result';

const x: Result<number, string> = Ok(10);
x.expectErr('Testing expectErr'); // throws Error('Testing expectErr: 10')
```

#### `unwrapErr`

Returns the contained `Err` value.

Throws an Error if itself is `Ok`, with an error message provided by the `Ok`'s value.

Examples:

```ts
import { Ok, type Result } from 'rustlike-result';

const x: Result<number, string> = Err('emergency failure');
assert(x.unwrapErr() === 'emergency failure');

const y: Result<number, string> = Ok(2);
y.unwrapErr(); // throws Error(2)
```

#### `unwrapOr`

Returns the contained `Ok` value or a provided default.

Arguments passed to `unwrapOr` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `unwrapOrElse`, which is lazily evaluated.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const $default = 2;
const x: Result<number, string> = Ok(9);
assert(x.unwrapOr($default) === 9);

const y: Result<number, string> = Err('error');
assert(y.unwrapOr($default) === $default);
```

#### `unwrapOrElse`

Returns the contained `Ok` value or computes it from a closure.

Examples:

```ts
import { Err, Ok } from 'rustlike-result';

const count = (err: string) => err.length;
assert(Ok<number, string>(2).unwrapOrElse(count) === 2);
assert(Err<number, string>('foo').unwrapOrElse(count) === 3);
```

#### `unwrapOrElseAsync`

Asynchronously returns the contained `Ok` value or computes it from a closure.

Examples:

```ts
import { Err, Ok } from 'rustlike-result';

const count = (err: string) => Promise.resolve(err.length);
assert((await Ok<number, string>(2).unwrapOrElseAsync(count)) === 2);
assert((await Err<number, string>('foo').unwrapOrElseAsync(count)) === 3);
```

#### `unwrapUnchecked`

Returns the contained `Ok` value, without checking that the value is not an `Err`.

**SAFETY**: Calling this method on an `Err` is undefined behavior.
The safety contract must be upheld by the caller.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const x: Result<number, string> = Ok(2);
assert(x.unwrapUnchecked() === 2);

const y: Result<number, string> = Err('emergency failure');
y.unwrapUnchecked();
```

#### `unwrapErrUnchecked`

Returns the contained `Err` value, without checking that the value is not an `Ok`.

**SAFETY**: Calling this method on an `Ok` is undefined behavior.
The safety contract must be upheld by the caller.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const x: Result<number, string> = Ok(2);
x.unwrapErrUnchecked();

const y: Result<number, string> = Err('emergency failure');
assert(y.unwrapErrUnchecked() === 'emergency failure');
```

#### `and`

Returns `res` if itself is `Ok`, otherwise returns the `Err` value of itself.

Arguments passed to `and` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `andThen`, which is lazily evaluated.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

let x: Result<number, string>;
let y: Result<string, string>;

x = Ok(2);
y = Err('late error');
assert(x.and(y).equal(Err('late error')));

x = Err('early error');
y = Ok('foo');
assert(x.and(y).equal(Err('early error')));

x = Err('not a 2');
y = Err('late error');
assert(x.and(y).equal(Err('not a 2')));

x = Ok(2);
y = Ok('different result type');
assert(x.and(y).equal(Ok('different result type')));
```

#### `andThen`

Calls `op` if itself is `Ok`, otherwise returns the `Err` value of itself.

This function can be used for control flow based on Result values.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const parseJSON = (json: string) =>
    resultify
    .sync<SyntaxError>()(JSON.parse)(json)
        .mapErr((err) => err.message);

assert(Ok<string, string>('2').andThen(parseJSON).equal(Ok(2)));
assert(
    Ok<string, string>('asdf')
        .andThen(parseJSON)
        .equal(Err('Unexpected token \'a\', "asdf" is not valid JSON')),
);
```

#### `andThenAsync`

Asynchronously calls `op` if itself is `Ok`, otherwise returns the `Err` value of itself.

This function can be used for control flow based on Result values.

Examples:

```ts
import { Err, Ok, type Result } from 'rustlike-result';

const parseJSON = (json: string) =>
    Promise.resolve(
        resultify
            .sync<SyntaxError>()(JSON.parse)(json)
            .mapErr((err) => err.message),
    );

const x = await Ok<string, string>('2').andThenAsync(parseJSON);
assert(x.equal(Ok(2)));

const y = await Ok<string, string>('asdf').andThenAsync(parseJSON);
assert(y.equal(Err('Unexpected token \'a\', "asdf" is not valid JSON')));

const z = await Err('not a valid json string').andThenAsync(parseJSON);
assert(z.equal(Err('not a valid json string')));
```

### Additional Methods
#### equal

You can not just use `===` or `==` to compare `Result`, so `Result` itself provides an method call `equal` for that.

```js
expect(Ok(1).equal(Ok(1))).toBe(true);
expect(Ok(1).equal(Ok(2))).toBe(false);
expect(Ok(1).equal(Ok(2))).toBe(false);
expect(Ok('hello').equal(Ok('hello'))).toBe(true);
expect(Ok('hello').equal(Ok('hello world'))).toBe(false);
expect(Ok(1).equal(Ok('hello world'))).toBe(false);

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

The `rustlike-result` project is available as open source under the terms of the [MIT license].

[MIT license]: https://doc.rust-lang.org/std/result/enum.Result.html#method.transpose

