/**
 * Defines execution strategy coordination for pipeline-based processing.
 *
 * The executor coordinates handler resolution and pipeline execution
 * within the application execution lifecycle owned by the application executor.
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