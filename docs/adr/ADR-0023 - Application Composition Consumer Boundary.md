# ADR-0023 — Application Composition Consumer Boundary

* Status: Accepted
* Date: 2026-08-17
* Decision Owners: AIDA Architecture
* Scope: Application Composition Consumer

## Context

AIDA currently contains two Foundation packages:

```text
packages/
├── domain/
└── persistence/
```

The established dependency direction is:

```text
@aida/persistence
        ↓
@aida/domain
```

The Domain package owns the runtime composition Foundation.

The persistence package owns the concrete persistence boundary.

ADR-0021 established that concrete persistence must not be composed into the Domain package merely to connect the existing Foundation packages.

The Application Composition Layer was intentionally deferred until the repository contains an actual application-level responsibility that requires such a boundary.

ADR-0022 subsequently established the post-commit Domain Event dispatch lifecycle:

```text
ApplicationExecutor
        ↓
UnitOfWork.commit()
        ↓
Post-Commit Domain Event Collection
        ↓
DomainEventDispatcher.dispatch()
```

ApplicationExecutor remains the single lifecycle owner.

UnitOfWork remains the transaction boundary.

DomainEventDispatcher remains the publication boundary.

ADR-0022 explicitly does not materialize an Application Composition Layer because no concrete application consumer exists in the repository.

The Sprint 11 Architecture Check therefore evaluates whether the repository has since acquired an application responsibility that justifies materializing this boundary.

## Repository Evidence

The repository contains the following application workspace boundaries:

```text
apps/
├── api/
├── cli/
├── web/
└── worker/
```

These directories do not currently contain application implementations.

The repository does not contain:

* a concrete application entry point;
* an application-level request;
* a concrete command or query handler;
* an application-level handler consumer;
* an application composition implementation;
* a concrete application runtime assembly;
* a consumer that combines `@aida/domain` and `@aida/persistence`.

The existing ApplicationExecutor, RuntimeBuilder, handlers, and related components remain Foundation components rather than concrete application consumers.

Therefore the repository does not currently provide an application responsibility that can own Application Composition.

## Decision

Application Composition is **not materialized** during Sprint 11.

No application workspace is selected as the first consumer solely because the repository contains:

```text
apps/api
apps/cli
apps/web
apps/worker
```

No application package or composition module is introduced solely to fill the current architectural gap.

The existing architecture remains:

```text
@aida/persistence
        ↓
@aida/domain
```

with Application Composition remaining a future architectural boundary.

When an actual application consumer appears, that consumer must first pass a dedicated Architecture Check and Architecture Design before Application Composition is materialized.

## Composition Ownership

No new composition owner is introduced by this decision.

When a concrete application consumer appears, its composition boundary must be responsible for assembling the runtime dependencies required by that application.

The future composition owner may combine:

```text
Domain Runtime
        +
Concrete Persistence
```

and must preserve a single lifecycle owner.

A second lifecycle coordinator must not be introduced.

## Dependency Direction

Future Application Composition must preserve:

```text
Application Composition
        ├── @aida/domain
        └── @aida/persistence

@aida/persistence
        ↓
@aida/domain
```

The Domain package must remain independent from concrete persistence.

The application composition boundary must not introduce a reverse dependency from Domain to Persistence.

## Runtime Isolation

Future application composition must preserve runtime-scoped isolation.

For independent runtime instances:

```text
Runtime A
    ↓
Persistence Boundary A
    ↓
Events A
    ↓
Dispatcher A
```

and:

```text
Runtime B
    ↓
Persistence Boundary B
    ↓
Events B
    ↓
Dispatcher B
```

The runtimes must not share mutable persistence state, event collection state, dispatcher state, or execution state.

No process-wide lifecycle state is introduced by this decision.

## Post-Commit Domain Event Dispatch

The post-commit lifecycle established by ADR-0022 remains unchanged:

```text
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
```

Application Composition is responsible only for providing the runtime-scoped dependencies required by this lifecycle when an actual application consumer exists.

It does not move lifecycle ownership into:

* UnitOfWork;
* persistence;
* DomainEventDispatcher;
* a new event coordinator.

## Public API

No Application Composition public API is introduced.

The physical package, module boundary, entry point API, and lifecycle API remain intentionally unspecified until a concrete application consumer creates an actual requirement.

No generic dependency injection API is introduced.

## RuntimeBuilder

The RuntimeBuilder public contract remains unchanged.

No event-specific factories are added.

No persistence-specific composition methods are added.

No RuntimeBuilder extension is introduced merely to compensate for the absence of an application consumer.

Any future RuntimeBuilder change requires a separate Architecture Decision if the concrete application responsibility cannot be satisfied without changing the Frozen Foundation.

## Alternatives Rejected

### Existing Application Workspace as Consumer

Rejected.

`apps/api`, `apps/cli`, `apps/web`, and `apps/worker` are workspace boundaries only.

Selecting one without a concrete responsibility would create an application architecture based on directory naming rather than repository evidence.

### Dedicated Application Composition Module

Rejected for the current Sprint.

There is no existing application boundary that requires such a module.

Creating one would establish an architectural layer before its application responsibility exists.

### New Shared Application Composition Package

Rejected.

A new shared package would introduce an abstraction before there is a concrete consumer requiring reuse.

This would increase the public architecture without a demonstrated requirement.

### Extending RuntimeBuilder

Rejected.

RuntimeBuilder is part of the Frozen Foundation and already provides the required Domain-level composition boundary.

Extending it solely to bridge the absent application layer would expand the Foundation unnecessarily.

### Generic Dependency Injection Abstraction

Rejected.

No ServiceProvider, DependencyContainer, ApplicationContext, RuntimeContext, or equivalent abstraction is justified by the current repository.

Such an abstraction requires a separate architectural decision based on a concrete application requirement.

### Persistence-Owned Application Composition

Rejected.

Concrete persistence must remain responsible for persistence infrastructure and transaction participation.

It must not become responsible for application lifecycle or application composition.

## Consequences

### Positive

* No artificial application responsibility is introduced.
* The Foundation remains minimal and stable.
* Frozen Foundation contracts remain unchanged.
* Domain remains independent from concrete persistence.
* Runtime isolation remains preserved.
* Post-commit Domain Event lifecycle remains aligned with ADR-0022.
* No generic dependency injection mechanism is introduced.
* No premature public Application Composition API is introduced.
* Future composition remains driven by an actual application consumer.

### Negative

* Concrete persistence is not yet part of a complete executable application runtime.
* Post-commit Domain Event dispatch remains an architectural contract rather than a materialized application capability.
* Application Composition remains intentionally deferred.
* The repository still lacks a concrete application entry point.

## Risks

Future Application Composition must not:

* reverse the Domain/Persistence dependency direction;
* introduce a second lifecycle owner;
* move transaction ownership into application composition;
* make UnitOfWork event-aware;
* make DomainEventDispatcher persistence-aware;
* introduce shared mutable runtime state;
* become a generic dependency injection framework without a separate Architecture Decision;
* create an application layer without an actual application responsibility.

## Scope

This ADR establishes:

* the absence of a concrete application consumer during Sprint 11;
* the decision not to materialize Application Composition;
* preservation of the existing package dependency direction;
* preservation of runtime isolation;
* preservation of the ADR-0022 post-commit lifecycle;
* preservation of the Frozen Foundation;
* the requirement for a future Architecture Check when an actual application consumer appears.

This ADR does not establish:

* an Application Composition package;
* an application runtime API;
* an application entry point;
* a concrete application consumer;
* runtime-scoped handler dependency injection;
* a dependency injection container;
* a RuntimeContext;
* an ApplicationContext;
* a PersistenceCoordinator;
* a new RuntimeBuilder API;
* a concrete production application.

## Verification

The architecture is considered valid when:

```text
No concrete application consumer
        ↓
No Application Composition implementation
```

and:

```text
@aida/persistence
        ↓
@aida/domain
```

remains the package dependency direction.

The following lifecycle remains valid:

```text
ApplicationExecutor
        ↓
UnitOfWork.commit()
        ↓
Post-Commit Domain Event Collection
        ↓
DomainEventDispatcher.dispatch()
```

No Frozen Foundation contract is changed by this decision.

When an actual application consumer appears, its introduction must trigger a separate Application Composition Architecture Check and Architecture Decision.

## Status

Accepted.

This decision closes the Sprint 11 Application Composition Consumer scope without production code changes.

The repository does not currently contain a concrete application responsibility that justifies materializing Application Composition.

Future Application Composition must be driven by an actual application consumer and must receive a separate Architecture Decision before implementation.
