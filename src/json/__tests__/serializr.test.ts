/* eslint-disable max-classes-per-file */

import { describe, expect, it } from '@jest/globals';
import { createModelSchema, deserialize, list, object, primitive, serialize } from 'serializr';

import { Err, Ok } from '../../factory';
import type { Result } from '../../Result';
import { createResultModelSchema, resultPropSchema } from '../serializr';

describe(`Test fn ${resultPropSchema.name}`, () => {
    describe('for simple `Result` structure', () => {
        class TestResult {
            constructor(public result: Result<unknown, unknown>) {}
        }

        const schema = createModelSchema(TestResult, { result: resultPropSchema() });

        it('should support serializing', () => {
            expect(serialize(schema, new TestResult(Ok(null)))).toStrictEqual({
                result: { type: 'ok', value: null },
            });
            expect(serialize(schema, new TestResult(Ok(undefined)))).toStrictEqual({
                result: { type: 'ok', value: undefined },
            });
            expect(serialize(schema, new TestResult(Ok(1)))).toStrictEqual({
                result: { type: 'ok', value: 1 },
            });
            expect(serialize(schema, new TestResult(Ok('hello world')))).toStrictEqual({
                result: { type: 'ok', value: 'hello world' },
            });
            expect(serialize(schema, new TestResult(Ok(true)))).toStrictEqual({
                result: { type: 'ok', value: true },
            });
            expect(serialize(schema, new TestResult(Ok({ foo: 'bar' })))).toStrictEqual({
                result: { type: 'ok', value: { foo: 'bar' } },
            });
            expect(serialize(schema, new TestResult(Ok([1, 2, 3])))).toStrictEqual({
                result: { type: 'ok', value: [1, 2, 3] },
            });

            expect(serialize(schema, new TestResult(Err(null)))).toStrictEqual({
                result: { type: 'err', value: null },
            });
            expect(serialize(schema, new TestResult(Err(undefined)))).toStrictEqual({
                result: { type: 'err', value: undefined },
            });
            expect(serialize(schema, new TestResult(Err(1)))).toStrictEqual({
                result: { type: 'err', value: 1 },
            });
            expect(serialize(schema, new TestResult(Err('hello world')))).toStrictEqual({
                result: { type: 'err', value: 'hello world' },
            });
            expect(serialize(schema, new TestResult(Err(true)))).toStrictEqual({
                result: { type: 'err', value: true },
            });
            expect(serialize(schema, new TestResult(Err({ foo: 'bar' })))).toStrictEqual({
                result: { type: 'err', value: { foo: 'bar' } },
            });
            expect(serialize(schema, new TestResult(Err([1, 2, 3])))).toStrictEqual({
                result: { type: 'err', value: [1, 2, 3] },
            });
        });

        it('should support deserializing', () => {
            expect(
                deserialize(schema, {
                    result: { type: 'ok', value: null },
                }),
            ).toStrictEqual(new TestResult(Ok(null)));
            expect(
                deserialize(schema, {
                    result: { type: 'ok', value: undefined },
                }),
            ).toStrictEqual(new TestResult(Ok(undefined)));
            expect(
                deserialize(schema, {
                    result: { type: 'ok', value: 1 },
                }),
            ).toStrictEqual(new TestResult(Ok(1)));
            expect(
                deserialize(schema, {
                    result: { type: 'ok', value: 'hello world' },
                }),
            ).toStrictEqual(new TestResult(Ok('hello world')));
            expect(
                deserialize(schema, {
                    result: { type: 'ok', value: true },
                }),
            ).toStrictEqual(new TestResult(Ok(true)));
            expect(
                deserialize(schema, {
                    result: { type: 'ok', value: { foo: 'bar' } },
                }),
            ).toStrictEqual(new TestResult(Ok({ foo: 'bar' })));
            expect(
                deserialize(schema, {
                    result: { type: 'ok', value: [1, 2, 3] },
                }),
            ).toStrictEqual(new TestResult(Ok([1, 2, 3])));

            expect(
                deserialize(schema, {
                    result: { type: 'err', value: null },
                }),
            ).toStrictEqual(new TestResult(Err(null)));
            expect(
                deserialize(schema, {
                    result: { type: 'err', value: undefined },
                }),
            ).toStrictEqual(new TestResult(Err(undefined)));
            expect(
                deserialize(schema, {
                    result: { type: 'err', value: 1 },
                }),
            ).toStrictEqual(new TestResult(Err(1)));
            expect(
                deserialize(schema, {
                    result: { type: 'err', value: 'hello world' },
                }),
            ).toStrictEqual(new TestResult(Err('hello world')));
            expect(
                deserialize(schema, {
                    result: { type: 'err', value: true },
                }),
            ).toStrictEqual(new TestResult(Err(true)));
            expect(
                deserialize(schema, {
                    result: { type: 'err', value: { foo: 'bar' } },
                }),
            ).toStrictEqual(new TestResult(Err({ foo: 'bar' })));
            expect(
                deserialize(schema, {
                    result: { type: 'err', value: [1, 2, 3] },
                }),
            ).toStrictEqual(new TestResult(Err([1, 2, 3])));
        });
    });

    describe('for nested `Result` structure', () => {
        class TestResult {
            constructor(public result: Result<Result<unknown, unknown>, Result<unknown, unknown>>) {}
        }

        const schema = createModelSchema(TestResult, {
            result: resultPropSchema({
                ok: resultPropSchema(),
                err: resultPropSchema(),
            }),
        });

        it('should support serializing', () => {
            expect(serialize(schema, new TestResult(Ok(Ok(1))))).toStrictEqual({
                result: { type: 'ok', value: { type: 'ok', value: 1 } },
            });
            expect(serialize(schema, new TestResult(Ok(Err(1))))).toStrictEqual({
                result: { type: 'ok', value: { type: 'err', value: 1 } },
            });
            expect(serialize(schema, new TestResult(Err(Ok(1))))).toStrictEqual({
                result: { type: 'err', value: { type: 'ok', value: 1 } },
            });
            expect(serialize(schema, new TestResult(Err(Err(1))))).toStrictEqual({
                result: { type: 'err', value: { type: 'err', value: 1 } },
            });
        });

        it('should support deserializing', () => {
            expect(
                deserialize(schema, {
                    result: { type: 'ok', value: { type: 'ok', value: 1 } },
                }),
            ).toStrictEqual(new TestResult(Ok(Ok(1))));
            expect(
                deserialize(schema, {
                    result: { type: 'ok', value: { type: 'err', value: 1 } },
                }),
            ).toStrictEqual(new TestResult(Ok(Err(1))));
            expect(
                deserialize(schema, {
                    result: { type: 'err', value: { type: 'ok', value: 1 } },
                }),
            ).toStrictEqual(new TestResult(Err(Ok(1))));
            expect(
                deserialize(schema, {
                    result: { type: 'err', value: { type: 'err', value: 1 } },
                }),
            ).toStrictEqual(new TestResult(Err(Err(1))));
        });
    });

    describe('for `Result` that holds complex objects', () => {
        class User {
            constructor(
                public username: string,
                public password: string,
            ) {}
        }

        class TestResult {
            constructor(public result: Result<User[], string>) {}
        }

        const userSchema = createModelSchema(User, {
            username: primitive(),
            password: primitive(),
        });

        const schema = createModelSchema(TestResult, {
            result: resultPropSchema({
                ok: list(object(userSchema)),
            }),
        });

        it('should support serializing', () => {
            expect(serialize(schema, new TestResult(Ok([new User('u1', 'p1'), new User('u2', 'p2')])))).toStrictEqual({
                result: {
                    type: 'ok',
                    value: [
                        { username: 'u1', password: 'p1' },
                        { username: 'u2', password: 'p2' },
                    ],
                },
            });
            expect(serialize(schema, new TestResult(Err('Some error message')))).toStrictEqual({
                result: {
                    type: 'err',
                    value: 'Some error message',
                },
            });
        });

        it('should support deserializing', () => {
            expect(
                deserialize(schema, {
                    result: {
                        type: 'ok',
                        value: [
                            { username: 'u1', password: 'p1' },
                            { username: 'u2', password: 'p2' },
                        ],
                    },
                }),
            ).toStrictEqual(new TestResult(Ok([new User('u1', 'p1'), new User('u2', 'p2')])));
            expect(
                deserialize(schema, {
                    result: {
                        type: 'err',
                        value: 'Some error message',
                    },
                }),
            ).toStrictEqual(new TestResult(Err('Some error message')));
        });
    });

    it('should throw error if input is not valid `Result` JSON object', () => {
        class TestResult {
            constructor(public result: Result<unknown, unknown>) {}
        }

        const schema = createModelSchema(TestResult, { result: resultPropSchema() });

        expect(() => deserialize(schema, { result: null })).toThrow('expected valid `Result` JSON object');
        expect(() => deserialize(schema, { result: {} })).toThrow('expected valid `Result` JSON object');
        expect(() => deserialize(schema, { result: [] })).toThrow('expected valid `Result` JSON object');
        expect(() => deserialize(schema, { result: { type: 'unknown', value: 1 } })).toThrow(
            'expected valid `Result` JSON object',
        );
    });

    it('should work fine with lifecycle functions', () => {
        class TestResult {
            constructor(public result: Result<unknown, unknown>) {}
        }

        const schema1 = createModelSchema(TestResult, {
            result: resultPropSchema({
                ok: primitive({
                    beforeDeserialize: (done, jsonValue) => void done(undefined, String(jsonValue)),
                }),
            }),
        });

        const schema2 = createModelSchema(TestResult, {
            result: resultPropSchema({
                ok: primitive({
                    afterDeserialize: (done, err, jsonValue) => void done(undefined, String(jsonValue)),
                }),
            }),
        });

        const schema3 = createModelSchema(TestResult, {
            result: resultPropSchema({
                ok: primitive({
                    beforeDeserialize: (done) => void done('error', undefined),
                }),
            }),
        });

        const schema4 = createModelSchema(TestResult, {
            result: resultPropSchema({
                ok: primitive({
                    afterDeserialize: (done) => void done('error', undefined),
                }),
            }),
        });

        expect(deserialize(schema1, { result: { type: 'ok', value: 1 } })).toStrictEqual(new TestResult(Ok('1')));
        expect(deserialize(schema2, { result: { type: 'ok', value: 1 } })).toStrictEqual(new TestResult(Ok('1')));
        expect(() => deserialize(schema3, { result: { type: 'ok', value: 1 } })).toThrow('error');
        expect(() => deserialize(schema4, { result: { type: 'ok', value: 1 } })).toThrow('error');
    });
});

describe(`Test fn ${createResultModelSchema.name}`, () => {
    describe('for simple `Result` structure', () => {
        const schema = createResultModelSchema();

        it('should support serializing', () => {
            expect(serialize(schema, Ok(null))).toStrictEqual({ type: 'ok', value: null });
            expect(serialize(schema, Ok(undefined))).toStrictEqual({ type: 'ok', value: undefined });
            expect(serialize(schema, Ok(1))).toStrictEqual({ type: 'ok', value: 1 });
            expect(serialize(schema, Ok('hello world'))).toStrictEqual({ type: 'ok', value: 'hello world' });
            expect(serialize(schema, Ok(true))).toStrictEqual({ type: 'ok', value: true });
            expect(serialize(schema, Ok({ foo: 'bar' }))).toStrictEqual({ type: 'ok', value: { foo: 'bar' } });
            expect(serialize(schema, Ok([1, 2, 3]))).toStrictEqual({ type: 'ok', value: [1, 2, 3] });

            expect(serialize(schema, Err(null))).toStrictEqual({ type: 'err', value: null });
            expect(serialize(schema, Err(undefined))).toStrictEqual({ type: 'err', value: undefined });
            expect(serialize(schema, Err(1))).toStrictEqual({ type: 'err', value: 1 });
            expect(serialize(schema, Err('hello world'))).toStrictEqual({ type: 'err', value: 'hello world' });
            expect(serialize(schema, Err(true))).toStrictEqual({ type: 'err', value: true });
            expect(serialize(schema, Err({ foo: 'bar' }))).toStrictEqual({ type: 'err', value: { foo: 'bar' } });
            expect(serialize(schema, Err([1, 2, 3]))).toStrictEqual({ type: 'err', value: [1, 2, 3] });
        });

        it('should support deserializing', () => {
            expect(deserialize(schema, { type: 'ok', value: null })).toStrictEqual(Ok(null));
            expect(deserialize(schema, { type: 'ok', value: undefined })).toStrictEqual(Ok(undefined));
            expect(deserialize(schema, { type: 'ok', value: 1 })).toStrictEqual(Ok(1));
            expect(deserialize(schema, { type: 'ok', value: 'hello world' })).toStrictEqual(Ok('hello world'));
            expect(deserialize(schema, { type: 'ok', value: true })).toStrictEqual(Ok(true));
            expect(deserialize(schema, { type: 'ok', value: { foo: 'bar' } })).toStrictEqual(Ok({ foo: 'bar' }));
            expect(deserialize(schema, { type: 'ok', value: [1, 2, 3] })).toStrictEqual(Ok([1, 2, 3]));

            expect(deserialize(schema, { type: 'err', value: null })).toStrictEqual(Err(null));
            expect(deserialize(schema, { type: 'err', value: undefined })).toStrictEqual(Err(undefined));
            expect(deserialize(schema, { type: 'err', value: 1 })).toStrictEqual(Err(1));
            expect(deserialize(schema, { type: 'err', value: 'hello world' })).toStrictEqual(Err('hello world'));
            expect(deserialize(schema, { type: 'err', value: true })).toStrictEqual(Err(true));
            expect(deserialize(schema, { type: 'err', value: { foo: 'bar' } })).toStrictEqual(Err({ foo: 'bar' }));
            expect(deserialize(schema, { type: 'err', value: [1, 2, 3] })).toStrictEqual(Err([1, 2, 3]));
        });
    });

    describe('for nested `Result` structure', () => {
        const schema = createResultModelSchema({
            ok: resultPropSchema(),
            err: resultPropSchema(),
        });

        it('should support serializing', () => {
            expect(serialize(schema, Ok(Ok(1)))).toStrictEqual({ type: 'ok', value: { type: 'ok', value: 1 } });
            expect(serialize(schema, Ok(Err(1)))).toStrictEqual({ type: 'ok', value: { type: 'err', value: 1 } });
            expect(serialize(schema, Err(Ok(1)))).toStrictEqual({ type: 'err', value: { type: 'ok', value: 1 } });
            expect(serialize(schema, Err(Err(1)))).toStrictEqual({ type: 'err', value: { type: 'err', value: 1 } });
        });

        it('should support deserializing', () => {
            expect(deserialize(schema, { type: 'ok', value: { type: 'ok', value: 1 } })).toStrictEqual(Ok(Ok(1)));
            expect(deserialize(schema, { type: 'ok', value: { type: 'err', value: 1 } })).toStrictEqual(Ok(Err(1)));
            expect(deserialize(schema, { type: 'err', value: { type: 'ok', value: 1 } })).toStrictEqual(Err(Ok(1)));
            expect(deserialize(schema, { type: 'err', value: { type: 'err', value: 1 } })).toStrictEqual(Err(Err(1)));
        });
    });

    describe('for `Result` that holds complex objects', () => {
        class User {
            constructor(
                public username: string,
                public password: string,
            ) {}
        }

        const userSchema = createModelSchema(User, {
            username: primitive(),
            password: primitive(),
        });

        const schema = createResultModelSchema({
            ok: list(object(userSchema)),
        });

        it('should support serializing', () => {
            expect(serialize(schema, Ok([new User('u1', 'p1'), new User('u2', 'p2')]))).toStrictEqual({
                type: 'ok',
                value: [
                    { username: 'u1', password: 'p1' },
                    { username: 'u2', password: 'p2' },
                ],
            });
            expect(serialize(schema, Err('Some error message'))).toStrictEqual({
                type: 'err',
                value: 'Some error message',
            });
        });

        it('should support deserializing', () => {
            expect(
                deserialize(schema, {
                    type: 'ok',
                    value: [
                        { username: 'u1', password: 'p1' },
                        { username: 'u2', password: 'p2' },
                    ],
                }),
            ).toStrictEqual(Ok([new User('u1', 'p1'), new User('u2', 'p2')]));
            expect(
                deserialize(schema, {
                    type: 'err',
                    value: 'Some error message',
                }),
            ).toStrictEqual(Err('Some error message'));
        });
    });

    it('should throw error if input is not valid `Result` JSON object', () => {
        const schema = createResultModelSchema();

        expect(() => deserialize(schema, { type: 'unknown', value: 1 })).toThrow('expected valid `Result` JSON object');
    });

    it('should work fine with lifecycle functions', () => {
        const schema1 = createResultModelSchema({
            ok: primitive({
                beforeDeserialize: (done, jsonValue) => void done(undefined, String(jsonValue)),
            }),
        });

        const schema2 = createResultModelSchema({
            ok: primitive({
                afterDeserialize: (done, err, jsonValue) => void done(undefined, String(jsonValue)),
            }),
        });

        const schema3 = createResultModelSchema({
            ok: primitive({
                beforeDeserialize: (done) => void done('error', undefined),
            }),
        });

        const schema4 = createResultModelSchema({
            ok: primitive({
                afterDeserialize: (done) => void done('error', undefined),
            }),
        });

        expect(deserialize(schema1, { type: 'ok', value: 1 })).toStrictEqual(Ok('1'));
        expect(deserialize(schema2, { type: 'ok', value: 1 })).toStrictEqual(Ok('1'));
        // https://github.com/mobxjs/serializr/issues/181
        expect(deserialize(schema3, { type: 'ok', value: 1 })).toStrictEqual(Ok(undefined));
        expect(() => deserialize(schema4, { type: 'ok', value: 1 })).toThrow('error');
    });
});
