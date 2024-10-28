# CHANGELOG
## rustlike-result v0.5.1 (2024-10-28)
### Features

Add helpers for TypeORM:
- `typeormTransaction`

## rustlike-result v0.5.0 (2024-08-20)
### Breaking Changes

All deprecated functions and methods are deleted:
- `Result.isOkAndAsync`
- `Result.isErrAndAsync`
- `Result.mapAsync`
- `Result.mapOrAsync`
- `Result.mapOrElseAsync`
- `Result.mapErrAsync`
- `Result.inspectAsync`
- `Result.inspectErrAsync`
- `Result.unwrapOrElseAsync`
- `Result.andThenAsync`
- `Result.orElseAsync`
- `resultify`
- `resultify.sync`
- `resultify.promise`

## rustlike-result v0.4.6 (2024-06-15)
### Features

Add new package exports for `jest`:
- `rustlike-result/cjs`
- `rustlike-result/cjs/serializr`

## rustlike-result v0.4.5 (2024-06-15)
### Features

Add new factory `fromPromiseableResult`

## rustlike-result v0.4.4 (2024-06-08)
### Features

Add asynchronous Result `ResultAsync`, support these methods:
- `ResultAsync.isOk`
- `ResultAsync.isOkAnd`
- `ResultAsync.isErr`
- `ResultAsync.isErrAnd`
- `ResultAsync.ok`
- `ResultAsync.err`
- `ResultAsync.map`
- `ResultAsync.mapOr`
- `ResultAsync.mapOrElse`
- `ResultAsync.mapErr`
- `ResultAsync.inspect`
- `ResultAsync.inspectErr`
- `ResultAsync.expect`
- `ResultAsync.unwrap`
- `ResultAsync.expectErr`
- `ResultAsync.unwrapErr`
- `ResultAsync.unwrapOr`
- `ResultAsync.unwrapOrElse`
- `ResultAsync.unwrapUnchecked`
- `ResultAsync.unwrapErrUnchecked`
- `ResultAsync.and`
- `ResultAsync.andThen`
- `ResultAsync.or`
- `ResultAsync.orElse`
- `ResultAsync.transpose`
- `ResultAsync.equal`

Add new factories:
- `OkAsync`
- `ErrAsync`

Support new methods for `Result`:
- `Result.async`

Add new resultifying helpers:
- `resultifyAsync`
- `resultifySync`
- `resultifyPromise`

### Notable Changes

These methods are deprecated:
- `Result.isOkAndAsync`
- `Result.isErrAndAsync`
- `Result.mapAsync`
- `Result.mapOrAsync`
- `Result.mapOrElseAsync`
- `Result.mapErrAsync`
- `Result.inspectAsync`
- `Result.inspectErrAsync`
- `Result.unwrapOrElseAsync`
- `Result.andThenAsync`
- `Result.orElseAsync`

These helpers are deprecated:
- `resultify`
- `resultify.sync`
- `resultify.promise`

## rustlike-result v0.4.3 (2024-04-14)
### Features

- Narrow down `Result` type after `isOk` or `isErr`

## rustlike-result v0.4.2 (2024-03-23)
### Features

- Remove type limit of `equal` method
- Add doc examples for Rust-like Result methods

## rustlike-result v0.4.1 (2024-03-17)
### Features

Support new methods:
- `inspectAsync`
- `inspectErrAsync`

## rustlike-result v0.4.0 (2024-03-03)
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
