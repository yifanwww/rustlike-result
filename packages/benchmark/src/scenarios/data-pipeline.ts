import type { Result } from '@rustresult/result';
import { Err, Ok } from '@rustresult/result';
import { Exit } from 'effect';
import type { Result as NTResult } from 'neverthrow';
import { err as ntErr, ok as ntOk } from 'neverthrow';
import { Bench, hrtimeNow } from 'tinybench';

import { formatTinybenchTask } from '../tinybench.js';
import { formatNum, logEnvironment, logTestCases } from '../utils.js';

await logEnvironment();

const N = 100_000;

// Simulated data structures
interface RawInput {
    email: string;
    age: string;
    username: string;
}

interface ParsedData {
    email: string;
    age: number;
    username: string;
}

interface ValidatedUser {
    email: string;
    age: number;
    username: string;
    isAdult: boolean;
}

interface TransformedUser {
    id: string;
    email: string;
    age: number;
    username: string;
    isAdult: boolean;
    timestamp: number;
}

interface SavedUser extends TransformedUser {
    saved: true;
}

type ValidationError =
    | { type: 'PARSE_ERROR'; message: string }
    | { type: 'VALIDATION_ERROR'; message: string }
    | { type: 'TRANSFORM_ERROR'; message: string }
    | { type: 'SAVE_ERROR'; message: string };

// Test data
const validInput: RawInput = {
    email: 'user@example.com',
    age: '25',
    username: 'johndoe',
};

const invalidEmailInput: RawInput = {
    email: 'invalid-email',
    age: '25',
    username: 'johndoe',
};

const invalidAgeInput: RawInput = {
    email: 'user@example.com',
    age: 'not-a-number',
    username: 'johndoe',
};

// =============================================================================
// Result-based approach
// =============================================================================

function parseInputResult(input: RawInput): Result<ParsedData, ValidationError> {
    const age = parseInt(input.age, 10);
    if (Number.isNaN(age)) {
        return Err({ type: 'PARSE_ERROR', message: 'Invalid age format' });
    }
    return Ok({
        email: input.email,
        age,
        username: input.username,
    });
}

function validateDataResult(data: ParsedData): Result<ValidatedUser, ValidationError> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return Err({ type: 'VALIDATION_ERROR', message: 'Invalid email format' });
    }
    if (data.age < 0 || data.age > 150) {
        return Err({ type: 'VALIDATION_ERROR', message: 'Invalid age range' });
    }
    if (data.username.length < 3) {
        return Err({ type: 'VALIDATION_ERROR', message: 'Username too short' });
    }
    return Ok({
        ...data,
        isAdult: data.age >= 18,
    });
}

function transformUserResult(user: ValidatedUser): Result<TransformedUser, ValidationError> {
    return Ok({
        id: `user_${user.username}_${Date.now()}`,
        ...user,
        timestamp: Date.now(),
    });
}

function saveUserResult(user: TransformedUser): Result<SavedUser, ValidationError> {
    // Simulate database save
    if (user.username.includes('admin')) {
        return Err({ type: 'SAVE_ERROR', message: 'Reserved username' });
    }
    return Ok({
        ...user,
        saved: true as const,
    });
}

function processDataResult(input: RawInput): Result<SavedUser, ValidationError> {
    return parseInputResult(input).andThen(validateDataResult).andThen(transformUserResult).andThen(saveUserResult);
}

// =============================================================================
// neverthrow Result-based approach
// =============================================================================

function parseInputNT(input: RawInput): NTResult<ParsedData, ValidationError> {
    const age = parseInt(input.age, 10);
    if (Number.isNaN(age)) {
        return ntErr({ type: 'PARSE_ERROR', message: 'Invalid age format' });
    }
    return ntOk({
        email: input.email,
        age,
        username: input.username,
    });
}

function validateDataNT(data: ParsedData): NTResult<ValidatedUser, ValidationError> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return ntErr({ type: 'VALIDATION_ERROR', message: 'Invalid email format' });
    }
    if (data.age < 0 || data.age > 150) {
        return ntErr({ type: 'VALIDATION_ERROR', message: 'Invalid age range' });
    }
    if (data.username.length < 3) {
        return ntErr({ type: 'VALIDATION_ERROR', message: 'Username too short' });
    }
    return ntOk({
        ...data,
        isAdult: data.age >= 18,
    });
}

function transformUserNT(user: ValidatedUser): NTResult<TransformedUser, ValidationError> {
    return ntOk({
        id: `user_${user.username}_${Date.now()}`,
        ...user,
        timestamp: Date.now(),
    });
}

function saveUserNT(user: TransformedUser): NTResult<SavedUser, ValidationError> {
    // Simulate database save
    if (user.username.includes('admin')) {
        return ntErr({ type: 'SAVE_ERROR', message: 'Reserved username' });
    }
    return ntOk({
        ...user,
        saved: true as const,
    });
}

function processDataNT(input: RawInput): NTResult<SavedUser, ValidationError> {
    return parseInputNT(input).andThen(validateDataNT).andThen(transformUserNT).andThen(saveUserNT);
}

// =============================================================================
// effect Exit-based approach
// =============================================================================

function parseInputEffect(input: RawInput): Exit.Exit<ParsedData, ValidationError> {
    const age = parseInt(input.age, 10);
    if (Number.isNaN(age)) {
        return Exit.fail({ type: 'PARSE_ERROR', message: 'Invalid age format' });
    }
    return Exit.succeed({
        email: input.email,
        age,
        username: input.username,
    });
}

function validateDataEffect(data: ParsedData): Exit.Exit<ValidatedUser, ValidationError> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return Exit.fail({ type: 'VALIDATION_ERROR', message: 'Invalid email format' });
    }
    if (data.age < 0 || data.age > 150) {
        return Exit.fail({ type: 'VALIDATION_ERROR', message: 'Invalid age range' });
    }
    if (data.username.length < 3) {
        return Exit.fail({ type: 'VALIDATION_ERROR', message: 'Username too short' });
    }
    return Exit.succeed({
        ...data,
        isAdult: data.age >= 18,
    });
}

function transformUserEffect(user: ValidatedUser): Exit.Exit<TransformedUser, ValidationError> {
    return Exit.succeed({
        id: `user_${user.username}_${Date.now()}`,
        ...user,
        timestamp: Date.now(),
    });
}

function saveUserEffect(user: TransformedUser): Exit.Exit<SavedUser, ValidationError> {
    // Simulate database save
    if (user.username.includes('admin')) {
        return Exit.fail({ type: 'SAVE_ERROR', message: 'Reserved username' });
    }
    return Exit.succeed({
        ...user,
        saved: true as const,
    });
}

function processDataEffect(input: RawInput): Exit.Exit<SavedUser, ValidationError> {
    return Exit.flatMap(
        Exit.flatMap(Exit.flatMap(parseInputEffect(input), validateDataEffect), transformUserEffect),
        saveUserEffect,
    );
}

// =============================================================================
// Traditional imperative approach (with null/undefined)
// =============================================================================

function parseInputImperative(input: RawInput): ParsedData | null {
    const age = parseInt(input.age, 10);
    if (Number.isNaN(age)) {
        return null;
    }
    return {
        email: input.email,
        age,
        username: input.username,
    };
}

function validateDataImperative(data: ParsedData): ValidatedUser | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return null;
    }
    if (data.age < 0 || data.age > 150) {
        return null;
    }
    if (data.username.length < 3) {
        return null;
    }
    return {
        ...data,
        isAdult: data.age >= 18,
    };
}

function transformUserImperative(user: ValidatedUser): TransformedUser | null {
    return {
        id: `user_${user.username}_${Date.now()}`,
        ...user,
        timestamp: Date.now(),
    };
}

function saveUserImperative(user: TransformedUser): SavedUser | null {
    // Simulate database save
    if (user.username.includes('admin')) {
        return null;
    }
    return {
        ...user,
        saved: true as const,
    };
}

function processDataImperative(input: RawInput): SavedUser | null {
    const parsed = parseInputImperative(input);
    if (parsed === null) return null;

    const validated = validateDataImperative(parsed);
    if (validated === null) return null;

    const transformed = transformUserImperative(validated);
    if (transformed === null) return null;

    const saved = saveUserImperative(transformed);
    if (saved === null) return null;

    return saved;
}

// =============================================================================
// Traditional try-catch approach
// =============================================================================

function parseInputThrow(input: RawInput): ParsedData {
    const age = parseInt(input.age, 10);
    if (Number.isNaN(age)) {
        throw new Error('Invalid age format');
    }
    return {
        email: input.email,
        age,
        username: input.username,
    };
}

function validateDataThrow(data: ParsedData): ValidatedUser {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
    }
    if (data.age < 0 || data.age > 150) {
        throw new Error('Invalid age range');
    }
    if (data.username.length < 3) {
        throw new Error('Username too short');
    }
    return {
        ...data,
        isAdult: data.age >= 18,
    };
}

function transformUserThrow(user: ValidatedUser): TransformedUser {
    return {
        id: `user_${user.username}_${Date.now()}`,
        ...user,
        timestamp: Date.now(),
    };
}

function saveUserThrow(user: TransformedUser): SavedUser {
    // Simulate database save
    if (user.username.includes('admin')) {
        throw new Error('Reserved username');
    }
    return {
        ...user,
        saved: true as const,
    };
}

function processDataTryCatch(input: RawInput): SavedUser | null {
    try {
        const parsed = parseInputThrow(input);
        const validated = validateDataThrow(parsed);
        const transformed = transformUserThrow(validated);
        const saved = saveUserThrow(transformed);
        return saved;
    } catch {
        return null;
    }
}

// =============================================================================
// Benchmark
// =============================================================================

logTestCases([
    ['rustresult Result (success)', processDataResult(validInput)],
    ['neverthrow Result (success)', processDataNT(validInput)],
    ['effect Exit (success)', processDataEffect(validInput)],
    ['Nullable (success)', processDataImperative(validInput)],
    ['Try-catch (success)', processDataTryCatch(validInput)],
    ['rustresult Result (parse error)', processDataResult(invalidAgeInput)],
    ['neverthrow Result (parse error)', processDataNT(invalidAgeInput)],
    ['effect Exit (parse error)', processDataEffect(invalidAgeInput)],
    ['Nullable (parse error)', processDataImperative(invalidAgeInput)],
    ['Try-catch (parse error)', processDataTryCatch(invalidAgeInput)],
    ['rustresult Result (validation error)', processDataResult(invalidEmailInput)],
    ['neverthrow Result (validation error)', processDataNT(invalidEmailInput)],
    ['effect Exit (validation error)', processDataEffect(invalidEmailInput)],
    ['Nullable (validation error)', processDataImperative(invalidEmailInput)],
    ['Try-catch (validation error)', processDataTryCatch(invalidEmailInput)],
]);

console.log('Loop N:', formatNum(N));

// Benchmark: Success path
const benchSuccess = new Bench({ now: hrtimeNow });
benchSuccess
    .add('rustresult Result (success path)', () => {
        for (let i = 0; i < N; i++) {
            processDataResult(validInput);
        }
    })
    .add('neverthrow Result (success path)', () => {
        for (let i = 0; i < N; i++) {
            processDataNT(validInput);
        }
    })
    .add('effect Exit (success path)', () => {
        for (let i = 0; i < N; i++) {
            processDataEffect(validInput);
        }
    })
    .add('Nullable (success path)', () => {
        for (let i = 0; i < N; i++) {
            processDataImperative(validInput);
        }
    })
    .add('Try-catch (success path)', () => {
        for (let i = 0; i < N; i++) {
            processDataTryCatch(validInput);
        }
    });

await benchSuccess.run();
console.table(benchSuccess.table(formatTinybenchTask));

// Benchmark: Early failure path
const benchEarlyFailure = new Bench({ now: hrtimeNow });
benchEarlyFailure
    .add('rustresult Result (early failure)', () => {
        for (let i = 0; i < N; i++) {
            processDataResult(invalidAgeInput);
        }
    })
    .add('neverthrow Result (early failure)', () => {
        for (let i = 0; i < N; i++) {
            processDataNT(invalidAgeInput);
        }
    })
    .add('effect Exit (early failure)', () => {
        for (let i = 0; i < N; i++) {
            processDataEffect(invalidAgeInput);
        }
    })
    .add('Nullable (early failure)', () => {
        for (let i = 0; i < N; i++) {
            processDataImperative(invalidAgeInput);
        }
    })
    .add('Try-catch (early failure)', () => {
        for (let i = 0; i < N; i++) {
            processDataTryCatch(invalidAgeInput);
        }
    });

await benchEarlyFailure.run();
console.table(benchEarlyFailure.table(formatTinybenchTask));

// Benchmark: Mid-pipeline failure
const benchMidFailure = new Bench({ now: hrtimeNow });
benchMidFailure
    .add('rustresult Result (mid failure)', () => {
        for (let i = 0; i < N; i++) {
            processDataResult(invalidEmailInput);
        }
    })
    .add('neverthrow Result (mid failure)', () => {
        for (let i = 0; i < N; i++) {
            processDataNT(invalidEmailInput);
        }
    })
    .add('effect Exit (mid failure)', () => {
        for (let i = 0; i < N; i++) {
            processDataEffect(invalidEmailInput);
        }
    })
    .add('Nullable (mid failure)', () => {
        for (let i = 0; i < N; i++) {
            processDataImperative(invalidEmailInput);
        }
    })
    .add('Try-catch (mid failure)', () => {
        for (let i = 0; i < N; i++) {
            processDataTryCatch(invalidEmailInput);
        }
    });

await benchMidFailure.run();
console.table(benchMidFailure.table(formatTinybenchTask));
