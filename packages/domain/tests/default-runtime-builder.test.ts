import { describe, expect, it } from "vitest";

import {
    DefaultRuntimeBuilder,
    type PipelineBehavior,
    type RequestHandler,
} from "../src";

class CreateUserCommand {
    public constructor(
        public readonly name: string,
    ) {}
}

describe("DefaultRuntimeBuilder", () => {
    it("builds an application executor", () => {
        const executor =
            new DefaultRuntimeBuilder().build();

        expect(executor).toBeDefined();
    });

    it("registers handlers before build", async () => {
        const handler: RequestHandler<
            CreateUserCommand,
            string
        > = async (request) => request.name;

        const executor =
            new DefaultRuntimeBuilder()
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
            new DefaultRuntimeBuilder()
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
            new DefaultRuntimeBuilder()
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
        const builder =
            new DefaultRuntimeBuilder();

        builder.register(
            CreateUserCommand,
            async (request) => request.name,
        );

        const first = builder.build();
        const second = builder.build();

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
    });

    it("supports fluent configuration", () => {
        const builder =
            new DefaultRuntimeBuilder();

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