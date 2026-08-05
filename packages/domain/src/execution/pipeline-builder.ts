/**
 * Defines pipeline composition.
 *
 * The builder creates an execution delegate
 * from configured pipeline behaviors.
 */
export interface PipelineBuilder {
    build<TRequest, TResponse>(
        terminal: (request: TRequest) => Promise<TResponse>,
    ): (request: TRequest) => Promise<TResponse>;
}