import { describe, expect, it, jest } from '@jest/globals';
import assert from 'node:assert';

import { Err, Ok } from '../factory';
import { ErrAsync, OkAsync } from '../factoryAsync';
import type { Result } from '../Result';
import type { ResultAsync } from '../ResultAsync';
import { RustlikeResultAsync } from '../RustlikeResultAsync';

function panicFn1(): never {
    throw new Error('error');
}

function panicFn2() {
    return Promise.reject(new Error('error'));
}

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.isOk.name}\``, () => {
    it('should return if itself is `Ok`', async () => {
        await expect(OkAsync(1).isOk()).resolves.toBe(true);
        await expect(ErrAsync('Some error message').isOk()).resolves.toBe(false);
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: ResultAsync<number, string> = OkAsync(2);
            assert((await x.isOk()) === true);

            const y: ResultAsync<number, string> = ErrAsync('Some error message');
            assert((await y.isOk()) === false);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.isOkAnd.name}\``, () => {
    const fnFactory1 = () => jest.fn((num: number) => num > 1);
    const fnFactory2 = () => jest.fn((num: number) => Promise.resolve(num > 1));

    it('should return if itself is `Ok` and the value inside of it matches a predicate', async () => {
        const _it = async (fn: (num: number) => boolean | Promise<boolean>) => {
            await expect(OkAsync(2).isOkAnd(fn)).resolves.toBe(true);
            await expect(OkAsync(0).isOkAnd(fn)).resolves.toBe(false);
            await expect(ErrAsync('Some error message').isOkAnd(fn)).resolves.toBe(false);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should call fn only once if itself is `Ok`', async () => {
        const _it = async (fn: (num: number) => boolean | Promise<boolean>) => {
            expect(fn).toHaveBeenCalledTimes(0);
            await OkAsync(2).isOkAnd(fn);
            expect(fn).toHaveBeenCalledTimes(1);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should not call fn if itself is `Err`', async () => {
        const _it = async (fn: (num: number) => boolean | Promise<boolean>) => {
            expect(fn).toHaveBeenCalledTimes(0);
            await ErrAsync('Some error message').isOkAnd(fn);
            expect(fn).toHaveBeenCalledTimes(0);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should panic if fn panic', async () => {
        await expect(() => OkAsync(2).isOkAnd(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => OkAsync(2).isOkAnd(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: ResultAsync<number, string> = OkAsync(2);
            assert((await x.isOkAnd((value) => Promise.resolve(value > 1))) === true);

            const y: ResultAsync<number, string> = OkAsync(0);
            assert((await y.isOkAnd((value) => Promise.resolve(value > 1))) === false);

            const z: ResultAsync<number, string> = ErrAsync('Some error message');
            assert((await z.isOkAnd((value) => Promise.resolve(value > 1))) === false);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.isErr.name}\``, () => {
    it('should return if itself is `Err`', async () => {
        await expect(OkAsync(1).isErr()).resolves.toBe(false);
        await expect(ErrAsync('Some error message').isErr()).resolves.toBe(true);
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: ResultAsync<number, string> = OkAsync(-3);
            assert((await x.isErr()) === false);

            const y: ResultAsync<number, string> = ErrAsync('Some error message');
            assert((await y.isErr()) === true);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.isErrAnd.name}\``, () => {
    enum ErrorKind {
        NOT_FOUND,
        PERMISSION_DENIED,
    }

    const fnFactory1 = () => jest.fn((err: ErrorKind) => err === ErrorKind.NOT_FOUND);
    const fnFactory2 = () => jest.fn((err: ErrorKind) => Promise.resolve(err === ErrorKind.NOT_FOUND));

    it('should return if itself is `Err` and the value inside of it matches a predicate', async () => {
        const _it = async (fn: (err: ErrorKind) => boolean | Promise<boolean>) => {
            await expect(ErrAsync(ErrorKind.NOT_FOUND).isErrAnd(fn)).resolves.toBe(true);
            await expect(ErrAsync(ErrorKind.PERMISSION_DENIED).isErrAnd(fn)).resolves.toBe(false);
            await expect(OkAsync(123).isErrAnd(fn)).resolves.toBe(false);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should call fn only once if itself is `Err`', async () => {
        const _it = async (fn: (err: ErrorKind) => boolean | Promise<boolean>) => {
            expect(fn).toHaveBeenCalledTimes(0);
            await ErrAsync(ErrorKind.NOT_FOUND).isErrAnd(fn);
            expect(fn).toHaveBeenCalledTimes(1);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should not call fn if itself is `Ok`', async () => {
        const _it = async (fn: (err: ErrorKind) => boolean | Promise<boolean>) => {
            expect(fn).toHaveBeenCalledTimes(0);
            await OkAsync(123).isErrAnd(fn);
            expect(fn).toHaveBeenCalledTimes(0);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should panic if fn panic', async () => {
        await expect(() => ErrAsync(ErrorKind.NOT_FOUND).isErrAnd(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => ErrAsync(ErrorKind.NOT_FOUND).isErrAnd(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: ResultAsync<number, ErrorKind> = ErrAsync(ErrorKind.NOT_FOUND);
            assert((await x.isErrAnd((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === true);

            const y: ResultAsync<number, ErrorKind> = ErrAsync(ErrorKind.PERMISSION_DENIED);
            assert((await y.isErrAnd((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === false);

            const z: ResultAsync<number, ErrorKind> = OkAsync(123);
            assert((await z.isErrAnd((value) => Promise.resolve(value === ErrorKind.NOT_FOUND))) === false);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.ok.name}\``, () => {
    it('should convert itself to an optional value', async () => {
        await expect(OkAsync(1).ok()).resolves.toBe(1);
        await expect(ErrAsync('Some error message').ok()).resolves.toBeUndefined();
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: ResultAsync<number, string> = OkAsync(2);
            assert((await x.ok()) === 2);

            const y: ResultAsync<number, string> = ErrAsync('Some error message');
            assert((await y.ok()) === undefined);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.err.name}\``, () => {
    it('should convert itself to an optional error', async () => {
        await expect(OkAsync(1).err()).resolves.toBeUndefined();
        await expect(ErrAsync('Some error message').err()).resolves.toBe('Some error message');
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: ResultAsync<number, string> = OkAsync(2);
            assert((await x.err()) === undefined);

            const y: ResultAsync<number, string> = ErrAsync('Some error message');
            assert((await y.err()) === 'Some error message');
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.map.name}\``, () => {
    const mapFactory1 = () => jest.fn((num: number) => String(num));
    const mapFactory2 = () => jest.fn((num: number) => Promise.resolve(String(num)));

    it('should map itself to another result', async () => {
        const _it = async (map: (num: number) => string | Promise<string>) => {
            await expect(OkAsync(1).map(map)).resolves.toStrictEqual(Ok('1'));
            await expect(ErrAsync('Some error message').map(map)).resolves.toStrictEqual(Err('Some error message'));
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should call map fn only once if itself is `Ok`', async () => {
        const _it = async (map: (num: number) => string | Promise<string>) => {
            expect(map).toHaveBeenCalledTimes(0);
            await OkAsync(1).map(map);
            expect(map).toHaveBeenCalledTimes(1);
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should not call map fn if itself is `Err`', async () => {
        const _it = async (map: (num: number) => string | Promise<string>) => {
            expect(map).toHaveBeenCalledTimes(0);
            await ErrAsync('Some error message').map(map);
            expect(map).toHaveBeenCalledTimes(0);
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should panic if fn panic', async () => {
        await expect(() => OkAsync(1).map(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => OkAsync(1).map(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x = OkAsync<string, string>('foo').map((value) => Promise.resolve(value.length));
            assert((await x.ok()) === 3);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.mapOr.name}\``, () => {
    const mapFactory1 = () => jest.fn((num: number) => num * 2);
    const mapFactory2 = () => jest.fn((num: number) => Promise.resolve(num * 2));

    it('should map itself to another result', async () => {
        const _it = async (map: (num: number) => number | Promise<number>) => {
            await expect(OkAsync(1).mapOr(-1, map)).resolves.toBe(2);
            await expect(ErrAsync('Some error message').mapOr(-1, map)).resolves.toBe(-1);
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should call map fn only once if itself is `Ok`', async () => {
        const _it = async (map: (num: number) => number | Promise<number>) => {
            expect(map).toHaveBeenCalledTimes(0);
            await OkAsync(1).mapOr(-1, map);
            expect(map).toHaveBeenCalledTimes(1);
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should not call map fn if itself is `Err`', async () => {
        const _it = async (map: (num: number) => number | Promise<number>) => {
            expect(map).toHaveBeenCalledTimes(0);
            await ErrAsync('Some error message').mapOr(-1, map);
            expect(map).toHaveBeenCalledTimes(0);
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should panic if fn panic', async () => {
        await expect(() => OkAsync(1).mapOr(Err('err'), panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => OkAsync(1).mapOr(Err('err'), panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: ResultAsync<string, string> = OkAsync('foo');
            assert((await x.mapOr(42, (value) => value.length)) === 3);

            const y: ResultAsync<string, string> = ErrAsync('bar');
            assert((await y.mapOr(42, (value) => value.length)) === 42);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.mapOrElse.name}\``, () => {
    const mapFactory1 = () => jest.fn(jest.fn((num: number) => String(num)));
    const mapFactory2 = () => jest.fn(jest.fn((num: number) => Promise.resolve(String(num))));
    const fallbackFactory1 = () => jest.fn(jest.fn((str: string) => str));
    const fallbackFactory2 = () => jest.fn(jest.fn((str: string) => Promise.resolve(str)));

    it('should map itself to another value', async () => {
        const _it = async (
            map: (num: number) => string | Promise<string>,
            fallback: (str: string) => string | Promise<string>,
        ) => {
            await expect(OkAsync(1).mapOrElse(fallback, map)).resolves.toBe('1');
            await expect(ErrAsync('Some error message').mapOrElse(fallback, map)).resolves.toBe('Some error message');
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
            await OkAsync(1).mapOrElse(fallback, map);
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
            await ErrAsync('Some error message').mapOrElse(fallback, map);
            expect(map).toHaveBeenCalledTimes(0);
            expect(fallback).toHaveBeenCalledTimes(1);
        };

        await _it(mapFactory1(), fallbackFactory1());
        await _it(mapFactory2(), fallbackFactory2());
    });

    it('should panic if fn panic', async () => {
        await expect(() => OkAsync(1).mapOrElse(panicFn1, panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => ErrAsync('err').mapOrElse(panicFn1, panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => OkAsync(1).mapOrElse(panicFn2, panicFn2)).rejects.toThrow(Error('error'));
        await expect(() => ErrAsync('err').mapOrElse(panicFn2, panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const k = 21;

            const x: ResultAsync<string, string> = OkAsync('foo');
            assert(
                (await x.mapOrElse(
                    () => Promise.resolve(k * 2),
                    (value) => Promise.resolve(value.length),
                )) === 3,
            );

            const y: ResultAsync<string, string> = ErrAsync('bar');
            assert(
                (await y.mapOrElse(
                    () => Promise.resolve(k * 2),
                    (value) => Promise.resolve(value.length),
                )) === 42,
            );
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.mapErr.name}\``, () => {
    const mapFactory1 = () => jest.fn((num: number) => `error code: ${num}`);
    const mapFactory2 = () => jest.fn((num: number) => Promise.resolve(`error code: ${num}`));

    it('should map itself to another result', async () => {
        const _it = async (map: (num: number) => string | Promise<string>) => {
            await expect(OkAsync(1).mapErr(map)).resolves.toStrictEqual(Ok(1));
            await expect(ErrAsync(2).mapErr(map)).resolves.toStrictEqual(Err('error code: 2'));
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should call map fn only once if itself is `Err`', async () => {
        const _it = async (map: (num: number) => string | Promise<string>) => {
            expect(map).toHaveBeenCalledTimes(0);
            await ErrAsync(2).mapErr(map);
            expect(map).toHaveBeenCalledTimes(1);
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should not call map fn if itself is `Ok`', async () => {
        const _it = async (map: (num: number) => string | Promise<string>) => {
            expect(map).toHaveBeenCalledTimes(0);
            await OkAsync(1).mapErr(map);
            expect(map).toHaveBeenCalledTimes(0);
        };

        await _it(mapFactory1());
        await _it(mapFactory2());
    });

    it('should panic if fn panic', async () => {
        await expect(() => ErrAsync('err').mapErr(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => ErrAsync('err').mapErr(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x = ErrAsync(new Error('Some error message')).mapErr((err) => Promise.resolve(err.message));
            assert((await x.err()) === 'Some error message');
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.inspect.name}\``, () => {
    it('should not mutate result', async () => {
        const fn1 = () => {
            // do something
        };
        const fn2 = () => {
            // do something
            return Promise.resolve();
        };

        const okResult = OkAsync(1);
        const errResult = ErrAsync(0);

        const expectedOk = Ok(1);
        const expectedErr = Err(0);

        await expect(okResult.inspect(fn1)).resolves.toStrictEqual(expectedOk);
        await expect(errResult.inspect(fn1)).resolves.toStrictEqual(expectedErr);
        await expect(okResult.inspect(fn2)).resolves.toStrictEqual(expectedOk);
        await expect(errResult.inspect(fn2)).resolves.toStrictEqual(expectedErr);
    });

    it('should inspect ok value', async () => {
        const fn1 = jest.fn((value: number) => expect(value).toBe(1));
        const fn2 = jest.fn((value: number) => {
            expect(value).toBe(1);
            return Promise.resolve();
        });
        expect(fn1).toHaveBeenCalledTimes(0);
        expect(fn2).toHaveBeenCalledTimes(0);
        await OkAsync(1).inspect(fn1);
        await OkAsync(1).inspect(fn2);
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn2).toHaveBeenCalledTimes(1);
    });

    it('should not inspect err value', async () => {
        const fn = jest.fn(() => {
            // do something
        });
        expect(fn).toHaveBeenCalledTimes(0);
        await ErrAsync(1).inspect(fn);
        expect(fn).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', async () => {
        await expect(() => OkAsync(1).inspect(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => OkAsync(1).inspect(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            jest.spyOn(console, 'log').mockImplementationOnce(() => {});

            const num = await OkAsync(4)
                .inspect((value) => {
                    console.log(`original: ${value}`);
                })
                .map((value) => value ** 3)
                .expect('Some error message');
            assert(num === 64);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.inspectErr.name}\``, () => {
    it('should return itself', async () => {
        const fn1 = () => {
            // do something
        };
        const fn2 = () => {
            // do something
            return Promise.resolve();
        };

        const okResult = OkAsync(1);
        const errResult = ErrAsync(0);

        const expectedOk = Ok(1);
        const expectedErr = Err(0);

        await expect(okResult.inspectErr(fn1)).resolves.toStrictEqual(expectedOk);
        await expect(errResult.inspectErr(fn1)).resolves.toStrictEqual(expectedErr);
        await expect(okResult.inspectErr(fn2)).resolves.toStrictEqual(expectedOk);
        await expect(errResult.inspectErr(fn2)).resolves.toStrictEqual(expectedErr);
    });

    it('should not inspect ok value', async () => {
        const fn = jest.fn(() => {
            // do something
        });
        expect(fn).toHaveBeenCalledTimes(0);
        await OkAsync(1).inspectErr(fn);
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
        await ErrAsync(1).inspectErr(fn1);
        await ErrAsync(1).inspectErr(fn2);
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn2).toHaveBeenCalledTimes(1);
    });

    it('should panic if fn panic', async () => {
        await expect(() => ErrAsync('err').inspectErr(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => ErrAsync('err').inspectErr(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        jest.spyOn(console, 'log').mockImplementationOnce(() => {});

        async function examples() {
            const result = ErrAsync(new SyntaxError('Some error message')).inspectErr((err) => {
                console.log(`failed to do something: ${err.message}`);
            });
            assert((await result.err()) instanceof SyntaxError);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.expect.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value', async () => {
        await expect(OkAsync(1).expect('Operation type should be correct')).resolves.toBe(1);
        await expect(() => ErrAsync(2).expect('Operation type should be correct')).rejects.toThrow(
            'Operation type should be correct: 2',
        );
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: ResultAsync<number, string> = ErrAsync('emergency failure');
            await x.expect('Failed to operate');
        }

        await expect(examples()).rejects.toThrow('Failed to operate: emergency failure');
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.unwrap.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value', async () => {
        await expect(OkAsync(1).unwrap()).resolves.toBe(1);
        await expect(() => ErrAsync('Some error message').unwrap()).rejects.toThrow('Some error message');
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: ResultAsync<number, string> = OkAsync(2);
            assert((await x.unwrap()) === 2);

            const y: ResultAsync<number, string> = ErrAsync('emergency failure');
            await y.unwrap();
        }

        await expect(examples()).rejects.toThrow('emergency failure');
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.expectErr.name}\``, () => {
    it('should unwrap itself to get the contained `Err` value', async () => {
        await expect(ErrAsync('Some error message').expectErr('Testing expectErr')).resolves.toBe('Some error message');
        await expect(() => OkAsync(1).expectErr('Testing expectErr')).rejects.toThrow('Testing expectErr: 1');
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: ResultAsync<number, string> = OkAsync(10);
            await x.expectErr('Testing expectErr');
        }

        await expect(examples()).rejects.toThrow('Testing expectErr: 10');
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.unwrapErr.name}\``, () => {
    it('should unwrap itself to get the contained `Err` value', async () => {
        await expect(ErrAsync('Some error message').unwrapErr()).resolves.toBe('Some error message');
        await expect(() => OkAsync(1).unwrapErr()).rejects.toThrow('1');
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: ResultAsync<number, string> = ErrAsync('emergency failure');
            assert((await x.unwrapErr()) === 'emergency failure');

            const y: ResultAsync<number, string> = OkAsync(2);
            await y.unwrapErr();
        }

        await expect(examples()).rejects.toThrow('2');
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.unwrapOr.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value or the provided value', async () => {
        const ok = OkAsync<number, string>(100);
        const okErr = ErrAsync<number, string>('Err');

        await expect(ok.unwrapOr(50)).resolves.toBe(100);
        await expect(okErr.unwrapOr(50)).resolves.toBe(50);
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const $default = 2;
            const x: ResultAsync<number, string> = OkAsync(9);
            assert((await x.unwrapOr($default)) === 9);

            const y: ResultAsync<number, string> = ErrAsync('error');
            assert((await y.unwrapOr($default)) === $default);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.unwrapOrElse.name}\``, () => {
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
            await expect(OkAsync(100).unwrapOrElse(op)).resolves.toBe(100);
            await expect(ErrAsync<number, string>('I got this.').unwrapOrElse(op)).resolves.toBe(50);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should call op only once if itself if `Err`', async () => {
        const _it = async (op: (msg: string) => number | Promise<number>) => {
            expect(op).toHaveBeenCalledTimes(0);
            await ErrAsync<number, string>('I got this.').unwrapOrElse(op);
            expect(op).toHaveBeenCalledTimes(1);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should not call op if itself if `Ok`', async () => {
        const _it = async (op: (msg: string) => number | Promise<number>) => {
            expect(op).toHaveBeenCalledTimes(0);
            await OkAsync(100).unwrapOrElse(op);
            expect(op).toHaveBeenCalledTimes(0);
        };

        await _it(fnFactory1());
        await _it(fnFactory2());
    });

    it('should panic if fn panic', async () => {
        await expect(() => ErrAsync('err').unwrapOrElse(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => ErrAsync('err').unwrapOrElse(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const count = (err: string) => Promise.resolve(err.length);
            assert((await OkAsync<number, string>(2).unwrapOrElse(count)) === 2);
            assert((await ErrAsync<number, string>('foo').unwrapOrElse(count)) === 3);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.unwrapUnchecked.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value', async () => {
        await expect(OkAsync(100).unwrapUnchecked()).resolves.toBe(100);
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: ResultAsync<number, string> = OkAsync(2);
            assert((await x.unwrapUnchecked()) === 2);

            const y: ResultAsync<number, string> = ErrAsync('emergency failure');
            await y.unwrapUnchecked();
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.unwrapErrUnchecked.name}\``, () => {
    it('should unwrap itself to get the contained `Err` value', async () => {
        await expect(ErrAsync('Err').unwrapErrUnchecked()).resolves.toBe('Err');
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const x: ResultAsync<number, string> = OkAsync(2);
            await x.unwrapErrUnchecked();

            const y: ResultAsync<number, string> = ErrAsync('emergency failure');
            assert((await y.unwrapErrUnchecked()) === 'emergency failure');
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

function op1(): ResultAsync<number, string> {
    return OkAsync(666);
}

function op2(): ResultAsync<number, string> {
    return ErrAsync('sadface');
}

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.and.name}\``, () => {
    it('should return `res`', async () => {
        await expect(op1().and(Ok(667))).resolves.toStrictEqual(Ok(667));
        await expect(op1().and(OkAsync(667))).resolves.toStrictEqual(Ok(667));
        await expect(op1().and(Err('bad'))).resolves.toStrictEqual(Err('bad'));
        await expect(op1().and(ErrAsync('bad'))).resolves.toStrictEqual(Err('bad'));
    });

    it('should return the `Err` result', async () => {
        await expect(op2().and(Ok(667))).resolves.toStrictEqual(Err('sadface'));
        await expect(op2().and(OkAsync(667))).resolves.toStrictEqual(Err('sadface'));
        await expect(op2().and(Err('bad'))).resolves.toStrictEqual(Err('sadface'));
        await expect(op2().and(ErrAsync('bad'))).resolves.toStrictEqual(Err('sadface'));
    });

    it('should have correct examples doc', () => {
        async function examples() {
            let x: ResultAsync<number, string>;
            let y: ResultAsync<string, string>;

            x = OkAsync(2);
            y = ErrAsync('late error');
            assert(await x.and(y).equal(Err('late error')));

            x = ErrAsync('early error');
            y = OkAsync('foo');
            assert(await x.and(y).equal(Err('early error')));

            x = ErrAsync('not a 2');
            y = ErrAsync('late error');
            assert(await x.and(y).equal(Err('not a 2')));

            x = OkAsync(2);
            y = OkAsync('different result type');
            assert(await x.and(y).equal(Ok('different result type')));
        }

        expect(examples).not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.andThen.name}\``, () => {
    it('should return `res`', async () => {
        await expect(op1().andThen((num) => Ok(num + 1))).resolves.toStrictEqual(Ok(667));
        await expect(op1().andThen((num) => Promise.resolve(Ok(num + 1)))).resolves.toStrictEqual(Ok(667));
        await expect(op1().andThen((num) => OkAsync(num + 1))).resolves.toStrictEqual(Ok(667));
        await expect(op1().andThen(() => Err('bad'))).resolves.toStrictEqual(Err('bad'));
        await expect(op1().andThen(() => Promise.resolve(Err('bad')))).resolves.toStrictEqual(Err('bad'));
        await expect(op1().andThen(() => ErrAsync('bad'))).resolves.toStrictEqual(Err('bad'));
    });

    it('should return the `Err` result', async () => {
        await expect(op2().andThen((num) => Ok(num + 1))).resolves.toStrictEqual(Err('sadface'));
        await expect(op2().andThen((num) => Promise.resolve(Ok(num + 1)))).resolves.toStrictEqual(Err('sadface'));
        await expect(op2().andThen((num) => OkAsync(num + 1))).resolves.toStrictEqual(Err('sadface'));
        await expect(op2().andThen(() => Err('bad'))).resolves.toStrictEqual(Err('sadface'));
        await expect(op2().andThen(() => Promise.resolve(Err('bad')))).resolves.toStrictEqual(Err('sadface'));
        await expect(op2().andThen(() => ErrAsync('bad'))).resolves.toStrictEqual(Err('sadface'));
    });

    it('should call op fn only once if itself is `Ok`', async () => {
        const fn = jest.fn((num: number) => Promise.resolve(Ok(num + 1)));
        expect(fn).toHaveBeenCalledTimes(0);
        await op1().andThen(fn);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not call op fn if itself is `Err`', async () => {
        const fn = jest.fn((num: number) => Promise.resolve(Ok(num + 1)));
        expect(fn).toHaveBeenCalledTimes(0);
        await op2().andThen(fn);
        expect(fn).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', async () => {
        await expect(() => OkAsync(1).andThen(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => OkAsync(1).andThen(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const sq = (num: number): ResultAsync<number, number> => OkAsync(num * num);
            const err = (num: number): ResultAsync<number, number> => ErrAsync(num);

            const x = OkAsync<number, number>(2).andThen(sq).andThen(sq);
            assert(await x.equal(Ok(16)));

            const y = OkAsync<number, number>(2).andThen(sq).andThen(err);
            assert(await y.equal(Err(4)));

            const z = OkAsync<number, number>(2).andThen(err).andThen(err);
            assert(await z.equal(Err(2)));
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.or.name}\``, () => {
    it('should return the `Ok` result', async () => {
        await expect(op1().or(Ok(667))).resolves.toStrictEqual(Ok(666));
        await expect(op1().or(OkAsync(667))).resolves.toStrictEqual(Ok(666));
        await expect(op1().or(Err('bad'))).resolves.toStrictEqual(Ok(666));
        await expect(op1().or(ErrAsync('bad'))).resolves.toStrictEqual(Ok(666));
    });

    it('should return `res`', async () => {
        await expect(op2().or(Ok(667))).resolves.toStrictEqual(Ok(667));
        await expect(op2().or(OkAsync(667))).resolves.toStrictEqual(Ok(667));
        await expect(op2().or(Err('bad'))).resolves.toStrictEqual(Err('bad'));
        await expect(op2().or(ErrAsync('bad'))).resolves.toStrictEqual(Err('bad'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            let x: ResultAsync<number, string>;
            let y: ResultAsync<number, string>;

            x = OkAsync(2);
            y = ErrAsync('late error');
            assert(await x.or(y).equal(Ok(2)));

            x = ErrAsync('early error');
            y = OkAsync(2);
            assert(await x.or(y).equal(Ok(2)));

            x = ErrAsync('not a 2');
            y = ErrAsync('late error');
            assert(await x.or(y).equal(Err('late error')));

            x = OkAsync(2);
            y = OkAsync(100);
            assert(await x.or(y).equal(Ok(2)));
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.orElse.name}\``, () => {
    it('should return the `Ok` result', async () => {
        await expect(op1().orElse(() => Ok(667))).resolves.toStrictEqual(Ok(666));
        await expect(op1().orElse(() => Promise.resolve(Ok(667)))).resolves.toStrictEqual(Ok(666));
        await expect(op1().orElse(() => OkAsync(667))).resolves.toStrictEqual(Ok(666));
        await expect(op1().orElse((err) => Err(err))).resolves.toStrictEqual(Ok(666));
        await expect(op1().orElse((err) => Promise.resolve(Err(err)))).resolves.toStrictEqual(Ok(666));
        await expect(op1().orElse((err) => ErrAsync(err))).resolves.toStrictEqual(Ok(666));
    });

    it('should return `res`', async () => {
        await expect(op2().orElse(() => Ok(667))).resolves.toStrictEqual(Ok(667));
        await expect(op2().orElse(() => Promise.resolve(Ok(667)))).resolves.toStrictEqual(Ok(667));
        await expect(op2().orElse(() => OkAsync(667))).resolves.toStrictEqual(Ok(667));
        await expect(op2().orElse((err) => Err(err))).resolves.toStrictEqual(Err('sadface'));
        await expect(op2().orElse((err) => Promise.resolve(Err(err)))).resolves.toStrictEqual(Err('sadface'));
        await expect(op2().orElse((err) => ErrAsync(err))).resolves.toStrictEqual(Err('sadface'));
    });

    it('should call op fn only once if itself is `Err`', async () => {
        const fn = jest.fn((err: string) => Promise.resolve(Err(err)));
        expect(fn).toHaveBeenCalledTimes(0);
        await op2().orElse(fn);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not call op fn if itself is `Ok`', async () => {
        const fn = jest.fn((err: string) => Promise.resolve(Err(err)));
        expect(fn).toHaveBeenCalledTimes(0);
        await op1().orElse(fn);
        expect(fn).toHaveBeenCalledTimes(0);
    });

    it('should panic if fn panic', async () => {
        await expect(() => ErrAsync('err').orElse(panicFn1)).rejects.toThrow(Error('error'));
        await expect(() => ErrAsync('err').orElse(panicFn2)).rejects.toThrow(Error('error'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            const sq = (num: number): ResultAsync<number, number> => OkAsync(num * num);
            const err = (num: number): ResultAsync<number, number> => ErrAsync(num);

            const x = OkAsync(2).orElse(sq).orElse(sq);
            assert(await x.equal(Ok(2)));

            const y = ErrAsync<number, number>(3).orElse(sq).orElse(err);
            assert(await y.equal(Ok(9)));

            const z = ErrAsync<number, number>(3).orElse(err).orElse(err);
            assert(await z.equal(Err(3)));
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.transpose.name}\``, () => {
    it('should transpose itself to an optional of a `ResultAsync`', async () => {
        await expect(OkAsync(1).transpose()).resolves.toStrictEqual(Ok(1));
        await expect(OkAsync(undefined).transpose()).resolves.toBeUndefined();
        await expect(OkAsync(null).transpose()).resolves.toBeUndefined();
        await expect(ErrAsync('Some error message').transpose()).resolves.toStrictEqual(Err('Some error message'));
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            type SomeErr = unknown;

            let x: ResultAsync<number | undefined | null, SomeErr>;
            let y: Result<number, SomeErr> | undefined;

            x = OkAsync(5);
            y = Ok(5);
            assert((await x.transpose())!.equal(y));

            x = OkAsync(undefined);
            y = undefined;
            assert((await x.transpose()) === y);

            x = OkAsync(null);
            y = undefined;
            assert((await x.transpose()) === y);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});

describe(`Test method \`${RustlikeResultAsync.name}.prototype.${RustlikeResultAsync.prototype.equal.name}\``, () => {
    it('should check if itself equals to another result', async () => {
        // simple true

        await expect(OkAsync(1).equal(Ok(1))).resolves.toBe(true);
        await expect(OkAsync(1).equal(Promise.resolve(Ok(1)))).resolves.toBe(true);
        await expect(OkAsync(1).equal(OkAsync(1))).resolves.toBe(true);

        await expect(OkAsync(NaN).equal(Ok(NaN))).resolves.toBe(true);
        await expect(OkAsync(NaN).equal(Promise.resolve(Ok(NaN)))).resolves.toBe(true);
        await expect(OkAsync(NaN).equal(OkAsync(NaN))).resolves.toBe(true);

        await expect(ErrAsync('err').equal(Err('err'))).resolves.toBe(true);
        await expect(ErrAsync('err').equal(Promise.resolve(Err('err')))).resolves.toBe(true);
        await expect(ErrAsync('err').equal(ErrAsync('err'))).resolves.toBe(true);

        // simple false

        await expect(OkAsync(1).equal(Ok(2))).resolves.toBe(false);
        await expect(OkAsync(1).equal(Promise.resolve(Ok(2)))).resolves.toBe(false);
        await expect(OkAsync(1).equal(OkAsync(2))).resolves.toBe(false);

        await expect(OkAsync(1).equal(Ok('hello world'))).resolves.toBe(false);
        await expect(OkAsync(1).equal(Promise.resolve(Ok('hello world')))).resolves.toBe(false);
        await expect(OkAsync(1).equal(OkAsync('hello world'))).resolves.toBe(false);

        await expect(OkAsync(1).equal(Err('err'))).resolves.toBe(false);
        await expect(OkAsync(1).equal(Promise.resolve(Err('err')))).resolves.toBe(false);
        await expect(OkAsync(1).equal(ErrAsync('err'))).resolves.toBe(false);

        await expect(ErrAsync('err 1').equal(Err('err 2'))).resolves.toBe(false);
        await expect(ErrAsync('err 1').equal(Promise.resolve(Err('err 2')))).resolves.toBe(false);
        await expect(ErrAsync('err 1').equal(ErrAsync('err 2'))).resolves.toBe(false);

        await expect(ErrAsync('err 1').equal(Err(-1))).resolves.toBe(false);
        await expect(ErrAsync('err 1').equal(Err(-1))).resolves.toBe(false);
        await expect(ErrAsync('err 1').equal(ErrAsync(-1))).resolves.toBe(false);

        await expect(ErrAsync('error').equal(Ok(1))).resolves.toBe(false);
        await expect(ErrAsync('error').equal(Promise.resolve(Ok(1)))).resolves.toBe(false);
        await expect(ErrAsync('error').equal(OkAsync(1))).resolves.toBe(false);

        // nested true

        await expect(OkAsync(Ok(1)).equal(Ok(Ok(1)))).resolves.toBe(true);
        await expect(OkAsync(Ok(1)).equal(Ok(OkAsync(1)))).resolves.toBe(true);
        await expect(OkAsync(Ok(1)).equal(Promise.resolve(Ok(Ok(1))))).resolves.toBe(true);
        await expect(OkAsync(Ok(1)).equal(Promise.resolve(Ok(OkAsync(1))))).resolves.toBe(true);
        await expect(OkAsync(Ok(1)).equal(OkAsync(Ok(1)))).resolves.toBe(true);
        await expect(OkAsync(Ok(1)).equal(OkAsync(Promise.resolve(Ok(1))))).resolves.toBe(true);
        await expect(OkAsync(Ok(1)).equal(OkAsync(OkAsync(1)))).resolves.toBe(true);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(Ok(Ok(1)))).resolves.toBe(true);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(Ok(OkAsync(1)))).resolves.toBe(true);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(Promise.resolve(Ok(Ok(1))))).resolves.toBe(true);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(Promise.resolve(Ok(OkAsync(1))))).resolves.toBe(true);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(OkAsync(Ok(1)))).resolves.toBe(true);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(OkAsync(Promise.resolve(Ok(1))))).resolves.toBe(true);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(OkAsync(OkAsync(1)))).resolves.toBe(true);
        await expect(OkAsync(OkAsync(1)).equal(Ok(Ok(1)))).resolves.toBe(true);
        await expect(OkAsync(OkAsync(1)).equal(Ok(OkAsync(1)))).resolves.toBe(true);
        await expect(OkAsync(OkAsync(1)).equal(Promise.resolve(Ok(Ok(1))))).resolves.toBe(true);
        await expect(OkAsync(OkAsync(1)).equal(Promise.resolve(Ok(OkAsync(1))))).resolves.toBe(true);
        await expect(OkAsync(OkAsync(1)).equal(OkAsync(Ok(1)))).resolves.toBe(true);
        await expect(OkAsync(OkAsync(1)).equal(OkAsync(Promise.resolve(Ok(1))))).resolves.toBe(true);
        await expect(OkAsync(OkAsync(1)).equal(OkAsync(OkAsync(1)))).resolves.toBe(true);

        await expect(OkAsync(Err('err')).equal(Ok(Err('err')))).resolves.toBe(true);
        await expect(OkAsync(Err('err')).equal(Ok(ErrAsync('err')))).resolves.toBe(true);
        await expect(OkAsync(Err('err')).equal(Promise.resolve(Ok(Err('err'))))).resolves.toBe(true);
        await expect(OkAsync(Err('err')).equal(Promise.resolve(Ok(ErrAsync('err'))))).resolves.toBe(true);
        await expect(OkAsync(Err('err')).equal(OkAsync(Err('err')))).resolves.toBe(true);
        await expect(OkAsync(Err('err')).equal(OkAsync(Promise.resolve(Err('err'))))).resolves.toBe(true);
        await expect(OkAsync(Err('err')).equal(OkAsync(ErrAsync('err')))).resolves.toBe(true);
        await expect(OkAsync(Promise.resolve(Err('err'))).equal(Ok(Err('err')))).resolves.toBe(true);
        await expect(OkAsync(Promise.resolve(Err('err'))).equal(Ok(ErrAsync('err')))).resolves.toBe(true);
        await expect(OkAsync(Promise.resolve(Err('err'))).equal(Promise.resolve(Ok(Err('err'))))).resolves.toBe(true);
        await expect(OkAsync(Promise.resolve(Err('err'))).equal(Promise.resolve(Ok(ErrAsync('err'))))).resolves.toBe(
            true,
        );
        await expect(OkAsync(Promise.resolve(Err('err'))).equal(OkAsync(Err('err')))).resolves.toBe(true);
        await expect(OkAsync(Promise.resolve(Err('err'))).equal(OkAsync(Promise.resolve(Err('err'))))).resolves.toBe(
            true,
        );
        await expect(OkAsync(Promise.resolve(Err('err'))).equal(OkAsync(ErrAsync('err')))).resolves.toBe(true);
        await expect(OkAsync(ErrAsync('err')).equal(Ok(Err('err')))).resolves.toBe(true);
        await expect(OkAsync(ErrAsync('err')).equal(Ok(ErrAsync('err')))).resolves.toBe(true);
        await expect(OkAsync(ErrAsync('err')).equal(Promise.resolve(Ok(Err('err'))))).resolves.toBe(true);
        await expect(OkAsync(ErrAsync('err')).equal(Promise.resolve(Ok(ErrAsync('err'))))).resolves.toBe(true);
        await expect(OkAsync(ErrAsync('err')).equal(OkAsync(Err('err')))).resolves.toBe(true);
        await expect(OkAsync(ErrAsync('err')).equal(OkAsync(Promise.resolve(Err('err'))))).resolves.toBe(true);
        await expect(OkAsync(ErrAsync('err')).equal(OkAsync(ErrAsync('err')))).resolves.toBe(true);

        await expect(ErrAsync(Err('err')).equal(Err(Err('err')))).resolves.toBe(true);
        await expect(ErrAsync(Err('err')).equal(Err(ErrAsync('err')))).resolves.toBe(true);
        await expect(ErrAsync(Err('err')).equal(Promise.resolve(Err(Err('err'))))).resolves.toBe(true);
        await expect(ErrAsync(Err('err')).equal(Promise.resolve(Err(ErrAsync('err'))))).resolves.toBe(true);
        await expect(ErrAsync(Err('err')).equal(ErrAsync(Err('err')))).resolves.toBe(true);
        await expect(ErrAsync(Err('err')).equal(ErrAsync(Promise.resolve(Err('err'))))).resolves.toBe(true);
        await expect(ErrAsync(Err('err')).equal(ErrAsync(ErrAsync('err')))).resolves.toBe(true);
        await expect(ErrAsync(Promise.resolve(Err('err'))).equal(Err(Err('err')))).resolves.toBe(true);
        await expect(ErrAsync(Promise.resolve(Err('err'))).equal(Err(ErrAsync('err')))).resolves.toBe(true);
        await expect(ErrAsync(Promise.resolve(Err('err'))).equal(Promise.resolve(Err(Err('err'))))).resolves.toBe(true);
        await expect(ErrAsync(Promise.resolve(Err('err'))).equal(Promise.resolve(Err(ErrAsync('err'))))).resolves.toBe(
            true,
        );
        await expect(ErrAsync(Promise.resolve(Err('err'))).equal(ErrAsync(Err('err')))).resolves.toBe(true);
        await expect(ErrAsync(Promise.resolve(Err('err'))).equal(ErrAsync(Promise.resolve(Err('err'))))).resolves.toBe(
            true,
        );
        await expect(ErrAsync(Promise.resolve(Err('err'))).equal(ErrAsync(ErrAsync('err')))).resolves.toBe(true);
        await expect(ErrAsync(ErrAsync('err')).equal(Err(Err('err')))).resolves.toBe(true);
        await expect(ErrAsync(ErrAsync('err')).equal(Err(ErrAsync('err')))).resolves.toBe(true);
        await expect(ErrAsync(ErrAsync('err')).equal(Promise.resolve(Err(Err('err'))))).resolves.toBe(true);
        await expect(ErrAsync(ErrAsync('err')).equal(Promise.resolve(Err(ErrAsync('err'))))).resolves.toBe(true);
        await expect(ErrAsync(ErrAsync('err')).equal(ErrAsync(Err('err')))).resolves.toBe(true);
        await expect(ErrAsync(ErrAsync('err')).equal(ErrAsync(Promise.resolve(Err('err'))))).resolves.toBe(true);
        await expect(ErrAsync(ErrAsync('err')).equal(ErrAsync(ErrAsync('err')))).resolves.toBe(true);

        await expect(ErrAsync(Ok(1)).equal(Err(Ok(1)))).resolves.toBe(true);
        await expect(ErrAsync(Ok(1)).equal(Err(OkAsync(1)))).resolves.toBe(true);
        await expect(ErrAsync(Ok(1)).equal(Promise.resolve(Err(Ok(1))))).resolves.toBe(true);
        await expect(ErrAsync(Ok(1)).equal(Promise.resolve(Err(OkAsync(1))))).resolves.toBe(true);
        await expect(ErrAsync(Ok(1)).equal(ErrAsync(Ok(1)))).resolves.toBe(true);
        await expect(ErrAsync(Ok(1)).equal(ErrAsync(Promise.resolve(Ok(1))))).resolves.toBe(true);
        await expect(ErrAsync(Ok(1)).equal(ErrAsync(OkAsync(1)))).resolves.toBe(true);
        await expect(ErrAsync(Promise.resolve(Ok(1))).equal(Err(Ok(1)))).resolves.toBe(true);
        await expect(ErrAsync(Promise.resolve(Ok(1))).equal(Err(OkAsync(1)))).resolves.toBe(true);
        await expect(ErrAsync(Promise.resolve(Ok(1))).equal(Promise.resolve(Err(Ok(1))))).resolves.toBe(true);
        await expect(ErrAsync(Promise.resolve(Ok(1))).equal(Promise.resolve(Err(OkAsync(1))))).resolves.toBe(true);
        await expect(ErrAsync(Promise.resolve(Ok(1))).equal(ErrAsync(Ok(1)))).resolves.toBe(true);
        await expect(ErrAsync(Promise.resolve(Ok(1))).equal(ErrAsync(Promise.resolve(Ok(1))))).resolves.toBe(true);
        await expect(ErrAsync(Promise.resolve(Ok(1))).equal(ErrAsync(OkAsync(1)))).resolves.toBe(true);
        await expect(ErrAsync(OkAsync(1)).equal(Err(Ok(1)))).resolves.toBe(true);
        await expect(ErrAsync(OkAsync(1)).equal(Err(OkAsync(1)))).resolves.toBe(true);
        await expect(ErrAsync(OkAsync(1)).equal(Promise.resolve(Err(Ok(1))))).resolves.toBe(true);
        await expect(ErrAsync(OkAsync(1)).equal(Promise.resolve(Err(OkAsync(1))))).resolves.toBe(true);
        await expect(ErrAsync(OkAsync(1)).equal(ErrAsync(Ok(1)))).resolves.toBe(true);
        await expect(ErrAsync(OkAsync(1)).equal(ErrAsync(Promise.resolve(Ok(1))))).resolves.toBe(true);
        await expect(ErrAsync(OkAsync(1)).equal(ErrAsync(OkAsync(1)))).resolves.toBe(true);

        // nested false

        await expect(OkAsync(Ok(1)).equal(Ok(Ok(2)))).resolves.toBe(false);
        await expect(OkAsync(Ok(1)).equal(Ok(OkAsync(2)))).resolves.toBe(false);
        await expect(OkAsync(Ok(1)).equal(Promise.resolve(Ok(Ok(2))))).resolves.toBe(false);
        await expect(OkAsync(Ok(1)).equal(Promise.resolve(Ok(OkAsync(2))))).resolves.toBe(false);
        await expect(OkAsync(Ok(1)).equal(OkAsync(Ok(2)))).resolves.toBe(false);
        await expect(OkAsync(Ok(1)).equal(OkAsync(Promise.resolve(Ok(2))))).resolves.toBe(false);
        await expect(OkAsync(Ok(1)).equal(OkAsync(OkAsync(2)))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(Ok(Ok(2)))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(Ok(OkAsync(2)))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(Promise.resolve(Ok(Ok(2))))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(Promise.resolve(Ok(OkAsync(2))))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(OkAsync(Ok(2)))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(OkAsync(Promise.resolve(Ok(2))))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(OkAsync(OkAsync(2)))).resolves.toBe(false);
        await expect(OkAsync(OkAsync(1)).equal(Ok(Ok(2)))).resolves.toBe(false);
        await expect(OkAsync(OkAsync(1)).equal(Ok(OkAsync(2)))).resolves.toBe(false);
        await expect(OkAsync(OkAsync(1)).equal(Promise.resolve(Ok(Ok(2))))).resolves.toBe(false);
        await expect(OkAsync(OkAsync(1)).equal(Promise.resolve(Ok(OkAsync(2))))).resolves.toBe(false);
        await expect(OkAsync(OkAsync(1)).equal(OkAsync(Ok(2)))).resolves.toBe(false);
        await expect(OkAsync(OkAsync(1)).equal(OkAsync(Promise.resolve(Ok(2))))).resolves.toBe(false);
        await expect(OkAsync(OkAsync(1)).equal(OkAsync(OkAsync(2)))).resolves.toBe(false);

        await expect(OkAsync(Ok(1)).equal(Ok(Err('err')))).resolves.toBe(false);
        await expect(OkAsync(Ok(1)).equal(Ok(ErrAsync('err')))).resolves.toBe(false);
        await expect(OkAsync(Ok(1)).equal(Promise.resolve(Ok(Err('err'))))).resolves.toBe(false);
        await expect(OkAsync(Ok(1)).equal(Promise.resolve(Ok(ErrAsync('err'))))).resolves.toBe(false);
        await expect(OkAsync(Ok(1)).equal(OkAsync(Err('err')))).resolves.toBe(false);
        await expect(OkAsync(Ok(1)).equal(OkAsync(Promise.resolve(Err('err'))))).resolves.toBe(false);
        await expect(OkAsync(Ok(1)).equal(OkAsync(ErrAsync('err')))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(Ok(Err('err')))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(Ok(ErrAsync('err')))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(Promise.resolve(Ok(Err('err'))))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(Promise.resolve(Ok(ErrAsync('err'))))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(OkAsync(Err('err')))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(OkAsync(Promise.resolve(Err('err'))))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok(1))).equal(OkAsync(ErrAsync('err')))).resolves.toBe(false);
        await expect(OkAsync(OkAsync(1)).equal(Ok(Err('err')))).resolves.toBe(false);
        await expect(OkAsync(OkAsync(1)).equal(Ok(ErrAsync('err')))).resolves.toBe(false);
        await expect(OkAsync(OkAsync(1)).equal(Promise.resolve(Ok(Err('err'))))).resolves.toBe(false);
        await expect(OkAsync(OkAsync(1)).equal(Promise.resolve(Ok(ErrAsync('err'))))).resolves.toBe(false);
        await expect(OkAsync(OkAsync(1)).equal(OkAsync(Err('err')))).resolves.toBe(false);
        await expect(OkAsync(OkAsync(1)).equal(OkAsync(Promise.resolve(Err('err'))))).resolves.toBe(false);
        await expect(OkAsync(OkAsync(1)).equal(OkAsync(ErrAsync('err')))).resolves.toBe(false);

        await expect(OkAsync(Err('err')).equal(Ok(Ok(1)))).resolves.toBe(false);
        await expect(OkAsync(Err('err')).equal(Ok(OkAsync(1)))).resolves.toBe(false);
        await expect(OkAsync(Err('err')).equal(Promise.resolve(Ok(Ok(1))))).resolves.toBe(false);
        await expect(OkAsync(Err('err')).equal(Promise.resolve(Ok(OkAsync(1))))).resolves.toBe(false);
        await expect(OkAsync(Err('err')).equal(OkAsync(Ok(1)))).resolves.toBe(false);
        await expect(OkAsync(Err('err')).equal(OkAsync(Promise.resolve(Ok(1))))).resolves.toBe(false);
        await expect(OkAsync(Err('err')).equal(OkAsync(OkAsync(1)))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Err('err'))).equal(Ok(Ok(1)))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Err('err'))).equal(Ok(OkAsync(1)))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Err('err'))).equal(Promise.resolve(Ok(Ok(1))))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Err('err'))).equal(Promise.resolve(Ok(OkAsync(1))))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Err('err'))).equal(OkAsync(Ok(1)))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Err('err'))).equal(OkAsync(Promise.resolve(Ok(1))))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Err('err'))).equal(OkAsync(OkAsync(1)))).resolves.toBe(false);
        await expect(OkAsync(ErrAsync('err')).equal(Ok(Ok(1)))).resolves.toBe(false);
        await expect(OkAsync(ErrAsync('err')).equal(Ok(OkAsync(1)))).resolves.toBe(false);
        await expect(OkAsync(ErrAsync('err')).equal(Promise.resolve(Ok(Ok(1))))).resolves.toBe(false);
        await expect(OkAsync(ErrAsync('err')).equal(Promise.resolve(Ok(OkAsync(1))))).resolves.toBe(false);
        await expect(OkAsync(ErrAsync('err')).equal(OkAsync(Ok(1)))).resolves.toBe(false);
        await expect(OkAsync(ErrAsync('err')).equal(OkAsync(Promise.resolve(Ok(1))))).resolves.toBe(false);
        await expect(OkAsync(ErrAsync('err')).equal(OkAsync(OkAsync(1)))).resolves.toBe(false);

        await expect(ErrAsync(Err('err')).equal(Err(Ok(1)))).resolves.toBe(false);
        await expect(ErrAsync(Err('err')).equal(Err(OkAsync(1)))).resolves.toBe(false);
        await expect(ErrAsync(Err('err')).equal(Promise.resolve(Err(Ok(1))))).resolves.toBe(false);
        await expect(ErrAsync(Err('err')).equal(Promise.resolve(Err(OkAsync(1))))).resolves.toBe(false);
        await expect(ErrAsync(Err('err')).equal(ErrAsync(Ok(1)))).resolves.toBe(false);
        await expect(ErrAsync(Err('err')).equal(ErrAsync(Promise.resolve(Ok(1))))).resolves.toBe(false);
        await expect(ErrAsync(Err('err')).equal(ErrAsync(OkAsync(1)))).resolves.toBe(false);
        await expect(ErrAsync(Promise.resolve(Err('err'))).equal(Err(Ok(1)))).resolves.toBe(false);
        await expect(ErrAsync(Promise.resolve(Err('err'))).equal(Err(OkAsync(1)))).resolves.toBe(false);
        await expect(ErrAsync(Promise.resolve(Err('err'))).equal(Promise.resolve(Err(Ok(1))))).resolves.toBe(false);
        await expect(ErrAsync(Promise.resolve(Err('err'))).equal(Promise.resolve(Err(OkAsync(1))))).resolves.toBe(
            false,
        );
        await expect(ErrAsync(Promise.resolve(Err('err'))).equal(ErrAsync(Ok(1)))).resolves.toBe(false);
        await expect(ErrAsync(Promise.resolve(Err('err'))).equal(ErrAsync(Promise.resolve(Ok(1))))).resolves.toBe(
            false,
        );
        await expect(ErrAsync(Promise.resolve(Err('err'))).equal(ErrAsync(OkAsync(1)))).resolves.toBe(false);
        await expect(ErrAsync(ErrAsync('err')).equal(Err(Ok(1)))).resolves.toBe(false);
        await expect(ErrAsync(ErrAsync('err')).equal(Err(OkAsync(1)))).resolves.toBe(false);
        await expect(ErrAsync(ErrAsync('err')).equal(Promise.resolve(Err(Ok(1))))).resolves.toBe(false);
        await expect(ErrAsync(ErrAsync('err')).equal(Promise.resolve(Err(OkAsync(1))))).resolves.toBe(false);
        await expect(ErrAsync(ErrAsync('err')).equal(ErrAsync(Ok(1)))).resolves.toBe(false);
        await expect(ErrAsync(ErrAsync('err')).equal(ErrAsync(Promise.resolve(Ok(1))))).resolves.toBe(false);
        await expect(ErrAsync(ErrAsync('err')).equal(ErrAsync(OkAsync(1)))).resolves.toBe(false);

        await expect(ErrAsync(Ok(1)).equal(Err(Err('err')))).resolves.toBe(false);
        await expect(ErrAsync(Ok(1)).equal(Err(ErrAsync('err')))).resolves.toBe(false);
        await expect(ErrAsync(Ok(1)).equal(Promise.resolve(Err(Err('err'))))).resolves.toBe(false);
        await expect(ErrAsync(Ok(1)).equal(Promise.resolve(Err(ErrAsync('err'))))).resolves.toBe(false);
        await expect(ErrAsync(Ok(1)).equal(ErrAsync(Err('err')))).resolves.toBe(false);
        await expect(ErrAsync(Ok(1)).equal(ErrAsync(Promise.resolve(Err('err'))))).resolves.toBe(false);
        await expect(ErrAsync(Ok(1)).equal(ErrAsync(ErrAsync('err')))).resolves.toBe(false);
        await expect(ErrAsync(Promise.resolve(Ok(1))).equal(Err(Err('err')))).resolves.toBe(false);
        await expect(ErrAsync(Promise.resolve(Ok(1))).equal(Err(ErrAsync('err')))).resolves.toBe(false);
        await expect(ErrAsync(Promise.resolve(Ok(1))).equal(Promise.resolve(Err(Err('err'))))).resolves.toBe(false);
        await expect(ErrAsync(Promise.resolve(Ok(1))).equal(Promise.resolve(Err(ErrAsync('err'))))).resolves.toBe(
            false,
        );
        await expect(ErrAsync(Promise.resolve(Ok(1))).equal(ErrAsync(Err('err')))).resolves.toBe(false);
        await expect(ErrAsync(Promise.resolve(Ok(1))).equal(ErrAsync(Promise.resolve(Err('err'))))).resolves.toBe(
            false,
        );
        await expect(ErrAsync(Promise.resolve(Ok(1))).equal(ErrAsync(ErrAsync('err')))).resolves.toBe(false);
        await expect(ErrAsync(OkAsync(1)).equal(Err(Err('err')))).resolves.toBe(false);
        await expect(ErrAsync(OkAsync(1)).equal(Err(ErrAsync('err')))).resolves.toBe(false);
        await expect(ErrAsync(OkAsync(1)).equal(Promise.resolve(Err(Err('err'))))).resolves.toBe(false);
        await expect(ErrAsync(OkAsync(1)).equal(Promise.resolve(Err(ErrAsync('err'))))).resolves.toBe(false);
        await expect(ErrAsync(OkAsync(1)).equal(ErrAsync(Err('err')))).resolves.toBe(false);
        await expect(ErrAsync(OkAsync(1)).equal(ErrAsync(Promise.resolve(Err('err'))))).resolves.toBe(false);
        await expect(ErrAsync(OkAsync(1)).equal(ErrAsync(ErrAsync('err')))).resolves.toBe(false);

        // object equality

        await expect(OkAsync([1]).equal(Ok([1]))).resolves.toBe(false);
        await expect(OkAsync([1]).equal(Promise.resolve(Ok([1])))).resolves.toBe(false);
        await expect(OkAsync([1]).equal(OkAsync([1]))).resolves.toBe(false);

        await expect(OkAsync({ foo: 1 }).equal(Ok({ foo: 1 }))).resolves.toBe(false);
        await expect(OkAsync({ foo: 1 }).equal(Promise.resolve(Ok({ foo: 1 })))).resolves.toBe(false);
        await expect(OkAsync({ foo: 1 }).equal(OkAsync({ foo: 1 }))).resolves.toBe(false);

        await expect(ErrAsync({ message: 'err' }).equal(Err({ message: 'err' }))).resolves.toBe(false);
        await expect(ErrAsync({ message: 'err' }).equal(Promise.resolve(Err({ message: 'err' })))).resolves.toBe(false);
        await expect(ErrAsync({ message: 'err' }).equal(ErrAsync({ message: 'err' }))).resolves.toBe(false);

        await expect(OkAsync(Ok([1])).equal(Ok(Ok([1])))).resolves.toBe(false);
        await expect(OkAsync(Ok([1])).equal(Ok(OkAsync([1])))).resolves.toBe(false);
        await expect(OkAsync(Ok([1])).equal(Promise.resolve(Ok(Ok([1]))))).resolves.toBe(false);
        await expect(OkAsync(Ok([1])).equal(Promise.resolve(Ok(OkAsync([1]))))).resolves.toBe(false);
        await expect(OkAsync(Ok([1])).equal(OkAsync(Ok([1])))).resolves.toBe(false);
        await expect(OkAsync(Ok([1])).equal(OkAsync(Promise.resolve(Ok([1]))))).resolves.toBe(false);
        await expect(OkAsync(Ok([1])).equal(OkAsync(OkAsync([1])))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok([1]))).equal(Ok(Ok([1])))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok([1]))).equal(Ok(OkAsync([1])))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok([1]))).equal(Promise.resolve(Ok(Ok([1]))))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok([1]))).equal(Promise.resolve(Ok(OkAsync([1]))))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok([1]))).equal(OkAsync(Ok([1])))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok([1]))).equal(OkAsync(Promise.resolve(Ok([1]))))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok([1]))).equal(OkAsync(OkAsync([1])))).resolves.toBe(false);
        await expect(OkAsync(OkAsync([1])).equal(Ok(Ok([1])))).resolves.toBe(false);
        await expect(OkAsync(OkAsync([1])).equal(Ok(OkAsync([1])))).resolves.toBe(false);
        await expect(OkAsync(OkAsync([1])).equal(Promise.resolve(Ok(Ok([1]))))).resolves.toBe(false);
        await expect(OkAsync(OkAsync([1])).equal(Promise.resolve(Ok(OkAsync([1]))))).resolves.toBe(false);
        await expect(OkAsync(OkAsync([1])).equal(OkAsync(Ok([1])))).resolves.toBe(false);
        await expect(OkAsync(OkAsync([1])).equal(OkAsync(Promise.resolve(Ok([1]))))).resolves.toBe(false);
        await expect(OkAsync(OkAsync([1])).equal(OkAsync(OkAsync([1])))).resolves.toBe(false);

        await expect(OkAsync(Ok({ foo: 1 })).equal(Ok(Ok({ foo: 1 })))).resolves.toBe(false);
        await expect(OkAsync(Ok({ foo: 1 })).equal(Ok(OkAsync({ foo: 1 })))).resolves.toBe(false);
        await expect(OkAsync(Ok({ foo: 1 })).equal(Promise.resolve(Ok(Ok({ foo: 1 }))))).resolves.toBe(false);
        await expect(OkAsync(Ok({ foo: 1 })).equal(Promise.resolve(Ok(OkAsync({ foo: 1 }))))).resolves.toBe(false);
        await expect(OkAsync(Ok({ foo: 1 })).equal(OkAsync(Ok({ foo: 1 })))).resolves.toBe(false);
        await expect(OkAsync(Ok({ foo: 1 })).equal(OkAsync(Promise.resolve(Ok({ foo: 1 }))))).resolves.toBe(false);
        await expect(OkAsync(Ok({ foo: 1 })).equal(OkAsync(OkAsync({ foo: 1 })))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok({ foo: 1 }))).equal(Ok(Ok({ foo: 1 })))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok({ foo: 1 }))).equal(Ok(OkAsync({ foo: 1 })))).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok({ foo: 1 }))).equal(Promise.resolve(Ok(Ok({ foo: 1 }))))).resolves.toBe(
            false,
        );
        await expect(
            OkAsync(Promise.resolve(Ok({ foo: 1 }))).equal(Promise.resolve(Ok(OkAsync({ foo: 1 })))),
        ).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok({ foo: 1 }))).equal(OkAsync(Ok({ foo: 1 })))).resolves.toBe(false);
        await expect(
            OkAsync(Promise.resolve(Ok({ foo: 1 }))).equal(OkAsync(Promise.resolve(Ok({ foo: 1 })))),
        ).resolves.toBe(false);
        await expect(OkAsync(Promise.resolve(Ok({ foo: 1 }))).equal(OkAsync(OkAsync({ foo: 1 })))).resolves.toBe(false);
        await expect(OkAsync(OkAsync({ foo: 1 })).equal(Ok(Ok({ foo: 1 })))).resolves.toBe(false);
        await expect(OkAsync(OkAsync({ foo: 1 })).equal(Ok(OkAsync({ foo: 1 })))).resolves.toBe(false);
        await expect(OkAsync(OkAsync({ foo: 1 })).equal(Promise.resolve(Ok(Ok({ foo: 1 }))))).resolves.toBe(false);
        await expect(OkAsync(OkAsync({ foo: 1 })).equal(Promise.resolve(Ok(OkAsync({ foo: 1 }))))).resolves.toBe(false);
        await expect(OkAsync(OkAsync({ foo: 1 })).equal(OkAsync(Ok({ foo: 1 })))).resolves.toBe(false);
        await expect(OkAsync(OkAsync({ foo: 1 })).equal(OkAsync(Promise.resolve(Ok({ foo: 1 }))))).resolves.toBe(false);
        await expect(OkAsync(OkAsync({ foo: 1 })).equal(OkAsync(OkAsync({ foo: 1 })))).resolves.toBe(false);

        await expect(ErrAsync(Err({ message: 'err' })).equal(Err(Err({ message: 'err' })))).resolves.toBe(false);
        await expect(ErrAsync(Err({ message: 'err' })).equal(Err(ErrAsync({ message: 'err' })))).resolves.toBe(false);
        await expect(
            ErrAsync(Err({ message: 'err' })).equal(Promise.resolve(Err(Err({ message: 'err' })))),
        ).resolves.toBe(false);
        await expect(
            ErrAsync(Err({ message: 'err' })).equal(Promise.resolve(Err(ErrAsync({ message: 'err' })))),
        ).resolves.toBe(false);
        await expect(ErrAsync(Err({ message: 'err' })).equal(ErrAsync(Err({ message: 'err' })))).resolves.toBe(false);
        await expect(
            ErrAsync(Err({ message: 'err' })).equal(ErrAsync(Promise.resolve(Err({ message: 'err' })))),
        ).resolves.toBe(false);
        await expect(ErrAsync(Err({ message: 'err' })).equal(ErrAsync(ErrAsync({ message: 'err' })))).resolves.toBe(
            false,
        );
        await expect(
            ErrAsync(Promise.resolve(Err({ message: 'err' }))).equal(Err(Err({ message: 'err' }))),
        ).resolves.toBe(false);
        await expect(
            ErrAsync(Promise.resolve(Err({ message: 'err' }))).equal(Err(ErrAsync({ message: 'err' }))),
        ).resolves.toBe(false);
        await expect(
            ErrAsync(Promise.resolve(Err({ message: 'err' }))).equal(Promise.resolve(Err(Err({ message: 'err' })))),
        ).resolves.toBe(false);
        await expect(
            ErrAsync(Promise.resolve(Err({ message: 'err' }))).equal(
                Promise.resolve(Err(ErrAsync({ message: 'err' }))),
            ),
        ).resolves.toBe(false);
        await expect(
            ErrAsync(Promise.resolve(Err({ message: 'err' }))).equal(ErrAsync(Err({ message: 'err' }))),
        ).resolves.toBe(false);
        await expect(
            ErrAsync(Promise.resolve(Err({ message: 'err' }))).equal(
                ErrAsync(Promise.resolve(Err({ message: 'err' }))),
            ),
        ).resolves.toBe(false);
        await expect(
            ErrAsync(Promise.resolve(Err({ message: 'err' }))).equal(ErrAsync(ErrAsync({ message: 'err' }))),
        ).resolves.toBe(false);
        await expect(ErrAsync(ErrAsync({ message: 'err' })).equal(Err(Err({ message: 'err' })))).resolves.toBe(false);
        await expect(ErrAsync(ErrAsync({ message: 'err' })).equal(Err(ErrAsync({ message: 'err' })))).resolves.toBe(
            false,
        );
        await expect(
            ErrAsync(ErrAsync({ message: 'err' })).equal(Promise.resolve(Err(Err({ message: 'err' })))),
        ).resolves.toBe(false);
        await expect(
            ErrAsync(ErrAsync({ message: 'err' })).equal(Promise.resolve(Err(ErrAsync({ message: 'err' })))),
        ).resolves.toBe(false);
        await expect(ErrAsync(ErrAsync({ message: 'err' })).equal(ErrAsync(Err({ message: 'err' })))).resolves.toBe(
            false,
        );
        await expect(
            ErrAsync(ErrAsync({ message: 'err' })).equal(ErrAsync(Promise.resolve(Err({ message: 'err' })))),
        ).resolves.toBe(false);
        await expect(
            ErrAsync(ErrAsync({ message: 'err' })).equal(ErrAsync(ErrAsync({ message: 'err' }))),
        ).resolves.toBe(false);
    });

    it('should have correct examples doc', async () => {
        async function examples() {
            assert(await OkAsync(1).equal(Ok(1)));
            assert(await OkAsync(1).equal(Promise.resolve(Ok(1))));
            assert(await OkAsync(1).equal(OkAsync(1)));

            assert((await OkAsync(1).equal(Ok(2))) === false);
            assert((await OkAsync(1).equal(Promise.resolve(Ok(2)))) === false);
            assert((await OkAsync(1).equal(OkAsync(2))) === false);

            assert(await OkAsync(Ok(1)).equal(Ok(Ok(1))));
            assert(await OkAsync(Ok(1)).equal(Ok(OkAsync(1))));
            assert(await OkAsync(Ok(1)).equal(Promise.resolve(Ok(Ok(1)))));
            assert(await OkAsync(Ok(1)).equal(OkAsync(Promise.resolve(Ok(1)))));
            assert(await OkAsync(Ok(1)).equal(OkAsync(OkAsync(1))));
            assert(await OkAsync(Promise.resolve(Ok(1))).equal(Promise.resolve(Ok(OkAsync(1)))));
            assert(await OkAsync(OkAsync(1)).equal(OkAsync(Ok(1))));

            assert((await OkAsync([1]).equal(Ok([1]))) === false);
            assert((await OkAsync({ foo: 1 }).equal(Promise.resolve(Ok({ foo: 1 })))) === false);
            assert((await ErrAsync({ message: 'err' }).equal(ErrAsync({ message: 'err' }))) === false);

            assert((await OkAsync(Ok([1])).equal(Ok(Ok([1])))) === false);
            assert((await OkAsync(Ok([1])).equal(OkAsync(OkAsync([1])))) === false);
            assert((await OkAsync(Promise.resolve(Ok([1]))).equal(OkAsync(Ok([1])))) === false);
            assert((await OkAsync(Promise.resolve(Ok({ foo: 1 }))).equal(Ok(OkAsync({ foo: 1 })))) === false);
            assert((await OkAsync(OkAsync({ foo: 1 })).equal(OkAsync(OkAsync({ foo: 1 })))) === false);
        }

        await expect(examples()).resolves.not.toThrow();
    });
});
