import { ResultError } from "./result-error";

export type Result<T, E> = Ok<T, E> | Err<T, E>;

abstract class ResultBase<T, E> {
    public abstract isOk(): this is Ok<T, E>;

    public abstract isErr(): this is Err<T, E>;

    public abstract unwrap(): T;

    public abstract unwrapErr(): E;

    public unwrapOr(defaultValue: T): T {
        return this.isOk()
            ? this.unwrap()
            : defaultValue;
    }

    public abstract map<U>(
        mapper: (value: T) => U,
    ): Result<U, E>;

    public abstract flatMap<U>(
        mapper: (value: T) => Result<U, E>,
    ): Result<U, E>;

    public abstract mapErr<F>(
        mapper: (error: E) => F,
    ): Result<T, F>;

    public match<R>(handlers: {
        success: (value: T) => R;
        failure: (error: E) => R;
    }): R {
        return this.isOk()
            ? handlers.success(this.unwrap())
            : handlers.failure(this.unwrapErr());
    }
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
        return new Ok<U, E>(mapper(this.value));
    }

    public flatMap<U>(
        mapper: (value: T) => Result<U, E>,
    ): Result<U, E> {
        return mapper(this.value);
    }

    public mapErr<F>(
        _: (error: E) => F,
    ): Result<T, F> {
        return new Ok<T, F>(this.value);
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
        return new Err<U, E>(this.error);
    }

    public flatMap<U>(
        _: (value: T) => Result<U, E>,
    ): Result<U, E> {
        return new Err<U, E>(this.error);
    }

    public mapErr<F>(
        mapper: (error: E) => F,
    ): Result<T, F> {
        return new Err<T, F>(mapper(this.error));
    }
}

export function ok<T>(
    value: T,
): Result<T, never> {
    return new Ok(value);
}

export function err<E>(
    error: E,
): Result<never, E> {
    return new Err(error);
}