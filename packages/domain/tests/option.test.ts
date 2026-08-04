// @ts-ignore

import { describe, expect, it } from "vitest";
import { none, some } from "../src/foundation";

describe("Option", () => {
    it("creates Some option", () => {
        const option = some(42);

        expect(option.isSome()).toBe(true);
        expect(option.isNone()).toBe(false);
        expect(option.unwrap()).toBe(42);
    });

    it("creates None option", () => {
        const option = none<number>();

        expect(option.isSome()).toBe(false);
        expect(option.isNone()).toBe(true);
    });

    it("throws when unwrap() is called on None", () => {
        const option = none<number>();

        expect(() => option.unwrap()).toThrow();
    });

    it("returns default value for None", () => {
        const option = none<number>();

        expect(option.unwrapOr(42)).toBe(42);
    });

    it("returns contained value for Some", () => {
        const option = some(42);

        expect(option.unwrapOr(0)).toBe(42);
    });

    it("maps Some value", () => {
        const option = some("AIDA").map((value) => value.length);

        expect(option.isSome()).toBe(true);
        expect(option.unwrap()).toBe(4);
    });

    it("does not map None value", () => {
        const option = none<string>().map((value) => value.length);

        expect(option.isNone()).toBe(true);
    });
});