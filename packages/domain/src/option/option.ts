abstract class OptionBase<T> {
    abstract isSome(): boolean;

    abstract isNone(): boolean;

    abstract unwrap(): T;

    abstract unwrapOr(defaultValue: T): T;

    abstract map<U>(fn: (value: T) => U): Option<U>;
}

class Some<T> extends OptionBase<T> {
    public constructor(private readonly value: T) {
        super();
    }

    public isSome(): boolean {
        return true;
    }

    public isNone(): boolean {
        return false;
    }

    public unwrap(): T {
        return this.value;
    }

    public unwrapOr(_defaultValue: T): T {
        return this.value;
    }

    public map<U>(fn: (value: T) => U): Option<U> {
        return some(fn(this.value));
    }
}

class None<T> extends OptionBase<T> {
    public isSome(): boolean {
        return false;
    }

    public isNone(): boolean {
        return true;
    }

    public unwrap(): T {
        throw new Error("Cannot unwrap None.");
    }

    public unwrapOr(defaultValue: T): T {
        return defaultValue;
    }

    public map<U>(_fn: (value: T) => U): Option<U> {
        return none<U>();
    }
}

export type Option<T> = OptionBase<T>;

export function some<T>(value: T): Option<T> {
    return new Some(value);
}

export function none<T = never>(): Option<T> {
    return new None<T>();
}