/**
 * Defines execution coordination for pipeline-based processing.
 *
 * The executor owns execution lifecycle and coordinates
 * handler resolution and pipeline execution.
 */
export interface PipelineExecutor {
    /**
     * Executes an application request.
     *
     * @typeParam TRequest - Request type.
     * @typeParam TResponse - Response type.
     *
     * @param request - Execution request.
     * @returns Execution response.
     */
    execute<TRequest, TResponse>(
        request: TRequest,
    ): Promise<TResponse>;
}