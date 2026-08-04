import { describe, expect, it } from "vitest";

import { DomainEvent } from "../src/events";

class TestDomainEvent extends DomainEvent {
    public constructor(occurredAt?: Date) {
        super(occurredAt);
    }
}

describe("DomainEvent", () => {
    it("creates event with current timestamp", () => {
        const before = Date.now();

        const event = new TestDomainEvent();

        const after = Date.now();

        expect(event.occurredAt.getTime()).toBeGreaterThanOrEqual(before);
        expect(event.occurredAt.getTime()).toBeLessThanOrEqual(after);
    });

    it("uses provided occurrence time", () => {
        const occurredAt = new Date("2026-01-01T00:00:00.000Z");

        const event = new TestDomainEvent(occurredAt);

        expect(event.occurredAt).toBe(occurredAt);
    });
});