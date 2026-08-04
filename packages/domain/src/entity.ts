import { Identity } from "./foundation/identity";

export abstract class Entity<TId extends Identity<unknown>> {
    private readonly _id: TId;

    protected constructor(id: TId) {
        this._id = id;
    }

    public get id(): TId {
        return this._id;
    }

    public equals(other: Entity<TId> | null | undefined): boolean {
        if (other == null) {
            return false;
        }

        if (this === other) {
            return true;
        }

        if (this.constructor !== other.constructor) {
            return false;
        }

        return this._id.equals(other._id);
    }
}