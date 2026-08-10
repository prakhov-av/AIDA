import type {
    HandlerActivationSource,
} from "./handler-activator";
import type {
    HandlerRegistry,
    RequestConstructor,
} from "./handler-registry";

/**
 * Default in-memory implementation of HandlerRegistry.
 */
export class DefaultHandlerRegistry
    implements HandlerRegistry
{
    private readonly handlers = new Map<
        Function,
        HandlerActivationSource<unknown, unknown>
    >();

    /**
     * Registers a handler activation source for the specified request type.
     *
     * @param request - Request constructor.
     * @param source - Handler activation source.
     */
    public register<TRequest, TResponse>(
        request: RequestConstructor<TRequest>,
        source: HandlerActivationSource<
            TRequest,
            TResponse
        >,
    ): void {
        this.handlers.set(
            request,
            source as HandlerActivationSource<
                unknown,
                unknown
            >,
        );
    }

    /**
     * Returns the activation source registered for the specified request type.
     *
     * @param request - Request constructor.
     * @returns Registered activation source or undefined.
     */
    public get<TRequest, TResponse>(
        request: RequestConstructor<TRequest>,
    ):
        | HandlerActivationSource<TRequest, TResponse>
        | undefined {
        return this.handlers.get(request) as
            | HandlerActivationSource<
            TRequest,
            TResponse
        >
            | undefined;
    }
}