import { describe, expect, it } from "vitest";

import { deepEqual } from "../src/value-object/deep-equal";

describe("deepEqual", () => {
    it("returns true for identical primitive values", () => {
        expect(deepEqual(42, 42)).toBe(true);
        expect(deepEqual("a", "a")).toBe(true);
        expect(deepEqual(true, true)).toBe(true);
    });

    it("returns false for different primitive values", () => {
        expect(deepEqual(1, 2)).toBe(false);
        expect(deepEqual("a", "b")).toBe(false);
        expect(deepEqual(true, false)).toBe(false);
    });

    it("returns true for equal objects", () => {
        expect(
            deepEqual(
                { value: 42 },
                { value: 42 },
            ),
        ).toBe(true);
    });

    it("returns false for different objects", () => {
        expect(
            deepEqual(
                { value: 1 },
                { value: 2 },
            ),
        ).toBe(false);
    });

    it("returns true for nested objects", () => {
        expect(
            deepEqual(
                {
                    value: {
                        nested: 42,
                    },
                },
                {
                    value: {
                        nested: 42,
                    },
                },
            ),
        ).toBe(true);
    });

    it("returns true for equal arrays", () => {
        expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it("returns false for different arrays", () => {
        expect(deepEqual([1, 2, 3], [1, 2])).toBe(false);
    });

    it("returns false for object and array", () => {
        expect(deepEqual({}, [])).toBe(false);
    });

    it("returns false for null and object", () => {
        expect(deepEqual(null, {})).toBe(false);
    });
});