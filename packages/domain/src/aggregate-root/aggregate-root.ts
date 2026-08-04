import { Entity } from "../entity";
import { DomainEvent, DomainEvents } from "../events";
import type { Identity } from "../foundation/identity";

export abstract class AggregateRoot<
    TId extends Identity<unknown>,
> extends Entity<TId> {
    private readonly domainEvents = new DomainEvents();

    protected addDomainEvent(event: DomainEvent): void {
        this.domainEvents.add(event);
    }

    public pullDomainEvents(): readonly DomainEvent[] {
        return this.domainEvents.pull();
    }
}