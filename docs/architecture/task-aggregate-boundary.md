# Task Aggregate Boundary

**Version:** 0.1

**Status:** Frozen

---

# Purpose

This document defines the architectural boundary of the AIDA Task Aggregate.

The Task Aggregate is the consistency boundary responsible for realizing the frozen Task Lifecycle Contract without redefining its normative behavior.

The Task Aggregate is a domain boundary, not a persistence, application, infrastructure, or runtime orchestration boundary.

---

# Authority

The authority chain is:

```text
Authoritative Task Requirements
        ↓
Task Lifecycle Contract
        ↓
Task Aggregate Boundary
        ↓
Implementation
```

The authoritative Task requirements remain defined in:

`docs/requirements/task-requirements.md`

The normative Task lifecycle behavior remains defined in:

`docs/architecture/task-lifecycle-contract.md`

The Task Aggregate must preserve the rules established by the frozen lifecycle contract.

---

# Aggregate Responsibility

The Task Aggregate is the consistency boundary for Task state and behavior.

It owns the invariants required to keep a Task valid according to the authoritative requirements and frozen lifecycle contract.

The Aggregate must prevent external mutation from bypassing those invariants.

The Aggregate does not redefine Product / Domain requirements.

---

# Identity Boundary

A Task Aggregate has a stable Task-specific identity.

The repository provides the generic `Identity<T>` and `Entity<TId>` foundation used by Aggregate Roots.

This document does not define the concrete Task identity representation.

In particular, it does not prescribe:

- a UUID representation;
- a string representation;
- a concrete `TaskId` implementation;
- a database identifier;
- a serialization format.

The concrete identity representation is an implementation concern and must preserve the stable identity boundary of the Aggregate.

---

# Aggregate State Boundary

The minimum Task state within the Aggregate boundary is:

```text
Task Aggregate
├── identity
├── lifecycle state
└── assigned Role
```

No additional Task state is introduced by this architectural decision.

Future state may only be added when supported by an accepted domain requirement or a separate architectural decision.

---

# Lifecycle Ownership

The Task Aggregate owns the Task lifecycle state.

A Task must always have exactly one lifecycle state.

The complete lifecycle state set is defined exclusively by the frozen Task Lifecycle Contract:

```text
Created
Planned
In Progress
Review
Testing
Completed
```

The Aggregate owns enforcement of the allowed lifecycle transitions:

```text
Created → Planned
Planned → In Progress
In Progress → Review
Review → Testing
Testing → Completed
```

Transitions outside this set are invalid.

The Aggregate must not introduce additional lifecycle states or transitions.

---

# Terminal State

The Task Aggregate owns enforcement of the terminal lifecycle invariant.

`Completed` is the only terminal state.

A Task in `Completed` cannot transition to another lifecycle state.

---

# Role Boundary

The Task Aggregate owns the Task Role assignment invariant.

A Task is performed by exactly one Role.

A Role must be assigned before the Task may transition from `Created` to `Planned`.

The Aggregate therefore owns the consistency relationship between:

```text
Role assignment
        ↓
Created → Planned
```

Role reassignment semantics are explicitly undefined by the frozen Task Lifecycle Contract.

This architectural decision does not define reassignment behavior.

No reassignment semantics may be inferred from this Aggregate boundary.

---

# Aggregate Invariants

The Task Aggregate must protect the following already accepted invariants:

1. A Task is always in exactly one lifecycle state.
2. A Task may transition only through an allowed lifecycle transition.
3. `Completed` has no allowed outgoing lifecycle transition.
4. A Task is performed by exactly one Role.
5. A Role must be assigned before `Created → Planned`.

These are normative invariants inherited from the authoritative requirements and frozen lifecycle contract.

They are not new Task requirements introduced by this document.

---

# Domain Event Boundary

The Task Aggregate is the domain consistency boundary from which accepted Task lifecycle facts originate.

The currently accepted Task lifecycle event facts are:

```text
TaskCreated
TaskAssigned
TaskStarted
TaskCompleted
```

These facts correspond to the accepted lifecycle behavior defined by the frozen Task Lifecycle Contract.

The Aggregate records domain facts resulting from valid Task behavior.

Event dispatch, subscription, transport, and external delivery are outside the Aggregate boundary.

The following event names remain outside the current normative Task lifecycle contract:

```text
TaskBlocked
TaskResumed
TaskRejected
```

This document does not promote them into accepted Task behavior.

---

# External Mutation Boundary

Changes that can affect Task lifecycle state, Role assignment, or Aggregate invariants must pass through the Task Aggregate boundary.

External code must not bypass the Aggregate and directly mutate:

- lifecycle state;
- assigned Role;
- other state participating in accepted Task invariants.

This document defines the responsibility boundary only.

It does not define commands, method names, factories, handlers, or application services.

---

# Persistence Boundary

Persistence is outside the Task Aggregate boundary.

The existing Domain Foundation separates Aggregate behavior from Repository and persistence responsibilities.

Therefore:

```text
Task Aggregate
    ↓
Domain consistency

Task Repository / Persistence
    ↓
Storage concerns
```

The Task Aggregate does not own:

- database state;
- persistence mapping;
- repository implementation;
- transactions;
- Unit of Work orchestration;
- serialization;
- storage infrastructure.

No Task repository or persistence model is introduced by this decision.

---

# Application Boundary

The Task Aggregate does not own application orchestration.

The following concerns remain outside the Aggregate:

- command handling;
- application services;
- workflow orchestration;
- transaction orchestration;
- dependency resolution;
- event dispatching.

A future application layer may invoke Aggregate behavior, but it must not bypass the Aggregate consistency boundary.

---

# Implementation Boundary

This document does not define a runtime implementation.

It does not prescribe:

- TypeScript classes;
- factories;
- command objects;
- command handlers;
- method names;
- constructors;
- lifecycle value objects;
- concrete `TaskId` types;
- repository APIs;
- persistence schemas.

Future implementation must preserve the architectural boundary defined here.

---

# Explicit Exclusions

The Task Aggregate does not introduce or define:

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

Any such concern requires its own evidence and, where architectural behavior changes, a separate decision.

---

# Future Implementation Constraint

Any future Task implementation must satisfy all of the following:

```text
Task Aggregate
├── has stable identity
├── owns lifecycle state
├── owns lifecycle transition validity
├── owns accepted Role invariants
├── preserves accepted lifecycle event facts
└── protects the complete Task consistency boundary
```

The implementation must not make the runtime model the implicit source of Task lifecycle requirements.

The frozen Task Lifecycle Contract remains authoritative.

---

# Relationship to the Task Lifecycle Contract

The relationship is:

```text
Authoritative Task Requirements
        ↓
Frozen Task Lifecycle Contract
        ↓
Task Aggregate Boundary
        ↓
Future Task Implementation
```

The Lifecycle Contract defines what Task may do.

The Task Aggregate defines where Task consistency is enforced.

The implementation defines how that boundary is realized.

These responsibilities must remain separate.

---

# Stability

This document becomes the architectural boundary for the Task Aggregate after Architecture Review and Freeze.

Changes to the Aggregate consistency boundary, ownership of accepted invariants, or responsibility for lifecycle behavior require an explicit architecture decision.

Changes to lifecycle states, transitions, lifecycle invariants, Role lifecycle semantics, or accepted lifecycle event facts remain subject to the authoritative requirements and frozen Task Lifecycle Contract process.
