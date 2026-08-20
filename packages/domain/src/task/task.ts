import { AggregateRoot } from "../aggregate-root";
import { DomainError } from "../domain-error";
import { DomainEvent } from "../events";
import { Identity } from "../foundation/identity";

export type TaskLifecycleState =
    | "Created"
    | "Planned"
    | "In Progress"
    | "Review"
    | "Testing"
    | "Completed";

export class TaskId extends Identity<string> {
    public constructor(value: string) {
        super(value);
    }
}

export class RoleId extends Identity<string> {
    public constructor(value: string) {
        super(value);
    }
}

export class TaskCreated extends DomainEvent {
    public constructor(public readonly taskId: TaskId) {
        super();
    }
}

export class TaskAssigned extends DomainEvent {
    public constructor(
        public readonly taskId: TaskId,
        public readonly roleId: RoleId,
    ) {
        super();
    }
}

export class TaskStarted extends DomainEvent {
    public constructor(public readonly taskId: TaskId) {
        super();
    }
}

export class TaskCompleted extends DomainEvent {
    public constructor(public readonly taskId: TaskId) {
        super();
    }
}

class InvalidTaskTransitionError extends DomainError {
    public constructor(
        from: TaskLifecycleState,
        to: TaskLifecycleState,
    ) {
        super(`Invalid Task lifecycle transition: ${from} -> ${to}.`);
    }
}

class TaskRoleRequiredError extends DomainError {
    public constructor() {
        super("A Role must be assigned before the Task can enter Planned.");
    }
}

class TaskRoleAlreadyAssignedError extends DomainError {
    public constructor() {
        super("A Task already has an assigned Role.");
    }
}

export class Task extends AggregateRoot<TaskId> {
    private _state: TaskLifecycleState = "Created";
    private _assignedRoleId: RoleId | undefined;

    public constructor(id: TaskId) {
        super(id);

        this.addDomainEvent(new TaskCreated(id));
    }

    public get state(): TaskLifecycleState {
        return this._state;
    }

    public get assignedRoleId(): RoleId | undefined {
        return this._assignedRoleId;
    }

    public assignRole(roleId: RoleId): void {
        if (this._assignedRoleId !== undefined) {
            throw new TaskRoleAlreadyAssignedError();
        }

        this._assignedRoleId = roleId;
        this.addDomainEvent(new TaskAssigned(this.id, roleId));
    }

    public plan(): void {
        this.transitionTo("Planned");
    }

    public start(): void {
        this.transitionTo("In Progress");
        this.addDomainEvent(new TaskStarted(this.id));
    }

    public submitForReview(): void {
        this.transitionTo("Review");
    }

    public startTesting(): void {
        this.transitionTo("Testing");
    }

    public complete(): void {
        this.transitionTo("Completed");
        this.addDomainEvent(new TaskCompleted(this.id));
    }

    private transitionTo(nextState: TaskLifecycleState): void {
        if (nextState === "Planned" && this._assignedRoleId === undefined) {
            throw new TaskRoleRequiredError();
        }

        if (!this.isAllowedTransition(this._state, nextState)) {
            throw new InvalidTaskTransitionError(this._state, nextState);
        }

        this._state = nextState;
    }

    private isAllowedTransition(
        currentState: TaskLifecycleState,
        nextState: TaskLifecycleState,
    ): boolean {
        return (
            (currentState === "Created" && nextState === "Planned") ||
            (currentState === "Planned" && nextState === "In Progress") ||
            (currentState === "In Progress" && nextState === "Review") ||
            (currentState === "Review" && nextState === "Testing") ||
            (currentState === "Testing" && nextState === "Completed")
        );
    }
}