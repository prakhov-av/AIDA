import { Entity } from "../entity";
import { DomainEvent, DomainEvents } from "../events";
import type { Identity } from "../foundation/identity";

/**
 * Represents the root entity of an aggregate.
 *
 * An aggregate root is responsible for collecting and exposing
 * domain events produced within the aggregate.
 *
 * @typeParam TId - Aggregate identity type.
 */
export abstract class AggregateRoot<
    TId extends Identity<unknown>,
> extends Entity<TId> {
    private readonly domainEvents = new DomainEvents();

    protected addDomainEvent(event: DomainEvent): void {
        this.domainEvents.add(event);
    }

    /**
     * Retrieves and clears all pending domain events.
     *
     * @returns Collected domain events in the order they were added.
     */
    public pullDomainEvents(): readonly DomainEvent[] {
        return this.domainEvents.pull();
    }
}