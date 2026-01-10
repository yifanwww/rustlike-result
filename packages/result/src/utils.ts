import type { Result } from './Result';
import { RESULT_SYMBOL } from './symbols';

export function isResult(value: Exclude<unknown, null | undefined>): value is Result<unknown, unknown> {
    return (value as Result<unknown, unknown>).symbol === RESULT_SYMBOL;
}

export function equalResult(self: unknown, other: unknown): boolean {
    // check null or undefined first so we don't need to check it repeatedly later
    const isSelfNullish = self === undefined || self === null;
    const isOtherNullish = other === undefined || other === null;
    if (isSelfNullish && isOtherNullish) return self === other;
    if (isSelfNullish || isOtherNullish) return false;

    const isSelfResult = isResult(self);
    const isOtherResult = isResult(other);

    if (isSelfResult && isOtherResult) {
        const isOk = self.isOk();
        if (isOk !== other.isOk()) return false;
        return isOk
            ? equalResult(self.unwrapUnchecked(), other.unwrapUnchecked())
            : equalResult(self.unwrapErrUnchecked(), other.unwrapErrUnchecked());
    }

    return self === other;
}

export async function equalResultAsync(self: unknown, other: unknown): Promise<boolean> {
    const _self = await self;
    const _other = await other;

    // check null or undefined first so we don't need to check it repeatedly later
    const isSelfNullish = _self === undefined || _self === null;
    const isOtherNullish = _other === undefined || _other === null;
    if (isSelfNullish && isOtherNullish) return _self === _other;
    else if (isSelfNullish || isOtherNullish) return false;

    const isSelfResult = isResult(_self);
    const isOtherResult = isResult(_other);

    if (isSelfResult && isOtherResult) {
        const isOk = _self.isOk();
        if (isOk !== _other.isOk()) return false;
        return isOk
            ? equalResultAsync(_self.unwrapUnchecked(), _other.unwrapUnchecked())
            : equalResultAsync(_self.unwrapErrUnchecked(), _other.unwrapErrUnchecked());
    }

    return self === other;
}
