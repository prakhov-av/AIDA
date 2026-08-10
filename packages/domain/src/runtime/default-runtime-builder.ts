import type { ApplicationExecutor } from "../execution";
import type { PipelineBehavior } from "../execution";

import {
    DefaultApplicationExecutor,
    DefaultHandlerResolver,
    DefaultPipelineBuilder,
    DefaultPipelineExecutor,
} from "../execution";

import { DefaultHandlerActivator } from "./default-handler-activator";
import { DefaultHandlerRegistry } from "./default-handler-registry";
import type {
    RequestConstructor,
    RequestHandler,
} from "./handler-registry";
import type { RuntimeBuilder } from "./runtime-builder";

interface Registration {
    readonly request: RequestConstructor<unknown>;
    readonly handler: RequestHandler<unknown, unknown>;
}

/**
 * Default implementation of RuntimeBuilder.
 */
export class DefaultRuntimeBuilder
    implements RuntimeBuilder
{
    private readonly registrations: Registration[] = [];

    private readonly behaviors: PipelineBehavior<
        unknown,
        unknown
    >[] = [];

    /**
     * Registers a request handler.
     *
     * @param request - Request constructor.
     * @param handler - Request handler.
     * @returns Current builder.
     */
    public register<TRequest, TResponse>(
        request: RequestConstructor<TRequest>,
        handler: RequestHandler<TRequest, TResponse>,
    ): RuntimeBuilder {
        this.registrations.push({
            request:
                request as RequestConstructor<unknown>,
            handler:
                handler as RequestHandler<
                    unknown,
                    unknown
                >,
        });

        return this;
    }

    /**
     * Adds a pipeline behavior.
     *
     * @param behavior - Pipeline behavior.
     * @returns Current builder.
     */
    public addBehavior<TRequest, TResponse>(
        behavior: PipelineBehavior<
            TRequest,
            TResponse
        >,
    ): RuntimeBuilder {
        this.behaviors.push(
            behavior as PipelineBehavior<
                unknown,
                unknown
            >,
        );

        return this;
    }

    /**
     * Builds a new independent application executor.
     *
     * @returns Application executor.
     */
    public build(): ApplicationExecutor {
        const registry =
            new DefaultHandlerRegistry();

        for (const registration of this.registrations) {
            registry.register(
                registration.request,
                {
                    kind: "handler",
                    handler: registration.handler,
                },
            );
        }

        const activator =
            new DefaultHandlerActivator();

        const resolver =
            new DefaultHandlerResolver(
                registry,
                activator,
            );

        const pipelineBuilder =
            new DefaultPipelineBuilder(
                this.behaviors,
            );

        const pipelineExecutor =
            new DefaultPipelineExecutor(
                resolver,
                pipelineBuilder,
            );

        return new DefaultApplicationExecutor(
            pipelineExecutor,
        );
    }
}