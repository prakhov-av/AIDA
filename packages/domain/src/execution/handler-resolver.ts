/**
 * Defines handler resolution for application requests.
 *
 * The resolver maps requests to executable handlers.
 */
export interface HandlerResolver {
    /**
     * Resolves an executable handler for a request.
     *
     * @typeParam TRequest - Request type.
     * @typeParam TResponse - Response type.
     *
     * @param request - Application request.
     * @returns Executable handler.
     */
    resolve<TRequest, TResponse>(
        request: TRequest,
    ): (request: TRequest) => Promise<TResponse>;
}