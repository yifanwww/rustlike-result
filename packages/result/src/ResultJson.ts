/**
 * The type that represents the JSON object structure of `Result`.
 *
 * `value` may not exist if `T` or `E` is `undefined`.
 */
export type ResultJson<T, E> =
    | (undefined extends T ? { type: 'ok'; value?: T } : { type: 'ok'; value: T })
    | (undefined extends E ? { type: 'err'; value?: E } : { type: 'err'; value: E });
