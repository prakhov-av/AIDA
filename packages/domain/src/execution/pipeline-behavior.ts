/**
 * Defines a behavior executed as part of a pipeline.
 *
 * Pipeline behaviors allow execution logic to be composed
 * while keeping each responsibility isolated.
 *
 * @typeParam TRequest - Type of the execution request.
 * @typeParam TResponse - Type of the execution response.
 */
export interface PipelineBehavior<TRequest, TResponse> {
    /**
     * Executes the current pipeline behavior.
     *
     * @param request - Current execution request.
     * @param next - Delegate to continue pipeline execution.
     * @returns Execution response.
     */
    execute(
        request: TRequest,
        next: () => Promise<TResponse>,
    ): Promise<TResponse>;
}