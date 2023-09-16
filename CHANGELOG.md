# CHANGELOG
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
