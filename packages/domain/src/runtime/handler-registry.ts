/**
 * Represents a request constructor used as a registry key.
 *
 * @typeParam TRequest - Request type.
 */
export type RequestConstructor<TRequest> =
    abstract new (...args: never[]) => TRequest;

/**
 * Represents an executable request handler.
 *
 * @typeParam TRequest - Request type.
 * @typeParam TResponse - Response type.
 */
export type RequestHandler<TRequest, TResponse> = (
    request: TRequest,
) => Promise<TResponse>;

/**
 * Defines registration and lookup of request handlers.
 */
export interface HandlerRegistry {
    /**
     * Registers a handler for the specified request type.
     *
     * @typeParam TRequest - Request type.
     * @typeParam TResponse - Response type.
     *
     * @param request - Request constructor.
     * @param handler - Request handler.
     */
    register<TRequest, TResponse>(
        request: RequestConstructor<TRequest>,
        handler: RequestHandler<TRequest, TResponse>,
    ): void;

    /**
     * Returns a handler registered for the specified request type.
     *
     * @typeParam TRequest - Request type.
     * @typeParam TResponse - Response type.
     *
     * @param request - Request constructor.
     * @returns Registered handler or undefined.
     */
    get<TRequest, TResponse>(
        request: RequestConstructor<TRequest>,
    ): RequestHandler<TRequest, TResponse> | undefined;
}