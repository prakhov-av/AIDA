import type { HandlerActivationSource } from "./handler-activator";

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
 * Defines registration and lookup of request handler activation sources.
 */
export interface HandlerRegistry {
    /**
     * Registers a handler activation source for the specified request type.
     *
     * @typeParam TRequest - Request type.
     * @typeParam TResponse - Response type.
     *
     * @param request - Request constructor.
     * @param source - Handler activation source.
     */
    register<TRequest, TResponse>(
        request: RequestConstructor<TRequest>,
        source: HandlerActivationSource<TRequest, TResponse>,
    ): void;

    /**
     * Returns the activation source registered for the specified request type.
     *
     * @typeParam TRequest - Request type.
     * @typeParam TResponse - Response type.
     *
     * @param request - Request constructor.
     * @returns Registered activation source or undefined.
     */
    get<TRequest, TResponse>(
        request: RequestConstructor<TRequest>,
    ): HandlerActivationSource<TRequest, TResponse> | undefined;
}