import { describe, expect, it } from "vitest";

import { DefaultApplicationExecutor } from "../src/execution/default-application-executor";
import type { PipelineExecutor } from "../src/execution/pipeline-executor";
import type { UnitOfWork } from "../src/unit-of-work";

describe("DefaultApplicationExecutor", () => {
    it("delegates request execution to pipeline executor", async () => {
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

        const unitOfWork: UnitOfWork = {
            commit: async () => {},
            rollback: async () => {},
        };

        const executor = new DefaultApplicationExecutor(
            pipelineExecutor,
            unitOfWork,
        );

        const result = await executor.execute<
            typeof request,
            { success: boolean }
        >(request);

        expect(executedRequest).toBe(request);
        expect(result.success).toBe(true);
    });

    it("commits after successful execution", async () => {
        const calls: string[] = [];

        const pipelineExecutor: PipelineExecutor = {
            execute<TRequest, TResponse>(
                _request: TRequest,
            ): Promise<TResponse> {
                calls.push("execute");

                return Promise.resolve(
                    "response" as TResponse,
                );
            },
        };

        const unitOfWork: UnitOfWork = {
            commit: async () => {
                calls.push("commit");
            },
            rollback: async () => {
                calls.push("rollback");
            },
        };

        const executor = new DefaultApplicationExecutor(
            pipelineExecutor,
            unitOfWork,
        );

        await executor.execute<unknown, string>({});

        expect(calls).toEqual([
            "execute",
            "commit",
        ]);
    });

    it("rolls back when execution fails", async () => {
        const failure = new Error("Execution failed");

        let rolledBack = false;

        const pipelineExecutor: PipelineExecutor = {
            execute<TRequest, TResponse>(
                _request: TRequest,
            ): Promise<TResponse> {
                return Promise.reject(failure);
            },
        };

        const unitOfWork: UnitOfWork = {
            commit: async () => {},
            rollback: async () => {
                rolledBack = true;
            },
        };

        const executor = new DefaultApplicationExecutor(
            pipelineExecutor,
            unitOfWork,
        );

        await expect(
            executor.execute<unknown, unknown>({}),
        ).rejects.toBe(failure);

        expect(rolledBack).toBe(true);
    });

    it("rolls back when commit fails", async () => {
        const commitFailure = new Error("Commit failed");

        let rolledBack = false;

        const pipelineExecutor: PipelineExecutor = {
            execute<TRequest, TResponse>(
                _request: TRequest,
            ): Promise<TResponse> {
                return Promise.resolve(
                    "response" as TResponse,
                );
            },
        };

        const unitOfWork: UnitOfWork = {
            commit: async () => {
                throw commitFailure;
            },
            rollback: async () => {
                rolledBack = true;
            },
        };

        const executor = new DefaultApplicationExecutor(
            pipelineExecutor,
            unitOfWork,
        );

        await expect(
            executor.execute<unknown, string>({}),
        ).rejects.toBe(commitFailure);

        expect(rolledBack).toBe(true);
    });
});