import { Err, Ok } from '../factory';
import { RustlikeResult } from '../result';
import type { Result } from '../types';

function op1(): Result<number, string> {
    return Ok(666);
}

function op2(): Result<number, string> {
    return Err('sadface');
}

describe(`Test static method \`${RustlikeResult.name}.${RustlikeResult.Ok.name}\``, () => {
    it('should create `Ok` result', () => {
        expect(RustlikeResult.Ok(1)).toMatchSnapshot();
    });
});

describe(`Test static method \`${RustlikeResult.name}.${RustlikeResult.Err.name}\``, () => {
    it('should create `Err` result', () => {
        expect(RustlikeResult.Err('Some error message')).toMatchSnapshot();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.isOk.name}\``, () => {
    it('should return if itself is `Ok`', () => {
        expect(Ok(1).isOk()).toBe(true);
        expect(Err('Some error message').isOk()).toBe(false);
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
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.isErr.name}\``, () => {
    it('should return if itself is `Err`', () => {
        expect(Ok(1).isErr()).toBe(false);
        expect(Err('Some error message').isErr()).toBe(true);
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
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.ok.name}\``, () => {
    it('should convert itself to an optional value', () => {
        expect(Ok(1).ok()).toBe(1);
        expect(Err('Some error message').ok()).toBeUndefined();
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.err.name}\``, () => {
    it('should convert itself to an optional error', () => {
        expect(Ok(1).err()).toBeUndefined();
        expect(Err('Some error message').err()).toBe('Some error message');
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
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.expect.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value', () => {
        expect(Ok(1).expect('Operation type should be correct')).toBe(1);
        expect(() => Err(2).expect('Operation type should be correct')).toThrow('Operation type should be correct: 2');
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.unwrap.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value', () => {
        expect(Ok(1).unwrap()).toBe(1);
        expect(() => Err('Some error message').unwrap()).toThrow('Some error message');
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.expectErr.name}\``, () => {
    it('should unwrap itself to get the contained `Err` value', () => {
        expect(Err('Some error message').expectErr('Testing expectErr')).toBe('Some error message');
        expect(() => Ok(1).expectErr('Testing expectErr')).toThrow('Testing expectErr: 1');
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.unwrapErr.name}\``, () => {
    it('should unwrap itself to get the contained `Err` value', () => {
        expect(Err('Some error message').unwrapErr()).toBe('Some error message');
        expect(() => Ok(1).unwrapErr()).toThrow('1');
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.unwrapOr.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value or the provided value', () => {
        const ok = Ok<number, string>(100);
        const okErr = Err<number, string>('Err');

        expect(ok.unwrapOr(50)).toBe(100);
        expect(okErr.unwrapOr(50)).toBe(50);
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
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.unwrapUnchecked.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value', () => {
        expect(Ok(100).unwrapUnchecked()).toBe(100);
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.unwrapErrUnchecked.name}\``, () => {
    it('should unwrap itself to get the contained `Err` value', () => {
        expect(Err('Err').unwrapErrUnchecked()).toBe('Err');
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.and.name}\``, () => {
    it('should return `res`', () => {
        expect(op1().and(Ok(667))).toStrictEqual(Ok(667));
        expect(op1().and(Err('bad'))).toStrictEqual(Err('bad'));
    });

    it('should return the `Err` result', () => {
        expect(op2().and(Ok(667))).toStrictEqual(Err('sadface'));
        expect(op2().and(Err('bad'))).toStrictEqual(Err('sadface'));
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
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.transpose.name}\``, () => {
    it('should transpose itself to an optional of a `Result`', () => {
        expect(Ok<number | undefined | null, string>(1).transpose()).toStrictEqual(Ok(1));
        expect(Ok<number | undefined | null, string>(undefined).transpose()).toBeUndefined();
        expect(Ok<number | undefined | null, string>(null).transpose()).toBeUndefined();
        expect(Err<number | undefined | null, string>('Some error message').transpose()).toStrictEqual(
            Err('Some error message'),
        );
    });
});

describe(`Test method \`${RustlikeResult.name}.prototype.${RustlikeResult.prototype.equal.name}\``, () => {
    it('should check if itself equals to another result', () => {
        expect(Ok(1).equal(Ok(1))).toBe(true);
        expect(Ok(NaN).equal(Ok(NaN))).toBe(true);
        expect(Ok(Ok(1)).equal(Ok(Ok(1)))).toBe(true);
        expect(Ok(Err('Some error message')).equal(Ok(Err('Some error message')))).toBe(true);
        expect(Err('Some error message').equal(Err('Some error message'))).toBe(true);
        expect(Err(Err('Some error message')).equal(Err(Err('Some error message')))).toBe(true);
        expect(Err(Ok(1)).equal(Err(Ok(1)))).toBe(true);

        expect(Ok(1).equal(Ok(2))).toBe(false);
        expect(Ok(Ok(1)).equal(Ok(Ok(2)))).toBe(false);
        expect(Ok(Err<number, string>('Some error message')).equal(Ok(Ok(1)))).toBe(false);
        expect(Ok(Ok<number, string>(1)).equal(Ok(Err('Some error message')))).toBe(false);
        expect(Err('Some error message 1').equal(Err('Some error message 2'))).toBe(false);
        expect(Err(Err('Some error message 1')).equal(Err(Err('Some error message 2')))).toBe(false);
        expect(Err(Ok<number, string>(1)).equal(Err(Err('Some error message')))).toBe(false);
        expect(Err(Err<number, string>('Some error message')).equal(Err(Ok(1)))).toBe(false);
        expect(Ok<number, string>(1).equal(Err('Some error message'))).toBe(false);

        expect(Ok([1]).equal(Ok([1]))).toBe(false);
        expect(Ok({ foo: 1 }).equal(Ok({ foo: 1 }))).toBe(false);
        expect(Ok(Ok([1])).equal(Ok(Ok([1])))).toBe(false);
        expect(Ok(Ok({ foo: 1 })).equal(Ok(Ok({ foo: 1 })))).toBe(false);
        expect(Err({ message: 'Some error message' }).equal(Err({ message: 'Some error message' }))).toBe(false);
        expect(Err(Err({ message: 'Some error message' })).equal(Err(Err({ message: 'Some error message' })))).toBe(
            false,
        );
    });
});
