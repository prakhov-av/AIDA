/**
 * Defines the application execution entry point.
 *
 * The executor coordinates application request execution
 * without depending on concrete request types.
 */
export interface ApplicationExecutor {
    /**
     * Executes an application request.
     *
     * @typeParam TRequest - Request type.
     * @typeParam TResponse - Response type.
     *
     * @param request - Application request.
     * @returns Execution response.
     */
    execute<TRequest, TResponse>(
        request: TRequest,
    ): Promise<TResponse>;
}