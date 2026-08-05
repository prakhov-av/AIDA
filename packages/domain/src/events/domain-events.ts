import { DomainEvent } from "./domain-event";

/**
 * Stores domain events raised during the current unit of work.
 */
export class DomainEvents {
    private readonly events: DomainEvent[] = [];

    /**
     * Adds a domain event to the collection.
     *
     * @param event The domain event to store.
     */
    public add(event: DomainEvent): void {
        this.events.push(event);
    }

    /**
     * Returns all stored domain events and clears the collection.
     *
     * @returns The collected domain events.
     */
    public pull(): readonly DomainEvent[] {
        const events = [...this.events];

        this.events.length = 0;

        return events;
    }

    /**
     * Removes all stored domain events.
     */
    public clear(): void {
        this.events.length = 0;
    }

    /**
     * Gets the number of stored domain events.
     */
    public get size(): number {
        return this.events.length;
    }
}