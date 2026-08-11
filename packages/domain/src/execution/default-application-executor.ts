import type { UnitOfWork } from "../unit-of-work";
import type { ApplicationExecutor } from "./application-executor";
import type { PipelineExecutor } from "./pipeline-executor";

/**
 * Default application execution entry point.
 *
 * Coordinates application execution and persistence transaction outcome.
 */
export class DefaultApplicationExecutor
    implements ApplicationExecutor
{
    constructor(
        private readonly pipelineExecutor: PipelineExecutor,
        private readonly unitOfWork: UnitOfWork,
    ) {}

    /**
     * Executes an application request.
     *
     * @param request - Application request.
     * @returns Execution response.
     */
    async execute<TRequest, TResponse>(
        request: TRequest,
    ): Promise<TResponse> {
        try {
            const response =
                await this.pipelineExecutor.execute<
                    TRequest,
                    TResponse
                >(request);

            await this.unitOfWork.commit();

            return response;
        } catch (error) {
            await this.unitOfWork.rollback();

            throw error;
        }
    }
}