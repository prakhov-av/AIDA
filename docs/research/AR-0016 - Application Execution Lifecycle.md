# AR-0016 - Application Execution Lifecycle

* Status: Proposed
* Date: 2026-08-10
* Authors: AIDA Team
* Related:

  * ADR-0011 - Application Execution Model
  * DD-0011 - Application Execution Model
  * ADR-0012 - Execution Strategy
  * DD-0012 - Execution Strategy
  * ADR-0014 - Handler Activation Model
  * ADR-0015 - Handler Registration Model
  * ADR-0016 - Application Execution Lifecycle
  * DD-0016 - Application Execution Lifecycle

---

# Problem

The AIDA Application Execution Model defines a common architectural boundary for application request execution.

The current Runtime Foundation and Execution Foundation provide explicit composition for request execution through:

* handler registration;
* handler activation;
* handler resolution;
* pipeline construction;
* pipeline execution;
* application execution entry point.

The implemented execution path currently establishes the following boundary:

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

This structure establishes the concrete execution path but does not by itself define the semantic lifecycle boundaries of application execution.

The architecture therefore requires explicit lifecycle semantics that clarify:

* where application execution begins;
* who owns execution coordination;
* where concrete execution occurs;
* how successful execution terminates;
* how unsuccessful execution terminates;
* which components must not become lifecycle owners.

The research must also distinguish between architectural responsibilities and currently implemented mechanisms.

Persistence and Domain Event Publication remain broader Application Execution responsibilities, but the current Foundation does not implement their orchestration inside the Application Executor.

---

# Research Goals

The research evaluates an execution lifecycle model that should:

* preserve the existing Application Executor boundary;
* establish one explicit lifecycle owner;
* preserve the Pipeline as an Execution Strategy;
* preserve Handler isolation;
* preserve Runtime as the Composition Root;
* avoid introducing a second lifecycle owner;
* avoid introducing unnecessary lifecycle-specific public abstractions;
* remain compatible with the current Foundation implementation;
* provide a stable basis for future persistence and Domain Event orchestration decisions.

---

# Non-Goals

This research does not define:

* transaction management;
* UnitOfWork orchestration;
* persistence implementation;
* persistence infrastructure;
* Domain Event transport;
* EventBus implementation;
* event dispatch infrastructure;
* framework lifecycle integration;
* dependency injection;
* lifecycle middleware;
* lifecycle-specific context objects.

These concerns require separate architectural decisions if they become necessary.

---

# Current Foundation

The current execution Foundation contains the following conceptual responsibilities:

```text
Runtime Composition
        ↓
Application Execution
        ↓
Pipeline Execution Strategy
        ↓
Handler Resolution
        ↓
Application Handler
```

The Runtime Foundation composes the dependencies required to construct this graph.

The Application Executor represents the application execution entry boundary.

The Pipeline Executor provides the concrete execution strategy.

The Handler Resolver locates the application handler.

The Application Handler executes the application use case.

No separate lifecycle component currently exists.

---

# Research Questions

## 1. Who should own the application execution lifecycle?

The lifecycle requires one explicit owner.

The owner must coordinate application execution without becoming responsible for business logic, Runtime composition, or execution-strategy implementation.

---

## 2. Should lifecycle ownership belong to the Pipeline?

The Pipeline already provides the concrete execution strategy.

The research must determine whether extending that responsibility to lifecycle ownership would improve the architecture or conflate two different concerns.

---

## 3. Should Runtime own the lifecycle?

Runtime is responsible for composing the execution graph.

The research must determine whether assigning lifecycle ownership to Runtime would violate the separation between composition and execution.

---

## 4. Should a new lifecycle component be introduced?

A dedicated lifecycle abstraction could technically be placed around the existing execution components.

The research must evaluate whether such a component provides architectural value or merely duplicates existing ownership.

---

## 5. How should failure be represented?

The current execution contracts already provide Promise-based success and failure semantics.

The research must determine whether a new lifecycle-specific failure abstraction is necessary.

---

## 6. How should persistence and Domain Event Publication relate to lifecycle ownership?

The research must preserve the distinction between:

```text
architectural responsibility
```

and:

```text
currently implemented orchestration
```

Persistence and Domain Event Publication may participate in the broader application execution architecture without becoming independent lifecycle owners.

---

# Architectural Constraints

The research is constrained by the existing AIDA architecture.

## Single Execution Owner

Application execution must have one explicit owner.

No second lifecycle owner should be introduced.

## Runtime Isolation

Runtime remains the Composition Root.

Runtime must not become responsible for application execution semantics.

## Pipeline Isolation

The Pipeline remains an Execution Strategy.

The Pipeline must not become the owner of the complete application execution lifecycle.

## Handler Isolation

Application handlers execute application use cases.

Handlers must not become lifecycle coordinators.

## Framework Independence

Lifecycle semantics must remain independent of application frameworks and dependency injection mechanisms.

## Minimal Public API

Lifecycle semantics should not require a new public lifecycle interface unless a separate architectural decision demonstrates clear value.

## Composition

Execution behavior should remain composable without transferring lifecycle ownership between architectural layers.

---

# Alternatives Considered

## Alternative A — Handler-Owned Lifecycle

The application handler could define the complete execution lifecycle.

```text
Application Request
        ↓
Handler
        ↓
Result
```

### Advantages

* minimal execution structure;
* direct request-to-handler mapping.

### Disadvantages

* lifecycle ownership becomes distributed across handlers;
* handlers become responsible for coordination concerns;
* persistence and Domain Event responsibilities become difficult to coordinate consistently;
* cross-cutting execution behavior loses a stable architectural boundary.

### Evaluation

Rejected.

The handler should remain responsible for the application use case rather than the complete execution lifecycle.

---

## Alternative B — Pipeline-Owned Lifecycle

The Pipeline could own the complete execution lifecycle.

```text
Application Request
        ↓
Pipeline Begin
        ↓
Handler
        ↓
Pipeline Complete
```

### Advantages

* lifecycle behavior can be composed with pipeline behavior;
* lifecycle hooks could be implemented around handler execution.

### Disadvantages

* execution strategy becomes lifecycle owner;
* lifecycle ownership becomes coupled to one execution strategy;
* Runtime and Application Execution boundaries become less explicit;
* replacing or composing execution strategies becomes architecturally harder.

### Evaluation

Rejected.

The Pipeline is an Execution Strategy and should remain separate from lifecycle ownership.

---

## Alternative C — Runtime-Owned Lifecycle

Runtime could coordinate the complete application execution lifecycle.

```text
Runtime
        ↓
Application Request
        ↓
Execution
```

### Advantages

* all dependencies are available at the composition boundary;
* execution could be centrally controlled.

### Disadvantages

* composition and execution become coupled;
* Runtime becomes application-specific;
* Application Execution becomes dependent on Runtime concerns;
* separation between Composition Root and execution semantics is lost.

### Evaluation

Rejected.

Runtime must remain the Composition Root rather than become an execution coordinator.

---

## Alternative D — Separate Lifecycle Component

A dedicated lifecycle component could wrap the existing Application Executor.

```text
Lifecycle
        ↓
Application Executor
        ↓
Pipeline
        ↓
Handler
```

### Advantages

* explicit lifecycle abstraction;
* centralized lifecycle hooks.

### Disadvantages

* creates another execution owner;
* duplicates existing coordination responsibilities;
* increases abstraction surface;
* provides little value when lifecycle semantics already belong to the Application Executor.

### Evaluation

Rejected.

The lifecycle should remain semantic rather than becoming another technical component.

---

## Alternative E — Application Executor-Owned Lifecycle

The existing Application Executor remains the single owner of application execution coordination.

The Pipeline remains the Execution Strategy.

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

### Advantages

* preserves the existing architecture;
* provides explicit ownership;
* keeps Runtime as the Composition Root;
* keeps Pipeline as an Execution Strategy;
* keeps handlers focused on use cases;
* requires no new lifecycle abstraction;
* preserves existing public execution contracts.

### Disadvantages

* lifecycle semantics must remain synchronized with the Application Executor;
* future persistence and Domain Event orchestration must respect this ownership boundary.

### Evaluation

Selected.

---

# Lifecycle Model

The selected lifecycle is:

```text
Begin
  ↓
Execute
  ↓
Complete / Fail
```

## Begin

Begin represents entry into coordinated application execution.

The Application Executor establishes the execution boundary.

Begin does not represent a separate technical operation.

---

## Execute

Execute represents concrete application request execution.

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

The Pipeline remains the selected Execution Strategy.

---

## Complete

Complete represents successful termination of the application execution contract.

The current Foundation expresses completion through successful Promise resolution.

No separate completion abstraction is required.

---

## Fail

Fail represents unsuccessful termination of the application execution contract.

The current Foundation expresses failure through Promise rejection.

Failures originating from execution dependencies propagate through the existing execution boundary.

No new lifecycle-specific failure representation is required.

---

# Persistence and Domain Event Publication

Persistence and Domain Event Publication remain part of the broader Application Execution architecture.

The research does not establish their concrete orchestration.

The current Foundation should therefore be understood as:

```text
Application Request
        ↓
Application Executor
        ↓
Pipeline
        ↓
Handler
        ↓
Execution Result
```

rather than as an already implemented flow of:

```text
Application Handler
        ↓
Persistence
        ↓
Domain Event Publication
        ↓
Execution Complete
```

The latter represents a potential broader application execution lifecycle that requires dedicated architectural decisions before implementation.

Those future decisions must preserve the Application Executor as the single application execution owner.

---

# Runtime Relationship

Runtime remains responsible for composition.

The relationship is:

```text
Runtime
   │
   │ composition
   ▼
Application Executor
   │
   │ execution
   ▼
Pipeline
```

Runtime must not own lifecycle semantics.

The Application Executor must not depend on Runtime-specific composition mechanisms.

---

# Pipeline Relationship

The Pipeline provides execution strategy behavior within the lifecycle owned by the Application Executor.

The relationship is:

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

* complete application execution;
* Runtime composition;
* lifecycle ownership;
* persistence ownership;
* Domain Event Publication ownership.

---

# Failure Semantics

The current Foundation already provides a failure boundary through Promise rejection.

The research therefore rejects introducing:

* `ExecutionFailure`;
* `LifecycleFailure`;
* lifecycle result wrappers;
* lifecycle-specific exception hierarchies.

Such abstractions would increase the public and internal API without solving an existing architectural problem.

---

# Public API Implications

The selected model does not require:

* `ExecutionLifecycle`;
* `ExecutionContext`;
* `LifecycleManager`;
* `TransactionManager`;
* `EventDispatcher`;
* `EventBus`;
* lifecycle-specific middleware contracts.

The existing Application Executor and execution contracts remain sufficient for the current Foundation.

Any future public lifecycle abstraction requires a separate architectural decision.

---

# Architectural Invariants

The selected model preserves the following invariants:

1. Application Executor is the single application execution owner.
2. Application requests enter execution through the established execution boundary.
3. Pipeline remains an Execution Strategy.
4. Handler Resolution remains an execution dependency.
5. Application Handlers remain use-case executors.
6. Runtime remains the Composition Root.
7. Runtime does not own execution semantics.
8. Persistence does not become a lifecycle owner.
9. Domain Event Publication does not become a lifecycle owner.
10. Lifecycle semantics remain explicit.
11. Existing Promise-based failure semantics remain valid.
12. No unnecessary lifecycle abstraction is introduced.
13. Existing public execution contracts remain stable.
14. Framework independence is preserved.

---

# Risks

## Lifecycle Responsibility Growth

The Application Executor could accumulate unrelated responsibilities.

This risk must be controlled through explicit architectural boundaries.

---

## Pipeline Ownership Leakage

The Pipeline could gradually become responsible for lifecycle coordination.

This would conflate execution strategy with execution ownership.

The invariant must remain explicit.

---

## Persistence Coupling

Persistence infrastructure could become directly coupled to the Application Executor.

Such coupling requires a separate architectural decision.

---

## Domain Event Coupling

Domain Event Publication could become coupled to transport-specific infrastructure.

The execution lifecycle must remain independent of transport.

---

## Abstraction Growth

Future lifecycle requirements could lead to unnecessary interfaces and context objects.

The architecture should prefer existing contracts until a new abstraction is justified.

---

# Evaluation Outcome

The research establishes that the Application Executor provides the correct architectural ownership boundary for the Application Execution Lifecycle.

The selected structure is:

```text
Application Request
        ↓
Application Executor
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

This model:

* preserves existing Foundation ownership;
* does not introduce a second lifecycle owner;
* keeps Runtime isolated as the Composition Root;
* keeps Pipeline isolated as the Execution Strategy;
* keeps handlers focused on application use cases;
* preserves existing failure semantics;
* avoids unnecessary public abstractions.

---

# Conclusion

The research supports defining the Application Execution Lifecycle as the semantic lifecycle of the existing Application Executor.

A separate lifecycle component is not required.

The Pipeline should remain an Execution Strategy rather than become a lifecycle owner.

Runtime should remain the Composition Root rather than become an execution owner.

Application handlers should remain use-case executors rather than lifecycle coordinators.

Persistence and Domain Event Publication remain broader application execution responsibilities whose concrete orchestration should be addressed separately.

The resulting architectural model is:

```text
Application Request
        ↓
Application Executor
        ↓
Pipeline
        ↓
Handler Resolution
        ↓
Application Handler
        ↓
Execution Result
```

with the lifecycle:

```text
Begin
  ↓
Execute
  ↓
Complete / Fail
```

---

# Research Status

Research outcome:

* Problem defined;
* research goals established;
* constraints identified;
* alternatives evaluated;
* lifecycle ownership evaluated;
* Application Executor selected as lifecycle owner;
* Pipeline retained as Execution Strategy;
* Runtime retained as Composition Root;
* Handler isolation preserved;
* Persistence orchestration explicitly excluded from the current implementation;
* Domain Event orchestration explicitly excluded from the current implementation;
* separate lifecycle component rejected;
* lifecycle-specific public abstraction rejected.

The research is complete and supports ADR-0016 - Application Execution Lifecycle.
