// @ts-ignore

import { describe, expect, it } from "vitest";
import { Identity } from "../src/foundation/identity";

class TestIdentity extends Identity<string> {
    public constructor(value: string) {
        super(value);
    }

    public getValue(): string {
        return this.value;
    }
}

describe("Identity", () => {
    it("stores the provided value", () => {
        const identity = new TestIdentity("user-1");

        expect(identity.getValue()).toBe("user-1");
    });

    it("compares identities by value", () => {
        const left = new TestIdentity("user-1");
        const right = new TestIdentity("user-1");

        expect(left.equals(right)).toBe(true);
    });

    it("does not consider different values equal", () => {
        const left = new TestIdentity("user-1");
        const right = new TestIdentity("user-2");

        expect(left.equals(right)).toBe(false);
    });
});
