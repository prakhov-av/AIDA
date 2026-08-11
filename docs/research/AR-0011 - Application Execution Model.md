# AR-0011 - Application Execution Model

* Status: Proposed
* Date: 2026-08-05
* Authors: AIDA Team
* Related:

  * ADR-0011 - Application Execution Model
  * DD-0011 - Application Execution Model
  * ADR-0012 - Execution Strategy
  * DD-0012 - Execution Strategy

---

# Problem

The AIDA Application SDK provides independent contracts for coordinating application logic.

These contracts include:

* Command
* CommandHandler
* Query
* QueryHandler
* Repository
* UnitOfWork

Each contract has a focused responsibility and intentionally avoids assumptions about application frameworks, infrastructure, transport, or execution mechanisms.

This separation keeps the public SDK small and preserves Domain independence.

However, the SDK also requires an architectural model defining how application requests are coordinated.

Without a common execution model:

* command execution becomes application-specific;
* query execution becomes application-specific;
* handler coordination becomes application-specific;
* execution boundaries become inconsistent;
* transaction coordination remains undefined at the application architecture level;
* domain event publication lacks a common lifecycle boundary;
* cross-cutting execution behavior has no consistent architectural location.

The SDK therefore requires an explicit Application Execution Model that defines ownership and boundaries without introducing unnecessary technical abstractions.

---

# Goals

The research evaluates an architectural model that should:

* define a consistent application execution boundary;
* establish clear ownership of application request coordination;
* preserve Domain independence;
* remain framework-independent;
* support composable execution strategies;
* preserve a minimal public API;
* avoid unnecessary architectural complexity;
* provide a stable foundation for future execution capabilities.

The selected model should remain compatible with the existing SDK contracts and should not require replacing previously established Foundation components.

---

# Non-Goals

This research does not define:

* concrete framework integrations;
* dependency injection mechanisms;
* transport protocols;
* persistence technologies;
* event brokers;
* middleware implementations;
* logging frameworks;
* validation libraries;
* caching implementations;
* concrete lifecycle infrastructure.

This research also does not define the concrete execution strategy implementation.

The execution strategy is defined separately by ADR-0012 - Execution Strategy.

---

# Current State

The SDK already provides the fundamental contracts required to implement application use cases.

The Application layer defines:

* Command;
* CommandHandler;
* Query;
* QueryHandler;
* Repository;
* UnitOfWork.

The Domain layer defines:

* AggregateRoot;
* DomainEvent;
* DomainEvents.

These contracts establish the building blocks required for application execution but do not define how requests are coordinated.

The execution architecture therefore requires a separate coordination boundary.

The current Foundation has subsequently established:

* Handler Resolution;
* Pipeline-based Execution Strategy;
* Runtime Composition;
* Handler Registration;
* Handler Activation;
* Application Execution entry point.

The architectural model must therefore preserve these existing responsibilities rather than introduce a competing execution owner.

---

# Research Questions

The research was organized around the following architectural questions.

## 1. What should own application execution?

The primary question is whether application execution should remain application-specific or whether the SDK should define a common coordination boundary.

---

## 2. How should commands and queries enter execution?

The architecture must provide a consistent entry boundary for application requests without coupling execution to transport or framework mechanisms.

---

## 3. Where should concrete execution behavior belong?

The architecture must distinguish execution ownership from the mechanism used to perform execution.

This distinction allows an execution strategy to evolve without transferring ownership of the complete application execution model.

---

## 4. Where should handler resolution belong?

Handler Resolution must remain an execution dependency while preserving a clear separation between request coordination and handler implementation.

---

## 5. Where should persistence and domain event publication belong?

Persistence and Domain Event Publication participate in the broader application execution architecture.

However, their concrete orchestration mechanisms should not be invented as part of the basic Application Execution Model.

Dedicated architectural decisions may define those mechanisms when required.

---

## 6. Where should cross-cutting concerns belong?

Cross-cutting execution behavior should be introduced through composable execution mechanisms rather than by embedding unrelated responsibilities into the Execution Coordinator.

---

## 7. What should the public API contain?

The architecture should avoid introducing lifecycle-specific public abstractions unless they provide clear architectural value.

---

# Architectural Constraints

Any selected solution must comply with the established AIDA architectural principles.

## Domain Independence

The Domain layer must remain independent from:

* Application;
* Infrastructure;
* frameworks;
* transport protocols;
* persistence technologies;
* dependency injection mechanisms.

---

## Stable Public API

The public SDK API should remain intentionally small.

New public abstractions should only be introduced when they provide clear architectural value.

---

## Explicit Architecture

Application execution must remain explicit and understandable.

Hidden execution paths and implicit framework behavior should be avoided.

---

## Framework Independence

The execution model must remain independent from application frameworks.

Framework integrations belong outside the SDK.

---

## Composition

Execution behavior should be extended through composition rather than by transferring responsibilities between architectural owners.

---

## Single Responsibility

Execution coordination must not contain business logic.

Business behavior belongs to application handlers and the Domain model.

---

## Predictable Execution

The application request lifecycle must have clearly defined architectural boundaries.

Each responsibility should have one owner.

---

## Backward Compatibility

Previously established public contracts should remain valid.

The execution model must not require unnecessary replacement of existing Foundation components.

---

# Architectural Alternatives

The alternatives evaluated below concern **ownership of application execution coordination**.

They do not define concrete execution mechanisms.

---

## Alternative A — Independent Application Execution

Each application coordinates its own requests.

### Advantages

* maximum application-level flexibility;
* minimal SDK responsibility;
* no common coordination abstraction.

### Disadvantages

* duplicated execution infrastructure;
* inconsistent application architecture;
* different lifecycle semantics across applications;
* repeated architectural decisions.

### Evaluation

Rejected because the SDK would provide execution building blocks without providing a consistent Application execution boundary.

---

## Alternative B — Centralized Execution Coordinator

The SDK defines a common Execution Coordinator responsible for application request coordination.

Concrete execution behavior is delegated to an Execution Strategy.

### Advantages

* explicit execution ownership;
* consistent application execution boundary;
* reusable architecture;
* clear separation between coordination and execution strategy;
* framework independence;
* compatibility with composable execution behavior.

### Disadvantages

* increases the architectural responsibility of the Application layer;
* requires explicit separation between coordinator and execution strategy.

### Evaluation

Selected.

The Execution Coordinator provides the stable architectural ownership boundary while the concrete execution mechanism remains independently composable.

---

## Alternative C — Infrastructure-Driven Coordination

Execution coordination belongs entirely to external frameworks or infrastructure.

### Advantages

* smaller SDK responsibility;
* maximum framework-level flexibility.

### Disadvantages

* framework-dependent execution architecture;
* inconsistent lifecycle semantics;
* reduced portability;
* weaker Application layer ownership.

### Evaluation

Rejected because execution ownership should remain explicit and framework-independent.

---

## Alternative D — Separate Lifecycle Component

A dedicated lifecycle component owns application execution around the existing execution components.

### Advantages

* explicit lifecycle abstraction;
* potentially centralized lifecycle hooks.

### Disadvantages

* introduces another execution owner;
* duplicates coordination responsibilities;
* increases public and internal abstraction surface;
* risks coupling lifecycle semantics to a technical component.

### Evaluation

Rejected.

Lifecycle semantics should remain part of the existing Execution Coordinator rather than introducing a second lifecycle owner.

---

# Evaluation

The selected centralized execution model satisfies the primary architectural requirements.

| Criterion                      | Independent | Centralized Coordinator | Infrastructure-Driven | Separate Lifecycle Component |
| ------------------------------ | ----------- | ----------------------- | --------------------- | ---------------------------- |
| Domain Independence            | Yes         | Yes                     | Partial               | Yes                          |
| Explicitness                   | Partial     | Yes                     | Partial               | Yes                          |
| Simplicity                     | Yes         | Yes                     | Yes                   | No                           |
| Extensibility                  | Partial     | Yes                     | Partial               | Yes                          |
| Testability                    | Partial     | Yes                     | Partial               | Yes                          |
| Framework Independence         | Yes         | Yes                     | No                    | Yes                          |
| Stable Public API              | Yes         | Yes                     | Yes                   | Partial                      |
| Separation of Responsibilities | Partial     | Yes                     | Partial               | No                           |
| Long-Term Maintainability      | Partial     | Yes                     | Partial               | Partial                      |
| Consistency                    | No          | Yes                     | Partial               | Yes                          |

The Centralized Execution Coordinator provides the strongest balance between explicit ownership, composability, framework independence, and architectural simplicity.

---

# Selected Architectural Model

The selected architecture is:

```text
Application Request
        ↓
Execution Coordinator
        ↓
Execution Strategy
        ↓
Handler Resolution
        ↓
Application Handler
        ↓
Execution Result
```

The responsibilities are separated as follows:

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
```

Runtime remains the Composition Root.

The Execution Coordinator remains the single owner of application execution coordination.

The Pipeline remains an Execution Strategy.

The Application Handler remains responsible for executing the application use case.

---

# Execution Lifecycle Semantics

The selected architecture establishes the following semantic lifecycle:

```text
Begin
  ↓
Execute
  ↓
Complete / Fail
```

`Begin` represents entry into coordinated application execution.

`Execute` represents execution through the selected Execution Strategy and Application Handler.

`Complete` represents successful termination.

`Fail` represents unsuccessful termination.

These lifecycle semantics belong to the Execution Coordinator.

They do not require a separate lifecycle component.

---

# Persistence and Domain Events

Persistence and Domain Event Publication remain part of the broader Application Execution architecture.

The selected model does not assign lifecycle ownership to:

* Repository;
* UnitOfWork;
* DomainEvents;
* event transport;
* persistence infrastructure.

Their concrete orchestration remains a separate architectural concern.

This separation prevents the basic execution model from prematurely introducing:

* transaction managers;
* event buses;
* event dispatchers;
* lifecycle-specific contexts;
* infrastructure-specific coordination components.

Future architecture decisions may define concrete persistence or domain event orchestration while preserving the Execution Coordinator as the application execution owner.

---

# Runtime Boundary

Runtime is responsible for composition.

Runtime constructs the execution graph but does not own application execution semantics.

The architectural boundary is:

```text
Runtime
    │
    │ composition
    ▼
Execution Coordinator
```

The Execution Coordinator must remain independent from Runtime-specific composition types.

---

# Execution Strategy Boundary

The concrete execution strategy is defined separately by ADR-0012.

The selected Foundation strategy is Pipeline-based execution.

The Pipeline provides composable execution behavior.

It does not become the owner of the complete application execution model.

The relationship is:

```text
Execution Coordinator
        ↓
Pipeline
        ↓
Handler Resolution
        ↓
Application Handler
```

This separation prevents execution strategy implementation from becoming application lifecycle ownership.

---

# Handler Boundary

Application handlers execute application use cases.

Handlers do not own:

* application execution coordination;
* lifecycle completion;
* lifecycle failure;
* Runtime composition;
* Pipeline composition.

This preserves the separation between use-case behavior and execution coordination.

---

# Public API Implications

The selected architecture does not require a dedicated lifecycle interface.

The following abstractions are intentionally not introduced by this decision:

* `ExecutionLifecycle`;
* `ExecutionContext`;
* `TransactionManager`;
* `EventDispatcher`;
* `EventBus`;
* `ServiceProvider`;
* lifecycle-specific middleware contracts.

The public API should remain limited to the existing execution boundaries.

Any future public abstraction must be justified by a separate architectural decision.

---

# Risks

The selected architecture introduces several risks that must remain controlled.

## Coordinator Responsibility Growth

The Execution Coordinator could gradually accumulate unrelated responsibilities.

This must be prevented through explicit architectural boundaries.

---

## Strategy Ownership Leakage

The Pipeline or another Execution Strategy could become a de facto lifecycle owner.

This must be prevented by preserving the Coordinator as the single execution owner.

---

## Persistence Coupling

Persistence infrastructure could become coupled directly to the execution coordinator.

Persistence orchestration must remain a separate architectural concern unless explicitly introduced through a dedicated decision.

---

## Domain Event Coupling

Domain event publication could become coupled to transport-specific mechanisms.

Domain event publication must remain independent from transport infrastructure.

---

## Public API Expansion

Future execution features could introduce unnecessary lifecycle abstractions.

New public abstractions require separate architectural justification.

---

# Architectural Outcome

The research establishes the following architectural direction:

1. AIDA should define a common Application Execution Model.
2. Application execution should have one explicit execution owner.
3. The Execution Coordinator should own application execution coordination.
4. Concrete execution behavior should be delegated to an Execution Strategy.
5. Pipeline is the selected Execution Strategy defined by ADR-0012.
6. Runtime remains the Composition Root.
7. Application handlers remain use-case executors.
8. Persistence and Domain Event Publication remain separate architectural responsibilities.
9. No second lifecycle owner should be introduced.
10. No dedicated public lifecycle abstraction is required by this model.

---

# Conclusion

The research supports a centralized Application Execution Model based on a single Execution Coordinator.

The selected model provides:

* explicit ownership;
* predictable execution boundaries;
* framework independence;
* composable execution strategies;
* stable public APIs;
* separation of application execution from business logic;
* compatibility with the existing Runtime, Handler, and Pipeline Foundations.

The resulting architecture is:

```text
Application Request
        ↓
Execution Coordinator
        ↓
Execution Strategy
        ↓
Handler Resolution
        ↓
Application Handler
        ↓
Execution Result
```

The Execution Coordinator remains the single owner of application execution coordination.

The Pipeline remains an Execution Strategy.

No separate lifecycle component is required.

Persistence and Domain Event Publication remain broader application execution responsibilities whose concrete orchestration requires dedicated architectural decisions.

---

# Research Status

Research outcome:

* Problem defined
* Goals established
* Constraints identified
* Alternatives evaluated
* Evaluation criteria applied
* Centralized Execution Coordinator selected
* Execution Strategy separated from execution ownership
* Pipeline selected separately by ADR-0012
* Separate lifecycle component rejected
* Public lifecycle abstraction rejected

The research is complete and supports ADR-0011 - Application Execution Model.
