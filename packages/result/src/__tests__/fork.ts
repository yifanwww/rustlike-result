import type { Result } from '../Result';
import { RESULT_SYMBOL } from '../symbols';

class ResultFork<T, E> {
    constructor(
        private readonly _isOk: boolean,
        private readonly _value: T | E,
    ) {}

    get symbol(): typeof RESULT_SYMBOL {
        return RESULT_SYMBOL;
    }

    isOk(): boolean {
        return this._isOk;
    }

    unwrapUnchecked(): T {
        return this._value as T;
    }

    unwrapErrUnchecked(): E {
        return this._value as E;
    }
}

export function OkFork<T, E = never>(value: T): Result<T, E> {
    // eslint-disable-next-line new-cap
    const instance = new ResultFork(true, value);
    return instance as unknown as Result<T, E>;
}

export function ErrFork<E, T = never>(error: E): Result<T, E> {
    // eslint-disable-next-line new-cap
    const instance = new ResultFork(false, error);
    return instance as unknown as Result<T, E>;
}
