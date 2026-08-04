import { describe, expect, it } from "vitest";

import { DomainEvent, DomainEvents } from "../src";

class TestDomainEvent extends DomainEvent {
    public constructor(occurredAt?: Date) {
        super(occurredAt);
    }
}

describe("DomainEvents", () => {
    it("starts empty", () => {
        const events = new DomainEvents();

        expect(events.size).toBe(0);
    });

    it("adds events", () => {
        const events = new DomainEvents();

        events.add(new TestDomainEvent());

        expect(events.size).toBe(1);
    });

    it("preserves insertion order", () => {
        const events = new DomainEvents();

        const first = new TestDomainEvent();
        const second = new TestDomainEvent();

        events.add(first);
        events.add(second);

        expect(events.pull()).toEqual([first, second]);
    });

    it("pull returns all events and clears collection", () => {
        const events = new DomainEvents();

        const first = new TestDomainEvent();
        const second = new TestDomainEvent();

        events.add(first);
        events.add(second);

        const pulled = events.pull();

        expect(pulled).toEqual([first, second]);
        expect(events.size).toBe(0);
    });

    it("pull returns a new array", () => {
        const events = new DomainEvents();

        events.add(new TestDomainEvent());

        const pulled = events.pull();

        expect(pulled).not.toBe(events.pull());
    });

    it("clear removes all events", () => {
        const events = new DomainEvents();

        events.add(new TestDomainEvent());
        events.add(new TestDomainEvent());

        events.clear();

        expect(events.size).toBe(0);
    });

    it("clear is idempotent", () => {
        const events = new DomainEvents();

        events.clear();
        events.clear();

        expect(events.size).toBe(0);
    });
});
