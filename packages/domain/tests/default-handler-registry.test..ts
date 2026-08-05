import { describe, expect, it } from "vitest";

import {
    DefaultHandlerRegistry,
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
        const registry = new DefaultHandlerRegistry();

        const handler: RequestHandler<CreateUserCommand, void> =
            async () => {};

        registry.register(CreateUserCommand, handler);

        expect(
            registry.get(CreateUserCommand),
        ).toBe(handler);
    });

    it("returns undefined for unknown request", () => {
        const registry = new DefaultHandlerRegistry();

        expect(
            registry.get(CreateUserCommand),
        ).toBeUndefined();
    });

    it("replaces an existing registration", () => {
        const registry = new DefaultHandlerRegistry();

        const first: RequestHandler<CreateUserCommand, void> =
            async () => {};

        const second: RequestHandler<CreateUserCommand, void> =
            async () => {};

        registry.register(CreateUserCommand, first);
        registry.register(CreateUserCommand, second);

        expect(
            registry.get(CreateUserCommand),
        ).toBe(second);
    });

    it("stores handlers independently", () => {
        const registry = new DefaultHandlerRegistry();

        const createHandler: RequestHandler<
            CreateUserCommand,
            void
        > = async () => {};

        const deleteHandler: RequestHandler<
            DeleteUserCommand,
            void
        > = async () => {};

        registry.register(
            CreateUserCommand,
            createHandler,
        );

        registry.register(
            DeleteUserCommand,
            deleteHandler,
        );

        expect(
            registry.get(CreateUserCommand),
        ).toBe(createHandler);

        expect(
            registry.get(DeleteUserCommand),
        ).toBe(deleteHandler);
    });
});