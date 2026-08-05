/**
 * Represents a domain event raised by the domain model.
 *
 * Domain events capture facts that have already occurred and can be
 * collected by an aggregate root for later dispatch.
 */
export abstract class DomainEvent {
    private readonly _occurredAt: Date;

    protected constructor(occurredAt: Date = new Date()) {
        this._occurredAt = occurredAt;
    }

    /**
     * Gets the timestamp when the event occurred.
     */
    public get occurredAt(): Date {
        return this._occurredAt;
    }
}