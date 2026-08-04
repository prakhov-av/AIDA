import { describe, expect, it } from "vitest";

import { Entity } from "../src/entity";
import { Identity } from "../src/foundation";

class TestId extends Identity<string> {
    public static create(value: string): TestId {
        return new TestId(value);
    }

    private constructor(value: string) {
        super(value);
    }
}

class TestEntity extends Entity<TestId> {
    public constructor(id: TestId) {
        super(id);
    }
}

class AnotherEntity extends Entity<TestId> {
    public constructor(id: TestId) {
        super(id);
    }
}

describe("Entity", () => {
    it("exposes identity", () => {
        const id = TestId.create("1");
        const entity = new TestEntity(id);

        expect(entity.id).toBe(id);
    });

    it("is equal to itself", () => {
        const entity = new TestEntity(TestId.create("1"));

        expect(entity.equals(entity)).toBe(true);
    });

    it("is equal when type and identity are equal", () => {
        const left = new TestEntity(TestId.create("1"));
        const right = new TestEntity(TestId.create("1"));

        expect(left.equals(right)).toBe(true);
    });

    it("is not equal when identities differ", () => {
        const left = new TestEntity(TestId.create("1"));
        const right = new TestEntity(TestId.create("2"));

        expect(left.equals(right)).toBe(false);
    });

    it("is not equal when runtime types differ", () => {
        const id = TestId.create("1");

        const left = new TestEntity(id);
        const right = new AnotherEntity(id);

        expect(left.equals(right)).toBe(false);
    });

    it("returns false for null", () => {
        const entity = new TestEntity(TestId.create("1"));

        expect(entity.equals(null)).toBe(false);
    });

    it("returns false for undefined", () => {
        const entity = new TestEntity(TestId.create("1"));

        expect(entity.equals(undefined)).toBe(false);
    });
});