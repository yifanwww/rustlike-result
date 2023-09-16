import { resultify } from '../resultify';

function syncFn($throw: boolean) {
    if ($throw) {
        throw new Error('Some error message');
    } else {
        return 'hello world';
    }
}

function asyncFn($throw: boolean) {
    if ($throw) {
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

describe(`Test fn \`${resultify.name}.async\``, () => {
    it('should be resultify fn', () => {
        expect(resultify.async).toBe(resultify);
    });
});
