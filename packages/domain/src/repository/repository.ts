import type { AggregateRoot } from "../aggregate-root";
import type { Identity } from "../foundation";
import type { Option } from "../option";

/**
 * Defines the persistence contract for aggregate roots.
 *
 * @typeParam TAggregate The aggregate root type.
 * @typeParam TId The aggregate identifier type.
 */
export abstract class Repository<
    TAggregate extends AggregateRoot<TId>,
    TId extends Identity<unknown>,
> {
    /**
     * Finds an aggregate by its identifier.
     *
     * @param id The aggregate identifier.
     * @returns An option containing the aggregate when found.
     */
    public abstract findById(id: TId): Promise<Option<TAggregate>>;

    /**
     * Persists the aggregate.
     *
     * @param aggregate The aggregate to save.
     */
    public abstract save(aggregate: TAggregate): Promise<void>;

    /**
     * Deletes the aggregate with the specified identifier.
     *
     * @param id The aggregate identifier.
     */
    public abstract delete(id: TId): Promise<void>;
}