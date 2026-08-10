import type {
    HandlerActivator,
} from "../runtime";
import type {
    HandlerRegistry,
    RequestConstructor,
} from "../runtime";
import {
    HandlerNotFoundError,
} from "../runtime";

import type { HandlerResolver } from "./handler-resolver";

/**
 * Default implementation of HandlerResolver.
 *
 * Resolves executable handlers from the configured registry
 * and activates them through the configured HandlerActivator.
 */
export class DefaultHandlerResolver
    implements HandlerResolver
{
    public constructor(
        private readonly registry: HandlerRegistry,
        private readonly activator: HandlerActivator,
    ) {}

    /**
     * Resolves a handler for the specified request.
     *
     * @param request - Application request.
     * @returns Registered executable handler.
     * @throws HandlerNotFoundError when no handler has been registered.
     */
    public resolve<TRequest, TResponse>(
        request: TRequest,
    ): (request: TRequest) => Promise<TResponse> {
        const requestType =
            (request as object)
                .constructor as RequestConstructor<TRequest>;

        const source =
            this.registry.get<TRequest, TResponse>(
                requestType,
            );

        if (source === undefined) {
            throw new HandlerNotFoundError(
                requestType.name,
            );
        }

        return this.activator.activate(source);
    }
}