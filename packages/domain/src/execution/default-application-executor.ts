import type { ApplicationExecutor } from "./application-executor";
import type { PipelineExecutor } from "./pipeline-executor";

/**
 * Default application execution entry point.
 *
 * Delegates execution details to the configured pipeline executor.
 */
export class DefaultApplicationExecutor implements ApplicationExecutor {
    constructor(
        private readonly pipelineExecutor: PipelineExecutor,
    ) {}

    /**
     * Executes an application request.
     *
     * @param request - Application request.
     * @returns Execution response.
     */
    execute<TRequest, TResponse>(
        request: TRequest,
    ): Promise<TResponse> {
        return this.pipelineExecutor.execute<TRequest, TResponse>(
            request,
        );
    }
}