import { DomainEvent } from "./domain-event";

export class DomainEvents {
    private readonly events: DomainEvent[] = [];

    public add(event: DomainEvent): void {
        this.events.push(event);
    }

    public pull(): readonly DomainEvent[] {
        const events = [...this.events];

        this.events.length = 0;

        return events;
    }

    public clear(): void {
        this.events.length = 0;
    }

    public get size(): number {
        return this.events.length;
    }
}