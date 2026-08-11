# ADR-0016 - Application Execution Lifecycle

* Status: Accepted
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

The AIDA Application Execution Model defines a common boundary for application request execution.

The current Foundation provides:

* handler registration;
* handler activation;
* handler resolution;
* pipeline construction;
* pipeline execution;
* application execution entry point.

The current execution path is:

```text
Application Request
        ↓
Application Executor
        ↓
Pipeline Executor
        ↓
Handler Resolution
        ↓
Application Handler
        ↓
Execution Result
```

The existing Application Execution Model establishes the application execution coordinator as the owner of application execution coordination.

The Pipeline-based Execution Strategy provides the concrete execution mechanism used within that boundary.

The architecture therefore requires explicit lifecycle semantics without introducing a second execution owner or a separate lifecycle framework.

Persistence and Domain Event Publication are broader application execution responsibilities, but their concrete orchestration is not currently implemented by the Application Executor Foundation and is outside the scope of this decision.

The architectural research documented in AR-0016 evaluated alternative lifecycle models and concluded that the Application Execution Lifecycle should describe the semantic boundary of the existing Application Executor rather than introduce a separate technical lifecycle component.

---

# Decision

The AIDA SDK SHALL define the Application Execution Lifecycle as the semantic lifecycle of the existing Application Executor.

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

The existing Application Executor remains responsible for application execution coordination.

The existing Pipeline-based Execution Strategy remains responsible for executing the application request within that coordination boundary.

The lifecycle therefore describes the semantic boundaries of existing execution responsibilities rather than introducing a new technical lifecycle abstraction.

---

# Architectural Ownership

The Application Executor remains the single owner of application execution coordination.

The responsibility model is:

```text
Runtime
  │
  │ composition
  ▼
Application Executor
  │
  │ execution strategy
  ▼
Pipeline Executor
  │
  ▼
Handler Resolver
  │
  ▼
Application Handler
```

Runtime remains the Composition Root.

Pipeline remains the Execution Strategy.

Application handlers remain responsible for application use cases.

Handler Resolution remains an execution dependency.

Persistence and Domain Event Publication remain separate application-level responsibilities and do not become execution owners.

No additional lifecycle owner is introduced.

---

# Lifecycle

Every application execution follows the same logical lifecycle.

## Begin

The Begin stage represents the start of one application execution.

The Application Executor receives an application request and establishes the execution boundary.

Begin does not itself:

* implement application business logic;
* compose Runtime dependencies;
* become a handler;
* introduce a lifecycle-specific abstraction.

Begin represents the semantic boundary before execution work starts.

---

## Execute

The Execute stage represents application request execution.

The existing Execution Strategy remains responsible for executing the request.

The current execution path is:

```text
Application Request
        ↓
Application Executor
        ↓
Pipeline Executor
        ↓
Handler Resolver
        ↓
Pipeline
        ↓
Application Handler
```

The existing execution contracts remain unchanged.

The Application Executor delegates concrete execution to the configured Execution Strategy.

---

## Complete

The Complete stage represents successful termination of application execution.

For the current Foundation, successful completion is represented by successful resolution of the existing execution contract.

No separate completion object or lifecycle interface is introduced.

Future application-level responsibilities may participate in successful completion when their orchestration is explicitly defined by subsequent architectural decisions.

---

## Fail

The Fail stage represents unsuccessful termination of application execution.

Failure may originate from any execution stage that prevents successful completion.

For the current Foundation, failure is represented through the existing Promise-based execution contract.

The Application Executor does not transform failures into a new lifecycle-specific representation.

---

# Persistence and Domain Events

Persistence and Domain Event Publication remain broader responsibilities of the Application Execution architecture.

This ADR does not claim that the current Application Executor implements their orchestration.

The current Foundation does not introduce a persistence lifecycle coordinator or a domain event lifecycle coordinator.

The architectural relationship is therefore:

```text
Application Execution
        │
        ├── execution coordination
        │
        ├── persistence responsibility
        │
        └── domain event responsibility
```

The Application Executor remains the single owner of application execution coordination.

Persistence and Domain Event Publication do not become separate lifecycle owners.

Future architectural decisions may define:

* transaction boundaries;
* Unit of Work orchestration;
* persistence orchestration;
* domain event publication orchestration.

Such decisions SHALL preserve the ownership model established by this ADR.

---

# Runtime Boundary

Runtime remains responsible for composition.

Runtime constructs the execution graph required by the Application Executor.

Conceptually:

```text
RuntimeBuilder
        │
        ├── Handler Registry
        ├── Handler Activator
        ├── Handler Resolver
        ├── Pipeline Builder
        ├── Pipeline Executor
        └── Application Executor
```

Runtime SHALL NOT own application execution semantics.

The Application Executor SHALL NOT depend on Runtime-specific composition types.

This preserves the existing separation:

```text
Runtime
  │
  │ composition
  ▼
Application Execution
```

---

# Pipeline Boundary

The Pipeline remains an Execution Strategy.

It provides composable execution behavior within the lifecycle owned by the Application Executor.

The Pipeline SHALL NOT become the owner of the complete application execution lifecycle.

The relationship remains:

```text
Application Executor
        ↓
Pipeline Executor
        ↓
Pipeline
        ↓
Handler Resolution
        ↓
Application Handler
```

The Pipeline does not independently coordinate:

* application lifecycle ownership;
* Runtime composition;
* persistence ownership;
* Domain Event Publication ownership.

This preserves the distinction between execution strategy and lifecycle ownership.

---

# Pipeline Context

The existing Pipeline Context defined by the Execution Strategy remains part of the Pipeline architecture.

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

The handler remains one stage within application execution.

---

# Architectural Invariants

The following invariants SHALL be preserved.

## Single Lifecycle Owner

The Application Executor remains the single owner of application execution coordination.

No second lifecycle owner is introduced.

## Single Execution Entry

Application requests enter execution through the established Application Executor entry point.

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

Pipeline provides execution strategy behavior but does not own the complete application execution lifecycle.

## Handler Isolation

Application handlers execute application use cases but do not coordinate the lifecycle.

## Persistence Alignment

Persistence remains a separate application-level responsibility.

Its concrete orchestration must preserve the lifecycle ownership established here.

## Domain Event Alignment

Domain Event Publication remains a separate application-level responsibility.

Its concrete orchestration must preserve the lifecycle ownership established here.

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

Rejected because this would make application execution ownership dependent on individual handlers and would remove the explicit execution coordination boundary.

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

A separate lifecycle component could be introduced around the existing Application Executor.

Rejected because it would create a second execution owner and duplicate responsibilities already assigned to the Application Executor.

The lifecycle is therefore defined semantically rather than through a new technical component.

---

## Application Executor Lifecycle

The existing Application Executor owns application execution coordination, while the Pipeline remains its Execution Strategy.

```text
Application Executor
        │
        ├── Begin
        │
        ├── Execute
        │      ↓
        │   Pipeline
        │      ↓
        │   Handler
        │
        └── Complete / Fail
```

Selected because this model preserves the existing Application Execution Model, aligns with the current Foundation implementation, and does not introduce a second lifecycle owner.

---

# Rationale

The selected model clarifies the semantic lifecycle without changing the established ownership model.

It preserves the existing responsibilities:

* Runtime composes;
* Application Executor coordinates application execution;
* Pipeline provides execution strategy;
* Handler executes the application use case;
* Handler Resolution resolves the executable handler;
* Persistence remains a separate application-level responsibility;
* Domain Event Publication remains a separate application-level responsibility.

The decision therefore strengthens the existing architecture without introducing another abstraction layer.

---

# Consequences

## Positive

* Application execution has an explicit semantic lifecycle.
* Existing Application Executor ownership is preserved.
* Runtime remains the Composition Root.
* Pipeline remains an Execution Strategy.
* Handler responsibilities remain isolated.
* Persistence remains separate from execution ownership.
* Domain Event Publication remains separate from execution ownership.
* No second lifecycle owner is introduced.
* No new public lifecycle abstraction is required.
* Existing public execution contracts remain stable.

## Negative

* The Application Executor must remain clearly separated from the Pipeline implementation.
* Future persistence and Domain Event Publication designs must preserve the lifecycle boundaries established here.
* Lifecycle semantics must remain synchronized with the Application Executor implementation.
* Future lifecycle responsibilities require explicit architectural decisions rather than implicit expansion of the Application Executor.

These consequences are intentional.

---

# Public API Impact

This decision does not require a new public lifecycle interface.

The existing Application Executor and execution contracts remain the public architectural boundary.

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

The decision clarifies the semantics of the existing Application Executor.

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

* the Application Executor is confirmed as the single lifecycle owner;
* Begin, Execute, Complete, and Fail boundaries are stable;
* Runtime remains the Composition Root;
* Pipeline remains the Execution Strategy;
* Handler Resolution remains an execution dependency;
* Application Handlers remain use-case executors;
* persistence remains outside the current implementation boundary;
* Domain Event Publication remains outside the current implementation boundary;
* no second lifecycle owner is introduced;
* no unnecessary public abstraction is introduced;
* Detailed Design is reviewed;
* TypeScript checks pass;
* unit tests pass;
* Architecture Review is complete.

---

# Implementation Outcome

The Application Execution Lifecycle SHALL be represented by the lifecycle semantics of the existing Application Executor.

The implementation SHALL preserve the following conceptual structure:

```text
Application Request
        ↓
Application Executor
        ↓
Pipeline Executor
        ↓
Pipeline
        ↓
Handler Resolution
        ↓
Application Handler
        ↓
Execution Result
```

The lifecycle semantics are:

```text
Begin
  ↓
Execute
  ↓
Complete / Fail
```

Persistence and Domain Event Publication remain outside the current implementation boundary.

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
