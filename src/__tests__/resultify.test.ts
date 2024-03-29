import { describe, expect, it } from '@jest/globals';

import { resultify } from '../resultify';

function syncFn(throws: boolean) {
    if (throws) {
        throw new Error('Some error message');
    } else {
        return 'hello world';
    }
}

async function asyncFn(throws: boolean) {
    if (throws) {
        return Promise.reject(new Error('Some error message'));
    } else {
        return Promise.resolve('hello world');
    }
}

describe(`Test fn \`${resultify.name}\``, () => {
    it('should resultify a sync function', async () => {
        const fn = resultify(syncFn);

        const [result1, result2] = await Promise.all([fn(false), fn(true)]);

        expect(result1.isOk()).toBe(true);
        expect(result1.unwrap()).toBe('hello world');
        expect(result2.isErr()).toBe(true);
        expect(result2.unwrapErr()).toBeInstanceOf(Error);
        expect((result2.unwrapErr() as Error).message).toBe('Some error message');
    });

    it('should resultify an async function', async () => {
        const fn = resultify(asyncFn);

        const [result1, result2] = await Promise.all([fn(false), fn(true)]);

        expect(result1.isOk()).toBe(true);
        expect(result1.unwrap()).toBe('hello world');
        expect(result2.isErr()).toBe(true);
        expect(result2.unwrapErr()).toBeInstanceOf(Error);
        expect((result2.unwrapErr() as Error).message).toBe('Some error message');
    });

    it('should resultify a sync function with error type specified', async () => {
        const fn = resultify<Error>()(syncFn);

        const [result1, result2] = await Promise.all([fn(false), fn(true)]);

        expect(result1.isOk()).toBe(true);
        expect(result1.unwrap()).toBe('hello world');
        expect(result2.isErr()).toBe(true);
        expect(result2.unwrapErr()).toBeInstanceOf(Error);
        expect(result2.unwrapErr().message).toBe('Some error message');
    });

    it('should resultify an async function with error type specified', async () => {
        const fn = resultify<Error>()(asyncFn);

        const [result1, result2] = await Promise.all([fn(false), fn(true)]);

        expect(result1.isOk()).toBe(true);
        expect(result1.unwrap()).toBe('hello world');
        expect(result2.isErr()).toBe(true);
        expect(result2.unwrapErr()).toBeInstanceOf(Error);
        expect(result2.unwrapErr().message).toBe('Some error message');
    });
});

describe(`Test fn \`${resultify.sync.name}\``, () => {
    it('should resultify a sync function', () => {
        const fn = resultify.sync(syncFn);

        const result1 = fn(false);
        const result2 = fn(true);

        expect(result1.isOk()).toBe(true);
        expect(result1.unwrap()).toBe('hello world');
        expect(result2.isErr()).toBe(true);
        expect(result2.unwrapErr()).toBeInstanceOf(Error);
        expect((result2.unwrapErr() as Error).message).toBe('Some error message');
    });

    it('should resultify a sync function with error type specified', () => {
        const fn = resultify.sync<Error>()(syncFn);

        const result1 = fn(false);
        const result2 = fn(true);

        expect(result1.isOk()).toBe(true);
        expect(result1.unwrap()).toBe('hello world');
        expect(result2.isErr()).toBe(true);
        expect(result2.unwrapErr()).toBeInstanceOf(Error);
        expect(result2.unwrapErr().message).toBe('Some error message');
    });
});

describe(`Test fn \`${resultify.promise.name}\``, () => {
    it('should resultify a promise', async () => {
        const promise1 = asyncFn(false);
        const promise2 = asyncFn(true);

        const [result1, result2] = await Promise.all([
            resultify.promise<string, Error>(promise1),
            resultify.promise<string, Error>(promise2),
        ]);

        expect(result1.isOk()).toBe(true);
        expect(result1.unwrap()).toBe('hello world');
        expect(result2.isErr()).toBe(true);
        expect(result2.unwrapErr()).toBeInstanceOf(Error);
        expect(result2.unwrapErr().message).toBe('Some error message');
    });
});
