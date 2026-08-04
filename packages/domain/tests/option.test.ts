import { describe, expect, it } from "vitest";

import { none, some } from "../src/option";

describe("Option", () => {
    it("creates Some option", () => {
        const option = some(42);

        expect(option.isSome()).toBe(true);
        expect(option.isNone()).toBe(false);
    });

    it("creates None option", () => {
        const option = none<number>();

        expect(option.isSome()).toBe(false);
        expect(option.isNone()).toBe(true);
    });

    it("unwraps Some value", () => {
        const option = some(42);

        expect(option.unwrap()).toBe(42);
    });

    it("throws when unwrapping None", () => {
        const option = none<number>();

        expect(() => option.unwrap()).toThrow("Cannot unwrap None.");
    });

    it("returns value from unwrapOr for Some", () => {
        const option = some(42);

        expect(option.unwrapOr(100)).toBe(42);
    });

    it("returns default value from unwrapOr for None", () => {
        const option = none<number>();

        expect(option.unwrapOr(100)).toBe(100);
    });

    it("maps Some value", () => {
        const option = some(21);

        const mapped = option.map((value) => value * 2);

        expect(mapped.isSome()).toBe(true);
        expect(mapped.unwrap()).toBe(42);
    });

    it("does not map None", () => {
        const option = none<number>();

        const mapped = option.map((value) => value * 2);

        expect(mapped.isNone()).toBe(true);
    });
});