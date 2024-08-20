import { describe, expect, it } from '@jest/globals';

import { resultifyAsync, resultifyPromise, resultifySync } from '../resultify';
import { RustlikeResult } from '../RustlikeResult';
import { RustlikeResultAsync } from '../RustlikeResultAsync';

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

describe(`Test fn \`${resultifyAsync.name}\``, () => {
    it('should resultify a sync function', async () => {
        const fn = resultifyAsync(syncFn);

        const result1 = fn(false);
        const result2 = fn(true);

        expect(result1).toBeInstanceOf(RustlikeResultAsync);
        expect(result2).toBeInstanceOf(RustlikeResultAsync);
        await expect(result1.isOk()).resolves.toBe(true);
        await expect(result1.unwrap()).resolves.toBe('hello world');
        await expect(result2.isErr()).resolves.toBe(true);
        await expect(result2.unwrapErr()).resolves.toBeInstanceOf(Error);
        expect(((await result2.unwrapErr()) as Error).message).toBe('Some error message');
    });

    it('should resultify an async function', async () => {
        const fn = resultifyAsync(asyncFn);

        const result1 = fn(false);
        const result2 = fn(true);

        expect(result1).toBeInstanceOf(RustlikeResultAsync);
        expect(result2).toBeInstanceOf(RustlikeResultAsync);
        await expect(result1.isOk()).resolves.toBe(true);
        await expect(result1.unwrap()).resolves.toBe('hello world');
        await expect(result2.isErr()).resolves.toBe(true);
        await expect(result2.unwrapErr()).resolves.toBeInstanceOf(Error);
        expect(((await result2.unwrapErr()) as Error).message).toBe('Some error message');
    });

    it('should resultify a sync function with error type specified', async () => {
        const fn = resultifyAsync<Error>()(syncFn);

        const result1 = fn(false);
        const result2 = fn(true);

        expect(result1).toBeInstanceOf(RustlikeResultAsync);
        expect(result2).toBeInstanceOf(RustlikeResultAsync);
        await expect(result1.isOk()).resolves.toBe(true);
        await expect(result1.unwrap()).resolves.toBe('hello world');
        await expect(result2.isErr()).resolves.toBe(true);
        await expect(result2.unwrapErr()).resolves.toBeInstanceOf(Error);
        expect((await result2.unwrapErr()).message).toBe('Some error message');
    });

    it('should resultify an async function with error type specified', async () => {
        const fn = resultifyAsync<Error>()(asyncFn);

        const result1 = fn(false);
        const result2 = fn(true);

        expect(result1).toBeInstanceOf(RustlikeResultAsync);
        expect(result2).toBeInstanceOf(RustlikeResultAsync);
        await expect(result1.isOk()).resolves.toBe(true);
        await expect(result1.unwrap()).resolves.toBe('hello world');
        await expect(result2.isErr()).resolves.toBe(true);
        await expect(result2.unwrapErr()).resolves.toBeInstanceOf(Error);
        expect((await result2.unwrapErr()).message).toBe('Some error message');
    });
});

describe(`Test fn \`${resultifySync.name}\``, () => {
    it('should resultify a sync function', () => {
        const fn = resultifySync(syncFn);

        const result1 = fn(false);
        const result2 = fn(true);

        expect(result1).toBeInstanceOf(RustlikeResult);
        expect(result2).toBeInstanceOf(RustlikeResult);
        expect(result1.isOk()).toBe(true);
        expect(result1.unwrap()).toBe('hello world');
        expect(result2.isErr()).toBe(true);
        expect(result2.unwrapErr()).toBeInstanceOf(Error);
        expect((result2.unwrapErr() as Error).message).toBe('Some error message');
    });

    it('should resultify a sync function with error type specified', () => {
        const fn = resultifySync<Error>()(syncFn);

        const result1 = fn(false);
        const result2 = fn(true);

        expect(result1).toBeInstanceOf(RustlikeResult);
        expect(result2).toBeInstanceOf(RustlikeResult);
        expect(result1.isOk()).toBe(true);
        expect(result1.unwrap()).toBe('hello world');
        expect(result2.isErr()).toBe(true);
        expect(result2.unwrapErr()).toBeInstanceOf(Error);
        expect(result2.unwrapErr().message).toBe('Some error message');
    });
});

describe(`Test fn \`${resultifyPromise.name}\``, () => {
    it('should resultify a promise', async () => {
        const promise1 = asyncFn(false);
        const promise2 = asyncFn(true);

        const result1 = resultifyPromise<string, Error>(promise1);
        const result2 = resultifyPromise<string, Error>(promise2);

        expect(result1).toBeInstanceOf(RustlikeResultAsync);
        expect(result2).toBeInstanceOf(RustlikeResultAsync);
        await expect(result1.isOk()).resolves.toBe(true);
        await expect(result1.unwrap()).resolves.toBe('hello world');
        await expect(result2.isErr()).resolves.toBe(true);
        await expect(result2.unwrapErr()).resolves.toBeInstanceOf(Error);
        expect((await result2.unwrapErr()).message).toBe('Some error message');
    });
});
