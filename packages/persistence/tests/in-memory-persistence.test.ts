import { describe, expect, it } from "vitest";

import {
    AggregateRoot,
    Identity,
} from "@aida/domain";

import { InMemoryPersistence } from "../src";

class TestId extends Identity<string> {
    public static create(value: string): TestId {
        return new TestId(value);
    }

    private constructor(value: string) {
        super(value);
    }
}

class TestAggregate extends AggregateRoot<TestId> {
    public constructor(
        id: TestId,
        public readonly value: string,
    ) {
        super(id);
    }
}

describe("InMemoryPersistence", () => {
    it("creates an isolated persistence boundary", async () => {
        const first = new InMemoryPersistence();
        const second = new InMemoryPersistence();

        const aggregate = new TestAggregate(
            TestId.create("1"),
            "value",
        );

        const firstRepository =
            first.createRepository<
                TestAggregate,
                TestId
            >();

        const secondRepository =
            second.createRepository<
                TestAggregate,
                TestId
            >();

        await firstRepository.save(aggregate);
        await first.unitOfWork.commit();

        expect(
            (
                await firstRepository.findById(
                    aggregate.id,
                )
            ).isSome(),
        ).toBe(true);

        expect(
            (
                await secondRepository.findById(
                    aggregate.id,
                )
            ).isNone(),
        ).toBe(true);

        expect(first.unitOfWork).not.toBe(
            second.unitOfWork,
        );
    });

    it("does not persist changes before commit", async () => {
        const persistence =
            new InMemoryPersistence();

        const repository =
            persistence.createRepository<
                TestAggregate,
                TestId
            >();

        const aggregate = new TestAggregate(
            TestId.create("1"),
            "value",
        );

        await repository.save(aggregate);

        expect(
            (
                await repository.findById(
                    aggregate.id,
                )
            ).isSome(),
        ).toBe(true);

        await persistence.unitOfWork.rollback();

        expect(
            (
                await repository.findById(
                    aggregate.id,
                )
            ).isNone(),
        ).toBe(true);
    });

    it("persists an aggregate after commit", async () => {
        const persistence =
            new InMemoryPersistence();

        const repository =
            persistence.createRepository<
                TestAggregate,
                TestId
            >();

        const aggregate = new TestAggregate(
            TestId.create("1"),
            "value",
        );

        await repository.save(aggregate);
        await persistence.unitOfWork.commit();

        const result =
            await repository.findById(
                aggregate.id,
            );

        expect(result.isSome()).toBe(true);
        expect(result.unwrap()).toBe(aggregate);
    });

    it("rolls back pending changes", async () => {
        const persistence =
            new InMemoryPersistence();

        const repository =
            persistence.createRepository<
                TestAggregate,
                TestId
            >();

        const aggregate = new TestAggregate(
            TestId.create("1"),
            "value",
        );

        await repository.save(aggregate);
        await persistence.unitOfWork.rollback();

        const result =
            await repository.findById(
                aggregate.id,
            );

        expect(result.isNone()).toBe(true);
    });

    it("deletes a persisted aggregate after commit", async () => {
        const persistence =
            new InMemoryPersistence();

        const repository =
            persistence.createRepository<
                TestAggregate,
                TestId
            >();

        const aggregate = new TestAggregate(
            TestId.create("1"),
            "value",
        );

        await repository.save(aggregate);
        await persistence.unitOfWork.commit();

        await repository.delete(aggregate.id);
        await persistence.unitOfWork.commit();

        const result =
            await repository.findById(
                aggregate.id,
            );

        expect(result.isNone()).toBe(true);
    });
});