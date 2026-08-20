# ADR-0028 — Task Aggregate Boundary

- **Status:** Accepted
- **Date:** 2026-08-20
- **Decision:** Task Aggregate Boundary

---

## Context

AIDA has established the Task requirements as the authoritative Product / Domain requirements source and has frozen the Task Lifecycle Contract as the normative lifecycle boundary.

The next architectural boundary is the Task Aggregate.

The repository already provides the generic Domain Foundation required for Aggregate Roots, including:

- `Identity<T>`;
- `Entity<TId>`;
- `AggregateRoot<TId>`;
- domain event recording;
- Repository and Unit of Work boundaries.

The Task Aggregate must therefore be defined as a domain consistency boundary without introducing runtime implementation, application orchestration, persistence behavior, or new Product / Domain requirements.

---

## Decision

The AIDA Task Aggregate is the consistency boundary responsible for maintaining the validity of a Task according to the authoritative Task Requirements and the Frozen Task Lifecycle Contract.

The Task Aggregate owns:

1. Task-specific identity boundary;
2. lifecycle state;
3. lifecycle transition validity;
4. the accepted Role assignment invariant;
5. the accepted lifecycle invariants;
6. the accepted Task lifecycle domain event facts.

The Aggregate must prevent external mutation from bypassing these invariants.

---

## Aggregate State Boundary

The minimum Task Aggregate state is:

```text
Task Aggregate
├── identity
├── lifecycle state
└── assigned Role
```

No additional Task state is introduced by this ADR.

---

## Lifecycle Ownership

The Task Aggregate owns the lifecycle state and transition rules defined by the Frozen Task Lifecycle Contract.

The lifecycle states are:

```text
Created
Planned
In Progress
Review
Testing
Completed
```

The allowed transitions are:

```text
Created → Planned
Planned → In Progress
In Progress → Review
Review → Testing
Testing → Completed
```

All other transitions are invalid.

`Completed` is the only terminal state.

This ADR does not introduce or modify lifecycle states or transitions.

---

## Role Ownership

The Task Aggregate owns the accepted Task Role invariant:

```text
A Task is performed by exactly one Role.
```

A Role must be assigned before:

```text
Created → Planned
```

Role reassignment semantics remain undefined.

This ADR does not introduce reassignment behavior.

---

## Domain Events

The Task Aggregate is the domain consistency boundary from which accepted Task lifecycle facts originate.

The accepted lifecycle event facts are:

```text
TaskCreated
TaskAssigned
TaskStarted
TaskCompleted
```

These are domain facts, not commands or application API definitions.

Event dispatch, subscription, transport, and external delivery remain outside the Aggregate boundary.

The following remain outside the current lifecycle contract:

```text
TaskBlocked
TaskResumed
TaskRejected
```

---

## Invariants

The Task Aggregate must protect the following already accepted invariants:

1. A Task is always in exactly one lifecycle state.
2. A Task may transition only through an allowed lifecycle transition.
3. `Completed` has no allowed outgoing lifecycle transition.
4. A Task is performed by exactly one Role.
5. A Role must be assigned before `Created → Planned`.

These invariants originate from the authoritative requirements and Frozen Task Lifecycle Contract.

This ADR does not create new Task invariants.

---

## External Mutation Boundary

Any change affecting lifecycle state, Role assignment, or another accepted Aggregate invariant must pass through the Task Aggregate boundary.

External consumers must not directly mutate Aggregate state in a way that bypasses invariant protection.

This ADR does not define command objects, command handlers, application services, factories, or concrete runtime methods.

---

## Persistence Boundary

Persistence is outside the Task Aggregate boundary.

The Aggregate owns domain consistency, while Repository and persistence components own storage concerns.

The Task Aggregate therefore does not own:

- database state;
- persistence mapping;
- repository implementation;
- transaction orchestration;
- serialization;
- storage infrastructure.

No Task repository or persistence model is introduced by this ADR.

---

## Implementation Boundary

This ADR intentionally does not define:

- a TypeScript class;
- a concrete `TaskId` type;
- a factory;
- command objects;
- command handlers;
- application services;
- lifecycle value objects;
- repository APIs;
- persistence schemas;
- event dispatch mechanisms.

Concrete implementation must preserve the boundary established by this ADR.

---

## Explicit Exclusions

The Task Aggregate Boundary does not introduce:

- new lifecycle states;
- new lifecycle transitions;
- new Task invariants;
- Role reassignment semantics;
- commands;
- application services;
- repositories;
- persistence models;
- event dispatchers;
- infrastructure services;
- runtime lifecycle abstractions;
- concrete identity representation.

Any future change to these boundaries requires separate evidence and, where applicable, a separate architecture decision.

---

## Consequences

### Positive

- Task lifecycle consistency has a single domain owner.
- Accepted Task invariants cannot be delegated implicitly to application or persistence layers.
- The frozen lifecycle contract remains authoritative.
- The Aggregate boundary remains independent from persistence and application orchestration.
- Future implementation has a stable architectural constraint.
- Concrete implementation choices remain deliberately deferred.

### Negative

- The Task Aggregate cannot yet be implemented without a separate implementation stage.
- Concrete identity and runtime API decisions remain unresolved.
- Role reassignment remains intentionally unspecified.

These are deliberate consequences of keeping the architecture minimal and stable.

---

## Relationship to Existing Architecture

The resulting architecture is:

```text
Authoritative Task Requirements
        ↓
Frozen Task Lifecycle Contract
        ↓
Frozen Task Aggregate Boundary
        ↓
Future Task Implementation
```

The Aggregate is implemented on top of the existing Domain Foundation:

```text
Identity
   ↓
Entity
   ↓
AggregateRoot
   ↓
Task Aggregate
```

Persistence remains outside the Aggregate:

```text
Task Aggregate
      ↓
Repository / Unit of Work
      ↓
Persistence
```

---

## Rejected Alternatives

### Lifecycle owned outside the Aggregate

Rejected because lifecycle transition validity is part of Task consistency and must not be bypassable by external orchestration.

### Separate lifecycle service

Rejected because the frozen lifecycle contract defines Task behavior that belongs to the Task consistency boundary. A separate service would unnecessarily split that boundary.

### Persistence-owned lifecycle validation

Rejected because persistence is outside the domain consistency boundary.

### Defining Role reassignment behavior now

Rejected because the Frozen Task Lifecycle Contract explicitly leaves reassignment semantics undefined.

### Defining a concrete Task identity representation now

Rejected because the repository provides the generic identity foundation but no accepted Task-specific identity representation.

---

## Status

This ADR records the accepted Task Aggregate Boundary.

The corresponding architecture artifact is:

`docs/architecture/task-aggregate-boundary.md`

The architecture artifact is Frozen.

Task Aggregate runtime implementation remains deferred.
