import { ValueObject } from "../../value-object";

/**
 * Represents a strongly typed identity value.
 *
 * Identities provide equality semantics through {@link ValueObject}
 * and serve as a base class for domain-specific identifiers.
 *
 * @typeParam T - Underlying identity value type.
 */
export abstract class Identity<T> extends ValueObject<{ value: T }> {
    protected constructor(value: T) {
        super({ value });
    }

    protected get value(): T {
        return this.props.value;
    }
}