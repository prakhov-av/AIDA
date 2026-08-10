import { describe, expect, it } from "vitest";

import { DefaultApplicationExecutor } from "../src/execution/default-application-executor";
import type { PipelineExecutor } from "../src/execution/pipeline-executor";

describe("DefaultApplicationExecutor", () => {
    it("should delegate request execution to pipeline executor", async () => {
        const request = {
            value: "test",
        };

        let executedRequest: unknown;

        const pipelineExecutor: PipelineExecutor = {
            execute<TRequest, TResponse>(
                receivedRequest: TRequest,
            ): Promise<TResponse> {
                executedRequest = receivedRequest;

                return Promise.resolve({
                    success: true,
                } as TResponse);
            },
        };

        const executor = new DefaultApplicationExecutor(
            pipelineExecutor,
        );

        const result = await executor.execute<
            typeof request,
            { success: boolean }
        >(request);

        expect(executedRequest).toBe(request);
        expect(result.success).toBe(true);
    });

    it("should propagate execution failure from pipeline executor", async () => {
        const request = {
            value: "test",
        };

        const error = new Error("Execution failed");

        const pipelineExecutor: PipelineExecutor = {
            execute<TRequest, TResponse>(
                _request: TRequest,
            ): Promise<TResponse> {
                return Promise.reject(error);
            },
        };

        const executor = new DefaultApplicationExecutor(
            pipelineExecutor,
        );

        await expect(
            executor.execute<typeof request, { success: boolean }>(
                request,
            ),
        ).rejects.toBe(error);
    });
});