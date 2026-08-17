# ADR-0024 — Foundation Stability Boundary

* Status: Accepted
* Date: 2026-08-17
* Decision Owners: AIDA Architecture
* Scope: Foundation Stability

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

The Domain package contains the established runtime and application execution Foundation.

The persistence package contains the established concrete persistence infrastructure.

Previous Foundation decisions established:

* the Domain runtime composition boundary;
* the application execution lifecycle;
* handler registration and activation boundaries;
* the UnitOfWork contract;
* persistence coordination;
* concrete persistence infrastructure;
* runtime persistence composition;
* post-commit Domain Event dispatch;
* the Application Composition consumer boundary.

ADR-0023 established that Application Composition must not be materialized until an actual application-level consumer exists.

Sprint 12 performs a broader repository check to determine whether any other concrete responsibility has appeared that justifies a new Foundation boundary.

The purpose of this decision is therefore not to select a future Foundation Block, but to establish whether the current Foundation has reached a stable architectural point.

## Repository Evidence

The repository was checked for concrete responsibilities across the existing architecture.

The repository does not currently contain:

* a concrete application entry point;
* an application-level request;
* a concrete command or query handler consumer;
* an application-level handler consumer;
* an application composition implementation;
* a concrete application runtime assembly;
* a consumer that combines `@aida/domain` and `@aida/persistence`;
* a new persistence responsibility outside the established persistence boundary;
* a new runtime responsibility outside the established runtime boundary;
* a new domain responsibility requiring a new Foundation boundary;
* a new Domain Event responsibility requiring a new boundary;
* a new public API requirement requiring a new Foundation contract.

The existing `apps` workspace does not contain a concrete application implementation.

The existing Foundation components remain Foundation components and are not reclassified as application consumers merely because they provide reusable execution or runtime capabilities.

No new cross-package dependency requiring an architectural boundary was identified.

## Decision

AIDA Foundation is considered **architecturally stable at the current boundary**.

No new Foundation Block is introduced during Sprint 12.

No new package, module, runtime layer, application layer, composition layer, or public abstraction is created solely to fill an architectural gap.

The existing architecture remains:

```text
@aida/persistence
        ↓
@aida/domain
```

The existing Foundation boundaries remain unchanged.

Future Foundation expansion must be driven by an actual concrete responsibility in the repository.

The existence of an empty workspace, an existing capability, or an architectural possibility is not sufficient evidence for introducing a new Foundation boundary.

## Architectural Principle

Foundation expansion follows:

```text
Concrete Responsibility
        ↓
Architecture Check
        ↓
Architecture Design
        ↓
Minimal Stable Boundary
```

It must not follow:

```text
Existing Gap
        ↓
New Abstraction
        ↓
Future Consumer
```

Architecture is therefore expanded only when the repository provides evidence that an additional responsibility already exists.

## Dependency Direction

The existing dependency direction remains unchanged:

```text
@aida/persistence
        ↓
@aida/domain
```

No reverse dependency is introduced.

No application or composition boundary is introduced between these packages without a concrete consumer requiring it.

## Lifecycle Ownership

Existing lifecycle ownership remains unchanged.

`ApplicationExecutor` remains the application execution lifecycle owner.

`UnitOfWork` remains the transaction boundary.

`DomainEventDispatcher` remains the Domain Event publication boundary.

`RuntimeBuilder` remains the runtime composition boundary within the Domain Foundation.

No second lifecycle coordinator is introduced.

## Runtime Isolation

Existing runtime isolation requirements remain unchanged.

Independent runtime instances must retain independent:

* persistence state;
* event state;
* dispatcher state;
* execution state.

No process-wide mutable lifecycle state is introduced.

No shared runtime context is introduced.

## Frozen Foundation

The existing Frozen Foundation remains unchanged.

The following contracts and components are not modified by this decision:

```text
RuntimeBuilder
DefaultRuntimeBuilder
ApplicationExecutor
DefaultApplicationExecutor
HandlerFactory
HandlerActivator
HandlerRegistry
HandlerResolver
Repository
UnitOfWork
DomainEventDispatcher
AggregateRoot
DomainEvents
InMemoryPersistence
```

No indirect modification is introduced to bypass the Frozen Foundation.

If a future concrete responsibility cannot be satisfied without modifying a Frozen Foundation boundary, a separate Architecture Decision is required.

## Public API

No new public API is introduced.

No generic abstraction is introduced for hypothetical future consumers.

The following abstractions remain unjustified in the current repository:

```text
RuntimeContext
ApplicationContext
ServiceProvider
DependencyContainer
PersistenceCoordinator
ExecutionContext
EventPublishingUnitOfWork
EventAwareUnitOfWork
PostCommitEventDispatcher
```

A future requirement for any such abstraction must be evaluated from concrete repository evidence.

## Alternatives Rejected

### Introduce a New Foundation Block

Rejected.

No concrete responsibility exists that requires a new Foundation boundary.

Introducing one would create architecture without a demonstrated consumer.

### Materialize Application Composition

Rejected.

ADR-0023 already establishes the absence of a concrete application consumer.

Sprint 12 provides no new evidence that changes that decision.

### Create an Application Workspace Implementation

Rejected.

The existence of application workspace boundaries does not constitute an application responsibility.

Selecting an application target without a concrete requirement would make directory structure the source of architecture rather than repository evidence.

### Introduce a Generic Runtime or Dependency Container

Rejected.

No concrete consumer requires such an abstraction.

Introducing one would expand the public architecture without a demonstrated requirement.

### Extend Existing Frozen Foundation

Rejected.

The current repository does not demonstrate a responsibility that requires changing the Frozen Foundation.

## Consequences

### Positive

* Foundation remains minimal and stable.
* No artificial architectural layer is introduced.
* Existing dependency direction remains unchanged.
* Existing lifecycle ownership remains unchanged.
* Runtime isolation remains preserved.
* Frozen Foundation remains intact.
* Public API remains stable.
* Application Composition remains correctly deferred.
* Future architecture remains evidence-driven.

### Negative

* The repository still does not contain a complete concrete application runtime.
* The existing Foundation capabilities are not yet consumed by a production application.
* Future Foundation work must wait for a concrete repository responsibility.
* Some architectural capabilities remain intentionally unmaterialized.

These consequences are accepted because introducing implementation without a concrete responsibility would create artificial architecture.

## Scope

This ADR establishes:

* the current Foundation as a stable architectural boundary;
* the absence of a demonstrated new Foundation responsibility during Sprint 12;
* the requirement for evidence before Foundation expansion;
* preservation of existing dependency direction;
* preservation of lifecycle ownership;
* preservation of runtime isolation;
* preservation of the Frozen Foundation;
* preservation of the existing public API.

This ADR does not establish:

* an Application Composition implementation;
* an application entry point;
* a new application package;
* a new runtime package;
* a new persistence boundary;
* a new Domain Event boundary;
* a dependency injection container;
* a RuntimeContext;
* an ApplicationContext;
* a PersistenceCoordinator;
* a new RuntimeBuilder API;
* a concrete production application.

## Verification

The architecture is considered valid when:

```text
No demonstrated new responsibility
        ↓
No new Foundation Block
```

and:

```text
@aida/persistence
        ↓
@aida/domain
```

remains the package dependency direction.

The existing lifecycle remains:

```text
ApplicationExecutor
        ↓
execution
        ↓
UnitOfWork.commit()
        ↓
Post-Commit Domain Event Collection
        ↓
DomainEventDispatcher.dispatch()
        ↓
complete
```

No Frozen Foundation contract is changed by this decision.

When a new concrete responsibility appears, it must trigger a dedicated Architecture Check before implementation.

## Status

Accepted.

This decision closes the Sprint 12 Foundation Stability scope without production code changes.

The repository currently provides no evidence that justifies introducing another Foundation boundary.

Future Foundation expansion must be driven by an actual concrete responsibility and must receive a dedicated Architecture Check and Architecture Design before implementation.
