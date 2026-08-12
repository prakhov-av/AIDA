# ADR-0019 - Domain Event Dispatcher Contract

-   Status: Accepted
-   Date: 2026-08-12
-   Authors: AIDA Team
-   Related:
    -   ADR-0005 - Domain Events
    -   ADR-0016 - Application Execution Lifecycle
    -   ADR-0017 - UnitOfWork Contract Foundation
    -   ADR-0018 - Application Persistence Coordination

------------------------------------------------------------------------

# Context

The AIDA Domain Event Foundation provides domain events as immutable
domain facts produced by the Domain model.

The Application Execution Lifecycle established by ADR-0016 keeps
application execution coordination within the existing Application
Executor.

The Persistence Foundation established by ADR-0017 and ADR-0018 defines
UnitOfWork as the transaction boundary and places commit and rollback
coordination within the Application Executor.

Domain Event publication requires an application-level boundary without
introducing a second lifecycle owner or coupling the Domain model to
infrastructure delivery mechanisms.

The existing architecture therefore requires a minimal contract for
dispatching already collected Domain Events.

------------------------------------------------------------------------

# Decision

AIDA SHALL define `DomainEventDispatcher` as the application-level
contract for dispatching Domain Events.

The public contract is:

``` ts
export interface DomainEventDispatcher {
    dispatch(
        events: readonly DomainEvent[],
    ): Promise<void>;
}
```

`DomainEventDispatcher` SHALL have a single responsibility:

-   dispatch a provided collection of Domain Events.

The contract SHALL NOT own:

-   application execution lifecycle;
-   transaction coordination;
-   persistence;
-   Aggregate state;
-   Domain Event collection;
-   event storage;
-   subscription management;
-   transport selection;
-   retry policy;
-   delivery guarantees.

------------------------------------------------------------------------

# Architectural Ownership

The ownership model is:

``` text
Domain
    ↓
Domain Event
    ↓
Application
    ↓
DomainEventDispatcher
    ↓
Infrastructure
```

The Domain model remains responsible for producing Domain Events.

The Application layer owns the dispatch contract.

Infrastructure may provide concrete implementations of the contract.

The Domain layer SHALL NOT depend on `DomainEventDispatcher`.

Infrastructure SHALL NOT become the owner of application execution
lifecycle.

------------------------------------------------------------------------

# Lifecycle Alignment

Domain Event dispatch SHALL align with the existing Application
Execution Lifecycle.

The intended ordering is:

``` text
Application Request
        ↓
Application Execution
        ↓
Persistence
        ↓
UnitOfWork.commit()
        ↓
Domain Event Retrieval
        ↓
DomainEventDispatcher.dispatch()
        ↓
Execution Complete
```

Domain Events SHALL NOT be dispatched before successful persistence
commit.

This preserves the existing lifecycle ownership established by ADR-0016
and the persistence transaction boundary established by ADR-0018.

The concrete orchestration mechanism connecting the Application
Executor, UnitOfWork, Domain Event retrieval, and
`DomainEventDispatcher` is outside the scope of this ADR.

------------------------------------------------------------------------

# Commit Boundary

Persistence commit establishes the successful persistence boundary.

The expected ordering is:

``` text
Persist Application State
        ↓
UnitOfWork.commit()
        ↓
Retrieve Domain Events
        ↓
Dispatch Domain Events
```

If `commit()` fails:

``` text
UnitOfWork.commit()
        ↓
Failure
        ↓
UnitOfWork.rollback()
        ↓
Failure Propagated
```

Domain Events SHALL NOT be dispatched before a successful commit.

If dispatch fails after a successful commit:

``` text
UnitOfWork.commit()
        ↓
DomainEventDispatcher.dispatch()
        ↓
Failure
```

The completed persistence transaction SHALL NOT be rolled back by the
dispatcher.

Reliable delivery after a successful persistence commit is outside the
scope of this ADR.

------------------------------------------------------------------------

# Domain Event Ownership

`DomainEventDispatcher` SHALL NOT retrieve events directly from
Aggregates.

Aggregate event ownership remains within the Domain model.

The conceptual responsibility flow is:

``` text
AggregateRoot
        ↓
DomainEvents
        ↓
Application Event Retrieval
        ↓
DomainEventDispatcher
```

Event collection and event dispatch remain separate responsibilities.

The dispatcher receives an already collected sequence of Domain Events.

------------------------------------------------------------------------

# API Constraints

The public contract intentionally exposes only one operation:

``` ts
dispatch(
    events: readonly DomainEvent[],
): Promise<void>;
```

The contract SHALL NOT introduce:

-   `publish()`;
-   `subscribe()`;
-   `register()`;
-   `clear()`;
-   `flush()`;
-   `retry()`.

The contract SHALL accept a read-only event collection.

The dispatcher SHALL NOT mutate the provided event collection.

No infrastructure transport type SHALL be exposed by the contract.

------------------------------------------------------------------------

# Lifecycle Ownership

The existing Application Executor remains the single owner of
application execution coordination.

`DomainEventDispatcher` SHALL NOT become a lifecycle owner.

The relationship remains:

``` text
Application Executor
        ↓
Pipeline Executor
        ↓
Application Handler
        ↓
Persistence Coordination
        ↓
Domain Event Dispatch
        ↓
Execution Complete
```

Runtime remains responsible for composition.

Pipeline remains the execution strategy.

Application handlers remain responsible for application use cases.

UnitOfWork remains responsible for transaction coordination.

DomainEventDispatcher remains responsible only for Domain Event
dispatch.

------------------------------------------------------------------------

# Infrastructure Boundary

Concrete event delivery mechanisms remain outside the Domain and
Application contract.

Possible infrastructure implementations may include:

-   in-process dispatch;
-   message publication;
-   framework integration;
-   external transport.

This ADR does not select a transport mechanism.

Infrastructure implementations SHALL depend on `DomainEventDispatcher`
rather than changing the Domain Event model.

------------------------------------------------------------------------

# Reliability Boundary

This ADR does not define reliable delivery guarantees.

It does not introduce:

-   Outbox;
-   Event Store;
-   message broker;
-   retry infrastructure;
-   dead-letter handling;
-   idempotency infrastructure;
-   distributed transactions.

These concerns require separate architectural decisions if they become
necessary.

A successful `dispatch()` represents successful completion of the
dispatch operation provided by the selected implementation.

It does not establish durable delivery guarantees beyond that
implementation.

------------------------------------------------------------------------

# Architectural Invariants

The following invariants SHALL be preserved.

## Single Lifecycle Owner

The Application Executor remains the single owner of application
execution coordination.

No second lifecycle owner is introduced.

## Domain Independence

The Domain layer does not depend on `DomainEventDispatcher`.

## Persistence Independence

`DomainEventDispatcher` does not own persistence or transaction
coordination.

## Commit Ordering

Domain Event dispatch occurs only after successful persistence commit.

## Explicit Responsibility

Event collection and event dispatch remain separate responsibilities.

## Minimal API

The dispatcher exposes only the operation required by the current
Foundation.

## Transport Independence

The contract does not expose infrastructure transport details.

## Framework Independence

The contract remains independent from application frameworks and
dependency injection mechanisms.

## Stable Public API

Existing execution, persistence, repository, Aggregate Root, and Domain
Event contracts remain unchanged.

------------------------------------------------------------------------

# Public API Impact

This decision introduces one new application-level public contract:

``` ts
DomainEventDispatcher
```

The contract is exported through the existing Application module and the
package root.

No existing public contract is changed.

No existing Frozen contract is replaced.

------------------------------------------------------------------------

# Scope

This ADR defines:

-   ownership of Domain Event dispatch;
-   the `DomainEventDispatcher` contract;
-   lifecycle alignment;
-   commit ordering;
-   application and infrastructure responsibility boundaries.

This ADR does not define:

-   concrete dispatcher implementations;
-   transport mechanisms;
-   subscriptions;
-   event handlers;
-   reliable delivery;
-   retries;
-   Outbox;
-   Event Store;
-   distributed transactions;
-   framework integration;
-   complete Application Executor orchestration.

------------------------------------------------------------------------

# Migration

No migration is required for existing Domain Event contracts.

The new contract is additive.

Existing:

-   Domain Events;
-   Aggregate Root;
-   Repository;
-   UnitOfWork;
-   Application Executor;
-   Pipeline Executor;
-   Runtime composition

remain valid.

------------------------------------------------------------------------

# Implementation Outcome

The Foundation introduces the minimal `DomainEventDispatcher`
application contract.

The current implementation establishes the application-level
architectural boundary only.

Concrete lifecycle integration SHALL be implemented separately.

The implementation SHALL preserve:

``` text
Domain
    ↓
Domain Events
    ↓
Application Dispatch Contract
    ↓
Infrastructure Delivery
```

The implementation SHALL NOT introduce a second lifecycle owner.

------------------------------------------------------------------------

# Validation

The Foundation SHALL be validated through:

-   TypeScript type checking;
-   unit tests;
-   `npx vitest run`;
-   Architecture Review;
-   Freeze review.

The implementation SHALL preserve:

-   single lifecycle ownership;
-   Domain independence;
-   persistence transaction boundary;
-   commit ordering;
-   transport independence;
-   framework independence;
-   stable existing public contracts.

------------------------------------------------------------------------

# Freeze Criteria

The Domain Event Dispatcher Contract Foundation may be frozen when:

-   the `DomainEventDispatcher` contract is stable;
-   ownership is explicitly defined;
-   the contract remains minimal;
-   the Domain layer remains independent from Application;
-   persistence transaction ownership remains with UnitOfWork;
-   Domain Event dispatch is ordered after successful commit;
-   no second lifecycle owner is introduced;
-   no transport abstraction leaks into the contract;
-   TypeScript checks pass;
-   unit tests pass;
-   `npx vitest run` completes successfully;
-   Architecture Review is complete.
