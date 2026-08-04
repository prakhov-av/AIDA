export abstract class DomainEvent {
    private readonly _occurredAt: Date;

    protected constructor(occurredAt: Date = new Date()) {
        this._occurredAt = occurredAt;
    }

    public get occurredAt(): Date {
        return this._occurredAt;
    }
}