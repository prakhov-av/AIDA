import type { UnitOfWork } from "../unit-of-work";
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
    HandlerActivationSource,
    HandlerFactory,
} from "./handler-activator";
import type {
    RequestConstructor,
    RequestHandler,
} from "./handler-registry";
import type { RuntimeBuilder } from "./runtime-builder";

interface Registration {
    readonly request: RequestConstructor<unknown>;
    readonly source: HandlerActivationSource<
        unknown,
        unknown
    >;
}

type UnitOfWorkFactory = () => UnitOfWork;

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

    public constructor(
        private readonly unitOfWorkFactory: UnitOfWorkFactory,
    ) {}

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
            source: {
                kind: "handler",
                handler:
                    handler as RequestHandler<
                        unknown,
                        unknown
                    >,
            },
        });

        return this;
    }

    /**
     * Registers a request handler factory.
     *
     * @param request - Request constructor.
     * @param factory - Handler factory.
     * @returns Current builder.
     */
    public registerFactory<TRequest, TResponse>(
        request: RequestConstructor<TRequest>,
        factory: HandlerFactory<TRequest, TResponse>,
    ): RuntimeBuilder {
        this.registrations.push({
            request:
                request as RequestConstructor<unknown>,
            source: {
                kind: "factory",
                factory:
                    factory as HandlerFactory<
                        unknown,
                        unknown
                    >,
            },
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
                registration.source,
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
            this.unitOfWorkFactory(),
        );
    }
}