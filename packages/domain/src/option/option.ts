abstract class OptionBase<T> {
    public abstract isSome(): boolean;

    public abstract isNone(): boolean;

    public abstract unwrap(): T;

    public abstract unwrapOr(defaultValue: T): T;

    public map<U>(fn: (value: T) => U): Option<U> {
        if (this.isNone()) {
            return none();
        }

        return some(fn(this.unwrap()));
    }
}

class Some<T> extends OptionBase<T> {
    public constructor(private readonly value: T) {
        super();
    }

    public override isSome(): boolean {
        return true;
    }

    public override isNone(): boolean {
        return false;
    }

    public override unwrap(): T {
        return this.value;
    }

    public override unwrapOr(_: T): T {
        return this.value;
    }
}

class None extends OptionBase<never> {
    public override isSome(): boolean {
        return false;
    }

    public override isNone(): boolean {
        return true;
    }

    public override unwrap(): never {
        throw new Error("Cannot unwrap None.");
    }

    public override unwrapOr(defaultValue: never): never {
        return defaultValue;
    }
}

const NONE = new None();

export type Option<T> = OptionBase<T>;

export function some<T>(value: T): Option<T> {
    return new Some(value);
}

export function none<T>(): Option<T> {
    return NONE as Option<T>;
}