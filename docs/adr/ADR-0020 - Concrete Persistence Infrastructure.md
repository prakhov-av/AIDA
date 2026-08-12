# ADR-0020 — Concrete Persistence Infrastructure

- Status: Accepted
- Date: 2026-08-12
- Decision Owners: AIDA Architecture
- Scope: Persistence Infrastructure

## Context

AIDA currently defines persistence through Foundation-level contracts.

The Domain layer owns the `Repository` contract and the `UnitOfWork` contract.

The Application layer owns execution lifecycle coordination.

The Domain layer owns Aggregate Roots and Domain Events.

The Application layer owns the `DomainEventDispatcher` contract.

The current Foundation boundaries are intentionally frozen:

```text
AggregateRoot
    ↓
Domain Events

Repository
    ↓
Persistence Contract

UnitOfWork
    ↓
Transaction Boundary

ApplicationExecutor
    ↓
Execution Lifecycle

DomainEventDispatcher
    ↓
Domain Event Dispatch

RuntimeBuilder
    ↓
Composition Root

The Foundation does not contain a concrete persistence implementation.

Previous architectural work explicitly rejected introducing Foundation-level mechanisms such as:

AggregateTracker
DomainEventSource
PersistenceOutcome
PersistenceExecution
PersistenceExecutionFactory
PersistenceCoordinator
ExecutionContext
ServiceProvider

The UnitOfWork contract was intentionally not extended to expose Domain Events or participating aggregates.

Post-commit Domain Event dispatch was therefore intentionally left unresolved until concrete persistence infrastructure exists.

The current workspace contains:

packages/
└── domain/

There is no existing concrete persistence package.

The workspace architecture permits reusable packages under packages/*.

Decision

A concrete persistence package will be introduced as:

packages/persistence

The package represents the concrete persistence responsibility of the current Foundation architecture.

It does not redefine the architectural Infrastructure layer as a general-purpose package.

The concrete persistence package depends on the Domain package through its public API:

@aida/persistence
        ↓
@aida/domain

The Domain package does not depend on the persistence package.

The dependency direction remains:

Infrastructure
        ↓
Application
        ↓
Domain
Concrete Persistence Boundary

The package owns a concrete persistence boundary.

For the initial implementation, the concrete persistence boundary is represented by:

InMemoryPersistence

The boundary owns the concrete persistence state for one runtime instance.

Conceptually:

InMemoryPersistence
        │
        ├── Repository implementations
        │
        └── UnitOfWork implementation

The Repository implementation and UnitOfWork implementation belonging to the same persistence boundary operate on the same underlying persistence state.

A persistence boundary must not share mutable state with another persistence boundary.

Runtime Isolation

Each runtime must own an independent concrete persistence boundary.

The required invariant is:

Runtime A
    ↓
Persistence Boundary A

Runtime B
    ↓
Persistence Boundary B

The following must therefore produce independent persistence state:

runtimeBuilder.build()
runtimeBuilder.build()

No mutable persistence state may be stored in module-level singletons or other process-wide shared objects.

The concrete persistence boundary is an infrastructure composition concern.

Repository Implementation

The concrete Repository implementation implements the existing Domain Repository contract.

The Foundation Repository contract is not changed.

The concrete implementation provides:

findById()
save()
delete()

Persistence state is divided conceptually into:

committed state
pending changes

Repository mutations operate against pending changes.

A successful UnitOfWork commit applies pending changes to committed state.

A rollback discards pending changes.

The concrete Repository implementation must use only the public Domain API.

In particular, it must not access protected or private Domain implementation details.

Aggregate identity lookup must therefore not depend on direct access to the protected Identity.value member.

UnitOfWork Implementation

The concrete UnitOfWork implementation implements the existing Domain UnitOfWork contract.

The Foundation contract remains:

commit()
rollback()

No additional methods are added.

The concrete UnitOfWork is responsible for coordinating transaction completion within its owning persistence boundary.

It must not become a replacement for ApplicationExecutor.

It must not become a Domain Event dispatcher.

It must not expose persistence participation through the Foundation API.

Persistence Participation

Persistence participation is an infrastructure concern.

The concrete persistence implementation may internally maintain the set of concrete Repository instances participating in its UnitOfWork.

This participation mechanism is an implementation detail of packages/persistence.

It is not exposed as a Foundation-level abstraction.

The following abstractions are therefore not introduced:

AggregateTracker
EventCollector
PersistenceCoordinator
ExecutionContext
PersistenceOutcome
PersistenceExecution

unless a later Architecture Decision establishes a concrete need for one of them.

Domain Events

The existing Domain Event ownership model remains unchanged:

AggregateRoot
    ↓
DomainEvents
    ↓
pullDomainEvents()

The existing DomainEventDispatcher contract remains unchanged:

dispatch(readonly DomainEvent[])

The dispatcher does not:

discover aggregates;
retrieve Domain Events from aggregates;
manage transactions;
manage UnitOfWork;
participate in persistence.

This ADR does not introduce post-commit Domain Event dispatch.

The concrete persistence boundary must, however, preserve enough internal ownership information to allow a later architectural decision to define how participating Aggregate Roots can be inspected after a successful commit.

That future decision must not require changing the frozen UnitOfWork contract unless an explicit Architecture Decision is accepted.

Public API

The initial public API of the persistence package is intentionally minimal.

The package exports the concrete persistence boundary:

InMemoryPersistence

Concrete implementation classes remain internal unless they are explicitly required as part of the stable package API.

The persistence package must not expose internal participation mechanisms.

TypeScript Package Boundary

@aida/persistence depends on @aida/domain as a workspace package.

The package must consume Domain through its public package API.

Source-level TypeScript path aliases that redirect:

@aida/domain
    ↓
packages/domain/src

are not part of the persistence package architecture.

They must not be introduced merely to bypass the normal package boundary.

The exact TypeScript build mechanism used to make workspace packages consumable during development and build is an implementation/tooling concern and must follow the repository's established workspace conventions.

This ADR does not introduce a new TypeScript project-reference architecture.

Persistence State Semantics

The initial concrete persistence implementation uses in-memory state.

The state model is:

Repository.save()
Repository.delete()
        ↓
pending changes
        ↓
UnitOfWork.commit()
        ↓
committed state

For rollback:

Repository.save()
Repository.delete()
        ↓
pending changes
        ↓
UnitOfWork.rollback()
        ↓
pending changes discarded

A committed aggregate remains available to subsequent Repository operations within the same persistence boundary.

A persistence boundary created independently must not observe that aggregate.

Scope

This ADR establishes:

the physical package boundary;
dependency direction;
concrete persistence ownership;
runtime isolation;
Repository implementation responsibility;
UnitOfWork implementation responsibility;
participation responsibility;
current transaction semantics;
Domain Event boundaries;
public API constraints.

This ADR does not establish:

a database adapter;
an ORM;
a database schema;
a production storage engine;
post-commit Domain Event dispatch;
a persistence coordinator;
a new application execution context;
changes to Frozen Foundation contracts;
a general-purpose Infrastructure package.
Alternatives Rejected
packages/infrastructure

Rejected for the current scope.

The current Sprint addresses concrete persistence rather than a complete Infrastructure layer.

Creating a general-purpose Infrastructure package would establish a broader architectural boundary than required.

The concrete package is therefore named:

packages/persistence
Persistence inside packages/domain

Rejected.

Concrete persistence is an Infrastructure responsibility.

The Domain package must remain independent from databases, storage implementations, and infrastructure mechanisms.

Extending UnitOfWork

Rejected.

The existing UnitOfWork contract is frozen.

Event retrieval and participation must not be added to the contract merely to simplify concrete persistence implementation.

Foundation-level Aggregate Tracking

Rejected.

Participation is infrastructure-specific and does not justify introducing a new Foundation abstraction.

Source-level Domain alias

Rejected.

Redirecting @aida/domain directly to packages/domain/src would weaken the package boundary and couple persistence tooling to Domain source layout.

Shared process-wide persistence state

Rejected.

Shared mutable persistence state would violate runtime isolation.

Each runtime must own its own persistence boundary.

Consequences
Positive
Concrete persistence has a clear physical package boundary.
Domain contracts remain stable.
UnitOfWork remains frozen.
Repository remains a stable Domain contract.
Runtime persistence state can be isolated.
Repository and UnitOfWork can participate in one persistence boundary.
Infrastructure participation does not leak into Foundation.
The package API remains small.
Future concrete storage implementations can replace the in-memory implementation without changing Domain contracts.
Negative
Runtime composition must eventually provide the persistence boundary.
Concrete persistence currently requires an internal participation mechanism.
Post-commit Domain Event dispatch remains unresolved.
Workspace TypeScript build configuration must correctly resolve the Domain package boundary.
Risks

The persistence implementation must not gradually become a second application execution coordinator.

The persistence package must not accumulate generic Infrastructure abstractions without explicit architectural need.

The in-memory implementation must not become an implicit specification for database-specific transaction semantics beyond the behavior explicitly defined here.

Implementation Constraints

Implementation must:

create packages/persistence;
preserve the existing Domain contracts;
avoid modifying Frozen Foundation;
keep persistence state instance-scoped;
keep participation infrastructure-internal;
use only public Domain APIs;
avoid source-level package aliases;
expose the minimum stable public API;
provide tests for each concrete module;
follow existing workspace and test conventions.
Verification

The implementation is considered valid only after:

npx tsc --noEmit
npx tsc --noEmit -p tsconfig.vitest.json
npx vitest run

and package-specific persistence tests pass.

Architecture Review must confirm that:

Concrete Persistence
        ↓
Repository + UnitOfWork
        ↓
shared boundary state

does not introduce Foundation leakage.

Status

Accepted.

Implementation may proceed within the boundaries defined by this ADR.

No Frozen Foundation contract is changed by this decision.