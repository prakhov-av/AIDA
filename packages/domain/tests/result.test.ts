import { describe, expect, it } from "vitest";
import { err, ok } from "../src/foundation";

describe("Result", () => {
    it("creates Ok result", () => {
        const result = ok(42);

        expect(result.isOk()).toBe(true);
        expect(result.isErr()).toBe(false);
        expect(result.unwrap()).toBe(42);
    });

    it("creates Err result", () => {
        const result = err("Validation failed");

        expect(result.isOk()).toBe(false);
        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBe("Validation failed");
    });

    it("throws when unwrap() is called on Err", () => {
        const result = err("Validation failed");

        expect(() => result.unwrap()).toThrow();
    });

    it("throws when unwrapErr() is called on Ok", () => {
        const result = ok(42);

        expect(() => result.unwrapErr()).toThrow();
    });
});