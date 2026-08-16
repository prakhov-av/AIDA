# ADR-0021 — Runtime Persistence Composition Boundary

- Status: Accepted
- Date: 2026-08-16
- Decision Owners: AIDA Architecture
- Scope: Runtime Composition and Concrete Persistence

## Context

AIDA currently contains two Foundation packages:

```text
packages/
├── domain/
└── persistence/
```

The Domain package owns the runtime composition Foundation.

The persistence package owns the concrete persistence boundary.

The dependency direction is:

@aida/persistence
        ↓
@aida/domain

The Domain package must not depend on the concrete persistence package.

The current RuntimeBuilder is the Domain-level Composition Root.

Its public contract remains intentionally minimal:

register()
registerFactory()
addBehavior()
build()

The DefaultRuntimeBuilder receives a UnitOfWorkFactory and invokes the factory during each build operation.

Conceptually:

runtimeBuilder.build()
        ↓
UnitOfWorkFactory()
        ↓
ApplicationExecutor

This already provides the required per-build UnitOfWork lifecycle.

The concrete persistence package provides InMemoryPersistence.

Its public boundary is:

InMemoryPersistence
        │
        ├── Repository implementations
        │
        └── UnitOfWork implementation

Each InMemoryPersistence instance owns its own persistence state.

The persistence implementation therefore supports:

Persistence Boundary A
        ├── Repository A
        └── UnitOfWork A


Persistence Boundary B
        ├── Repository B
        └── UnitOfWork B

with no shared mutable persistence state.

The concrete persistence boundary is therefore compatible with the runtime isolation requirement already established by ADR-0020.

However, the current workspace does not contain an Application Composition Layer above the Domain and Persistence packages.

The workspace configuration permits applications under:

apps/*

but no application package currently exists.

There is therefore no existing architectural location that may legally perform:

InMemoryPersistence
        ↓
DefaultRuntimeBuilder

without either:

introducing a new application composition layer; or
making the Domain package depend on the concrete persistence package.

The second option would violate the established dependency direction.

The first option would introduce a new architectural layer before the repository has an application-level responsibility that requires it.

The Sprint therefore requires an explicit decision about the current composition boundary.

Decision

Runtime composition of Concrete Persistence is not introduced in the current Foundation.

The existing RuntimeBuilder remains the Domain-level Composition Root.

The existing InMemoryPersistence remains the concrete persistence boundary.

No new application composition package is introduced solely to connect the two packages during the current Sprint.

The current architecture therefore remains:

@aida/persistence
        ↓
@aida/domain

with the following responsibilities:

@aida/domain
    └── Runtime Composition Foundation


@aida/persistence
    └── Concrete Persistence Infrastructure

The existing UnitOfWorkFactory remains the runtime integration point available to the Domain Runtime.

When an Application Composition Layer exists, that layer may compose:

Concrete Persistence
        ↓
UnitOfWorkFactory
        ↓
RuntimeBuilder

without changing the dependency direction.

The future composition must preserve the following invariant:

Runtime A
    ↓
Persistence Boundary A
    ├── Repository A
    └── UnitOfWork A


Runtime B
    ↓
Persistence Boundary B
    ├── Repository B
    └── UnitOfWork B

The persistence boundary must remain instance-scoped.

No process-wide mutable persistence state may be introduced.

Frozen Foundation

The following Foundation contracts and components remain unchanged:

RuntimeBuilder
HandlerFactory
HandlerActivator
HandlerRegistry
HandlerResolver
ApplicationExecutor
Repository
UnitOfWork
DomainEventDispatcher

This decision does not introduce:

RuntimeContext
ApplicationContext
ServiceProvider
DependencyContainer
PersistenceCoordinator
ExecutionContext
PersistenceOutcome
PersistenceExecution

No new Foundation abstraction is introduced to bridge Domain Runtime Composition and Concrete Persistence.

Application Composition Boundary

Application Composition is a separate architectural responsibility from Domain Runtime Composition.

When an application-level composition layer is introduced, it will be responsible for combining:

Domain Runtime
        +
Concrete Persistence

The application composition layer must depend on both packages rather than introducing a reverse dependency from Domain to Persistence.

The expected dependency direction is therefore:

Application Composition
        ├── @aida/domain
        └── @aida/persistence

with:

@aida/persistence
        ↓
@aida/domain

remaining valid.

The exact physical package, API, and lifecycle of the Application Composition Layer are intentionally not established by this ADR.

They require a separate Architecture Decision when the application layer becomes an actual repository responsibility.

Runtime Isolation

Concrete persistence must remain isolated per runtime instance.

The required invariant is:

runtimeBuilder.build()
        ↓
Persistence Boundary A


runtimeBuilder.build()
        ↓
Persistence Boundary B

The two boundaries must not share mutable state.

The existing InMemoryPersistence implementation already satisfies this boundary ownership model.

No additional persistence isolation abstraction is introduced.

Repository Ownership

Repository implementations remain owned by the concrete persistence boundary.

The Domain Repository contract remains unchanged.

Repository instances must remain associated with the persistence boundary that created them.

The concrete persistence package remains responsible for transaction participation of its Repository instances.

This participation mechanism remains internal to the persistence package.

It must not be exposed through the Domain Foundation merely to support runtime composition.

UnitOfWork Ownership

The UnitOfWork implementation remains owned by the concrete persistence boundary.

The existing UnitOfWork contract remains:

commit()
rollback()

No persistence-specific methods are added.

The existing DefaultRuntimeBuilder continues to receive a UnitOfWorkFactory.

The factory remains responsible for providing the UnitOfWork used by the runtime being built.

Concrete persistence may therefore be adapted to the existing UnitOfWorkFactory without changing the Domain contract.

Handler Dependencies

This ADR does not introduce a mechanism for passing runtime-scoped Repository instances into handlers.

The existing HandlerFactory contract remains unchanged.

Runtime-scoped handler dependencies require a separate architectural decision if and when concrete application composition requires them.

No dependency injection mechanism, service locator, runtime context, or equivalent abstraction is introduced as part of this decision.

Domain Events

This ADR does not change the existing Domain Event architecture.

Domain Events remain owned by Aggregate Roots.

The DomainEventDispatcher contract remains unchanged.

This ADR does not introduce:

post-commit event dispatch
aggregate tracking
event collection
persistence participation through the Domain API

Post-commit Domain Event dispatch remains outside the scope of this decision.

Alternatives Rejected
Persistence Dependency from Domain

Rejected.

Making @aida/domain depend on @aida/persistence would reverse the established dependency direction.

The Domain package must remain independent from concrete infrastructure.

New Generic Runtime Context

Rejected.

Introducing RuntimeContext, ApplicationContext, or a similar abstraction would create a new Foundation-level composition mechanism without a concrete architectural requirement.

New Persistence Coordinator

Rejected.

A PersistenceCoordinator would duplicate responsibilities already owned by InMemoryPersistence and UnitOfWork.

It would also establish an additional infrastructure abstraction without a concrete need.

New Application Package Solely for Sprint 8

Rejected.

The current repository does not contain an Application Composition Layer.

Creating an application package only to connect the existing Domain and Persistence packages would establish an architectural layer before its application responsibility exists.

The application layer will be introduced when the repository reaches the architectural stage that requires it.

Direct Domain-to-Persistence Import

Rejected.

The Domain package must not import concrete persistence implementations.

RuntimeBuilder Changes

Rejected.

The existing DefaultRuntimeBuilder already provides the required UnitOfWorkFactory integration point.

Changing RuntimeBuilder merely to introduce concrete persistence would expand the Frozen Foundation unnecessarily.

Consequences
Positive

Concrete Persistence remains independently usable.

The Domain package remains independent from concrete infrastructure.

RuntimeBuilder remains minimal and stable.

The existing UnitOfWorkFactory integration point remains valid.

Persistence isolation remains instance-scoped.

No premature Application Composition Layer is introduced.

No generic dependency injection abstraction is introduced.

No Frozen Foundation contract is changed.

The repository remains aligned with the current Foundation scope.

Negative

Concrete Persistence cannot yet be composed into a complete application runtime through an existing repository-level Application Composition Layer.

An application-level composition boundary will be required before concrete persistence can become part of a complete executable application runtime.

Runtime-scoped handler dependencies remain unresolved.

Post-commit Domain Event dispatch remains unresolved.

Risks

Future application composition must not introduce a reverse dependency from Domain to Persistence.

The future Application Composition Layer must not become a generic dependency injection framework without an explicit architectural decision.

The persistence package must not accumulate runtime orchestration responsibilities.

The Domain Runtime must remain independent from concrete storage implementations.

Scope

This ADR establishes:

the current boundary between Domain Runtime Composition and Concrete Persistence;
preservation of dependency direction;
preservation of runtime persistence isolation;
continued use of UnitOfWorkFactory as the existing runtime integration point;
the decision not to introduce an Application Composition Layer during the current Sprint;
the decision not to modify Frozen Foundation contracts.

This ADR does not establish:

an Application Composition package;
an application runtime API;
runtime-scoped handler dependency injection;
a database adapter;
an ORM;
a production storage engine;
post-commit Domain Event dispatch;
a PersistenceCoordinator;
a RuntimeContext;
a general-purpose Infrastructure package.
Verification

The architecture is considered valid when:

@aida/persistence
        ↓
@aida/domain

remains the package dependency direction.

The following invariants must remain true:

Runtime A
    ↓
Persistence Boundary A


Runtime B
    ↓
Persistence Boundary B

and:

Persistence Boundary A !== Persistence Boundary B

No Frozen Foundation contract is changed by this decision.

Existing persistence tests continue to verify concrete persistence isolation and transaction semantics.

When an Application Composition Layer is introduced, it must be covered by a separate Architecture Check and Architecture Decision.

Status

Accepted.

This decision closes the current Runtime Persistence Composition scope without production code changes.

Future integration of Concrete Persistence into an executable application runtime requires an Application Composition Architecture Decision.

No Frozen Foundation contract is changed by this decision.
