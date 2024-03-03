# CHANGELOG
## rustlike-result v0.3.2 (2024-03-03)
### Breaking Changes

- `Optional` type is no longer exported, you can just simply write `T | undefined`.

### Features

Support new methods:
- `inspect`
- `inspectErr`

## rustlike-result v0.3.2 (2024-01-02)
### Bug Fixes

Correct `exports` in package.json, run commonjs code in Node.js environment, while the bundlers can still bundle the fake esm code.

## rustlike-result v0.3.1 (2023-09-24)
### Features

Add async methods:
- `isOkAndAsync`
- `isErrAndAsync`
- `mapAsync`
- `mapOrAsync`
- `mapOrElseAsync`
- `mapErrAsync`
- `unwrapOrElseAsync`
- `andThenAsync`
- `orElseAsync`

## rustlike-result v0.3.0 (2023-09-23)
### Features

Adds JSON serialization and deserialization support with these functions:
- `ResultJSON.serialize`
- `ResultJSON.deserialize`
- `createResultModelSchema`
- `resultPropSchema`

## rustlike-result v0.2.0 (2023-09-17)
### Features

Adds resultify help funtions
- `resultify`
- `resultify.sync`
- `resultify.promise`

## rustlike-result v0.1.0 (2023-09-13)
### Features

Implements `Result` with these methods:
- isOk
- isOkAnd
- isErr
- isErrAnd
- ok
- err
- map
- mapOr
- mapOrElse
- mapErr
- expect
- unwrap
- expectErr
- unwrapErr
- unwrapOr
- unwrapOrElse
- unwrapUnchecked
- unwrapErrUnchecked
- and
- andThen
- or
- orElse
- transpose

Implements `Ok` and `Err` to create `Result`
