import { describe, expect, it } from "vitest";

import {
    DefaultHandlerRegistry,
    type HandlerActivationSource,
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

describe("DefaultHandlerRegistry", () => {
    it("registers and resolves a handler", () => {
        const registry =
            new DefaultHandlerRegistry();

        const handler: RequestHandler<
            CreateUserCommand,
            void
        > = async () => {};

        const source: HandlerActivationSource<
            CreateUserCommand,
            void
        > = {
            kind: "handler",
            handler,
        };

        registry.register(
            CreateUserCommand,
            source,
        );

        expect(
            registry.get(CreateUserCommand),
        ).toBe(source);
    });

    it("returns undefined for unknown request", () => {
        const registry =
            new DefaultHandlerRegistry();

        expect(
            registry.get(CreateUserCommand),
        ).toBeUndefined();
    });

    it("replaces an existing registration", () => {
        const registry =
            new DefaultHandlerRegistry();

        const first: HandlerActivationSource<
            CreateUserCommand,
            void
        > = {
            kind: "handler",
            handler: async () => {},
        };

        const second: HandlerActivationSource<
            CreateUserCommand,
            void
        > = {
            kind: "handler",
            handler: async () => {},
        };

        registry.register(
            CreateUserCommand,
            first,
        );

        registry.register(
            CreateUserCommand,
            second,
        );

        expect(
            registry.get(CreateUserCommand),
        ).toBe(second);
    });

    it("stores handlers independently", () => {
        const registry =
            new DefaultHandlerRegistry();

        const createHandler: RequestHandler<
            CreateUserCommand,
            void
        > = async () => {};

        const deleteHandler: RequestHandler<
            DeleteUserCommand,
            void
        > = async () => {};

        const createSource:
            HandlerActivationSource<
                CreateUserCommand,
                void
            > = {
            kind: "handler",
            handler: createHandler,
        };

        const deleteSource:
            HandlerActivationSource<
                DeleteUserCommand,
                void
            > = {
            kind: "handler",
            handler: deleteHandler,
        };

        registry.register(
            CreateUserCommand,
            createSource,
        );

        registry.register(
            DeleteUserCommand,
            deleteSource,
        );

        expect(
            registry.get(CreateUserCommand),
        ).toBe(createSource);

        expect(
            registry.get(DeleteUserCommand),
        ).toBe(deleteSource);
    });
});