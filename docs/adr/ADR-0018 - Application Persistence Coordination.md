# ADR-0018 - Application Persistence Coordination

* Status: Accepted
* Date: 2026-08-11
* Authors: AIDA Team
* Related:

  * ADR-0017 - UnitOfWork Contract Foundation
  * ADR-0016 - Application Execution Lifecycle
  * DD-0016 - Application Execution Lifecycle

---

# Context

The AIDA SDK contains a frozen `UnitOfWork` contract representing the transactional boundary for application-level persistence coordination.

The application execution lifecycle is owned by `ApplicationExecutor`. The existing implementation delegates request execution to `PipelineExecutor`, while persistence transaction coordination is not yet integrated into the application execution lifecycle.

The Runtime is responsible for composition and must not become the owner of execution or persistence semantics.

Each runtime build must produce an independent execution graph. Therefore, a shared `UnitOfWork` instance must not be reused across separately built application executors.

---

# Decision

`DefaultApplicationExecutor` is responsible for coordinating the persistence outcome of an application execution.

The execution flow is:

```text
Application Request
        ↓
ApplicationExecutor
        ↓
PipelineExecutor
        ↓
Handler / Persistence
        ↓
UnitOfWork.commit()
        ↓
Execution Complete
```

If execution fails before successful completion:

```text
Execution Failure
        ↓
UnitOfWork.rollback()
        ↓
Execution Failure Propagated
```

If `commit()` fails, the failure is handled through the same failure path and `rollback()` is attempted before the original failure is propagated.

The public `ApplicationExecutor` contract is not changed.

`DefaultApplicationExecutor` receives `UnitOfWork` as a concrete dependency.

`DefaultRuntimeBuilder` receives a `UnitOfWork` factory as a composition dependency. The factory is invoked once for every `build()` operation.

This guarantees independent transaction boundaries:

```text
UnitOfWorkFactory
        ↓
RuntimeBuilder.build()
        ├── UnitOfWork A → ApplicationExecutor A
        └── UnitOfWork B → ApplicationExecutor B
```

The `RuntimeBuilder` public interface is not extended. The existing Handler Activation and Pipeline Composition boundaries remain unchanged.

---

# Ownership

```text
Runtime
    → composition only

DefaultRuntimeBuilder
    → constructs the runtime graph
    → obtains a UnitOfWork from the supplied factory

ApplicationExecutor
    → owns application execution lifecycle
    → coordinates commit and rollback

UnitOfWork
    → owns the transactional boundary

PipelineExecutor
    → owns execution strategy

Handler
    → owns application use-case logic
```

---

# Consequences

## Positive

* Application persistence coordination has an explicit owner.
* Transaction boundaries are integrated with application execution.
* `UnitOfWork` remains a small stable contract.
* Runtime does not create infrastructure-specific persistence implementations.
* Each runtime build receives an independent `UnitOfWork`.
* The public `ApplicationExecutor` contract remains stable.
* Existing Handler Activation and Pipeline Composition boundaries remain unchanged.

## Negative

* `DefaultRuntimeBuilder` now requires a `UnitOfWork` factory.
* Existing construction sites of `DefaultRuntimeBuilder` must provide the dependency.
* Persistence infrastructure must provide the concrete `UnitOfWork` implementation.

---

# Out of Scope

This decision does not introduce:

* a `PersistenceCoordinator`;
* a `TransactionManager`;
* a new execution lifecycle abstraction;
* a `begin()` operation on `UnitOfWork`;
* Domain Event orchestration;
* EventBus integration;
* Outbox processing;
* retry policies;
* distributed transaction support;
* infrastructure-specific `UnitOfWork` implementations.

Domain Event orchestration remains a separate architectural concern.

---

# Status

Accepted.

The Application Persistence Coordination Foundation is frozen after successful type checking, unit testing, architecture review, and repository verification.
