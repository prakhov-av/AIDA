import { describe, expect, it } from "vitest";

import { UnitOfWork } from "../src/unit-of-work";

class TestUnitOfWork implements UnitOfWork {
    public committed = false;
    public rolledBack = false;

    public async commit(): Promise<void> {
        this.committed = true;
    }

    public async rollback(): Promise<void> {
        this.rolledBack = true;
    }
}

describe("UnitOfWork", () => {
    it("can be implemented", () => {
        const unitOfWork = new TestUnitOfWork();

        expect(unitOfWork).toBeInstanceOf(TestUnitOfWork);
    });

    it("supports commit", async () => {
        const unitOfWork = new TestUnitOfWork();

        await expect(unitOfWork.commit()).resolves.toBeUndefined();
        expect(unitOfWork.committed).toBe(true);
    });

    it("supports rollback", async () => {
        const unitOfWork = new TestUnitOfWork();

        await expect(unitOfWork.rollback()).resolves.toBeUndefined();
        expect(unitOfWork.rolledBack).toBe(true);
    });
});
