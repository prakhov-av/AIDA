import type { RequestHandler } from "./handler-registry";

/**
 * Represents a source capable of creating or providing an executable request handler.
 *
 * @typeParam TRequest - Request type.
 * @typeParam TResponse - Response type.
 */
export type HandlerActivationSource<TRequest, TResponse> =
    | {
    readonly kind: "handler";
    readonly handler: RequestHandler<TRequest, TResponse>;
}
    | {
    readonly kind: "factory";
    readonly factory: () => RequestHandler<
        TRequest,
        TResponse
    >;
};

/**
 * Represents a factory capable of creating an executable request handler.
 *
 * @typeParam TRequest - Request type.
 * @typeParam TResponse - Response type.
 */
export type HandlerFactory<TRequest, TResponse> = () =>
    RequestHandler<TRequest, TResponse>;

/**
 * Defines activation of executable request handlers.
 */
export interface HandlerActivator {
    /**
     * Activates an executable handler from an activation source.
     *
     * @typeParam TRequest - Request type.
     * @typeParam TResponse - Response type.
     *
     * @param source - Handler activation source.
     * @returns Executable handler.
     */
    activate<TRequest, TResponse>(
        source: HandlerActivationSource<TRequest, TResponse>,
    ): RequestHandler<TRequest, TResponse>;

    /**
     * Activates an executable handler from a factory.
     *
     * @typeParam TRequest - Request type.
     * @typeParam TResponse - Response type.
     *
     * @param factory - Handler factory.
     * @returns Executable handler.
     */
    activate<TRequest, TResponse>(
        factory: HandlerFactory<TRequest, TResponse>,
    ): RequestHandler<TRequest, TResponse>;
}