# ADR-0016 - Application Execution Lifecycle

* Status: Proposed
* Date: 2026-08-10
* Authors: AIDA Team
* Related:

  * AR-0016 - Application Execution Lifecycle
  * DD-0016 - Application Execution Lifecycle
  * ADR-0011 - Application Execution Model
  * DD-0011 - Application Execution Model
  * ADR-0012 - Execution Strategy
  * DD-0012 - Execution Strategy
  * ADR-0014 - Handler Activation Model
  * ADR-0015 - Handler Registration Model

---

# Context

The AIDA Application Execution Model defines a common lifecycle for application request execution.

The current Foundation implements explicit request execution through:

* handler registration;
* handler activation;
* handler resolution;
* pipeline execution;
* application execution entry point.

The current execution path is:

```text
Application Request
        ↓
Execution Coordinator
        ↓
Pipeline
        ↓
Handler Resolution
        ↓
Application Handler
        ↓
Persistence
        ↓
Domain Event Publication
        ↓
Execution Complete
```

The existing Application Execution Model defines the Execution Coordinator as the owner of the complete application execution lifecycle.

The current Pipeline-based Execution Strategy provides the concrete execution mechanism used by the Execution Coordinator.

The Handler Activation and Handler Registration foundations provide the dependencies required to construct and execute the application handler path.

The architecture therefore requires a precise definition of the lifecycle semantics without introducing a second execution owner or a new technical lifecycle framework.

The architectural research documented in AR-0016 evaluated alternative lifecycle models and concluded that the Application Execution Lifecycle should describe the semantic boundary of the existing Execution Coordinator rather than introduce a separate runtime component.

---

# Decision

The AIDA SDK SHALL define the Application Execution Lifecycle as the semantic lifecycle of the existing Execution Coordinator.

The Application Execution Lifecycle SHALL NOT introduce a second execution owner.

The lifecycle SHALL be understood as:

```text
Begin
  ↓
Execute
  ↓
Complete
```

or, when execution cannot complete successfully:

```text
Begin
  ↓
Execute
  ↓
Fail
```

The existing Execution Coordinator remains responsible for coordinating the complete application execution lifecycle.

The existing Pipeline-based Execution Strategy remains responsible for executing the application request within that lifecycle.

The lifecycle therefore describes the semantic boundaries of existing execution responsibilities rather than introducing a new execution abstraction.

---

# Architectural Ownership

The existing Execution Coordinator remains the single owner of the complete application execution lifecycle.

The responsibility model is:

```text
Runtime
  │
  │ composition
  ▼
Execution Coordinator
  │
  │ execution strategy
  ▼
Pipeline
  │
  ▼
Handler Resolution
  │
  ▼
Application Handler
  │
  ▼
Persistence
  │
  ▼
Domain Event Publication
  │
  ▼
Execution Complete
```

Runtime remains the Composition Root.

Pipeline remains the execution strategy.

Application handlers remain responsible for application use cases.

Persistence and Domain Event Publication remain lifecycle responsibilities defined by the Application Execution Model.

No additional lifecycle owner is introduced.

---

# Lifecycle

Every application execution follows the same logical lifecycle.

## Begin

The Begin stage represents the start of one application execution.

The Execution Coordinator establishes that an application request has entered the execution lifecycle.

Begin does not itself:

* resolve handlers;
* invoke handlers;
* perform persistence;
* publish domain events.

Begin represents the lifecycle boundary before execution work starts.

---

## Execute

The Execute stage represents application request execution.

The existing Execution Strategy remains responsible for executing the request.

The execution path is:

```text
Application Request
        ↓
Execution Coordinator
        ↓
Pipeline
        ↓
Handler Resolution
        ↓
Application Handler
```

The existing execution contracts remain unchanged.

---

## Complete

The Complete stage represents successful termination of the application execution lifecycle.

Completion occurs only after the responsibilities defined by the Application Execution Model have successfully completed.

Where persistence and domain event publication participate in the execution lifecycle, successful completion occurs after those lifecycle responsibilities have completed successfully.

---

## Fail

The Fail stage represents unsuccessful termination of the application execution lifecycle.

Failure may originate from any lifecycle stage that prevents successful completion.

Failure semantics remain governed by the existing error and result model.

This ADR does not introduce a new failure representation.

---

# Persistence and Domain Events

Persistence and Domain Event Publication remain part of the application execution lifecycle defined by ADR-0011.

This ADR does not remove or defer these responsibilities.

Instead, it clarifies that they are lifecycle stages coordinated by the existing Execution Coordinator rather than responsibilities of Runtime or Pipeline itself.

The lifecycle is therefore conceptually:

```text
Begin
  ↓
Execute Application Request
  ↓
Persist Application State
  ↓
Publish Domain Events
  ↓
Complete
```

If any required lifecycle responsibility fails:

```text
Begin
  ↓
Execute
  ↓
Failure
```

The concrete mechanisms for persistence and Domain Event Publication are not defined by this ADR.

Dedicated architectural decisions may define:

* transaction boundaries;
* Unit of Work coordination;
* persistence orchestration;
* domain event publication orchestration.

Such decisions SHALL preserve the lifecycle ownership established here.

---

# Runtime Boundary

Runtime remains responsible for composition.

Runtime constructs the execution graph required by the Execution Coordinator.

Conceptually:

```text
RuntimeBuilder
        │
        ├── Handler Registry
        ├── Handler Activator
        ├── Handler Resolver
        ├── Pipeline Builder
        ├── Pipeline Executor
        └── Execution Coordinator
```

Runtime SHALL NOT own application execution semantics.

The Execution Coordinator SHALL NOT depend on Runtime-specific composition types.

This preserves the existing separation:

```text
Runtime
  │
  │ composition
  ▼
Execution
```

---

# Pipeline Boundary

The Pipeline remains an Execution Strategy.

It provides composable execution behavior within the lifecycle owned by the Execution Coordinator.

The Pipeline SHALL NOT become the owner of the complete application execution lifecycle.

The relationship remains:

```text
Execution Coordinator
        ↓
Pipeline
        ↓
Handler Resolution
        ↓
Application Handler
```

The Pipeline does not independently coordinate:

* persistence;
* domain event publication;
* runtime composition;
* complete application lifecycle ownership.

---

# Pipeline Context

The existing Pipeline Context described by the Execution Strategy remains part of the Pipeline architecture.

This ADR does not introduce a new lifecycle context.

This ADR does not change the existing Pipeline Context contract or its responsibilities.

Any future lifecycle-level context must be justified by a separate architectural decision.

---

# Handler Boundary

Application handlers remain responsible for executing application use cases.

Handlers SHALL NOT become lifecycle coordinators.

Handlers SHALL NOT directly own:

* lifecycle completion;
* lifecycle failure;
* Runtime composition;
* Pipeline composition.

The handler remains one stage within the execution lifecycle.

---

# Architectural Invariants

The following invariants SHALL be preserved.

## Single Lifecycle Owner

The existing Execution Coordinator remains the single owner of the complete application execution lifecycle.

No second lifecycle owner is introduced.

## Single Execution Entry

Application requests enter execution through the established Execution Coordinator entry point.

## Explicit Lifecycle

The lifecycle remains explicit:

```text
Begin
  ↓
Execute
  ↓
Complete / Fail
```

## Runtime Isolation

Runtime composes execution dependencies but does not define application execution semantics.

## Pipeline Isolation

Pipeline provides execution strategy behavior but does not own the complete lifecycle.

## Handler Isolation

Application handlers execute application use cases but do not coordinate the lifecycle.

## Persistence Alignment

Persistence remains a lifecycle responsibility as established by ADR-0011.

## Domain Event Alignment

Domain Event Publication remains a lifecycle responsibility as established by ADR-0011.

## Framework Independence

The lifecycle remains independent of application frameworks and dependency injection mechanisms.

## Minimal Abstractions

No new technical abstraction is introduced solely to represent lifecycle semantics.

---

# Alternatives Considered

## Handler-Centric Lifecycle

The handler invocation could define the complete execution boundary.

```text
Request
  ↓
Handler
  ↓
Result
```

Rejected because this would remove the explicit lifecycle responsibilities already defined by the Application Execution Model.

It would also make persistence and Domain Event Publication difficult to represent consistently.

---

## Pipeline-Owned Lifecycle

The Pipeline could own the complete lifecycle.

```text
Request
  ↓
Pipeline Begin
  ↓
Handler
  ↓
Pipeline Complete
```

Rejected because the Pipeline is an Execution Strategy rather than the owner of the complete application execution lifecycle.

This would conflate execution strategy with lifecycle ownership.

---

## Runtime-Owned Lifecycle

Runtime could coordinate the complete application execution lifecycle.

Rejected because Runtime is the Composition Root.

Making Runtime responsible for execution semantics would couple execution to composition and violate the existing Runtime/Execution separation.

---

## New Lifecycle Component

A separate lifecycle component could be introduced around the existing Execution Coordinator.

Rejected because it would create a second execution owner and duplicate responsibilities already assigned to the Execution Coordinator.

The lifecycle is therefore defined semantically rather than through a new technical component.

---

## Execution Coordinator Lifecycle

The existing Execution Coordinator owns the complete application execution lifecycle, while the Pipeline remains its execution strategy.

```text
Execution Coordinator
        │
        ├── Begin
        │
        ├── Execute
        │      ↓
        │   Pipeline
        │      ↓
        │   Handler
        │
        ├── Persistence
        │
        ├── Domain Event Publication
        │
        └── Complete / Fail
```

Selected because this model preserves the existing Application Execution Model and does not introduce a second lifecycle owner.

---

# Rationale

The selected model clarifies the semantic lifecycle without changing the ownership model already established by the Application Execution Foundation.

It preserves the existing responsibilities:

* Runtime composes;
* Execution Coordinator owns the application execution lifecycle;
* Pipeline provides execution strategy;
* Handler executes the application use case;
* Persistence participates in the lifecycle;
* Domain Event Publication participates in the lifecycle.

The decision therefore strengthens the existing architecture rather than introducing another abstraction layer.

---

# Consequences

## Positive

* Application execution has an explicit semantic lifecycle.
* Existing Execution Coordinator ownership is preserved.
* Runtime remains the Composition Root.
* Pipeline remains an Execution Strategy.
* Persistence remains aligned with the existing Application Execution Model.
* Domain Event Publication remains aligned with the existing Application Execution Model.
* Handler responsibilities remain isolated.
* No second lifecycle owner is introduced.
* No new public lifecycle abstraction is required.
* Existing public execution contracts remain stable.

## Negative

* The Execution Coordinator must remain clearly separated from the Pipeline implementation.
* Future persistence and Domain Event Publication designs must preserve the lifecycle boundaries established here.
* Lifecycle semantics must remain synchronized with the Execution Coordinator implementation.

These consequences are intentional.

---

# Public API Impact

This decision does not require a new public lifecycle interface.

The existing Execution Coordinator and execution contracts remain the public architectural boundary.

The decision does not introduce:

* `ExecutionLifecycle`;
* `ExecutionContext`;
* `TransactionManager`;
* `EventDispatcher`;
* `EventBus`;
* `ServiceProvider`;
* lifecycle-specific middleware contracts.

The existing Pipeline Context is not changed by this ADR.

Any future public abstraction required by persistence, Domain Event Publication, or lifecycle coordination SHALL be introduced through a dedicated Detailed Design and architectural review.

---

# Migration

No migration is required.

The decision clarifies the semantics of the existing Execution Coordinator.

Existing Runtime, Handler Registration, Handler Activation, Handler Resolution, Pipeline, and execution contracts remain valid.

No existing component needs to be replaced by a new lifecycle component.

---

# Scope

This decision applies to the semantic lifecycle of application execution.

It does not redefine:

* Domain Foundation;
* Application request contracts;
* Handler Registration;
* Handler Activation;
* Handler Resolution;
* Pipeline execution strategy;
* Runtime Composition;
* persistence implementation;
* transaction implementation;
* domain event transport;
* application framework integrations.

---

# Freeze Criteria

The Application Execution Lifecycle Foundation may be frozen when:

* the Execution Coordinator is confirmed as the single lifecycle owner;
* Begin, Execute, Complete, and Fail boundaries are stable;
* persistence remains aligned with the Application Execution Model;
* Domain Event Publication remains aligned with the Application Execution Model;
* Runtime remains the Composition Root;
* Pipeline remains the Execution Strategy;
* no second lifecycle owner is introduced;
* no unnecessary public abstraction is introduced;
* Detailed Design is reviewed;
* TypeScript checks pass;
* unit tests pass;
* Architecture Review is complete.

---

# Implementation Outcome

The Application Execution Lifecycle SHALL be implemented as the lifecycle semantics of the existing Execution Coordinator.

The implementation SHALL preserve the following conceptual structure:

```text
Application Request
        ↓
Execution Coordinator
        ↓
Pipeline
        ↓
Handler Resolution
        ↓
Application Handler
        ↓
Persistence
        ↓
Domain Event Publication
        ↓
Execution Complete
```

Failure may terminate the lifecycle at any stage that prevents successful completion.

Implementation SHALL NOT introduce a separate lifecycle owner.

Implementation details SHALL be defined separately by DD-0016.

---

# Validation

The resulting implementation SHALL be validated through:

* TypeScript type checking;
* unit tests;
* Architecture Review;
* Freeze review.

The implementation must preserve:

* explicit lifecycle boundaries;
* single lifecycle ownership;
* Runtime isolation;
* Pipeline isolation;
* handler isolation;
* persistence alignment;
* Domain Event alignment;
* framework independence;
* stable existing public contracts.
