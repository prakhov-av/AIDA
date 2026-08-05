import type {
    HandlerRegistry,
    RequestConstructor,
    RequestHandler,
} from "./handler-registry";

/**
 * Default in-memory implementation of HandlerRegistry.
 */
export class DefaultHandlerRegistry implements HandlerRegistry {
    private readonly handlers = new Map<
        Function,
        RequestHandler<unknown, unknown>
    >();

    /**
     * Registers a handler for the specified request type.
     *
     * @param request - Request constructor.
     * @param handler - Request handler.
     */
    public register<TRequest, TResponse>(
        request: RequestConstructor<TRequest>,
        handler: RequestHandler<TRequest, TResponse>,
    ): void {
        this.handlers.set(
            request,
            handler as RequestHandler<unknown, unknown>,
        );
    }

    /**
     * Returns a handler registered for the specified request type.
     *
     * @param request - Request constructor.
     * @returns Registered handler or undefined.
     */
    public get<TRequest, TResponse>(
        request: RequestConstructor<TRequest>,
    ): RequestHandler<TRequest, TResponse> | undefined {
        return this.handlers.get(request) as
            | RequestHandler<TRequest, TResponse>
            | undefined;
    }
}