# ADR-0022 — Post-Commit Domain Event Dispatch Boundary

- Status: Accepted
- Date: 2026-08-16
- Decision Owners: AIDA Architecture
- Scope: Post-Commit Domain Event Dispatch

## Context

AIDA contains a Domain Event model in which Domain Events are owned by Aggregate Roots.

Aggregate Roots expose their pending Domain Events through:

```text
AggregateRoot
    ↓
pullDomainEvents()
```

The Domain package also defines the DomainEventDispatcher contract:

DomainEventDispatcher
    ↓
dispatch(readonly DomainEvent[])

The dispatcher is responsible only for event publication.

It does not own aggregate lifecycle.

It does not own persistence lifecycle.

It does not define transaction boundaries.

The existing runtime execution lifecycle is owned by ApplicationExecutor.

The existing transaction boundary is owned by UnitOfWork:

ApplicationExecutor
    ↓
UnitOfWork
    ├── commit()
    └── rollback()

Concrete persistence infrastructure is now present in @aida/persistence.

The persistence boundary owns Repository instances and their transaction participation.

However, post-commit Domain Event dispatch was intentionally left unresolved by the Runtime Persistence Composition decision.

The required lifecycle is now:

Application Execution
        ↓
Persistence
        ↓
commit()
        ↓
Domain Event Collection
        ↓
Domain Event Dispatch
        ↓
Complete

The critical semantic requirement is that Domain Events must be dispatched only after a successful persistence commit.

Decision

Post-commit Domain Event dispatch is defined as a responsibility of the existing application execution lifecycle.

The lifecycle is:

ApplicationExecutor
        ↓
execution
        ↓
UnitOfWork.commit()
        ↓
collect committed Domain Events
        ↓
DomainEventDispatcher.dispatch()
        ↓
complete

ApplicationExecutor remains the single lifecycle owner.

UnitOfWork remains the transaction boundary.

DomainEventDispatcher remains the event publication boundary.

AggregateRoot remains the owner of Domain Events.

No second lifecycle coordinator is introduced.

Commit Semantics

A persistence commit failure follows the existing transaction failure semantics:

commit()
    ↓
failure
    ↓
rollback()
    ↓
error propagated

A successful commit establishes a committed persistence state.

Domain Event dispatch occurs only after that successful commit:

commit()
    ↓
success
    ↓
collect()
    ↓
dispatch()

If Domain Event dispatch fails after commit:

commit()
    ↓
success
    ↓
dispatch()
    ↓
failure

the committed persistence state must not be rolled back.

The dispatch error is propagated to the caller.

The architecture therefore explicitly distinguishes:

Transaction Failure

from:

Post-Commit Publication Failure

A post-commit publication failure is not a transaction rollback condition.

Domain Event Ownership

Aggregate Roots own their Domain Events.

The event collection boundary obtains events from participating Aggregate Roots through the existing AggregateRoot event lifecycle.

Conceptually:

AggregateRoot
    ↓
pullDomainEvents()
    ↓
DomainEvent[]

No second Domain Event storage mechanism is introduced.

The DomainEventDispatcher receives already-collected events:

DomainEvent[]
    ↓
DomainEventDispatcher.dispatch()

The dispatcher must not:

extract events from Aggregate Roots;
manage Aggregate Root lifecycle;
manage persistence;
manage transactions;
know concrete persistence implementations.
Post-Commit Event Collection

Post-commit event collection is a distinct responsibility from transaction management.

The logical collection boundary is:

Post-Commit Domain Event Source
        ↓
collect()
        ↓
readonly DomainEvent[]

The source is responsible only for collecting events produced by aggregates participating in the committed runtime execution.

It does not commit.

It does not roll back.

It does not dispatch events.

It does not become a transaction coordinator.

The source must operate on the same runtime-scoped persistence participation that performed the successful commit.

Persistence Participation

Concrete persistence already owns Repository participation for transaction lifecycle.

The same concrete persistence boundary may provide the information required to collect Domain Events after commit.

The Domain Foundation must not expose concrete persistence participation merely to support this mechanism.

The existing Domain Repository contract remains unchanged.

The existing UnitOfWork contract remains unchanged:

commit()
rollback()

No persistence-specific methods are added to UnitOfWork.

Runtime Isolation

Post-commit Domain Event collection and dispatch must remain isolated per runtime.

The required invariant is:

Runtime A
    ↓
Persistence Boundary A
    ↓
Events A
    ↓
Dispatcher A

and:

Runtime B
    ↓
Persistence Boundary B
    ↓
Events B
    ↓
Dispatcher B

The two runtimes must not share mutable event state.

No process-wide Domain Event collection state is introduced.

No process-wide Domain Event dispatcher state is introduced by this decision.

Application Composition

This decision defines the post-commit lifecycle but does not materialize a new Application Composition Layer.

The current repository contains application workspace boundaries:

apps/
├── api/
├── cli/
├── web/
└── worker/

but no application implementation currently exists.

Therefore no application package is introduced solely to materialize post-commit event dispatch.

When an actual application consumer exists, its Application Composition Layer may combine:

@aida/domain
        +
@aida/persistence

and provide the runtime-scoped dependencies required by the execution lifecycle.

The application composition must preserve the existing package dependency direction:

Application Composition
    ├── @aida/domain
    └── @aida/persistence


@aida/persistence
        ↓
@aida/domain

The Domain package must remain independent from concrete persistence.

Frozen Foundation

The following Foundation contracts remain unchanged:

RuntimeBuilder
HandlerFactory
HandlerActivator
HandlerRegistry
HandlerResolver
ApplicationExecutor
Repository
UnitOfWork
DomainEventDispatcher
AggregateRoot

This decision does not introduce:

RuntimeContext
ApplicationContext
ServiceProvider
DependencyContainer
PersistenceCoordinator
ExecutionContext
EventPublishingUnitOfWork
EventAwareUnitOfWork
PostCommitEventDispatcher

No new lifecycle owner is introduced.

Alternatives Rejected
Dispatch inside UnitOfWork

Rejected.

UnitOfWork is the transaction boundary.

Adding Domain Event publication to UnitOfWork would combine transaction management and event publication responsibilities.

It would also make the persistence boundary responsible for application lifecycle.

Dispatch inside DomainEventDispatcher

Rejected.

DomainEventDispatcher is the publication boundary.

It must not discover Aggregate Roots or manage persistence lifecycle.

Dispatch before commit

Rejected.

Events could be published for persistence state that subsequently fails to commit.

This would violate the post-commit requirement.

Rollback after dispatch failure

Rejected.

Once commit succeeds, persistence state is committed.

A later publication failure cannot safely roll back that committed state.

New PostCommitEventDispatcher

Rejected.

The existing DomainEventDispatcher already defines the publication contract.

A second dispatcher abstraction would duplicate responsibility without a concrete requirement.

Event-aware UnitOfWork

Rejected.

The UnitOfWork contract must remain focused on transaction semantics.

Domain Event collection and publication are application lifecycle concerns.

New Persistence Coordinator

Rejected.

Concrete persistence already owns Repository participation and UnitOfWork implementation.

A PersistenceCoordinator would duplicate persistence orchestration.

New Application Package

Rejected for the current Foundation.

The repository currently has no concrete application consumer.

Creating an application package solely to materialize this boundary would introduce an architectural layer before its application responsibility exists.

RuntimeBuilder Extension

Rejected.

RuntimeBuilder remains the Domain-level Composition Root.

Its public contract remains:

register()
registerFactory()
addBehavior()
build()

The RuntimeBuilder must not be expanded with Domain Event specific factories solely to bridge concrete persistence.

Consequences
Positive

Post-commit Domain Event dispatch has an explicit lifecycle boundary.

ApplicationExecutor remains the single lifecycle owner.

UnitOfWork remains the transaction boundary.

AggregateRoot remains the owner of Domain Events.

DomainEventDispatcher remains responsible only for publication.

Commit failure and post-commit dispatch failure have distinct semantics.

Runtime isolation remains preserved.

The Domain package remains independent from concrete persistence.

No generic dependency injection abstraction is introduced.

No new transaction coordinator is introduced.

No new application package is introduced prematurely.

Negative

The current repository does not yet contain a concrete Application Composition Layer capable of wiring the complete post-commit lifecycle.

Concrete post-commit event dispatch therefore remains an architectural contract rather than a materialized application runtime capability.

An actual application consumer is required before concrete composition can be introduced.

Risks

Future application composition must not introduce a second lifecycle owner.

Concrete persistence must not become responsible for application execution orchestration.

UnitOfWork must not become event-aware.

DomainEventDispatcher must not acquire persistence knowledge.

Aggregate Root event ownership must remain unchanged.

Future composition must preserve runtime isolation.

Future application composition must not introduce a general-purpose dependency injection mechanism without a separate Architecture Decision.

Scope

This ADR establishes:

post-commit Domain Event dispatch as part of the existing application execution lifecycle;
ApplicationExecutor as the lifecycle owner;
UnitOfWork as the transaction boundary;
post-commit event collection as a distinct responsibility;
DomainEventDispatcher as the publication boundary;
commit failure semantics;
post-commit dispatch failure semantics;
Aggregate Root ownership of Domain Events;
runtime isolation requirements;
preservation of the existing package dependency direction.

This ADR does not establish:

a concrete Application Composition package;
an application runtime API;
a concrete production event dispatcher;
a database-backed event store;
a general-purpose dependency injection container;
a PersistenceCoordinator;
a RuntimeContext;
a change to the RuntimeBuilder public contract;
a change to the UnitOfWork contract.
Verification

The architecture is considered valid when the following lifecycle remains true:

ApplicationExecutor
        ↓
UnitOfWork.commit()
        ↓
Post-Commit Domain Event Collection
        ↓
DomainEventDispatcher.dispatch()

The following invariants must remain true:

commit failure
    ↓
rollback
    ↓
error
commit success
    ↓
dispatch failure
    ↓
no rollback

and:

AggregateRoot
    owns Domain Events

and:

Runtime A
    ↓
Events A


Runtime B
    ↓
Events B

with no shared mutable event state.

No Frozen Foundation contract is changed by this decision.

Concrete application composition requires a separate Architecture Check when an actual application responsibility appears in the repository.

Status

Accepted.

This decision closes the Post-Commit Domain Event Dispatch architecture scope.

The current Sprint does not materialize an Application Composition Layer because no concrete application consumer exists in the repository.

Future materialization of this boundary requires an Application Composition Architecture Decision based on an actual application responsibility.

No generic lifecycle or dependency injection abstraction is introduced by this decision.



### Foundation Status


```text
Architecture Check    ✅
Repository Check      ✅
Architecture Design   ✅
Architecture Decision ✅
Implementation        ⏸
Type Check            ⏸
Unit Tests            ⏸
Architecture Review   ✅
Freeze                ✅
ADR                   🟢
Release               ⏸
