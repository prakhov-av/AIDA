import { describe, expect, it } from "vitest";

import {
    RoleId,
    Task,
    TaskAssigned,
    TaskCompleted,
    TaskCreated,
    TaskId,
    TaskStarted,
} from "../src";

describe("Task", () => {
    it("starts in Created and records TaskCreated", () => {
        const taskId = new TaskId("task-1");
        const task = new Task(taskId);

        expect(task.state).toBe("Created");
        expect(task.assignedRoleId).toBeUndefined();

        const events = task.pullDomainEvents();

        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(TaskCreated);
        expect((events[0] as TaskCreated).taskId).toBe(taskId);
    });

    it("assigns a Role and records TaskAssigned", () => {
        const taskId = new TaskId("task-1");
        const roleId = new RoleId("role-1");
        const task = new Task(taskId);

        task.assignRole(roleId);

        expect(task.assignedRoleId).toBe(roleId);

        const events = task.pullDomainEvents();

        expect(events).toHaveLength(2);
        expect(events[0]).toBeInstanceOf(TaskCreated);
        expect(events[1]).toBeInstanceOf(TaskAssigned);
        expect((events[1] as TaskAssigned).taskId).toBe(taskId);
        expect((events[1] as TaskAssigned).roleId).toBe(roleId);
    });

    it("requires a Role before planning", () => {
        const task = new Task(new TaskId("task-1"));

        task.pullDomainEvents();

        expect(() => task.plan()).toThrow(
            "A Role must be assigned before the Task can enter Planned.",
        );
    });

    it("follows the frozen lifecycle", () => {
        const task = new Task(new TaskId("task-1"));

        task.assignRole(new RoleId("role-1"));
        task.plan();
        task.start();
        task.submitForReview();
        task.startTesting();
        task.complete();

        expect(task.state).toBe("Completed");

        const events = task.pullDomainEvents();

        expect(events).toHaveLength(4);
        expect(events[0]).toBeInstanceOf(TaskCreated);
        expect(events[1]).toBeInstanceOf(TaskAssigned);
        expect(events[2]).toBeInstanceOf(TaskStarted);
        expect(events[3]).toBeInstanceOf(TaskCompleted);
    });

    it("rejects invalid lifecycle transitions", () => {
        const task = new Task(new TaskId("task-1"));

        task.assignRole(new RoleId("role-1"));

        expect(() => task.start()).toThrow(
            "Invalid Task lifecycle transition: Created -> In Progress.",
        );
    });

    it("rejects transitions from Completed", () => {
        const task = new Task(new TaskId("task-1"));

        task.assignRole(new RoleId("role-1"));
        task.plan();
        task.start();
        task.submitForReview();
        task.startTesting();
        task.complete();

        expect(() => task.complete()).toThrow(
            "Invalid Task lifecycle transition: Completed -> Completed.",
        );
    });

    it("does not allow a second Role assignment", () => {
        const task = new Task(new TaskId("task-1"));

        task.assignRole(new RoleId("role-1"));

        expect(() => task.assignRole(new RoleId("role-2"))).toThrow(
            "A Task already has an assigned Role.",
        );
    });
});