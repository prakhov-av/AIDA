import { ResultError } from "./result-error";

export type Result<T, E> = Ok<T, E> | Err<T, E>;

class Ok<T, E = never> {
    public constructor(
        private readonly value: T,
    ) {}

    public isOk(): this is Ok<T, E> {
        return true;
    }

    public isErr(): this is Err<T, E> {
        return false;
    }

    public unwrap(): T {
        return this.value;
    }

    public unwrapErr(): never {
        throw new ResultError(
            "Cannot call unwrapErr() on an Ok result. Use unwrap() to access the value.",
        );
    }
}

class Err<T = never, E = unknown> {
    public constructor(
        private readonly error: E,
    ) {}

    public isOk(): this is Ok<T, E> {
        return false;
    }

    public isErr(): this is Err<T, E> {
        return true;
    }

    public unwrap(): never {
        throw new ResultError(
            "Cannot call unwrap() on an Err result. Use unwrapErr() to access the error.",
        );
    }

    public unwrapErr(): E {
        return this.error;
    }
}

export function ok<T>(value: T): Result<T, never> {
    return new Ok(value);
}

export function err<E>(error: E): Result<never, E> {
    return new Err(error);
}