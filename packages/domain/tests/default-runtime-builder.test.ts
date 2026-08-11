import { describe, expect, it } from "vitest";

import {
    DefaultRuntimeBuilder,
    type PipelineBehavior,
    type RequestHandler,
} from "../src";

import type { UnitOfWork } from "../src/unit-of-work";

class CreateUserCommand {
    public constructor(
        public readonly name: string,
    ) {}
}

class TestUnitOfWork implements UnitOfWork {
    public commits = 0;
    public rollbacks = 0;

    public async commit(): Promise<void> {
        this.commits += 1;
    }

    public async rollback(): Promise<void> {
        this.rollbacks += 1;
    }
}

describe("DefaultRuntimeBuilder", () => {
    const createUnitOfWork = (): UnitOfWork =>
        new TestUnitOfWork();

    it("builds an application executor", () => {
        const executor =
            new DefaultRuntimeBuilder(
                createUnitOfWork,
            ).build();

        expect(executor).toBeDefined();
    });

    it("registers handlers before build", async () => {
        const handler: RequestHandler<
            CreateUserCommand,
            string
        > = async (request) => request.name;

        const executor =
            new DefaultRuntimeBuilder(
                createUnitOfWork,
            )
                .register(
                    CreateUserCommand,
                    handler,
                )
                .build();

        await expect(
            executor.execute<
                CreateUserCommand,
                string
            >(
                new CreateUserCommand("AIDA"),
            ),
        ).resolves.toBe("AIDA");
    });

    it("registers handler factories before build", async () => {
        let activations = 0;

        const executor =
            new DefaultRuntimeBuilder(
                createUnitOfWork,
            )
                .registerFactory(
                    CreateUserCommand,
                    () => {
                        activations += 1;

                        return async (request) =>
                            request.name;
                    },
                )
                .build();

        await expect(
            executor.execute<
                CreateUserCommand,
                string
            >(
                new CreateUserCommand("AIDA"),
            ),
        ).resolves.toBe("AIDA");

        expect(activations).toBe(1);
    });

    it("executes registered pipeline behaviors", async () => {
        const calls: string[] = [];

        const behavior: PipelineBehavior<
            CreateUserCommand,
            string
        > = {
            execute: async (
                _request,
                next,
            ) => {
                calls.push("before");

                const result =
                    await next();

                calls.push("after");

                return result;
            },
        };

        const handler: RequestHandler<
            CreateUserCommand,
            string
        > = async (request) => {
            calls.push("handler");

            return request.name;
        };

        const executor =
            new DefaultRuntimeBuilder(
                createUnitOfWork,
            )
                .addBehavior(behavior)
                .register(
                    CreateUserCommand,
                    handler,
                )
                .build();

        await executor.execute<
            CreateUserCommand,
            string
        >(
            new CreateUserCommand("AIDA"),
        );

        expect(calls).toEqual([
            "before",
            "handler",
            "after",
        ]);
    });

    it("creates independent executors", async () => {
        const unitOfWorks: TestUnitOfWork[] = [];

        const builder =
            new DefaultRuntimeBuilder(
                () => {
                    const unitOfWork =
                        new TestUnitOfWork();

                    unitOfWorks.push(
                        unitOfWork,
                    );

                    return unitOfWork;
                },
            );

        builder.register(
            CreateUserCommand,
            async (request) => request.name,
        );

        const first = builder.build();
        const second = builder.build();

        expect(unitOfWorks).toHaveLength(2);
        expect(unitOfWorks[0]).not.toBe(
            unitOfWorks[1],
        );

        await expect(
            first.execute<
                CreateUserCommand,
                string
            >(
                new CreateUserCommand("One"),
            ),
        ).resolves.toBe("One");

        await expect(
            second.execute<
                CreateUserCommand,
                string
            >(
                new CreateUserCommand("Two"),
            ),
        ).resolves.toBe("Two");

        expect(unitOfWorks[0]).toBeDefined();
        expect(unitOfWorks[1]).toBeDefined();

        expect(unitOfWorks[0]!.commits).toBe(1);
        expect(unitOfWorks[1]!.commits).toBe(1);
    });

    it("supports fluent configuration", () => {
        const builder =
            new DefaultRuntimeBuilder(
                createUnitOfWork,
            );

        expect(
            builder.register(
                CreateUserCommand,
                async () => "",
            ),
        ).toBe(builder);

        expect(
            builder.registerFactory(
                CreateUserCommand,
                () => async () => "",
            ),
        ).toBe(builder);

        expect(
            builder.addBehavior({
                execute: async (
                    _,
                    next,
                ) => next(),
            }),
        ).toBe(builder);
    });
});