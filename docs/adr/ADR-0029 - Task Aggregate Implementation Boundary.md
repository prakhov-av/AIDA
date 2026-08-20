# ADR-0029 — Task Aggregate Implementation Boundary

- **Status:** Accepted
- **Date:** 2026-08-20
- **Decision:** Establish the minimal runtime implementation boundary for the frozen Task Aggregate.

---

## Context

AIDA has established the Task requirements as the authoritative Task behavioral source, the Task Lifecycle Contract as the frozen normative lifecycle contract, and the Task Aggregate Boundary as the frozen domain consistency boundary.

ADR-0028 intentionally deferred concrete runtime implementation decisions.

The repository already provides the generic Domain Foundation required for Aggregate implementation, including:

- `Identity<T>`;
- `Entity<TId>`;
- `AggregateRoot<TId>`;
- `DomainEvent`;
- domain event collection;
- `DomainError`;
- Repository and Unit of Work boundaries.

The remaining architectural question is how to minimally realize the frozen Task Aggregate Boundary using the existing Foundation without expanding the Task domain contract or introducing speculative abstractions.

The implementation must preserve the following frozen boundary:

```text
Task Aggregate
├── identity
├── lifecycle state
└── assigned Role
```

and the accepted lifecycle transitions:

```text
Created → Planned
Planned → In Progress
In Progress → Review
Review → Testing
Testing → Completed
```

The accepted lifecycle Domain Event facts remain:

```text
TaskCreated
TaskAssigned
TaskStarted
TaskCompleted
```

---

## Decision

AIDA will implement the Task Aggregate as a concrete domain aggregate over the existing `AggregateRoot<TId>` Foundation.

The implementation is intentionally minimal and must not introduce new lifecycle semantics, application orchestration, persistence behavior, or infrastructure abstractions.

The implementation boundary is:

```text
Task Aggregate
├── TaskId
├── lifecycle state
├── assigned Role identity
├── explicit lifecycle transitions
├── accepted lifecycle Domain Events
├── invariant protection
└── minimal public behavior API
```

---

## Identity Representation

Task identity is represented by a concrete `TaskId` domain identity based on the existing `Identity<string>` Foundation.

The Task Aggregate therefore uses:

```text
Task extends AggregateRoot<TaskId>
```

No UUID generation, persistence-specific identifier, or additional identity abstraction is introduced by this ADR.

Role reference is represented by a concrete `RoleId` domain identity based on the same `Identity<string>` Foundation.

`RoleId` is an identity reference only. This ADR does not introduce a runtime `Role` entity or aggregate.

---

## Lifecycle State Representation

Task lifecycle state is represented by a strongly typed literal union containing exactly the states established by the Frozen Task Lifecycle Contract:

```text
Created
Planned
In Progress
Review
Testing
Completed
```

No lifecycle enum, lifecycle value object, state machine abstraction, or additional state representation is introduced.

---

## Lifecycle Transition Mechanism

Lifecycle transitions are implemented as explicit behavior on the Task Aggregate.

Only the following transitions are permitted:

```text
Created → Planned
Planned → In Progress
In Progress → Review
Review → Testing
Testing → Completed
```

Invalid transitions are rejected by the Aggregate before mutation occurs.

`Completed` has no valid outgoing transition.

No standalone lifecycle service or state machine abstraction is introduced.

---

## Role Assignment

The Task Aggregate stores an assigned `RoleId` reference.

A Role must be assigned before:

```text
Created → Planned
```

Role assignment is performed through Aggregate behavior so that the invariant cannot be bypassed through direct state mutation.

Role reassignment is not implemented because its semantics remain undefined by the frozen Task contract.

This ADR does not introduce a Role domain implementation.

---

## Construction

Task construction uses the existing Aggregate construction pattern and does not introduce a factory solely for Task creation.

A newly constructed Task begins in:

```text
Created
```

The Task Aggregate records the accepted `TaskCreated` Domain Event during construction.

---

## Domain Events

The Task Aggregate uses the existing `DomainEvent` and `AggregateRoot` domain event collection mechanisms.

The concrete accepted events are:

```text
TaskCreated(taskId)
TaskAssigned(taskId, roleId)
TaskStarted(taskId)
TaskCompleted(taskId)
```

The event payload contains only the domain data required by the accepted event fact.

No event dispatcher, transport, subscription, serialization, event store, or external delivery mechanism is introduced.

The Aggregate remains responsible only for recording domain facts.

---

## Mutation Boundary

The following mutations are exclusively controlled by the Task Aggregate:

- Role assignment;
- lifecycle transition.

External code must not mutate Task lifecycle state or Role assignment directly.

Every mutation must preserve the frozen Task invariants.

No command objects or application services are introduced as part of this boundary.

---

## Error Model

Invalid lifecycle transitions and violated Task invariants are represented through the existing `DomainError` Foundation.

No new general-purpose error abstraction is introduced.

Concrete Task errors remain internal implementation details unless a stable public API requires otherwise.

---

## Public API

The Task public API is limited to behavior required to realize the frozen Aggregate boundary:

- Task construction;
- Task identity access through the existing Aggregate/Entity contract;
- lifecycle state observation;
- assigned Role identity observation;
- Role assignment;
- the five accepted lifecycle transition operations.

No commands, handlers, application services, repositories, persistence APIs, or infrastructure APIs are exposed by the Task module.

---

## Export Boundary

The Task Aggregate is exposed through its own domain module and the existing domain package export chain.

Only the stable Task domain contracts required by consumers are exported.

Internal invariant error implementation and transition validation details remain private to the Task module.

No unrelated package export boundary is changed.

---

## Persistence Boundary

Persistence remains outside the Task Aggregate.

The Aggregate does not own:

- database state;
- persistence mapping;
- repository implementation;
- transaction orchestration;
- serialization infrastructure;
- storage infrastructure.

Existing Repository and Unit of Work contracts remain unchanged.

---

## Explicit Exclusions

This ADR does not introduce:

- new lifecycle states;
- new lifecycle transitions;
- new Task invariants;
- Role reassignment semantics;
- `TaskBlocked`;
- `TaskResumed`;
- `TaskRejected`;
- commands;
- command handlers;
- application services;
- Task repositories;
- persistence models;
- event dispatch infrastructure;
- speculative lifecycle abstractions;
- a runtime Role implementation.

Any future change to these boundaries requires separate architectural evidence and, where necessary, a separate architecture decision.

---

## Relationship to ADR-0028

ADR-0028 established the Task Aggregate as the domain consistency boundary and intentionally deferred concrete implementation.

This ADR defines the minimal runtime implementation required to realize that frozen boundary.

Therefore:

```text
ADR-0026
    ↓
Authoritative Task Requirements
    ↓
ADR-0027
    ↓
Frozen Task Lifecycle Contract
    ↓
ADR-0028
    ↓
Frozen Task Aggregate Boundary
    ↓
ADR-0029
    ↓
Task Aggregate Implementation
```

ADR-0029 does not modify the Task Requirements, Task Lifecycle Contract, or Task Aggregate Boundary.
