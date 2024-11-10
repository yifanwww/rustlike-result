# Rust-Like `Result`

Rust-like `Result` and `ResultAsync` for JavaScript.

`Result` is a type that represents either success (`Ok`) or `failure` (`Err`), `ResultAsync` is the asynchronous version of `Result`.

## Table Of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
  - [Rust-Like `Result` Core](#rust-like-result-core)
  - [JSON Serialization \& Deserialization](#json-serialization--deserialization)
  - [Third-Party Library Helpers](#third-party-library-helpers)
- [About Rust `Option`](#about-rust-option)
- [License](#license)

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

## API Documentation
### Rust-Like `Result` Core

Check out [`@rustresult/result`] for the core of Rust-like `Result`

[`@rustresult/result`]: https://github.com/yifanwww/rustlike-result/tree/main/packages/result

### JSON Serialization & Deserialization

- Check out [`@rustresult/json`] for the simple JSON (de)serialization support
- Check out [`@rustresult/json-serializr`] for the better JSON (de)serialization support using the `serializr` library

[`@rustresult/json`]: https://github.com/yifanwww/rustlike-result/tree/main/packages/json
[`@rustresult/json-serializr`]: https://github.com/yifanwww/rustlike-result/tree/main/packages/json-serializr

### Third-Party Library Helpers

`Result` is not a built-in feature in JavaScript world. You will definitely feel that it's hard to make `Result` work with third-party libraries. There are also some helpers for you.

- Check out [`@rustresult/typeorm`] for helpers that can help you use the `typeorm` library

[`@rustresult/typeorm`]: https://github.com/yifanwww/rustlike-result/tree/main/packages/typeorm

## About Rust `Option`

This project doesn't implement Rust-like `Option`. Handling `undefined`/`null` is not as hard as it was a few years ago, because right now we already have these proposals to help handle it:

- [proposal-optional-chaining](https://github.com/tc39/proposal-optional-chaining)
- [proposal-nullish-coalescing](https://github.com/tc39/proposal-nullish-coalescing)
- [proposal-logical-assignment](https://github.com/tc39/proposal-logical-assignment)

## License

The `rustlike-result` project is available as open source under the terms of the [MIT license].

[MIT license]: https://github.com/yifanwww/rustlike-result/blob/main/LICENSE
