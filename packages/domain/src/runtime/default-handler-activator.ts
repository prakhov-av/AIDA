import type {
    HandlerActivationSource,
    HandlerActivator,
    HandlerFactory,
} from "./handler-activator";
import type { RequestHandler } from "./handler-registry";

/**
 * Default implementation of HandlerActivator.
 *
 * Activates handlers from explicit activation sources
 * without depending on a dependency injection container.
 */
export class DefaultHandlerActivator implements HandlerActivator {
    /**
     * Activates an executable handler from an activation source.
     *
     * @param source - Handler activation source.
     * @returns Executable handler.
     */
    public activate<TRequest, TResponse>(
        source: HandlerActivationSource<TRequest, TResponse>,
    ): RequestHandler<TRequest, TResponse>;

    /**
     * Activates an executable handler from a factory.
     *
     * @param factory - Handler factory.
     * @returns Executable handler.
     */
    public activate<TRequest, TResponse>(
        factory: HandlerFactory<TRequest, TResponse>,
    ): RequestHandler<TRequest, TResponse>;

    public activate<TRequest, TResponse>(
        source:
            | HandlerActivationSource<TRequest, TResponse>
            | HandlerFactory<TRequest, TResponse>,
    ): RequestHandler<TRequest, TResponse> {
        if (typeof source === "function") {
            return source();
        }

        if (source.kind === "handler") {
            return source.handler;
        }

        return source.factory();
    }
}