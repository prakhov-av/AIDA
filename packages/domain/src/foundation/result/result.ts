import { ResultError } from "../result-error";

export type Result<T, E> = Ok<T, E> | Err<T, E>;

abstract class ResultBase<T, E> {
    public abstract isOk(): this is Ok<T, E>;

    public abstract isErr(): this is Err<T, E>;

    public abstract unwrap(): T;

    public abstract unwrapErr(): E;

    public abstract map<U>(
        mapper: (value: T) => U,
    ): Result<U, E>;
}

class Ok<T, E = never> extends ResultBase<T, E> {
    public constructor(
        private readonly value: T,
    ) {
        super();
    }

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
            "Cannot call unwrapErr() on an Ok result. Use unwrap() instead.",
        );
    }

    public map<U>(
        mapper: (value: T) => U,
    ): Result<U, E> {
        return ok(mapper(this.value));
    }
}

class Err<T = never, E = unknown> extends ResultBase<T, E> {
    public constructor(
        private readonly error: E,
    ) {
        super();
    }

    public isOk(): this is Ok<T, E> {
        return false;
    }

    public isErr(): this is Err<T, E> {
        return true;
    }

    public unwrap(): never {
        throw new ResultError(
            "Cannot call unwrap() on an Err result. Use unwrapErr() instead.",
        );
    }

    public unwrapErr(): E {
        return this.error;
    }

    public map<U>(
        _: (value: T) => U,
    ): Result<U, E> {
        return err(this.error);
    }
}

export function ok<T>(value: T): Result<T, never> {
    return new Ok(value);
}

export function err<E>(error: E): Result<never, E> {
    return new Err(error);
}