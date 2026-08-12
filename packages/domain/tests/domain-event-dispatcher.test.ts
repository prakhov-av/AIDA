import { describe, expect, it } from "vitest";

import {
    DomainEvent,
    type DomainEventDispatcher,
} from "../src";

class TestDomainEvent extends DomainEvent {
    public constructor() {
        super();
    }
}

describe("DomainEventDispatcher", () => {
    it("can be implemented", () => {
        const dispatcher: DomainEventDispatcher = {
            async dispatch(): Promise<void> {},
        };

        expect(dispatcher).toBeDefined();
    });

    it("accepts domain events for dispatch", async () => {
        const first = new TestDomainEvent();
        const second = new TestDomainEvent();
        let dispatchedEvents:
            | readonly DomainEvent[]
            | undefined;

        const dispatcher: DomainEventDispatcher = {
            async dispatch(events): Promise<void> {
                dispatchedEvents = events;
            },
        };

        await dispatcher.dispatch([first, second]);

        expect(dispatchedEvents).toEqual([
            first,
            second,
        ]);
    });
});
