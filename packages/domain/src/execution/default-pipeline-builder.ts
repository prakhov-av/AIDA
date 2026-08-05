import type { PipelineBehavior } from "./pipeline-behavior";
import type { PipelineBuilder } from "./pipeline-builder";

/**
 * Default implementation of pipeline composition.
 *
 * The builder creates an execution delegate
 * by composing configured pipeline behaviors.
 */
export class DefaultPipelineBuilder implements PipelineBuilder {
    private readonly behaviors: readonly PipelineBehavior<unknown, unknown>[];

    constructor(
        behaviors: readonly PipelineBehavior<unknown, unknown>[],
    ) {
        this.behaviors = behaviors;
    }

    /**
     * Builds a pipeline execution delegate.
     *
     * @param terminal - Final execution stage.
     * @returns Composed pipeline delegate.
     */
    build<TRequest, TResponse>(
        terminal: (request: TRequest) => Promise<TResponse>,
    ): (request: TRequest) => Promise<TResponse> {
        return (request: TRequest): Promise<TResponse> => {
            let next = terminal;

            for (let index = this.behaviors.length - 1; index >= 0; index -= 1) {
                const behavior = this.behaviors[index] as PipelineBehavior<
                    TRequest,
                    TResponse
                >;

                const currentNext = next;

                next = (currentRequest: TRequest): Promise<TResponse> =>
                    behavior.execute(
                        currentRequest,
                        () => currentNext(currentRequest),
                    );
            }

            return next(request);
        };
    }
}