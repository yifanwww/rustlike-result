import { describe, expect, it } from '@jest/globals';
import { Err, Ok } from '@rustresult/result';

import { ResultJSON } from '../index';

describe(`Test fn \`${ResultJSON.serialize.name}\``, () => {
    it('should convert a Result to a JSON object', () => {
        expect(ResultJSON.serialize(Ok(1))).toStrictEqual({ type: 'ok', value: 1 });
        expect(ResultJSON.serialize(Ok('hello world'))).toStrictEqual({ type: 'ok', value: 'hello world' });
        expect(ResultJSON.serialize(Ok(null))).toStrictEqual({ type: 'ok', value: null });
        expect(ResultJSON.serialize(Ok(undefined))).toStrictEqual({ type: 'ok', value: undefined });
        expect(ResultJSON.serialize(Ok({}))).toStrictEqual({ type: 'ok', value: {} });
        expect(ResultJSON.serialize(Ok([]))).toStrictEqual({ type: 'ok', value: [] });

        expect(ResultJSON.serialize(Err(1))).toStrictEqual({ type: 'err', value: 1 });
        expect(ResultJSON.serialize(Err('hello world'))).toStrictEqual({ type: 'err', value: 'hello world' });
        expect(ResultJSON.serialize(Err(null))).toStrictEqual({ type: 'err', value: null });
        expect(ResultJSON.serialize(Err(undefined))).toStrictEqual({ type: 'err', value: undefined });
        expect(ResultJSON.serialize(Err({}))).toStrictEqual({ type: 'err', value: {} });
        expect(ResultJSON.serialize(Err([]))).toStrictEqual({ type: 'err', value: [] });

        expect(ResultJSON.serialize(Ok(Ok(1)))).toStrictEqual({ type: 'ok', value: { type: 'ok', value: 1 } });
        expect(ResultJSON.serialize(Ok(Err(1)))).toStrictEqual({ type: 'ok', value: { type: 'err', value: 1 } });
        expect(ResultJSON.serialize(Err(Ok(1)))).toStrictEqual({ type: 'err', value: { type: 'ok', value: 1 } });
        expect(ResultJSON.serialize(Err(Err(1)))).toStrictEqual({ type: 'err', value: { type: 'err', value: 1 } });
    });
});

describe(`Test fn \`${ResultJSON.deserialize.name}\``, () => {
    it('should parse the valid `Result` JSON object', () => {
        expect(ResultJSON.deserialize({ type: 'ok', value: 1 })).toStrictEqual(Ok(Ok(1)));
        expect(ResultJSON.deserialize({ type: 'ok', value: 'hello world' })).toStrictEqual(Ok(Ok('hello world')));
        expect(ResultJSON.deserialize({ type: 'ok', value: null })).toStrictEqual(Ok(Ok(null)));
        expect(ResultJSON.deserialize({ type: 'ok' })).toStrictEqual(Ok(Ok(undefined)));
        expect(ResultJSON.deserialize({ type: 'ok', value: undefined })).toStrictEqual(Ok(Ok(undefined)));
        expect(ResultJSON.deserialize({ type: 'ok', value: {} })).toStrictEqual(Ok(Ok({})));
        expect(ResultJSON.deserialize({ type: 'ok', value: [] })).toStrictEqual(Ok(Ok([])));

        expect(ResultJSON.deserialize({ type: 'err', value: 1 })).toStrictEqual(Ok(Err(1)));
        expect(ResultJSON.deserialize({ type: 'err', value: 'hello world' })).toStrictEqual(Ok(Err('hello world')));
        expect(ResultJSON.deserialize({ type: 'err', value: null })).toStrictEqual(Ok(Err(null)));
        expect(ResultJSON.deserialize({ type: 'err' })).toStrictEqual(Ok(Err(undefined)));
        expect(ResultJSON.deserialize({ type: 'err', value: undefined })).toStrictEqual(Ok(Err(undefined)));
        expect(ResultJSON.deserialize({ type: 'err', value: {} })).toStrictEqual(Ok(Err({})));
        expect(ResultJSON.deserialize({ type: 'err', value: [] })).toStrictEqual(Ok(Err([])));

        expect(ResultJSON.deserialize({ type: 'ok', value: { type: 'ok', value: 1 } })).toStrictEqual(
            Ok(Ok({ type: 'ok', value: 1 })),
        );
        expect(ResultJSON.deserialize({ type: 'ok', value: { type: 'err', value: 1 } })).toStrictEqual(
            Ok(Ok({ type: 'err', value: 1 })),
        );
        expect(ResultJSON.deserialize({ type: 'err', value: { type: 'ok', value: 1 } })).toStrictEqual(
            Ok(Err({ type: 'ok', value: 1 })),
        );
        expect(ResultJSON.deserialize({ type: 'err', value: { type: 'err', value: 1 } })).toStrictEqual(
            Ok(Err({ type: 'err', value: 1 })),
        );
    });

    it('should failed to parse the invalid `Result` JSON object', () => {
        expect(ResultJSON.deserialize({ type: 'unknown', value: 1 } as never)).toStrictEqual(
            Err(new Error('Cannot parse to Result')),
        );

        expect(ResultJSON.deserialize({ value: 1 } as never)).toStrictEqual(Err(new Error('Cannot parse to Result')));
        expect(ResultJSON.deserialize(1 as never)).toStrictEqual(
            Err(new TypeError("Cannot use 'in' operator to search for 'type' in 1")),
        );
        expect(ResultJSON.deserialize('1' as never)).toStrictEqual(
            Err(new TypeError("Cannot use 'in' operator to search for 'type' in 1")),
        );
        expect(ResultJSON.deserialize(true as never)).toStrictEqual(
            Err(new TypeError("Cannot use 'in' operator to search for 'type' in true")),
        );
        expect(ResultJSON.deserialize(false as never)).toStrictEqual(
            Err(new TypeError("Cannot use 'in' operator to search for 'type' in false")),
        );
        expect(ResultJSON.deserialize([] as never)).toStrictEqual(Err(new Error('Cannot parse to Result')));
    });
});
