import { describe, expect, it, jest } from '@jest/globals';
import assert from 'node:assert';

import { Err, Ok } from '../factory';
import type { Result } from '../Result';
import { resultify } from '../resultify';
import { RustlikeResult } from '../RustlikeResult';

import { expectResult } from './_helpers';

function panicFn1(): never {
    throw new Error('error');
}

function panicFn2() {
    return Promise.reject(new Error('error'));
}

describe(`Test static method \`${RustlikeResult.name}.${RustlikeResult.Ok.name}\``, () => {
    it('should create `Ok` result', () => {
        const result = RustlikeResult.Ok(1);
        expectResult(result, { type: 'ok', value: 1, error: undefined });
    });
});

describe(`Test static method \`${RustlikeResult.name}.${RustlikeResult.Err.name}\``, () => {
    it('should create `Err` result', () => {
        const result = RustlikeResult.Err('Some error message');
        expectResult(result, { type: 'err', value: undefined, error: 'Some error message' });
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.isOk.name}\``, () => {
    it('should return if itself is `Ok`', () => {
        expect(Ok(1).isOk()).toBe(true);
        expect(Err('Some error message').isOk()).toBe(false);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should narrow down result type', () => {
        const result = Ok<number, string>(1);
        if (result.isOk()) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const expected: Result<number, never> = result;
        }
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<number, string> = Ok(2);
            assert(x.isOk() === true);

            const y: Result<number, string> = Err('Some error message');
            assert(y.isOk() === false);
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.isOkAnd.name}\``, () => {
    const fnFactory = () => jest.fn((num: number) => num > 1);

    it('should return if itself is `Ok` and the value inside of it matches a predicate', () => {
        const fn = fnFactory();
        expect(Ok(2).isOkAnd(fn)).toBe(true);
        expect(Ok(0).isOkAnd(fn)).toBe(false);
        expect(Err('Some error message').isOkAnd(fn)).toBe(false);
    });

    it('should call fn only once if itself is `Ok`', () => {
        const fn = fnFactory();
        expect(fn).toHaveBeenCalledTimes(0);
        Ok(2).isOkAnd(fn);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not call fn if itself is `Err`', () => {
        const fn = fnFactory();
        expect(fn).toHaveBeenCalledTimes(0);
        Err('Some error message').isOkAnd(fn);
        expect(fn).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', () => {
        expect(() => Ok(2).isOkAnd(panicFn1)).toThrow(Error('error'));
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<number, string> = Ok(2);
            assert(x.isOkAnd((value) => value > 1) === true);

            const y: Result<number, string> = Ok(0);
            assert(y.isOkAnd((value) => value > 1) === false);

            const z: Result<number, string> = Err('Some error message');
            assert(z.isOkAnd((value) => value > 1) === false);
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.isOkAndAsync.name}\``, () => {
    const fnFactory1 = () => jest.fn((num: number) => num > 1);
    const fnFactory2 = () => jest.fn((num: number) => Promise.resolve(num > 1));

    it('should return if itself is `Ok` and the value inside of it matches a predicate', async () => {
        const _it = async (fn: (num: number) => boolean | Promise<boolean>) => {
            await expect(Ok(2).isOkAndAsync(fn)).resolves.toBe(true);
            await expect(Ok(0).isOkAndAsync(fn)).resolves.toBe(false);
            await expect(Err('Some error message').isOkAndAsync(fn)).resolves.toBe(false);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should call fn only once if itself is `Ok`', async () => {
        const _it = async (fn: (num: number) => boolean | Promise<boolean>) => {
            expect(fn).toHaveBeenCalledTimes(0);
            await Ok(2).isOkAndAsync(fn);
            expect(fn).toHaveBeenCalledTimes(1);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should not call fn if itself is `Err`', async () => {
        const _it = async (fn: (num: number) => boolean | Promise<boolean>) => {
            expect(fn).toHaveBeenCalledTimes(0);
            await Err('Some error message').isOkAndAsync(fn);
            expect(fn).toHaveBeenCalledTimes(0);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should panic if fn panic', async () => {
        await expect(() => Ok(2).isOkAndAsync(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => Ok(2).isOkAndAsync(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: Result<number, string> = Ok(2);
            assert((await x.isOkAndAsync((value) => Promise.resolve(value > 1))) === true);

            const y: Result<number, string> = Ok(0);
            assert((await y.isOkAndAsync((value) => Promise.resolve(value > 1))) === false);

            const z: Result<number, string> = Err('Some error message');
            assert((await z.isOkAndAsync((value) => Promise.resolve(value > 1))) === false);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.isErr.name}\``, () => {
    it('should return if itself is `Err`', () => {
        expect(Ok(1).isErr()).toBe(false);
        expect(Err('Some error message').isErr()).toBe(true);
    });

    // eslint-disable-next-line jest/expect-expect
    it('should narrow down result type', () => {
        const result = Err<number, string>('Some error message');
        if (result.isErr()) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const expected: Result<never, string> = result;
        }
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<number, string> = Ok(-3);
            assert(x.isErr() === false);

            const y: Result<number, string> = Err('Some error message');
            assert(y.isErr() === true);
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.isErrAnd.name}\``, () => {
    enum ErrorKind {
        NOT_FOUND,
        PERMISSION_DENIED,
    }

    const fnFactory = () => jest.fn((err: ErrorKind) => err === ErrorKind.NOT_FOUND);

    it('should return if itself is `Err` and the value inside of it matches a predicate', () => {
        const fn = fnFactory();
        expect(Err(ErrorKind.NOT_FOUND).isErrAnd(fn)).toBe(true);
        expect(Err(ErrorKind.PERMISSION_DENIED).isErrAnd(fn)).toBe(false);
        expect(Ok(123).isErrAnd(fn)).toBe(false);
    });

    it('should call fn only once if itself is `Err`', () => {
        const fn = fnFactory();
        expect(fn).toHaveBeenCalledTimes(0);
        Err(ErrorKind.NOT_FOUND).isErrAnd(fn);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not call fn if itself is `Ok`', () => {
        const fn = fnFactory();
        expect(fn).toHaveBeenCalledTimes(0);
        Ok(123).isErrAnd(fn);
        expect(fn).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', () => {
        expect(() => Err(ErrorKind.NOT_FOUND).isErrAnd(panicFn1)).toThrow(Error('error'));
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<number, ErrorKind> = Err(ErrorKind.NOT_FOUND);
            assert(x.isErrAnd((value) => value === ErrorKind.NOT_FOUND) === true);

            const y: Result<number, ErrorKind> = Err(ErrorKind.PERMISSION_DENIED);
            assert(y.isErrAnd((value) => value === ErrorKind.NOT_FOUND) === false);

            const z: Result<number, ErrorKind> = Ok(123);
            assert(z.isErrAnd((value) => value === ErrorKind.NOT_FOUND) === false);
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.isErrAndAsync.name}\``, () => {
    enum ErrorKind {
        NOT_FOUND,
        PERMISSION_DENIED,
    }

    const fnFactory1 = () => jest.fn((err: ErrorKind) => err === ErrorKind.NOT_FOUND);
    const fnFactory2 = () => jest.fn((err: ErrorKind) => Promise.resolve(err === ErrorKind.NOT_FOUND));

    it('should return if itself is `Err` and the value inside of it matches a predicate', async () => {
        const _it = async (fn: (err: ErrorKind) => boolean | Promise<boolean>) => {
            await expect(Err(ErrorKind.NOT_FOUND).isErrAndAsync(fn)).resolves.toBe(true);
            await expect(Err(ErrorKind.PERMISSION_DENIED).isErrAndAsync(fn)).resolves.toBe(false);
            await expect(Ok(123).isErrAndAsync(fn)).resolves.toBe(false);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should call fn only once if itself is `Err`', async () => {
        const _it = async (fn: (err: ErrorKind) => boolean | Promise<boolean>) => {
            expect(fn).toHaveBeenCalledTimes(0);
            await Err(ErrorKind.NOT_FOUND).isErrAndAsync(fn);
            expect(fn).toHaveBeenCalledTimes(1);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should not call fn if itself is `Ok`', async () => {
        const _it = async (fn: (err: ErrorKind) => boolean | Promise<boolean>) => {
            expect(fn).toHaveBeenCalledTimes(0);
            await Ok(123).isErrAndAsync(fn);
            expect(fn).toHaveBeenCalledTimes(0);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should panic if fn panic', async () => {
        await expect(() => Err(ErrorKind.NOT_FOUND).isErrAndAsync(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => Err(ErrorKind.NOT_FOUND).isErrAndAsync(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: Result<number, ErrorKind> = Err(ErrorKind.NOT_FOUND);
            assert((await x.isErrAndAsync((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === true);

            const y: Result<number, ErrorKind> = Err(ErrorKind.PERMISSION_DENIED);
            assert((await y.isErrAndAsync((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === false);

            const z: Result<number, ErrorKind> = Ok(123);
            assert((await z.isErrAndAsync((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === false);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.ok.name}\``, () => {
    it('should convert itself to an optional value', () => {
        expect(Ok(1).ok()).toBe(1);
        expect(Err('Some error message').ok()).toBeUndefined();
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<number, string> = Ok(2);
            assert(x.ok() === 2);

            const y: Result<number, string> = Err('Some error message');
            assert(y.ok() === undefined);
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.err.name}\``, () => {
    it('should convert itself to an optional error', () => {
        expect(Ok(1).err()).toBeUndefined();
        expect(Err('Some error message').err()).toBe('Some error message');
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<number, string> = Ok(2);
            assert(x.err() === undefined);

            const y: Result<number, string> = Err('Some error message');
            assert(y.err() === 'Some error message');
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.map.name}\``, () => {
    const mapFactory = () => jest.fn((num: number) => String(num));

    it('should map itself to another result', () => {
        const map = mapFactory();
        expect(Ok(1).map(map)).toStrictEqual(Ok('1'));
        expect(Err('Some error message').map(map)).toStrictEqual(Err('Some error message'));
    });

    it('should call map fn only once if itself is `Ok`', () => {
        const map = mapFactory();
        expect(map).toHaveBeenCalledTimes(0);
        Ok(1).map(map);
        expect(map).toHaveBeenCalledTimes(1);
    });

    it('should not call map fn if itself is `Err`', () => {
        const map = mapFactory();
        expect(map).toHaveBeenCalledTimes(0);
        Err('Some error message').map(map);
        expect(map).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', () => {
        expect(() => Ok(1).map(panicFn1)).toThrow(Error('error'));
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<string, string> = Ok('foo');
            assert(x.map((value) => value.length).ok() === 3);
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.mapAsync.name}\``, () => {
    const mapFactory1 = () => jest.fn((num: number) => String(num));
    const mapFactory2 = () => jest.fn((num: number) => Promise.resolve(String(num)));

    it('should map itself to another result', async () => {
        const _it = async (map: (num: number) => string | Promise<string>) => {
            await expect(Ok(1).mapAsync(map)).resolves.toStrictEqual(Ok('1'));
            await expect(Err('Some error message').mapAsync(map)).resolves.toStrictEqual(Err('Some error message'));
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should call map fn only once if itself is `Ok`', async () => {
        const _it = async (map: (num: number) => string | Promise<string>) => {
            expect(map).toHaveBeenCalledTimes(0);
            await Ok(1).mapAsync(map);
            expect(map).toHaveBeenCalledTimes(1);
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should not call map fn if itself is `Err`', async () => {
        const _it = async (map: (num: number) => string | Promise<string>) => {
            expect(map).toHaveBeenCalledTimes(0);
            await Err('Some error message').mapAsync(map);
            expect(map).toHaveBeenCalledTimes(0);
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should panic if fn panic', async () => {
        await expect(() => Ok(1).mapAsync(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => Ok(1).mapAsync(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x = await Ok<string, string>('foo').mapAsync((value) => Promise.resolve(value.length));
            assert(x.ok() === 3);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.mapOr.name}\``, () => {
    const mapFactory = () => jest.fn((num: number) => num * 2);

    it('should map itself to another result', () => {
        const map = mapFactory();
        expect(Ok(1).mapOr(-1, map)).toBe(2);
        expect(Err('Some error message').mapOr(-1, map)).toBe(-1);
    });

    it('should call map fn only once if itself is `Ok`', () => {
        const map = mapFactory();
        expect(map).toHaveBeenCalledTimes(0);
        Ok(1).mapOr(-1, map);
        expect(map).toHaveBeenCalledTimes(1);
    });

    it('should not call map fn if itself is `Err`', () => {
        const map = mapFactory();
        expect(map).toHaveBeenCalledTimes(0);
        Err('Some error message').mapOr(-1, map);
        expect(map).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', () => {
        expect(() => Ok(1).mapOr(Err('err'), panicFn1)).toThrow(Error('error'));
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<string, string> = Ok('foo');
            assert(x.mapOr(42, (value) => value.length) === 3);

            const y: Result<string, string> = Err('bar');
            assert(y.mapOr(42, (value) => value.length) === 42);
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.mapOrAsync.name}\``, () => {
    const mapFactory1 = () => jest.fn((num: number) => num * 2);
    const mapFactory2 = () => jest.fn((num: number) => Promise.resolve(num * 2));

    it('should map itself to another result', async () => {
        const _it = async (map: (num: number) => number | Promise<number>) => {
            await expect(Ok(1).mapOrAsync(-1, map)).resolves.toBe(2);
            await expect(Err('Some error message').mapOrAsync(-1, map)).resolves.toBe(-1);
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should call map fn only once if itself is `Ok`', async () => {
        const _it = async (map: (num: number) => number | Promise<number>) => {
            expect(map).toHaveBeenCalledTimes(0);
            await Ok(1).mapOrAsync(-1, map);
            expect(map).toHaveBeenCalledTimes(1);
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should not call map fn if itself is `Err`', async () => {
        const _it = async (map: (num: number) => number | Promise<number>) => {
            expect(map).toHaveBeenCalledTimes(0);
            await Err('Some error message').mapOrAsync(-1, map);
            expect(map).toHaveBeenCalledTimes(0);
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should panic if fn panic', async () => {
        await expect(() => Ok(1).mapOrAsync(Err('err'), panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => Ok(1).mapOrAsync(Err('err'), panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: Result<string, string> = Ok('foo');
            assert((await x.mapOrAsync(42, (value) => value.length)) === 3);

            const y: Result<string, string> = Err('bar');
            assert((await y.mapOrAsync(42, (value) => value.length)) === 42);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.mapOrElse.name}\``, () => {
    const mapFactory = () => jest.fn(jest.fn((num: number) => String(num)));
    const fallbackFactory = () => jest.fn(jest.fn((str: string) => str));

    it('should map itself to another value', () => {
        const map = mapFactory();
        const fallback = fallbackFactory();
        expect(Ok(1).mapOrElse(fallback, map)).toBe('1');
        expect(Err('Some error message').mapOrElse(fallback, map)).toBe('Some error message');
    });

    it('should call map fn only once if itself is `Ok`', () => {
        const map = mapFactory();
        const fallback = fallbackFactory();

        expect(map).toHaveBeenCalledTimes(0);
        expect(fallback).toHaveBeenCalledTimes(0);
        Ok(1).mapOrElse(fallback, map);
        expect(map).toHaveBeenCalledTimes(1);
        expect(fallback).toHaveBeenCalledTimes(0);
    });

    it('should call fallback fn only once if itself is `Err`', () => {
        const map = mapFactory();
        const fallback = fallbackFactory();

        expect(map).toHaveBeenCalledTimes(0);
        expect(fallback).toHaveBeenCalledTimes(0);
        Err('Some error message').mapOrElse(fallback, map);
        expect(map).toHaveBeenCalledTimes(0);
        expect(fallback).toHaveBeenCalledTimes(1);
    });

    it('should panic if fn panic', () => {
        expect(() => Ok(1).mapOrElse(panicFn1, panicFn1)).toThrow(Error('error'));
        expect(() => Err('err').mapOrElse(panicFn1, panicFn1)).toThrow(Error('error'));
    });

    it('should have correct examples doc', () => {
        function examples() {
            const k = 21;

            const x: Result<string, string> = Ok('foo');
            assert(
                x.mapOrElse(
                    () => k * 2,
                    (value) => value.length,
                ) === 3,
            );

            const y: Result<string, string> = Err('bar');
            assert(
                y.mapOrElse(
                    () => k * 2,
                    (value) => value.length,
                ) === 42,
            );
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.mapOrElseAsync.name}\``, () => {
    const mapFactory1 = () => jest.fn(jest.fn((num: number) => String(num)));
    const mapFactory2 = () => jest.fn(jest.fn((num: number) => Promise.resolve(String(num))));
    const fallbackFactory1 = () => jest.fn(jest.fn((str: string) => str));
    const fallbackFactory2 = () => jest.fn(jest.fn((str: string) => Promise.resolve(str)));

    it('should map itself to another value', async () => {
        const _it = async (
            map: (num: number) => string | Promise<string>,
            fallback: (str: string) => string | Promise<string>,
        ) => {
            await expect(Ok(1).mapOrElseAsync(fallback, map)).resolves.toBe('1');
            await expect(Err('Some error message').mapOrElseAsync(fallback, map)).resolves.toBe('Some error message');
        };

        await _it(mapFactory1(), fallbackFactory1());
        await _it(mapFactory2(), fallbackFactory2());
    });

    it('should call map fn only once if itself is `Ok`', async () => {
        const _it = async (
            map: (num: number) => string | Promise<string>,
            fallback: (str: string) => string | Promise<string>,
        ) => {
            expect(map).toHaveBeenCalledTimes(0);
            expect(fallback).toHaveBeenCalledTimes(0);
            await Ok(1).mapOrElseAsync(fallback, map);
            expect(map).toHaveBeenCalledTimes(1);
            expect(fallback).toHaveBeenCalledTimes(0);
        };

        await _it(mapFactory1(), fallbackFactory1());
        await _it(mapFactory2(), fallbackFactory2());
    });

    it('should call fallback fn only once if itself is `Err`', async () => {
        const _it = async (
            map: (num: number) => string | Promise<string>,
            fallback: (str: string) => string | Promise<string>,
        ) => {
            expect(map).toHaveBeenCalledTimes(0);
            expect(fallback).toHaveBeenCalledTimes(0);
            await Err('Some error message').mapOrElseAsync(fallback, map);
            expect(map).toHaveBeenCalledTimes(0);
            expect(fallback).toHaveBeenCalledTimes(1);
        };

        await _it(mapFactory1(), fallbackFactory1());
        await _it(mapFactory2(), fallbackFactory2());
    });

    it('should panic if fn panic', async () => {
        await expect(() => Ok(1).mapOrElseAsync(panicFn1, panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => Err('err').mapOrElseAsync(panicFn1, panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => Ok(1).mapOrElseAsync(panicFn2, panicFn2)).rejects.toThrow(Error('error'));
        await expect(() => Err('err').mapOrElseAsync(panicFn2, panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const k = 21;

            const x: Result<string, string> = Ok('foo');
            assert(
                (await x.mapOrElseAsync(
                    () => Promise.resolve(k * 2),
                    (value) => Promise.resolve(value.length),
                )) === 3,
            );

            const y: Result<string, string> = Err('bar');
            assert(
                (await y.mapOrElseAsync(
                    () => Promise.resolve(k * 2),
                    (value) => Promise.resolve(value.length),
                )) === 42,
            );
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.mapErr.name}\``, () => {
    const mapFactory = () => jest.fn((num: number) => `error code: ${num}`);

    it('should map itself to another result', () => {
        const map = mapFactory();
        expect(Ok(1).mapErr(map)).toStrictEqual(Ok(1));
        expect(Err(2).mapErr(map)).toStrictEqual(Err('error code: 2'));
    });

    it('should call map fn only once if itself is `Err`', () => {
        const map = mapFactory();
        expect(map).toHaveBeenCalledTimes(0);
        Err(2).mapErr(map);
        expect(map).toHaveBeenCalledTimes(1);
    });

    it('should not call map fn if itself is `Ok`', () => {
        const map = mapFactory();
        expect(map).toHaveBeenCalledTimes(0);
        Ok(1).mapErr(map);
        expect(map).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', () => {
        expect(() => Err('err').mapErr(panicFn1)).toThrow(Error('error'));
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<number, Error> = Err(new Error('Some error message'));
            assert(x.mapErr((err) => err.message).err() === 'Some error message');
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.mapErrAsync.name}\``, () => {
    const mapFactory1 = () => jest.fn((num: number) => `error code: ${num}`);
    const mapFactory2 = () => jest.fn((num: number) => Promise.resolve(`error code: ${num}`));

    it('should map itself to another result', async () => {
        const _it = async (map: (num: number) => string | Promise<string>) => {
            await expect(Ok(1).mapErrAsync(map)).resolves.toStrictEqual(Ok(1));
            await expect(Err(2).mapErrAsync(map)).resolves.toStrictEqual(Err('error code: 2'));
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should call map fn only once if itself is `Err`', async () => {
        const _it = async (map: (num: number) => string | Promise<string>) => {
            expect(map).toHaveBeenCalledTimes(0);
            await Err(2).mapErrAsync(map);
            expect(map).toHaveBeenCalledTimes(1);
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should not call map fn if itself is `Ok`', async () => {
        const _it = async (map: (num: number) => string | Promise<string>) => {
            expect(map).toHaveBeenCalledTimes(0);
            await Ok(1).mapErrAsync(map);
            expect(map).toHaveBeenCalledTimes(0);
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should panic if fn panic', async () => {
        await expect(() => Err('err').mapErrAsync(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => Err('err').mapErrAsync(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x = await Err(new Error('Some error message')).mapErrAsync((err) => Promise.resolve(err.message));
            assert(x.err() === 'Some error message');
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.inspect.name}\``, () => {
    it('should return itself', () => {
        const fn = () => {
            // do something
        };
        const okResult = Ok(1);
        const errResult = Err(0);
        expect(okResult.inspect(fn)).toBe(okResult);
        expect(errResult.inspect(fn)).toBe(errResult);
    });

    it('should inspect ok value', () => {
        const fn = jest.fn((value: number) => expect(value).toBe(1));
        expect(fn).toHaveBeenCalledTimes(0);
        Ok(1).inspect(fn);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not inspect err value', () => {
        const fn = jest.fn(() => {
            // do something
        });
        expect(fn).toHaveBeenCalledTimes(0);
        Err(1).inspect(fn);
        expect(fn).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', () => {
        expect(() => Ok(1).inspect(panicFn1)).toThrow(Error('error'));
    });

    it('should have correct examples doc', () => {
        jest.spyOn(console, 'log').mockImplementationOnce(() => {});

        function examples() {
            const num = resultify
                .sync<SyntaxError>()(JSON.parse)('4')
                .inspect((value: number) => console.log(`original: ${value}`))
                .map((value) => value ** 3)
                .expect('failed to parse number');
            assert(num === 64);
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.inspectAsync.name}\``, () => {
    it('should return itself', async () => {
        const fn1 = () => {
            // do something
        };
        const fn2 = () => {
            // do something
            return Promise.resolve();
        };

        const okResult = Ok(1);
        const errResult = Err(0);

        await expect(okResult.inspectAsync(fn1)).resolves.toBe(okResult);
        await expect(errResult.inspectAsync(fn1)).resolves.toBe(errResult);
        await expect(okResult.inspectAsync(fn2)).resolves.toBe(okResult);
        await expect(errResult.inspectAsync(fn2)).resolves.toBe(errResult);
    });

    it('should inspect ok value', async () => {
        const fn1 = jest.fn((value: number) => expect(value).toBe(1));
        const fn2 = jest.fn((value: number) => {
            expect(value).toBe(1);
            return Promise.resolve();
        });
        expect(fn1).toHaveBeenCalledTimes(0);
        expect(fn2).toHaveBeenCalledTimes(0);
        await Ok(1).inspectAsync(fn1);
        await Ok(1).inspectAsync(fn2);
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn2).toHaveBeenCalledTimes(1);
    });

    it('should not inspect err value', async () => {
        const fn = jest.fn(() => {
            // do something
        });
        expect(fn).toHaveBeenCalledTimes(0);
        await Err(1).inspectAsync(fn);
        expect(fn).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', async () => {
        await expect(() => Ok(1).inspectAsync(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => Ok(1).inspectAsync(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            jest.spyOn(console, 'log').mockImplementationOnce(() => {});

            const num = await resultify
                .sync<SyntaxError>()(JSON.parse)('4')
                .inspectAsync((value: number) => {
                    console.log(`original: ${value}`);
                    return Promise.resolve();
                })
                .then((result) => result.map((value) => value ** 3))
                .then((result) => result.expect('failed to parse number'));
            assert(num === 64);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.inspectErr.name}\``, () => {
    it('should return itself', () => {
        const fn = () => {
            // do something
        };
        const okResult = Ok(1);
        const errResult = Err(0);
        expect(okResult.inspectErr(fn)).toBe(okResult);
        expect(errResult.inspectErr(fn)).toBe(errResult);
    });

    it('should not inspect ok value', () => {
        const fn = jest.fn(() => {
            // do something
        });
        expect(fn).toHaveBeenCalledTimes(0);
        Ok(1).inspectErr(fn);
        expect(fn).toHaveBeenCalledTimes(0);
    });

    it('should inspect err value', () => {
        const fn = jest.fn((value: number) => expect(value).toBe(1));
        expect(fn).toHaveBeenCalledTimes(0);
        Err(1).inspectErr(fn);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should panic if fn panic', () => {
        expect(() => Err('err').inspectErr(panicFn1)).toThrow(Error('error'));
    });

    it('should have correct examples doc', () => {
        jest.spyOn(console, 'log').mockImplementationOnce(() => {});

        function examples() {
            const num = resultify
                .sync<SyntaxError>()(JSON.parse)('asdf')
                .inspectErr((err) => console.log(`failed to parse json string: ${err.message}`));
            assert(num.err() instanceof SyntaxError);
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.inspectErrAsync.name}\``, () => {
    it('should return itself', async () => {
        const fn1 = () => {
            // do something
        };
        const fn2 = () => {
            // do something
            return Promise.resolve();
        };

        const okResult = Ok(1);
        const errResult = Err(0);

        await expect(okResult.inspectErrAsync(fn1)).resolves.toBe(okResult);
        await expect(errResult.inspectErrAsync(fn1)).resolves.toBe(errResult);
        await expect(okResult.inspectErrAsync(fn2)).resolves.toBe(okResult);
        await expect(errResult.inspectErrAsync(fn2)).resolves.toBe(errResult);
    });

    it('should not inspect ok value', async () => {
        const fn = jest.fn(() => {
            // do something
        });
        expect(fn).toHaveBeenCalledTimes(0);
        await Ok(1).inspectErrAsync(fn);
        expect(fn).toHaveBeenCalledTimes(0);
    });

    it('should inspect err value', async () => {
        const fn1 = jest.fn((value: number) => expect(value).toBe(1));
        const fn2 = jest.fn((value: number) => {
            expect(value).toBe(1);
            return Promise.resolve();
        });
        expect(fn1).toHaveBeenCalledTimes(0);
        expect(fn2).toHaveBeenCalledTimes(0);
        await Err(1).inspectErrAsync(fn1);
        await Err(1).inspectErrAsync(fn2);
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn2).toHaveBeenCalledTimes(1);
    });

    it('should panic if fn panic', async () => {
        await expect(() => Err('err').inspectErrAsync(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => Err('err').inspectErrAsync(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        jest.spyOn(console, 'log').mockImplementationOnce(() => {});

        async function examples() {
            const num = await resultify
                .sync<SyntaxError>()(JSON.parse)('asdf')
                .inspectErrAsync((err) => {
                    console.log(`failed to parse json string: ${err.message}`);
                    return Promise.resolve();
                });
            assert(num.err() instanceof SyntaxError);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.expect.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value', () => {
        expect(Ok(1).expect('Operation type should be correct')).toBe(1);
        expect(() => Err(2).expect('Operation type should be correct')).toThrow('Operation type should be correct: 2');
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<number, string> = Err('emergency failure');
            x.expect('Failed to operate');
        }

        expect(examples).toThrow('Failed to operate: emergency failure');
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.unwrap.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value', () => {
        expect(Ok(1).unwrap()).toBe(1);
        expect(() => Err('Some error message').unwrap()).toThrow('Some error message');
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<number, string> = Ok(2);
            assert(x.unwrap() === 2);

            const y: Result<number, string> = Err('emergency failure');
            y.unwrap();
        }

        expect(examples).toThrow('emergency failure');
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.expectErr.name}\``, () => {
    it('should unwrap itself to get the contained `Err` value', () => {
        expect(Err('Some error message').expectErr('Testing expectErr')).toBe('Some error message');
        expect(() => Ok(1).expectErr('Testing expectErr')).toThrow('Testing expectErr: 1');
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<number, string> = Ok(10);
            x.expectErr('Testing expectErr');
        }

        expect(examples).toThrow('Testing expectErr: 10');
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.unwrapErr.name}\``, () => {
    it('should unwrap itself to get the contained `Err` value', () => {
        expect(Err('Some error message').unwrapErr()).toBe('Some error message');
        expect(() => Ok(1).unwrapErr()).toThrow('1');
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<number, string> = Err('emergency failure');
            assert(x.unwrapErr() === 'emergency failure');

            const y: Result<number, string> = Ok(2);
            y.unwrapErr();
        }

        expect(examples).toThrow('2');
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.unwrapOr.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value or the provided value', () => {
        const ok = Ok<number, string>(100);
        const okErr = Err<number, string>('Err');

        expect(ok.unwrapOr(50)).toBe(100);
        expect(okErr.unwrapOr(50)).toBe(50);
    });

    it('should have correct examples doc', () => {
        function examples() {
            const $default = 2;
            const x: Result<number, string> = Ok(9);
            assert(x.unwrapOr($default) === 9);

            const y: Result<number, string> = Err('error');
            assert(y.unwrapOr($default) === $default);
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.unwrapOrElse.name}\``, () => {
    const fnFactory = () =>
        jest.fn((msg: string) => {
            if (msg === 'I got this.') return 50;
            throw new Error('BadBad');
        });

    it('should unwrap itself to get the contained `Ok` value or computes it from a closure', () => {
        const op = fnFactory();
        expect(Ok(100).unwrapOrElse(op)).toBe(100);
        expect(Err<number, string>('I got this.').unwrapOrElse(op)).toBe(50);
    });

    it('should call op only once if itself if `Err`', () => {
        const op = fnFactory();
        expect(op).toHaveBeenCalledTimes(0);
        Err<number, string>('I got this.').unwrapOrElse(op);
        expect(op).toHaveBeenCalledTimes(1);
    });

    it('should not call op if itself if `Ok`', () => {
        const op = fnFactory();
        expect(op).toHaveBeenCalledTimes(0);
        Ok(100).unwrapOrElse(op);
        expect(op).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', () => {
        expect(() => Err('err').unwrapOrElse(panicFn1)).toThrow(Error('error'));
    });

    it('should have correct examples doc', () => {
        function examples() {
            const count = (err: string) => err.length;
            assert(Ok<number, string>(2).unwrapOrElse(count) === 2);
            assert(Err<number, string>('foo').unwrapOrElse(count) === 3);
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.unwrapOrElseAsync.name}\``, () => {
    const fnFactory1 = () =>
        jest.fn((msg: string) => {
            if (msg === 'I got this.') return 50;
            throw new Error('BadBad');
        });
    const fnFactory2 = () =>
        jest.fn((msg: string) => {
            if (msg === 'I got this.') return Promise.resolve(50);
            throw new Error('BadBad');
        });

    it('should unwrap itself to get the contained `Ok` value or computes it from a closure', async () => {
        const _it = async (op: (msg: string) => number | Promise<number>) => {
            await expect(Ok(100).unwrapOrElseAsync(op)).resolves.toBe(100);
            await expect(Err<number, string>('I got this.').unwrapOrElseAsync(op)).resolves.toBe(50);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should call op only once if itself if `Err`', async () => {
        const _it = async (op: (msg: string) => number | Promise<number>) => {
            expect(op).toHaveBeenCalledTimes(0);
            await Err<number, string>('I got this.').unwrapOrElseAsync(op);
            expect(op).toHaveBeenCalledTimes(1);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should not call op if itself if `Ok`', async () => {
        const _it = async (op: (msg: string) => number | Promise<number>) => {
            expect(op).toHaveBeenCalledTimes(0);
            await Ok(100).unwrapOrElseAsync(op);
            expect(op).toHaveBeenCalledTimes(0);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should panic if fn panic', async () => {
        await expect(() => Err('err').unwrapOrElseAsync(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => Err('err').unwrapOrElseAsync(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const count = (err: string) => Promise.resolve(err.length);
            assert((await Ok<number, string>(2).unwrapOrElseAsync(count)) === 2);
            assert((await Err<number, string>('foo').unwrapOrElseAsync(count)) === 3);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.unwrapUnchecked.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value', () => {
        expect(Ok(100).unwrapUnchecked()).toBe(100);
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<number, string> = Ok(2);
            assert(x.unwrapUnchecked() === 2);

            const y: Result<number, string> = Err('emergency failure');
            y.unwrapUnchecked();
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.unwrapErrUnchecked.name}\``, () => {
    it('should unwrap itself to get the contained `Err` value', () => {
        expect(Err('Err').unwrapErrUnchecked()).toBe('Err');
    });

    it('should have correct examples doc', () => {
        function examples() {
            const x: Result<number, string> = Ok(2);
            x.unwrapErrUnchecked();

            const y: Result<number, string> = Err('emergency failure');
            assert(y.unwrapErrUnchecked() === 'emergency failure');
        }

        expect(examples).not.toThrow();
    });
});

function op1(): Result<number, string> {
    return Ok(666);
}

function op2(): Result<number, string> {
    return Err('sadface');
}

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.and.name}\``, () => {
    it('should return `res`', () => {
        expect(op1().and(Ok(667))).toStrictEqual(Ok(667));
        expect(op1().and(Err('bad'))).toStrictEqual(Err('bad'));
    });

    it('should return the `Err` result', () => {
        expect(op2().and(Ok(667))).toStrictEqual(Err('sadface'));
        expect(op2().and(Err('bad'))).toStrictEqual(Err('sadface'));
    });

    it('should have correct examples doc', () => {
        function examples() {
            let x: Result<number, string>;
            let y: Result<string, string>;

            x = Ok(2);
            y = Err('late error');
            assert(x.and(y).equal(Err('late error')));

            x = Err('early error');
            y = Ok('foo');
            assert(x.and(y).equal(Err('early error')));

            x = Err('not a 2');
            y = Err('late error');
            assert(x.and(y).equal(Err('not a 2')));

            x = Ok(2);
            y = Ok('different result type');
            assert(x.and(y).equal(Ok('different result type')));
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.andThen.name}\``, () => {
    it('should return `res`', () => {
        expect(op1().andThen((num) => Ok(num + 1))).toStrictEqual(Ok(667));
        expect(op1().andThen(() => Err('bad'))).toStrictEqual(Err('bad'));
    });

    it('should return the `Err` result', () => {
        expect(op2().andThen((num) => Ok(num + 1))).toStrictEqual(Err('sadface'));
        expect(op2().andThen(() => Err('bad'))).toStrictEqual(Err('sadface'));
    });

    it('should call op fn only once if itself is `Ok`', () => {
        const fn = jest.fn((num: number) => Ok(num + 1));
        expect(fn).toHaveBeenCalledTimes(0);
        op1().andThen(fn);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not call op fn if itself is `Err`', () => {
        const fn = jest.fn((num: number) => Ok(num + 1));
        expect(fn).toHaveBeenCalledTimes(0);
        op2().andThen(fn);
        expect(fn).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', () => {
        expect(() => Ok(1).andThen(panicFn1)).toThrow(Error('error'));
    });

    it('should have correct examples doc', () => {
        function examples() {
            const parseJSON = (json: string) =>
                resultify
                    .sync<SyntaxError>()(JSON.parse)(json)
                    .mapErr((err) => err.message);

            assert(Ok<string, string>('2').andThen(parseJSON).equal(Ok(2)));
            assert(
                Ok<string, string>('asdf')
                    .andThen(parseJSON)
                    .equal(Err('Unexpected token \'a\', "asdf" is not valid JSON')),
            );
            assert(Err('not a valid json string').andThen(parseJSON).equal(Err('not a valid json string')));
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.andThenAsync.name}\``, () => {
    it('should return `res`', async () => {
        await expect(op1().andThenAsync((num) => Ok(num + 1))).resolves.toStrictEqual(Ok(667));
        await expect(op1().andThenAsync((num) => Promise.resolve(Ok(num + 1)))).resolves.toStrictEqual(Ok(667));
        await expect(op1().andThenAsync(() => Err('bad'))).resolves.toStrictEqual(Err('bad'));
        await expect(op1().andThenAsync(() => Promise.resolve(Err('bad')))).resolves.toStrictEqual(Err('bad'));
    });

    it('should return the `Err` result', async () => {
        await expect(op2().andThenAsync((num) => Ok(num + 1))).resolves.toStrictEqual(Err('sadface'));
        await expect(op2().andThenAsync((num) => Promise.resolve(Ok(num + 1)))).resolves.toStrictEqual(Err('sadface'));
        await expect(op2().andThenAsync(() => Err('bad'))).resolves.toStrictEqual(Err('sadface'));
        await expect(op2().andThenAsync(() => Promise.resolve(Err('bad')))).resolves.toStrictEqual(Err('sadface'));
    });

    it('should call op fn only once if itself is `Ok`', async () => {
        const fn = jest.fn((num: number) => Promise.resolve(Ok(num + 1)));
        expect(fn).toHaveBeenCalledTimes(0);
        await op1().andThenAsync(fn);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not call op fn if itself is `Err`', async () => {
        const fn = jest.fn((num: number) => Promise.resolve(Ok(num + 1)));
        expect(fn).toHaveBeenCalledTimes(0);
        await op2().andThenAsync(fn);
        expect(fn).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', async () => {
        await expect(() => Ok(1).andThenAsync(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => Ok(1).andThenAsync(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const parseJSON = (json: string) =>
                Promise.resolve(
                    resultify
                        .sync<SyntaxError>()(JSON.parse)(json)
                        .mapErr((err) => err.message),
                );

            const x = await Ok<string, string>('2').andThenAsync(parseJSON);
            assert(x.equal(Ok(2)));

            const y = await Ok<string, string>('asdf').andThenAsync(parseJSON);
            assert(y.equal(Err('Unexpected token \'a\', "asdf" is not valid JSON')));

            const z = await Err('not a valid json string').andThenAsync(parseJSON);
            assert(z.equal(Err('not a valid json string')));
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.or.name}\``, () => {
    it('should return the `Ok` result', () => {
        expect(op1().or(Ok(667))).toStrictEqual(Ok(666));
        expect(op1().or(Err('bad'))).toStrictEqual(Ok(666));
    });

    it('should return `res`', () => {
        expect(op2().or(Ok(667))).toStrictEqual(Ok(667));
        expect(op2().or(Err('bad'))).toStrictEqual(Err('bad'));
    });

    it('should have correct examples doc', () => {
        function examples() {
            let x: Result<number, string>;
            let y: Result<number, string>;

            x = Ok(2);
            y = Err('late error');
            assert(x.or(y).equal(Ok(2)));

            x = Err('early error');
            y = Ok(2);
            assert(x.or(y).equal(Ok(2)));

            x = Err('not a 2');
            y = Err('late error');
            assert(x.or(y).equal(Err('late error')));

            x = Ok(2);
            y = Ok(100);
            assert(x.or(y).equal(Ok(2)));
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.orElse.name}\``, () => {
    it('should return the `Ok` result', () => {
        expect(op1().orElse(() => Ok(667))).toStrictEqual(Ok(666));
        expect(op1().orElse((err) => Err(err))).toStrictEqual(Ok(666));
    });

    it('should return `res`', () => {
        expect(op2().orElse(() => Ok(667))).toStrictEqual(Ok(667));
        expect(op2().orElse((err) => Err(err))).toStrictEqual(Err('sadface'));
    });

    it('should call op fn only once if itself is `Err`', () => {
        const fn = jest.fn((err: string) => Err(err));
        expect(fn).toHaveBeenCalledTimes(0);
        op2().orElse(fn);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not call op fn if itself is `Ok`', () => {
        const fn = jest.fn((err: string) => Err(err));
        expect(fn).toHaveBeenCalledTimes(0);
        op1().orElse(fn);
        expect(fn).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', () => {
        expect(() => Err('err').orElse(panicFn1)).toThrow(Error('error'));
    });

    it('should have correct examples doc', () => {
        function examples() {
            const sq = (num: number): Result<number, number> => Ok(num * num);
            const err = (num: number): Result<number, number> => Err(num);

            assert(Ok(2).orElse(sq).orElse(sq).equal(Ok(2)));
            assert(Ok(2).orElse(err).orElse(sq).equal(Ok(2)));
            assert(Err<number, number>(3).orElse(sq).orElse(err).equal(Ok(9)));
            assert(Err<number, number>(3).orElse(err).orElse(err).equal(Err(3)));
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.orElseAsync.name}\``, () => {
    it('should return the `Ok` result', async () => {
        await expect(op1().orElseAsync(() => Ok(667))).resolves.toStrictEqual(Ok(666));
        await expect(op1().orElseAsync(() => Promise.resolve(Ok(667)))).resolves.toStrictEqual(Ok(666));
        await expect(op1().orElseAsync((err) => Err(err))).resolves.toStrictEqual(Ok(666));
        await expect(op1().orElseAsync((err) => Promise.resolve(Err(err)))).resolves.toStrictEqual(Ok(666));
    });

    it('should return `res`', async () => {
        await expect(op2().orElseAsync(() => Ok(667))).resolves.toStrictEqual(Ok(667));
        await expect(op2().orElseAsync(() => Promise.resolve(Ok(667)))).resolves.toStrictEqual(Ok(667));
        await expect(op2().orElseAsync((err) => Err(err))).resolves.toStrictEqual(Err('sadface'));
        await expect(op2().orElseAsync((err) => Promise.resolve(Err(err)))).resolves.toStrictEqual(Err('sadface'));
    });

    it('should call op fn only once if itself is `Err`', async () => {
        const fn = jest.fn((err: string) => Promise.resolve(Err(err)));
        expect(fn).toHaveBeenCalledTimes(0);
        await op2().orElseAsync(fn);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not call op fn if itself is `Ok`', async () => {
        const fn = jest.fn((err: string) => Promise.resolve(Err(err)));
        expect(fn).toHaveBeenCalledTimes(0);
        await op1().orElseAsync(fn);
        expect(fn).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', async () => {
        await expect(() => Err('err').orElseAsync(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => Err('err').orElseAsync(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const sq = (num: number): Promise<Result<number, number>> => Promise.resolve(Ok(num * num));
            const err = (num: number): Promise<Result<number, number>> => Promise.resolve(Err(num));

            const x = await Ok(2)
                .orElseAsync(sq)
                .then((result) => result.orElseAsync(sq));
            assert(x.equal(Ok(2)));

            const y = await Err<number, number>(3)
                .orElseAsync(sq)
                .then((result) => result.orElseAsync(err));
            assert(y.equal(Ok(9)));

            const z = await Err<number, number>(3)
                .orElseAsync(err)
                .then((result) => result.orElseAsync(err));
            assert(z.equal(Err(3)));
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.transpose.name}\``, () => {
    it('should transpose itself to an optional of a `Result`', () => {
        expect(Ok(1).transpose()).toStrictEqual(Ok(1));
        expect(Ok(undefined).transpose()).toBeUndefined();
        expect(Ok(null).transpose()).toBeUndefined();
        expect(Err('Some error message').transpose()).toStrictEqual(Err('Some error message'));
    });

    it('should have correct examples doc', () => {
        function examples() {
            type SomeErr = unknown;

            let x: Result<number | undefined | null, SomeErr>;
            let y: Result<number, SomeErr> | undefined;

            x = Ok(5);
            y = Ok(5);
            assert(x.transpose()!.equal(y));

            x = Ok(undefined);
            y = undefined;
            assert(x.transpose() === y);

            x = Ok(null);
            y = undefined;
            assert(x.transpose() === y);
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.equal.name}\``, () => {
    it('should check if itself equals to another result', () => {
        // simple true

        expect(Ok(1).equal(Ok(1))).toBe(true);
        expect(Ok(NaN).equal(Ok(NaN))).toBe(true);
        expect(Err('err').equal(Err('err'))).toBe(true);

        // simple false

        expect(Ok(1).equal(Ok(2))).toBe(false);
        expect(Ok(1).equal(Ok('hello world'))).toBe(false);
        expect(Ok(1).equal(Err('err'))).toBe(false);
        expect(Err('err 1').equal(Err('err 2'))).toBe(false);
        expect(Err('err 1').equal(Err(-1))).toBe(false);
        expect(Err('error').equal(Ok(1))).toBe(false);

        // nested true

        expect(Ok(Ok(1)).equal(Ok(Ok(1)))).toBe(true);
        expect(Ok(Err('err')).equal(Ok(Err('err')))).toBe(true);
        expect(Err(Err('err')).equal(Err(Err('err')))).toBe(true);
        expect(Err(Ok(1)).equal(Err(Ok(1)))).toBe(true);

        // nested false

        expect(Ok(Ok(1)).equal(Ok(Ok(2)))).toBe(false);
        expect(Ok(Ok(1)).equal(Ok(Err('err')))).toBe(false);
        expect(Ok(Err('err')).equal(Ok(Ok(1)))).toBe(false);
        expect(Err(Err('err')).equal(Err(Ok(1)))).toBe(false);
        expect(Err(Ok(1)).equal(Err(Err('err')))).toBe(false);

        // object equality

        expect(Ok([1]).equal(Ok([1]))).toBe(false);
        expect(Ok({ foo: 1 }).equal(Ok({ foo: 1 }))).toBe(false);
        expect(Err({ message: 'err' }).equal(Err({ message: 'err' }))).toBe(false);
        expect(Ok(Ok([1])).equal(Ok(Ok([1])))).toBe(false);
        expect(Ok(Ok({ foo: 1 })).equal(Ok(Ok({ foo: 1 })))).toBe(false);
        expect(Err(Err({ message: 'err' })).equal(Err(Err({ message: 'err' })))).toBe(false);
    });
});
