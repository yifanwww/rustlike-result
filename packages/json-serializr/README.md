# @rustresult/json-serializr

This package provides some helpers that can help you (de)serialize `Result` objects by `serializr`.

## Table Of Contents

- [Installation](#installation)
- [Usage](#usage)
- [JSON Representation Format](#json-representation-format)

## Installation

```sh
> npm install @rustresult/json-serializr
> pnpm install @rustresult/json-serializr
> yarn add @rustresult/json-serializr
```

## Usage

Once you installed `serializr`, you can use these two helpers `resultPropSchema` and `createResultModelSchema` as shown in the following example:

```ts
import { createResultModelSchema, resultPropSchema } from '@rustresult/json-serializr';

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

## JSON Representation Format

The format of the JSON object follows the [adjacently tagged enum representation] in Rust library Serde.
The reason it doesn't follow the [externally tagged enum representation] (the default in Serde) is that, the externally tagged representation of `Ok(undefined)` and `Err(undefined)` are both `{}`, therefore we can't tell whether `{}` should be deserialized to `Ok(undefined)` or `Err(undefined)`.

[adjacently tagged enum representation]: https://serde.rs/enum-representations.html#adjacently-tagged
[externally tagged enum representation]: https://serde.rs/enum-representations.html#externally-tagged
