import { ValueObject } from "../../value-object";

export abstract class Identity<T> extends ValueObject<{ value: T }> {
    protected constructor(value: T) {
        super({ value });
    }

    protected get value(): T {
        return this.props.value;
    }
}