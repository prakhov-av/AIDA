import { describe, expect, it } from "vitest";

import {
    DefaultHandlerActivator,
    DefaultHandlerRegistry,
    DefaultHandlerResolver,
    HandlerNotFoundError,
    type RequestHandler,
} from "../src";

class CreateUserCommand {
    public constructor(
        public readonly name: string,
    ) {}
}

class DeleteUserCommand {
    public constructor(
        public readonly id: string,
    ) {}
}

describe("DefaultHandlerResolver", () => {
    it("resolves a registered handler", () => {
        const registry =
            new DefaultHandlerRegistry();

        const handler: RequestHandler<
            CreateUserCommand,
            string
        > = async (request) => request.name;

        registry.register(CreateUserCommand, {
            kind: "handler",
            handler,
        });

        const resolver =
            new DefaultHandlerResolver(
                registry,
                new DefaultHandlerActivator(),
            );

        expect(
            resolver.resolve<
                CreateUserCommand,
                string
            >(
                new CreateUserCommand("AIDA"),
            ),
        ).toBe(handler);
    });

    it("throws HandlerNotFoundError when handler is not registered", () => {
        const registry =
            new DefaultHandlerRegistry();

        const resolver =
            new DefaultHandlerResolver(
                registry,
                new DefaultHandlerActivator(),
            );

        expect(() =>
            resolver.resolve<
                DeleteUserCommand,
                void
            >(
                new DeleteUserCommand("1"),
            ),
        ).toThrow(HandlerNotFoundError);
    });

    it("resolves handlers independently", () => {
        const registry =
            new DefaultHandlerRegistry();

        const createHandler: RequestHandler<
            CreateUserCommand,
            string
        > = async (request) => request.name;

        const deleteHandler: RequestHandler<
            DeleteUserCommand,
            void
        > = async () => {};

        registry.register(
            CreateUserCommand,
            {
                kind: "handler",
                handler: createHandler,
            },
        );

        registry.register(
            DeleteUserCommand,
            {
                kind: "handler",
                handler: deleteHandler,
            },
        );

        const resolver =
            new DefaultHandlerResolver(
                registry,
                new DefaultHandlerActivator(),
            );

        expect(
            resolver.resolve<
                CreateUserCommand,
                string
            >(
                new CreateUserCommand("AIDA"),
            ),
        ).toBe(createHandler);

        expect(
            resolver.resolve<
                DeleteUserCommand,
                void
            >(
                new DeleteUserCommand("1"),
            ),
        ).toBe(deleteHandler);
    });

    it("activates a handler from a factory", () => {
        const registry =
            new DefaultHandlerRegistry();

        const handler: RequestHandler<
            CreateUserCommand,
            string
        > = async (request) => request.name;

        registry.register(
            CreateUserCommand,
            {
                kind: "factory",
                factory: () => handler,
            },
        );

        const resolver =
            new DefaultHandlerResolver(
                registry,
                new DefaultHandlerActivator(),
            );

        expect(
            resolver.resolve<
                CreateUserCommand,
                string
            >(
                new CreateUserCommand("AIDA"),
            ),
        ).toBe(handler);
    });
});