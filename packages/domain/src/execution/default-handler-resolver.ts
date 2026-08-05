import type { HandlerResolver } from "./handler-resolver";
import type {
    HandlerRegistry,
    RequestConstructor,
} from "../runtime";
import { HandlerNotFoundError } from "../runtime";

/**
 * Default implementation of HandlerResolver.
 *
 * Resolves executable handlers from the configured registry.
 */
export class DefaultHandlerResolver implements HandlerResolver {
    public constructor(
        private readonly registry: HandlerRegistry,
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
            (request as object).constructor as RequestConstructor<TRequest>;

        const handler =
            this.registry.get<TRequest, TResponse>(
                requestType,
            );

        if (handler === undefined) {
            throw new HandlerNotFoundError(
                requestType.name,
            );
        }

        return handler;
    }
}