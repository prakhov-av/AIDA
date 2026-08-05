import type { ApplicationExecutor } from "../execution";
import type { PipelineBehavior } from "../execution";

import type {
    RequestConstructor,
    RequestHandler,
} from "./handler-registry";

/**
 * Defines a fluent builder for composing an application runtime.
 */
export interface RuntimeBuilder {
    /**
     * Registers a request handler.
     *
     * @param request - Request constructor.
     * @param handler - Request handler.
     * @returns Current builder.
     */
    register<TRequest, TResponse>(
        request: RequestConstructor<TRequest>,
        handler: RequestHandler<TRequest, TResponse>,
    ): RuntimeBuilder;

    /**
     * Adds a pipeline behavior.
     *
     * @param behavior - Pipeline behavior.
     * @returns Current builder.
     */
    addBehavior<TRequest, TResponse>(
        behavior: PipelineBehavior<TRequest, TResponse>,
    ): RuntimeBuilder;

    /**
     * Builds a new independent application executor.
     *
     * Every invocation creates a new runtime composition.
     *
     * @returns Application executor.
     */
    build(): ApplicationExecutor;
}