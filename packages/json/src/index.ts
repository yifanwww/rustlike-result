import type { Result, ResultJson } from '@rustresult/result';
import { Err, Ok, RESULT_SYMBOL } from '@rustresult/result';

function isResult(value: Exclude<unknown, null | undefined>): value is Result<unknown, unknown> {
    return (value as Result<unknown, unknown>).symbol === RESULT_SYMBOL;
}

/**
 * Converts a `Result` to a JSON object.
 */
function toJSON(result: unknown): unknown {
    if (result === undefined || result === null) return result;

    if (isResult(result)) {
        return result.isOk()
            ? { type: 'ok', value: toJSON(result.unwrapUnchecked()) }
            : { type: 'err', value: toJSON(result.unwrapErrUnchecked()) };
    }

    return result;
}

/**
 * A simple implementation that convert `Result` to and from JSON object.
 *
 * The format of the JSON object follows the adjacently tagged enum representation in Rust library Serde.
 * https://serde.rs/enum-representations.html#adjacently-tagged
 */
export const ResultJSON = {
    /**
     * Converts a `Result` to a JSON object.
     *
     * The format of the JSON object follows the adjacently tagged enum representation in Rust library Serde.
     * https://serde.rs/enum-representations.html#adjacently-tagged
     *
     * The nested `Result` will be serialized.
     */
    serialize<T, E>(result: Result<unknown, unknown>): ResultJson<T, E> {
        return toJSON(result) as ResultJson<T, E>;
    },

    /**
     * Converts a JSON object into a `Result`.
     *
     * This function won't convert any `Result` JSON object inside of `Result`.
     * The result of `{"type":"ok","value":{"type":"ok","value":1}}` is `Ok({ type: 'ok', value: 1 })`.
     *
     * The format of the JSON object follows the adjacently tagged enum representation in Rust library Serde.
     * https://serde.rs/enum-representations.html#adjacently-tagged
     */
    deserialize<T, E>(json: ResultJson<unknown, unknown>): Result<Result<T, E>, Error> {
        try {
            if ('type' in json) {
                if (json.type === 'ok') {
                    return Ok(Ok(json.value as T));
                } else if (json.type === 'err') {
                    return Ok(Err(json.value as E));
                }
            }
            return Err(new Error('Cannot parse to Result'));
        } catch (err) {
            return Err(err as Error);
        }
    },
};
