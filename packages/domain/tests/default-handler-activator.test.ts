import { describe, expect, it } from "vitest";

import {
    DefaultHandlerActivator,
    type RequestHandler,
} from "../src";

class CreateUserCommand {
    public constructor(
        public readonly name: string,
    ) {}
}

describe("DefaultHandlerActivator", () => {
    it("activates a handler from a factory", () => {
        const handler: RequestHandler<
            CreateUserCommand,
            string
        > = async (request) => request.name;

        const activator =
            new DefaultHandlerActivator();

        const activated =
            activator.activate(() => handler);

        expect(activated).toBe(handler);
    });

    it("creates a new handler when the factory creates one", () => {
        const firstHandler: RequestHandler<
            CreateUserCommand,
            string
        > = async (request) => request.name;

        const secondHandler: RequestHandler<
            CreateUserCommand,
            string
        > = async (request) => request.name.toUpperCase();

        let calls = 0;

        const activator =
            new DefaultHandlerActivator();

        const activated =
            activator.activate(() => {
                calls += 1;

                return calls === 1
                    ? firstHandler
                    : secondHandler;
            });

        const second =
            activator.activate(() => {
                calls += 1;

                return calls === 1
                    ? firstHandler
                    : secondHandler;
            });

        expect(activated).toBe(firstHandler);
        expect(second).toBe(secondHandler);
        expect(calls).toBe(2);
    });
});