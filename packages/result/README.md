# @rustresult/result

Rust-like `Result` and `ResultAsync` for JavaScript.

`Result` is a type that represents either success (`Ok`) or `failure` (`Err`), `ResultAsync` is the asynchronous version of `Result`.

## Table Of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Factories](#factories)
- [Methods](#methods)
  - [Rust `Result` Methods](#rust-result-methods)
    - [Synchronous Methods (`Result`)](#synchronous-methods-result)
      - [`Result.isOk`](#resultisok)
      - [`Result.isOkAnd`](#resultisokand)
      - [`Result.isErr`](#resultiserr)
      - [`Result.isErrAnd`](#resultiserrand)
      - [`Result.ok`](#resultok)
      - [`Result.err`](#resulterr)
      - [`Result.map`](#resultmap)
      - [`Result.mapOr`](#resultmapor)
      - [`Result.mapOrElse`](#resultmaporelse)
      - [`Result.mapErr`](#resultmaperr)
      - [`Result.inspect`](#resultinspect)
      - [`Result.inspectErr`](#resultinspecterr)
      - [`Result.expect`](#resultexpect)
      - [`Result.unwrap`](#resultunwrap)
      - [`Result.expectErr`](#resultexpecterr)
      - [`Result.unwrapErr`](#resultunwraperr)
      - [`Result.unwrapOr`](#resultunwrapor)
      - [`Result.unwrapOrElse`](#resultunwraporelse)
      - [`Result.unwrapUnchecked`](#resultunwrapunchecked)
      - [`Result.unwrapErrUnchecked`](#resultunwraperrunchecked)
      - [`Result.and`](#resultand)
      - [`Result.andThen`](#resultandthen)
      - [`Result.or`](#resultor)
      - [`Result.orElse`](#resultorelse)
      - [`Result.transpose`](#resulttranspose)
    - [Asynchronous Methods (`ResultAsync`)](#asynchronous-methods-resultasync)
      - [`ResultAsync.isOk`](#resultasyncresultasyncisok)
      - [`ResultAsync.isOkAnd`](#resultasyncisokand)
      - [`ResultAsync.isErr`](#resultasynciserr)
      - [`ResultAsync.isErrAnd`](#resultasynciserrand)
      - [`ResultAsync.ok`](#resultasyncok)
      - [`ResultAsync.err`](#resultasyncerr)
      - [`ResultAsync.map`](#resultasyncmap)
      - [`ResultAsync.mapOr`](#resultasyncmapor)
      - [`ResultAsync.mapOrElse`](#resultasyncmaporelse)
      - [`ResultAsync.mapErr`](#resultasyncmaperr)
      - [`ResultAsync.inspect`](#resultasyncinspect)
      - [`ResultAsync.inspectErr`](#resultasyncinspecterr)
      - [`ResultAsync.expect`](#resultasyncexpect)
      - [`ResultAsync.unwrap`](#resultasyncunwrap)
      - [`ResultAsync.expectErr`](#resultasyncexpecterr)
      - [`ResultAsync.unwrapErr`](#resultasyncunwraperr)
      - [`ResultAsync.unwrapOr`](#resultasyncunwrapor)
      - [`ResultAsync.unwrapOrElse`](#resultasyncunwraporelse)
      - [`ResultAsync.unwrapUnchecked`](#resultasyncunwrapunchecked)
      - [`ResultAsync.unwrapErrUnchecked`](#resultasyncunwraperrunchecked)
      - [`ResultAsync.and`](#resultasyncand)
      - [`ResultAsync.andThen`](#resultasyncandthen)
      - [`ResultAsync.or`](#resultasyncor)
      - [`ResultAsync.orElse`](#resultasyncorelse)
      - [`ResultAsync.transpose`](#resultasynctranspose)
  - [Additional Methods](#additional-methods)
    - [`.equal`](#equal)
      - [`Result.equal`](#resultequal)
      - [`ResultAsync.equal`](#resultasyncequal)
    - [`Result.async`](#resultasync)
- [Helpers for Resultifying](#helpers-for-resultifying)
  - [`resultifyAsync`](#resultifyasync)
  - [`resultifySync`](#resultifysync)
  - [`resultifyPromise`](#resultifypromise)
- [Write Your Own Implementation of `Result`?](#write-your-own-implementation-of-result)

## Installation

```sh
> npm install @rustresult/result
> pnpm install @rustresult/result
> yarn add @rustresult/result
```

## Usage

This package implements a Rust-like `Result`, nearly all methods are similar to the Rust [Result].

```ts
const ok = Ok(1);
const err = Err('Some error message');
```

```ts
import fs, { Stats } from 'node:fs/promises';

const result1: Result<Stats, Error> = await fs
    .stat(path)
    .then((value) => Ok(value))
    .catch((err) => Err(err));

const readdir = resultifyAsync<Error>(fs.readdir);
const result2 = readdir(path, { withFileTypes: true });
//    ^ ResultAsync<Dirent[], Error>
```

[result]: https://doc.rust-lang.org/std/result/enum.Result.html

## Factories
### `Ok`

Creates a `Result` that contains the success value.

Examples:

```ts
const result1 = Ok(1);
const result2 = Ok<number, string>(1);
const result3: Result<number, string> = Ok(1);
```

### `Err`

Creates a `Result` that contains the error value.

Examples:

```ts
const result1 = Err('Some error message');
const result2 = Err<number, string>('Some error message');
const result3: Result<number, string> = Err('Some error message');
```

### `OkAsync`

Creates a `ResultAsync` that contains the success value.

Examples:

```ts
const result1 = OkAsync(1);
const result2 = OkAsync<number, string>(1);
const result3: ResultAsync<number, string> = OkAsync(1);
```

### `ErrAsync`

Creates a `ResultAsync` that contains the error value.

Examples:

```ts
const result1 = ErrAsync('Some error message');
const result2 = ErrAsync<number, string>('Some error message');
const result3: ResultAsync<number, string> = ErrAsync('Some error message');
```

### `fromPromiseableResult`

Creates a `ResultAsync` from a promiseable `Result`.

Examples:

```ts
const result1 = fromPromiseableResult<number, string>(Ok(1));
const result2 = fromPromiseableResult<number, string>(Err('Some error message'));
const result3 = fromPromiseableResult<number, string>(Promise.resolve(Ok(1)));
const result4 = fromPromiseableResult<number, string>(Promise.resolve(Err('Some error message')));
const result5 = fromPromiseableResult<number, string>(OkAsync(1));
const result6 = fromPromiseableResult<number, string>(ErrAsync('Some error message'));
```

## Methods
### Rust `Result` Methods

The Rust-like `Result` and `ResultAsync` implements the following methods:

| Rust-like `Result` / `ResultAsync` method | Rust `Result` method   |
| :---------------------------------------- | :--------------------- |
| isOk                                      | [is_ok]                |
| isOkAnd                                   | [is_ok_and]            |
| isErr                                     | [is_err]               |
| isErrAnd                                  | [is_err_and]           |
| ok                                        | [ok]                   |
| err                                       | [err]                  |
| map                                       | [map]                  |
| mapOr                                     | [map_or]               |
| mapOrElse                                 | [map_or_else]          |
| mapErr                                    | [map_err]              |
| inspect                                   | [inspect]              |
| inspectErr                                | [inspect_err]          |
| expect                                    | [expect]               |
| unwrap                                    | [unwrap]               |
| expectErr                                 | [expect_err]           |
| unwrapErr                                 | [unwrap_err]           |
| unwrapOr                                  | [unwrap_or]            |
| unwrapOrElse                              | [unwrap_or_else]       |
| unwrapUnchecked                           | [unwrap_unchecked]     |
| unwrapErrUnchecked                        | [unwrap_err_unchecked] |
| and                                       | [and]                  |
| andThen                                   | [and_then]             |
| or                                        | [or]                   |
| orElse                                    | [or_else]              |
| transpose                                 | [transpose]            |

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

#### Synchronous Methods (`Result`)
##### `Result.isOk`

Returns `true` if the result is `Ok`.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

const x: Result<number, string> = Ok(2);
assert(x.isOk() === true);

const y: Result<number, string> = Err('Some error message');
assert(y.isOk() === false);
```

##### `Result.isOkAnd`

Returns `true` if the result is `Ok` and the value inside of it matches a predicate.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

const x: Result<number, string> = Ok(2);
assert(x.isOkAnd((value) => value > 1) === true);

const y: Result<number, string> = Ok(0);
assert(y.isOkAnd((value) => value > 1) === false);

const z: Result<number, string> = Err('Some error message');
assert(z.isOkAnd((value) => value > 1) === false);
```

##### `Result.isErr`

Returns `true` if the result is `Err`.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

const x: Result<number, string> = Ok(-3);
assert(x.isErr() === false);

const y: Result<number, string> = Err('Some error message');
assert(y.isErr() === true);
```

##### `Result.isErrAnd`

Returns `true` if the result is `Err` and the value inside of it matches a predicate.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

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

##### `Result.ok`

Converts from `Result<T, E>` to `Optional<T>` and discarding the error, if any.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

const x: Result<number, string> = Ok(2);
assert(x.ok() === 2);

const y: Result<number, string> = Err('Some error message');
assert(y.ok() === undefined);
```

##### `Result.err`

Converts from `Result<T, E>` to `Optional<E>` and discarding the success value, if any.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

const x: Result<number, string> = Ok(2);
assert(x.err() === undefined);

const y: Result<number, string> = Err('Some error message');
assert(y.err() === 'Some error message');
```

##### `Result.map`

Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.

This function can be used to compose the results of two functions.

Examples:

```ts
import { Ok, type Result } from '@rustresult/result';

const x: Result<string, string> = Ok('foo');
assert(x.map((value) => value.length).ok() === 3);
```

##### `Result.mapOr`

Returns the provided `fallback` (if `Err`), or applies a function to the contained value (if `Ok`).

Arguments passed to `mapOr` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `mapOrElse`, which is lazily evaluated.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

const x: Result<string, string> = Ok('foo');
assert(x.mapOr(42, (value) => value.length) === 3);

const y: Result<string, string> = Err('bar');
assert(y.mapOr(42, (value) => value.length) === 42);
```

##### `Result.mapOrElse`

Maps a `Result<T, E>` to `U` by applying fallback function `fallback` to a contained `Err` value, or function `map` to a contained `Ok` value.

This function can be used to unpack a successful result while handling an error.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

const k = 21;

const x: Result<string, string> = Ok('foo');
assert(x.mapOrElse((err) => k * 2, (value) => value.length) === 3);

const y: Result<string, string> = Err('bar');
assert(y.mapOrElse((err) => k * 2, (value) => value.length) === 42);
```

##### `Result.mapErr`

Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.

This function can be used to pass through a successful result while handling an error.

Examples:

```ts
import { Err, type Result } from '@rustresult/result';

const x: Result<number, Error> = Err(new Error('Some error message'));
assert(x.mapErr((err) => err.message).err() === 'Some error message');
```

##### `Result.inspect`

Calls the provided closure with a reference to the contained value if `Ok`.

Examples:

```ts
import { resultifySync } from '@rustresult/result';

const num = resultifySync<SyntaxError>()(JSON.parse)('4')
    .inspect((value: number) => console.log(`original: ${value}`))
    .map((value) => value ** 3)
    .expect('failed to parse number');
assert(num === 64);
```

##### `Result.inspectErr`

Calls the provided closure with a reference to the contained value if `Err`.

Examples:

```ts
import { resultifySync } from '@rustresult/result';

const num = resultifySync<SyntaxError>()(JSON.parse)('asdf')
    .inspectErr((err) => console.log(`failed to parse json string: ${err.message}`));
assert(num.err() instanceof SyntaxError);
```

##### `Result.expect`

Returns the contained `Ok` value.

Because this function may throw an error, its use is generally discouraged. Instead, prefer to call `unwrapOr`, `unwrapOrElse`.

Throws an Error if itself is `Err`, with an error message including the passed message, and the content of the `Err`.

Examples:

```ts
import { Err, type Result } from '@rustresult/result';

const x: Result<number, string> = Err('emergency failure');
x.expect('Failed to operate'); // throws Error('Failed to operate: emergency failure')
```

##### `Result.unwrap`

Returns the contained `Ok` value.

Because this function may throw an error, its use is generally discouraged. Instead, prefer to call `unwrapOr`, `unwrapOrElse`.

Throws an Error if itself is `Err`, with an error message provided by the `Err`'s value.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

const x: Result<number, string> = Ok(2);
assert(x.unwrap() === 2);

const y: Result<number, string> = Err('emergency failure');
y.unwrap(); // throws Error('emergency failure')
```

##### `Result.expectErr`

Returns the contained `Err` value.

Throws an Error if itself is `Err`, with an error message provided by the `Ok`'s value.

Examples:

```ts
import { Ok, type Result } from '@rustresult/result';

const x: Result<number, string> = Ok(10);
x.expectErr('Testing expectErr'); // throws Error('Testing expectErr: 10')
```

##### `Result.unwrapErr`

Returns the contained `Err` value.

Throws an Error if itself is `Ok`, with an error message provided by the `Ok`'s value.

Examples:

```ts
import { Ok, type Result } from '@rustresult/result';

const x: Result<number, string> = Err('emergency failure');
assert(x.unwrapErr() === 'emergency failure');

const y: Result<number, string> = Ok(2);
y.unwrapErr(); // throws Error(2)
```

##### `Result.unwrapOr`

Returns the contained `Ok` value or a provided default.

Arguments passed to `unwrapOr` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `unwrapOrElse`, which is lazily evaluated.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

const $default = 2;
const x: Result<number, string> = Ok(9);
assert(x.unwrapOr($default) === 9);

const y: Result<number, string> = Err('error');
assert(y.unwrapOr($default) === $default);
```

##### `Result.unwrapOrElse`

Returns the contained `Ok` value or computes it from a closure.

Examples:

```ts
import { Err, Ok } from '@rustresult/result';

const count = (err: string) => err.length;
assert(Ok<number, string>(2).unwrapOrElse(count) === 2);
assert(Err<number, string>('foo').unwrapOrElse(count) === 3);
```

##### `Result.unwrapUnchecked`

Returns the contained `Ok` value, without checking that the value is not an `Err`.

**SAFETY**: Calling this method on an `Err` is undefined behavior.
The safety contract must be upheld by the caller.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

const x: Result<number, string> = Ok(2);
assert(x.unwrapUnchecked() === 2);

const y: Result<number, string> = Err('emergency failure');
y.unwrapUnchecked();
```

##### `Result.unwrapErrUnchecked`

Returns the contained `Err` value, without checking that the value is not an `Ok`.

**SAFETY**: Calling this method on an `Ok` is undefined behavior.
The safety contract must be upheld by the caller.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

const x: Result<number, string> = Ok(2);
x.unwrapErrUnchecked();

const y: Result<number, string> = Err('emergency failure');
assert(y.unwrapErrUnchecked() === 'emergency failure');
```

##### `Result.and`

Returns `res` if itself is `Ok`, otherwise returns the `Err` value of itself.

Arguments passed to `and` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `andThen`, which is lazily evaluated.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

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

##### `Result.andThen`

Calls `op` if itself is `Ok`, otherwise returns the `Err` value of itself.

This function can be used for control flow based on `Result` values.

Examples:

```ts
import { Err, Ok, resultifySync } from '@rustresult/result';

const parseJSON = (json: string) =>
    resultifySync<SyntaxError>()(JSON.parse)(json).mapErr((err) => err.message);

assert(Ok<string, string>('2').andThen(parseJSON).equal(Ok(2)));
assert(
    Ok<string, string>('asdf')
        .andThen(parseJSON)
        .equal(Err('Unexpected token \'a\', "asdf" is not valid JSON')),
);
```

##### `Result.or`

Returns `res` if itself is `Err`, otherwise returns the `Ok` value of itself.

Arguments passed to `or` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `orElse`, which is lazily evaluated.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

let x: Result<number, string>;
let y: Result<number, string>;

x = Ok(2);
y = Err('late error');
assert(x.or(y).equal(Ok(2)));

x = Err('early error');
y = Ok(2);
assert(x.or(y).equal(Ok(2)));

x = Err('not a 2');
y = Err('late error');
assert(x.or(y).equal(Err('late error')));

x = Ok(2);
y = Ok(100);
assert(x.or(y).equal(Ok(2)));
```

##### `Result.orElse`

Calls `op` if the result is `Err`, otherwise returns the `Ok` value of self.

This function can be used for control flow based on `Result` values.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

const sq = (num: number): Result<number, number> => Ok(num * num);
const err = (num: number): Result<number, number> => Err(num);

assert(Ok(2).orElse(sq).orElse(sq).equal(Ok(2)));
assert(Ok(2).orElse(err).orElse(sq).equal(Ok(2)));
assert(Err<number, number>(3).orElse(sq).orElse(err).equal(Ok(9)));
assert(Err<number, number>(3).orElse(err).orElse(err).equal(Err(3)));
```

##### `Result.transpose`

Transposes a `Result` of an optional value into an optional of a `Result`.

`Ok(undefined | null)` will be mapped to `undefined`. `Ok(_)` and `Err(_)` will be mapped to `Ok(_)` and `Err(_)`.

Examples:

```ts
import { Err, Ok, type Result } from '@rustresult/result';

type SomeErr = unknown;

let x: Result<number | undefined | null, SomeErr>;
let y: Result<number, SomeErr> | undefined;

x = Ok(5);
y = Ok(5);
assert(x.transpose()!.equal(y));

x = Ok(undefined);
y = undefined;
assert(x.transpose() === y);

x = Ok(null);
y = undefined;
assert(x.transpose() === y);
```

#### Asynchronous Methods (`ResultAsync`)
##### `ResultAsync.isOk`

Asynchornously returns `true` if the result is `Ok`.

Examples:

```ts
import { ErrAsync, OkAsync, type ResultAsync } from '@rustresult/result';

const x: ResultAsync<number, string> = OkAsync(2);
assert((await x.isOk()) === true);

const y: ResultAsync<number, string> = ErrAsync('Some error message');
assert((await y.isOk()) === false);
```

##### `ResultAsync.isOkAnd`

Asynchronously returns `true` if the result is `Ok` and the value inside of it matches a predicate.

Examples:

```ts
import { ErrAsync, OkAsync, type ResultAsync } from '@rustresult/result';

const x: ResultAsync<number, string> = OkAsync(2);
assert((await x.isOkAnd((value) => Promise.resolve(value > 1))) === true);

const y: ResultAsync<number, string> = OkAsync(0);
assert((await y.isOkAnd((value) => Promise.resolve(value > 1))) === false);

const z: ResultAsync<number, string> = ErrAsync('Some error message');
assert((await z.isOkAnd((value) => Promise.resolve(value > 1))) === false);
```

##### `ResultAsync.isErr`

Asynchornously returns `true` if the result is `Err`.

Examples:

```ts
import { ErrAsync, OkAsync, type ResultAsync } from '@rustresult/result';

const x: ResultAsync<number, string> = OkAsync(-3);
assert((await x.isErr()) === false);

const y: ResultAsync<number, string> = ErrAsync('Some error message');
assert((await y.isErr()) === true);
```

##### `ResultAsync.isErrAnd`

Asynchronously returns `true` if the result is `Err` and the value inside of it matches a predicate.

Examples:

```ts
import { ErrAsync, OkAsync, type ResultAsync } from '@rustresult/result';

enum ErrorKind {
    NOT_FOUND,
    PERMISSION_DENIED,
}

const x: ResultAsync<number, ErrorKind> = ErrAsync(ErrorKind.NOT_FOUND);
assert((await x.isErrAnd((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === true);

const y: ResultAsync<number, ErrorKind> = ErrAsync(ErrorKind.PERMISSION_DENIED);
assert((await y.isErrAnd((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === false);

const z: ResultAsync<number, ErrorKind> = OkAsync(123);
assert((await z.isErrAnd((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === false);
```

##### `ResultAsync.ok`

Asynchornously converts from `ResultAsync<T, E>` to `Optional<T>` and discarding the error, if any.

Examples:

```ts
import { ErrAsync, OkAsync, type ResultAsync } from '@rustresult/result';

const x: ResultAsync<number, string> = OkAsync(2);
assert((await x.ok()) === 2);

const y: ResultAsync<number, string> = ErrAsync('Some error message');
assert((await y.ok()) === undefined);
```

##### `ResultAsync.err`

Asynchornously converts from `ResultAsync<T, E>` to `Optional<E>` and discarding the success value, if any.

Examples:

```ts
import { ErrAsync, OkAsync, type ResultAsync } from '@rustresult/result';

const x: ResultAsync<number, string> = OkAsync(2);
assert((await x.err()) === undefined);

const y: ResultAsync<number, string> = ErrAsync('Some error message');
assert((await y.err()) === 'Some error message');
```

##### `ResultAsync.map`

Asynchronously maps a `ResultAsync<T, E>` to `ResultAsync<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.

This function can be used to compose the results of two functions.

Examples:

```ts
import { OkAsync } from '@rustresult/result';

const x = OkAsync<string, string>('foo').map((value) => Promise.resolve(value.length));
assert((await x.ok()) === 3);
```

##### `ResultAsync.mapOr`

Asynchronously returns the provided `fallback` (if `Err`), or applies a function to the contained value (if `Ok`).

Arguments passed to `mapOr` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `mapOrElse`, which is lazily evaluated.

Examples:

```ts
import { ErrAsync, OkAsync, type ResultAsync } from '@rustresult/result';

const x: ResultAsync<string, string> = OkAsync('foo');
assert((await x.mapOr(42, (value) => value.length)) === 3);

const y: ResultAsync<string, string> = ErrAsync('bar');
assert((await y.mapOr(42, (value) => value.length)) === 42);
```

##### `ResultAsync.mapOrElse`

Asynchronously maps a `ResultAsync<T, E>` to `U` by applying fallback function `fallback` to a contained `Err` value, or function `map` to a contained `Ok` value.

This function can be used to unpack a successful result while handling an error.

Examples:

```ts
import { ErrAsync, OkAsync, type ResultAsync } from '@rustresult/result';

const k = 21;

const x: ResultAsync<string, string> = OkAsync('foo');
assert((await x.mapOrElse(() => Promise.resolve(k * 2), (value) => Promise.resolve(value.length))) === 3);

const y: ResultAsync<string, string> = ErrAsync('bar');
assert((await y.mapOrElse(() => Promise.resolve(k * 2), (value) => Promise.resolve(value.length))) === 42);
```

##### `ResultAsync.mapErr`

Asynchronously maps a `ResultAsync<T, E>` to `ResultAsync<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.

This function can be used to pass through a successful result while handling an error.

Examples:

```ts
import { ErrAsync } from '@rustresult/result';

const x = ErrAsync(new Error('Some error message')).mapErr((err) => Promise.resolve(err.message));
assert((await x.err()) === 'Some error message');
```

##### `ResultAsync.inspect`

Asynchronously calls the provided closure with a reference to the contained value if `Ok`.

Examples:

```ts
const num = await OkAsync(4)
    .inspect((value) => {
        console.log(`original: ${value}`);
    })
    .map((value) => value ** 3)
    .expect('Some error message');
assert(num === 64);
```

##### `ResultAsync.inspectErr`

Asynchronously calls the provided closure with a reference to the contained value if `Err`.

Examples:

```ts
const result = ErrAsync(new SyntaxError('Some error message')).inspectErr((err) => {
    console.log(`failed to do something: ${err.message}`);
});
assert((await result.err()) instanceof SyntaxError);
```

##### `ResultAsync.expect`

Asynchronously returns the contained `Ok` value.

Because this function may throw an error, its use is generally discouraged. Instead, prefer to call `unwrapOr`, `unwrapOrElse`.

Throws an Error if itself is `Err`, with an error message including the passed message, and the content of the `Err`.

Examples:

```ts
import { ErrAsync, type ResultAsync } from '@rustresult/result';

const x: ResultAsync<number, string> = ErrAsync('emergency failure');
await x.expect('Failed to operate'); // throws Error('Failed to operate: emergency failure')
```

##### `ResultAsync.unwrap`

Asynchronously returns the contained `Ok` value.

Because this function may throw an error, its use is generally discouraged. Instead, prefer to call `unwrapOr`, `unwrapOrElse`.

Throws an Error if itself is `Err`, with an error message provided by the `Err`'s value.

Examples:

```ts
import { ErrAsync, OkAsync, type ResultAsync } from '@rustresult/result';

const x: ResultAsync<number, string> = OkAsync(2);
assert((await x.unwrap()) === 2);

const y: ResultAsync<number, string> = ErrAsync('emergency failure');
await y.unwrap(); // throws Error('emergency failure')
```

##### `ResultAsync.expectErr`

Asynchronously returns the contained `Err` value.

Throws an Error if itself is `Err`, with an error message provided by the `Ok`'s value.

Examples:

```ts
import { OkAsync, type ResultAsync } from '@rustresult/result';

const x: ResultAsync<number, string> = OkAsync(10);
await x.expectErr('Testing expectErr'); // throws Error('Testing expectErr: 10')
```

##### `ResultAsync.unwrapErr`

Asynchronously returns the contained `Err` value.

Throws an Error if itself is `Ok`, with an error message provided by the `Ok`'s value.

Examples:

```ts
import { OkAsync, type ResultAsync } from '@rustresult/result';

const x: ResultAsync<number, string> = Err('emergency failure');
assert((await x.unwrapErr()) === 'emergency failure');

const y: ResultAsync<number, string> = OkAsync(2);
await y.unwrapErr(); // throws Error(2)
```

##### `ResultAsync.unwrapOr`

Asynchronously returns the contained `Ok` value or a provided default.

Arguments passed to `unwrapOr` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `unwrapOrElse`, which is lazily evaluated.

Examples:

```ts
import { ErrAsync, OkAsync, type ResultAsync } from '@rustresult/result';

const $default = 2;
const x: ResultAsync<number, string> = OkAsync(9);
assert((await x.unwrapOr($default)) === 9);

const y: ResultAsync<number, string> = ErrAsync('error');
assert((await y.unwrapOr($default)) === $default);
```

##### `ResultAsync.unwrapOrElse`

Asynchronously returns the contained `Ok` value or computes it from a closure.

Examples:

```ts
import { ErrAsync, OkAsync } from '@rustresult/result';

const count = (err: string) => Promise.resolve(err.length);
assert((await OkAsync<number, string>(2).unwrapOrElse(count)) === 2);
assert((await ErrAsync<number, string>('foo').unwrapOrElse(count)) === 3);
```

##### `ResultAsync.unwrapUnchecked`

Asynchronously returns the contained `Ok` value, without checking that the value is not an `Err`.

**SAFETY**: Calling this method on an `Err` is undefined behavior.
The safety contract must be upheld by the caller.

Examples:

```ts
import { ErrAsync, OkAsync, type ResultAsync } from '@rustresult/result';

const x: ResultAsync<number, string> = OkAsync(2);
assert((await x.unwrapUnchecked()) === 2);

const y: ResultAsync<number, string> = ErrAsync('emergency failure');
await y.unwrapUnchecked();
```

##### `ResultAsync.unwrapErrUnchecked`

Asynchronously returns the contained `Err` value, without checking that the value is not an `Ok`.

**SAFETY**: Calling this method on an `Ok` is undefined behavior.
The safety contract must be upheld by the caller.

Examples:

```ts
import { ErrAsync, OkAsync, type ResultAsync } from '@rustresult/result';

const x: ResultAsync<number, string> = OkAsync(2);
await x.unwrapErrUnchecked();

const y: ResultAsync<number, string> = ErrAsync('emergency failure');
assert((await y.unwrapErrUnchecked()) === 'emergency failure');
```

##### `ResultAsync.and`

Asynchronously returns `res` if itself is `Ok`, otherwise returns the `Err` value of itself.

Arguments passed to `and` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `andThen`, which is lazily evaluated.

Examples:

```ts
import { Err, ErrAsync, Ok, OkAsync, type ResultAsync } from '@rustresult/result';

let x: ResultAsync<number, string>;
let y: ResultAsync<string, string>;

x = OkAsync(2);
y = ErrAsync('late error');
assert(await x.and(y).equal(Err('late error')));

x = ErrAsync('early error');
y = OkAsync('foo');
assert(await x.and(y).equal(Err('early error')));

x = ErrAsync('not a 2');
y = ErrAsync('late error');
assert(await x.and(y).equal(Err('not a 2')));

x = OkAsync(2);
y = OkAsync('different result type');
assert(await x.and(y).equal(Ok('different result type')));
```

##### `ResultAsync.andThen`

Asynchronously calls `op` if itself is `Ok`, otherwise returns the `Err` value of itself.

This function can be used for control flow based on `ResultAsync` values.

Examples:

```ts
import { Err, ErrAsync, Ok, OkAsync, type ResultAsync } from '@rustresult/result';

const sq = (num: number): ResultAsync<number, number> => OkAsync(num * num);
const err = (num: number): ResultAsync<number, number> => ErrAsync(num);

const x = OkAsync<number, number>(2).andThen(sq).andThen(sq);
assert(await x.equal(Ok(16)));

const y = OkAsync<number, number>(2).andThen(sq).andThen(err);
assert(await y.equal(Err(4)));

const z = OkAsync<number, number>(2).andThen(err).andThen(err);
assert(await z.equal(Err(2)));
```

##### `ResultAsync.or`

Returns `res` if itself is `Err`, otherwise returns the `Ok` value of itself.

Arguments passed to `or` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `orElse`, which is lazily evaluated.

Examples:

```ts
import { Err, ErrAsync, Ok, OkAsync, type ResultAsync } from '@rustresult/result';

let x: ResultAsync<number, string>;
let y: ResultAsync<number, string>;

x = OkAsync(2);
y = ErrAsync('late error');
assert(await x.or(y).equal(Ok(2)));

x = ErrAsync('early error');
y = OkAsync(2);
assert(await x.or(y).equal(Ok(2)));

x = ErrAsync('not a 2');
y = ErrAsync('late error');
assert(await x.or(y).equal(Err('late error')));

x = OkAsync(2);
y = OkAsync(100);
assert(await x.or(y).equal(Ok(2)));
```

##### `ResultAsync.orElse`

Asynchronously calls `op` if the result is `Err`, otherwise returns the `Ok` value of self.

This function can be used for control flow based on `ResultAsync` values.

Examples:

```ts
import { Err, ErrAsync, Ok, OkAsync, type ResultAsync } from '@rustresult/result';

const sq = (num: number): ResultAsync<number, number> => OkAsync(num * num);
const err = (num: number): ResultAsync<number, number> => ErrAsync(num);

const x = OkAsync(2).orElse(sq).orElse(sq);
assert(await x.equal(Ok(2)));

const y = ErrAsync<number, number>(3).orElse(sq).orElse(err);
assert(await y.equal(Ok(9)));

const z = ErrAsync<number, number>(3).orElse(err).orElse(err);
assert(await z.equal(Err(3)));
```

##### `ResultAsync.transpose`

Asynchronously transposes a `ResultAsync` of an optional value into an optional of a `ResultAsync`.

`OkAsync(undefined | null)` will be mapped to `Promise<undefined>`. `OkAsync(_)` and `ErrAsync(_)` will be mapped to `OkAsync(_)` and `ErrAsync(_)`.

Examples:

```ts
import { OkAsync, type ResultAsync } from '@rustresult/result';

type SomeErr = unknown;

let x: ResultAsync<number | undefined | null, SomeErr>;
let y: ResultAsync<number, SomeErr> | undefined;

x = OkAsync(5);
y = OkAsync(5);
assert(await x.transpose()!.equal(y));

x = OkAsync(undefined);
y = undefined;
assert((await x.transpose()) === y);

x = OkAsync(null);
y = undefined;
assert((await x.transpose()) === y);
```

### Additional Methods
#### `.equal`

You can not just use `===` or `==` to compare `Result` or `ResultAsync`, so `Result` and `ResultAsync` themselves provide an method call `equal` for that.

There is no built-in deep-equal support in this package for array, object, built-in classes like `Date`, custom classes. If you do want to deeply compare those complex structures, you will have to write your own helper functions.

There is a [proposal] (stage 2) that introduces `Record` and `Tuple` which are compared by content rather than identity. In the future, we can use `Record` and `Tuple` in `Result` so that we don't need to implement custom equality comparison function.

[proposal]: https://github.com/tc39/proposal-record-tuple

##### `Result.equal`

Returns `true` if `self` equals to `other`.

Examples:

```ts
import { Err, Ok } from '@rustresult/result';

assert(Ok(1).equal(Ok(1)));
assert(Ok(NaN).equal(Ok(NaN)));
assert(Err('err').equal(Err('err')));

assert(Ok(1).equal(Ok(2)) === false);
assert(Err('err 1').equal(Err(-1)) === false);

assert(Ok(Ok(1)).equal(Ok(Ok(1))));
assert(Ok(Err('err')).equal(Ok(Err('err'))));
assert(Err(Err('err')).equal(Err(Err('err'))));
assert(Err(Ok(1)).equal(Err(Ok(1))));

assert(Ok(Ok(1)).equal(Ok(Ok(2))) === false);
assert(Ok(Ok(1)).equal(Ok(Err('err'))) === false);
assert(Err(Ok(1)).equal(Err(Err('err'))) === false);

assert(Ok([1]).equal(Ok([1])) === false);
assert(Ok({ foo: 1 }).equal(Ok({ foo: 1 })) === false);
assert(Ok(Ok([1])).equal(Ok(Ok([1]))) === false);
assert(Ok(Ok({ foo: 1 })).equal(Ok(Ok({ foo: 1 }))) === false);
```

##### `ResultAsync.equal`

Asynchronously returns `true` if `self` equals to `other`.

Examples:

```ts
import { Err, ErrAsync, Ok, OkAsync, type ResultAsync } from '@rustresult/result';

assert(await OkAsync(1).equal(Ok(1)));
assert(await OkAsync(1).equal(Promise.resolve(Ok(1))));
assert(await OkAsync(1).equal(OkAsync(1)));

assert((await OkAsync(1).equal(Ok(2))) === false);
assert((await OkAsync(1).equal(Promise.resolve(Ok(2)))) === false);
assert((await OkAsync(1).equal(OkAsync(2))) === false);

assert(await OkAsync(Ok(1)).equal(Ok(Ok(1))));
assert(await OkAsync(Ok(1)).equal(Ok(OkAsync(1))));
assert(await OkAsync(Ok(1)).equal(Promise.resolve(Ok(Ok(1)))));
assert(await OkAsync(Ok(1)).equal(OkAsync(Promise.resolve(Ok(1)))));
assert(await OkAsync(Ok(1)).equal(OkAsync(OkAsync(1))));
assert(await OkAsync(Promise.resolve(Ok(1))).equal(Promise.resolve(Ok(OkAsync(1)))));
assert(await OkAsync(OkAsync(1)).equal(OkAsync(Ok(1))));

assert((await OkAsync([1]).equal(Ok([1]))) === false);
assert((await OkAsync({ foo: 1 }).equal(Promise.resolve(Ok({ foo: 1 })))) === false);
assert((await ErrAsync({ message: 'err' }).equal(ErrAsync({ message: 'err' }))) === false);

assert((await OkAsync(Ok([1])).equal(Ok(Ok([1])))) === false);
assert((await OkAsync(Ok([1])).equal(OkAsync(OkAsync([1])))) === false);
assert((await OkAsync(Promise.resolve(Ok([1]))).equal(OkAsync(Ok([1])))) === false);
assert((await OkAsync(Promise.resolve(Ok({ foo: 1 }))).equal(Ok(OkAsync({ foo: 1 })))) === false);
assert((await OkAsync(OkAsync({ foo: 1 })).equal(OkAsync(OkAsync({ foo: 1 })))) === false);
```

#### `Result.async`

Converts this result to an async `Result` so it can work in asynchronous code.

Examples:

```ts
import { Ok } from '@rustresult/result';

function fn(value: number): Promise<number> {
    // do something asynchronously
    return Promise.resolve(value ** 2);
}

const num = await Ok<number, string>(3)
    .async()
    .map(fn)
    .inspectErr((err) => {
        console.log(err);
    })
    .ok();
assert(num === 9);
```

## Helpers for Resultifying
### `resultifyAsync`

Takes a function and returns a version that returns results asynchronously.

```ts
import fs from 'node:fs/promises';
import { resultifyAsync } from '@rustresult/result';

const copyFile1 = resultifyAsync(fs.copyFile);
const copyFile2 = resultifyAsync<Error>()(fs.copyFile);
```

### `resultifySync`

Takes a function and returns a version that returns results synchronously.

```ts
import { resultifySync } from '@rustresult/result';

/**
 * @throws {Error} Some error messages
 */
function fn(): string {
    // do something
}

const fn1 = resultifySync(fn);
const fn1 = resultifySync<Error>()(fn);
```

In the context where async functions are not allowed, you can use this function to resultify the sync function.

### `resultifyPromise`

Takes a promise and returns a new promise that contains a result.

```ts
import { resultifyPromise } from '@rustresult/result';

const result = await resultifyPromise(promise);
```

Due to the limit of TypeScript,it's impossible to resultify overloaded functions perfectly that the returned functions are still overloaded.
This function allows you to resultify the promise that the overloaded functions return.

## Write Your Own Implementation of `Result`?

Although you do have the ability to do so, it's not recommended that you write your own implementation.

The default implementation that this package provides should meet your requirements in most cases. If if leaks some abilities please feel free to file an issue.
