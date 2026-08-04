export abstract class ValueObject<T extends object> {
    protected readonly props: Readonly<T>;

    protected constructor(props: T) {
        this.props = Object.freeze({ ...props });
    }

    public equals(other: ValueObject<T>): boolean {
        if (Object.is(this, other)) {
            return true;
        }

        if (this.constructor !== other.constructor) {
            return false;
        }

        return this.equalsCore(other);
    }

    protected abstract equalsCore(other: ValueObject<T>): boolean;
}