import type { DomainEvent } from "../events";

/**
 * Defines the application contract for dispatching domain events.
 */
export interface DomainEventDispatcher {
    /**
     * Dispatches the provided domain events.
     *
     * @param events - Domain events to dispatch.
     */
    dispatch(
        events: readonly DomainEvent[],
    ): Promise<void>;
}
