import { describe, expect, it } from "vitest";

import { AggregateRoot } from "../src/aggregate-root";
import { Identity } from "../src/foundation";
import { none, Option } from "../src/option";
import { Repository } from "../src/repository";

class TestId extends Identity<string> {
    public static create(value: string): TestId {
        return new TestId(value);
    }

    private constructor(value: string) {
        super(value);
    }
}

class TestAggregate extends AggregateRoot<TestId> {
    public constructor(id: TestId) {
        super(id);
    }
}

class TestRepository extends Repository<TestAggregate, TestId> {
    public async findById(_id: TestId): Promise<Option<TestAggregate>> {
        return none();
    }

    public async save(_aggregate: TestAggregate): Promise<void> {
        // no-op
    }

    public async delete(_id: TestId): Promise<void> {
        // no-op
    }
}

describe("Repository", () => {
    it("can be inherited", () => {
        const repository = new TestRepository();

        expect(repository).toBeInstanceOf(Repository);
    });

    it("returns Option from findById", async () => {
        const repository = new TestRepository();

        const result = await repository.findById(TestId.create("1"));

        expect(result.isNone()).toBe(true);
    });

    it("supports save", async () => {
        const repository = new TestRepository();

        await expect(
            repository.save(new TestAggregate(TestId.create("1"))),
        ).resolves.toBeUndefined();
    });

    it("supports delete", async () => {
        const repository = new TestRepository();

        await expect(
            repository.delete(TestId.create("1")),
        ).resolves.toBeUndefined();
    });
});