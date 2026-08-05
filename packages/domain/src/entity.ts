import { Identity } from "./foundation/identity";

/**
 * Represents a domain entity identified by a stable identity.
 *
 * Entities are compared by their identity rather than by the values
 * of their properties.
 *
 * @typeParam TId - Entity identity type.
 */
export abstract class Entity<TId extends Identity<unknown>> {
    private readonly _id: TId;

    protected constructor(id: TId) {
        this._id = id;
    }

    /**
     * Gets the identity of the entity.
     */
    public get id(): TId {
        return this._id;
    }

    /**
     * Determines whether this entity is equal to another entity.
     *
     * Equality is based on the runtime type and entity identity.
     *
     * @param other - Entity to compare with.
     * @returns `true` if both entities are equal; otherwise `false`.
     */
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