import type { HandlerResolver } from "./handler-resolver";
import type { PipelineBuilder } from "./pipeline-builder";
import type { PipelineExecutor } from "./pipeline-executor";

/**
 * Default implementation of pipeline execution coordination.
 *
 * Resolves handlers and builds execution pipelines.
 */
export class DefaultPipelineExecutor implements PipelineExecutor {
    constructor(
        private readonly handlerResolver: HandlerResolver,
        private readonly pipelineBuilder: PipelineBuilder,
    ) {}

    /**
     * Executes an application request through the pipeline.
     *
     * @param request - Application request.
     * @returns Execution response.
     */
    execute<TRequest, TResponse>(
        request: TRequest,
    ): Promise<TResponse> {
        const handler =
            this.handlerResolver.resolve<TRequest, TResponse>(
                request,
            );

        const pipeline =
            this.pipelineBuilder.build<TRequest, TResponse>(
                handler,
            );

        return pipeline(request);
    }
}