# CHANGELOG
## @rustresult/json v0.7.0 (Unreleased)
### Breaking Changes

**This package is now pure ESM.**

Requires `@rustresult/result v0.7.0`.

### Bug Fixes

Fix incorrect result of `ResultJSON.serialize(Ok(Ok(undefined)))`

## @rustresult/json v0.6.0 (2024-11-10)
### Features

Adds a simple JSON (de)serialization support for `@rustresult/result`:
- `ResultJSON.serialize`
- `ResultJSON.deserialize`
