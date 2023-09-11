import { Err, Ok, Result } from '../result';
import type { IResult } from '../types';

function op1(): IResult<number, string> {
    return Ok(666);
}

function op2(): IResult<number, string> {
    return Err('sadface');
}

describe(`Test static method \`${Result.name}.${Result.Ok.name}\``, () => {
    it('should create Ok result', () => {
        expect(Result.Ok(1)).toMatchSnapshot();
    });
});

describe(`Test static method \`${Result.name}.${Result.Err.name}\``, () => {
    it('should create Err result', () => {
        expect(Result.Err('Some error message')).toMatchSnapshot();
    });
});

describe(`Test fn \`${Ok.name}\``, () => {
    it('should create Ok result', () => {
        expect(Ok(1)).toMatchSnapshot();
    });
});

describe(`Test fn \`${Err.name}\``, () => {
    it('should create Err result', () => {
        expect(Err('Some error message')).toMatchSnapshot();
    });
});

describe(`Test method \`${Result.name}.prototype.${Result.prototype.isOk.name}\``, () => {
    it('should return if itself is `Ok`', () => {
        expect(Ok(1).isOk()).toBe(true);
        expect(Err('Some error message').isOk()).toBe(false);
    });
});

describe(`Test method \`${Result.name}.prototype.${Result.prototype.isOkAnd.name}\``, () => {
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

describe(`Test method \`${Result.name}.prototype.${Result.prototype.isErr.name}\``, () => {
    it('should return if itself is `Err`', () => {
        expect(Ok(1).isErr()).toBe(false);
        expect(Err('Some error message').isErr()).toBe(true);
    });
});

describe(`Test method \`${Result.name}.prototype.${Result.prototype.isErrAnd.name}\``, () => {
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

describe(`Test method \`${Result.name}.prototype.${Result.prototype.ok.name}\``, () => {
    it('should convert itself to an optional value', () => {
        expect(Ok(1).ok()).toBe(1);
        expect(Err('Some error message').ok()).toBeUndefined();
    });
});

describe(`Test method \`${Result.name}.prototype.${Result.prototype.err.name}\``, () => {
    it('should convert itself to an optional error', () => {
        expect(Ok(1).err()).toBeUndefined();
        expect(Err('Some error message').err()).toBe('Some error message');
    });
});

describe(`Test method \`${Result.name}.prototype.${Result.prototype.map.name}\``, () => {
    const mapFactory = () => jest.fn((num: number) => String(num));

    it('should map itself to another result', () => {
        const map = mapFactory();
        expect(Ok(1).map(map).ok()).toBe('1');
        expect(Err('Some error message').map(map).ok()).toBeUndefined();
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

describe(`Test method \`${Result.name}.prototype.${Result.prototype.mapOr.name}\``, () => {
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

describe(`Test method \`${Result.name}.prototype.${Result.prototype.mapOrElse.name}\``, () => {
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

describe(`Test method \`${Result.name}.prototype.${Result.prototype.mapErr.name}\``, () => {
    const mapFactory = () => jest.fn((num: number) => `error code: ${num}`);

    it('should map itself to another result', () => {
        const map = mapFactory();
        expect(Ok(1).mapErr(map).ok()).toBe(1);
        expect(Err(2).mapErr(map).err()).toBe('error code: 2');
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

describe(`Test method \`${Result.name}.prototype.${Result.prototype.expect.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value', () => {
        expect(Ok(1).expect('Operation type should be correct')).toBe(1);
        expect(() => Err(2).expect('Operation type should be correct')).toThrow('Operation type should be correct: 2');
    });
});

describe(`Test method \`${Result.name}.prototype.${Result.prototype.unwrap.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value', () => {
        expect(Ok(1).unwrap()).toBe(1);
        expect(() => Err('Some error message').unwrap()).toThrow('Some error message');
    });
});

describe(`Test method \`${Result.name}.prototype.${Result.prototype.expectErr.name}\``, () => {
    it('should unwrap itself to get the contained `Err` value', () => {
        expect(Err('Some error message').expectErr('Testing expectErr')).toBe('Some error message');
        expect(() => Ok(1).expectErr('Testing expectErr')).toThrow('Testing expectErr: 1');
    });
});

describe(`Test method \`${Result.name}.prototype.${Result.prototype.unwrapErr.name}\``, () => {
    it('should unwrap itself to get the contained `Err` value', () => {
        expect(Err('Some error message').unwrapErr()).toBe('Some error message');
        expect(() => Ok(1).unwrapErr()).toThrow('1');
    });
});

describe(`Test method \`${Result.name}.prototype.${Result.prototype.unwrapOr.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value or the provided value', () => {
        const ok = Ok<number, string>(100);
        const okErr = Err<number, string>('Err');

        expect(ok.unwrapOr(50)).toBe(100);
        expect(okErr.unwrapOr(50)).toBe(50);
    });
});

describe(`Test method \`${Result.name}.prototype.${Result.prototype.unwrapOrElse.name}\``, () => {
    it('should unwrap itself to get the contained `Ok` value or computes it from a closure', () => {
        const handler = (msg: string) => {
            if (msg === 'I got this.') return 50;
            throw new Error('BadBad');
        };

        const ok = Ok<number, string>(100);
        const okErr = Err<number, string>('I got this.');

        expect(ok.unwrapOrElse(handler)).toBe(100);
        expect(okErr.unwrapOrElse(handler)).toBe(50);
    });
});

describe(`Test method \`${Result.name}.prototype.${Result.prototype.and.name}\``, () => {
    it('should return `res`', () => {
        expect(op1().and(Ok(667)).ok()).toBe(667);
        expect(op1().and(Err('bad')).err()).toBe('bad');
    });

    it('should return the `Err` result', () => {
        expect(op2().and(Ok(667)).err()).toBe('sadface');
        expect(op2().and(Err('bad')).err()).toBe('sadface');
    });
});

describe(`Test method \`${Result.name}.prototype.${Result.prototype.andThen.name}\``, () => {
    it('should return `res`', () => {
        expect(
            op1()
                .andThen((num) => Ok(num + 1))
                .ok(),
        ).toBe(667);

        expect(
            op1()
                .andThen(() => Err('bad'))
                .err(),
        ).toBe('bad');
    });

    it('should return the `Err` result', () => {
        expect(
            op2()
                .andThen((num) => Ok(num + 1))
                .err(),
        ).toBe('sadface');

        expect(
            op2()
                .andThen(() => Err('bad'))
                .err(),
        ).toBe('sadface');
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

describe(`Test method \`${Result.name}.prototype.${Result.prototype.or.name}\``, () => {
    it('should return the `Ok` result', () => {
        expect(op1().or(Ok(667)).ok()).toBe(666);
        expect(op1().or(Err('bad')).ok()).toBe(666);
    });

    it('should return `res`', () => {
        expect(op2().or(Ok(667)).ok()).toBe(667);
        expect(op2().or(Err('bad')).err()).toBe('bad');
    });
});

describe(`Test method \`${Result.name}.prototype.${Result.prototype.orElse.name}\``, () => {
    it('should return the `Ok` result', () => {
        expect(
            op1()
                .orElse(() => Ok(667))
                .ok(),
        ).toBe(666);

        expect(
            op1()
                .orElse((err) => Err(err))
                .ok(),
        ).toBe(666);
    });

    it('should return `res`', () => {
        expect(
            op2()
                .orElse(() => Ok(667))
                .ok(),
        ).toBe(667);

        expect(
            op2()
                .orElse((err) => Err(err))
                .err(),
        ).toBe('sadface');
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

describe(`Test method \`${Result.name}.prototype.${Result.prototype.transpose.name}\``, () => {
    it('should transpose itself to an optional of a `Result`', () => {
        expect(Ok<number | undefined | null, string>(1).transpose()!.ok()).toBe(1);
        expect(Ok<number | undefined | null, string>(undefined).transpose()).toBeUndefined();
        expect(Ok<number | undefined | null, string>(null).transpose()).toBeUndefined();
        expect(Err<number | undefined | null, string>('Some error message').transpose()!.err()).toBe(
            'Some error message',
        );
    });
});

describe(`Test method \`${Result.name}.prototype.${Result.prototype.equal.name}\``, () => {
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
    });
});
