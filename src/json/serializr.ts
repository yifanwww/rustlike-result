import { SKIP, alias, createModelSchema, custom, raw } from 'serializr';
import type { AdditionalPropArgs, ModelSchema, PropDeserializer, PropSchema, PropSerializer } from 'serializr';

import { Err, Ok } from '../factory';
import type { Result } from '../Result';
import { RustlikeResult } from '../RustlikeResult';
import type { Optional, ResultType } from '../types.internal';

import type { ResultJson } from './types';

export interface ResultPropSchemas {
    ok?: PropSchema;
    err?: PropSchema;
}

/**
 * Creates a custom prop schema for fields whose type are `Result`.
 *
 * @param schemas Prop schemas to customize how to (de)serialize the `ok` and `err` values.
 * @param additionalArgs Optional object that contains `beforeDeserialize` and/or `afterDeserialize` handlers.
 */
export function resultPropSchema(schemas?: ResultPropSchemas, additionalArgs?: AdditionalPropArgs): PropSchema {
    const okPropSchema = schemas?.ok ?? raw();
    const errPropSchema = schemas?.err ?? raw();

    const serializer: PropSerializer = (result: Result<unknown, unknown>): ResultJson<unknown, unknown> => {
        return result.isOk()
            ? { type: 'ok', value: okPropSchema.serializer(result.unwrapUnchecked(), 'value', result) }
            : { type: 'err', value: errPropSchema.serializer(result.unwrapErrUnchecked(), 'value', result) };
    };

    const deserializer: PropDeserializer = (jsonValue: ResultJson<unknown, unknown>, done, context) => {
        if (typeof jsonValue !== 'object' || jsonValue === null || !('type' in jsonValue)) {
            return void done(new Error('expected valid `Result` JSON object'));
        }

        const deserialize = (propSchema: PropSchema, create: (value: unknown) => Result<unknown, unknown>) => {
            const handleDeserialized = (err: unknown, value?: unknown) => {
                return err ? void done(err) : void done(undefined, create(value));
            };

            const afterDeserialization = (err: unknown, value: unknown) => {
                if (typeof propSchema.afterDeserialize === 'function') {
                    propSchema.afterDeserialize(
                        handleDeserialized,
                        err,
                        value,
                        jsonValue.value,
                        jsonValue,
                        'value',
                        context,
                        propSchema,
                    );
                } else {
                    handleDeserialized(err, value);
                }
            };

            const deserializeImpl = (err: unknown, value: unknown) => {
                if (err) {
                    handleDeserialized(err);
                } else {
                    propSchema.deserializer(value, afterDeserialization, context);
                }
            };

            if (typeof propSchema.beforeDeserialize === 'function') {
                propSchema.beforeDeserialize(deserializeImpl, jsonValue.value, jsonValue, 'value', context, propSchema);
            } else {
                deserializeImpl(undefined, jsonValue.value);
            }
        };

        if (jsonValue.type === 'ok') {
            deserialize(okPropSchema, Ok);
        } else if (jsonValue.type === 'err') {
            deserialize(errPropSchema, Err);
        } else {
            done(new Error('expected valid `Result` JSON object'));
        }
    };

    return {
        ...additionalArgs,
        serializer,
        deserializer,
    };
}

/**
 * Creates a model schema that (de)serializes a `Result` object/instance.
 * The created model schema is associated by `Result` type as default model schema, see setDefaultModelSchema.
 *
 * @param schemas Prop schemas to customize how to (de)serialize the `ok` and `err` values.
 */
export function createResultModelSchema<T, E>(schemas?: ResultPropSchemas): ModelSchema<Result<T, E>> {
    const okPropSchema = schemas?.ok ?? raw();
    const errPropSchema = schemas?.err ?? raw();

    const resultValueLifecycleFunctionsFactory = (type: ResultType, propSchema: PropSchema): AdditionalPropArgs => ({
        afterDeserialize: typeof propSchema.afterDeserialize === 'function' ? propSchema.afterDeserialize : undefined,

        beforeDeserialize: (done, jsonValue, result: ResultJson<unknown, unknown>, propName, context, propDef) => {
            if (result.type === type) {
                if (typeof propSchema.beforeDeserialize === 'function') {
                    propSchema.beforeDeserialize(done, jsonValue, result, propName, context, propDef);
                } else {
                    done(undefined, jsonValue);
                }
            }
        },
    });

    const typePropSchema = custom(
        (value: unknown) => value,

        (jsonValue, context, oldValue, done) => {
            return jsonValue instanceof Error ? void done(jsonValue, undefined) : void done(undefined, jsonValue);
        },

        {
            beforeDeserialize: (done, jsonValue: ResultType) => {
                // https://github.com/mobxjs/serializr/issues/181
                // done(err) here doesn't stop the deserialization and throw errors,
                // we have to pass the error as the JSON value and check it in `deserializer`
                return jsonValue === 'ok' || jsonValue === 'err'
                    ? void done(undefined, jsonValue)
                    : void done(undefined, new Error('expected valid `Result` JSON object'));
            },
        },
    );

    const valuePropSchema = custom(
        (value, key, result: Result<T, E>): Optional<ResultJson<unknown, unknown>> => {
            return result.isOk() ? okPropSchema.serializer(value, key, result) : SKIP;
        },

        (jsonValue, context, oldValue, done) => okPropSchema.deserializer(jsonValue, done, context, oldValue),

        resultValueLifecycleFunctionsFactory('ok', okPropSchema),
    );

    const errorPropSchema = custom(
        (value, key, result: Result<T, E>): Optional<ResultJson<unknown, unknown>> => {
            return result.isErr() ? errPropSchema.serializer(value, key, result) : SKIP;
        },

        (jsonValue, context, oldValue, done) => errPropSchema.deserializer(jsonValue, done, context, oldValue),

        resultValueLifecycleFunctionsFactory('err', errPropSchema),
    );

    return createModelSchema(RustlikeResult<T, E>, {
        _type: alias('type', typePropSchema),
        _value: alias('value', valuePropSchema),
        _error: alias('value', errorPropSchema),
    });
}
