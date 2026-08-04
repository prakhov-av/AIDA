import { describe, expect, it } from "vitest";

import { DomainError } from "../src/domain-error";

class TestError extends DomainError {
    public constructor(message = "Test error", options?: ErrorOptions) {
        super(message, options);
    }
}

describe("DomainError", () => {
    it("extends Error", () => {
        const error = new TestError();

        expect(error).toBeInstanceOf(Error);
    });

    it("preserves DomainError inheritance", () => {
        const error = new TestError();

        expect(error).toBeInstanceOf(DomainError);
    });

    it("preserves derived type", () => {
        const error = new TestError();

        expect(error).toBeInstanceOf(TestError);
    });

    it("sets the error name", () => {
        const error = new TestError();

        expect(error.name).toBe("TestError");
    });

    it("preserves the message", () => {
        const error = new TestError("Something went wrong.");

        expect(error.message).toBe("Something went wrong.");
    });

    it("preserves cause", () => {
        const cause = new Error("Root cause");
        const error = new TestError("Failure", { cause });

        expect(error.cause).toBe(cause);
    });
});