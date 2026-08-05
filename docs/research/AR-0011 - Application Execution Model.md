# AR-0006 - Application Execution Model

- Status: Proposed
- Date: 2026-08-05
- Authors: AIDA Team
- Related:
  - ADR-0006 - Application Execution Model
  - DD-0006 - Application Execution Model

---

# Problem

The current Application SDK provides a set of independent contracts for coordinating application logic.

These contracts include:

- Command
- CommandHandler
- Query
- QueryHandler
- Repository
- UnitOfWork

Each contract has a single responsibility and intentionally avoids assumptions about execution, infrastructure, or framework integration.

This design successfully separates concerns and keeps the public SDK small. However, it leaves one architectural question intentionally unanswered:

> How should an application coordinate the execution of these contracts?

At present, every application built on top of the SDK must define its own execution model.

As a consequence:

- command execution is application-specific;
- query execution is application-specific;
- transaction boundaries are undefined;
- handler resolution is undefined;
- domain event publication has no defined lifecycle;
- cross-cutting concerns have no architectural location.

The SDK defines *what* the building blocks are, but not *how* they collaborate during request execution.

While this provides maximum flexibility, it also increases the likelihood of inconsistent application architectures and duplicated execution infrastructure across projects.

The platform therefore requires a common architectural model capable of coordinating application requests while preserving the existing design principles of AIDA.

---

# Goals

The objective of this research is to identify an architectural execution model suitable for coordinating application requests.

The resulting architecture should:

- define a consistent lifecycle for command execution;
- define a consistent lifecycle for query execution;
- preserve the independence of the Domain layer;
- maintain explicit architectural boundaries;
- remain framework-independent;
- support future extensibility;
- preserve a minimal public API;
- avoid unnecessary architectural complexity.

The selected approach should remain suitable for long-term evolution without introducing breaking changes to the existing SDK.

---

# Non-Goals

This research intentionally does **not** define:

- concrete implementations;
- dependency injection mechanisms;
- framework integrations;
- transport protocols;
- persistence technologies;
- event brokers;
- middleware implementations;
- logging frameworks;
- validation libraries;
- caching implementations.

This document also does not introduce new public APIs.

No architectural decisions are made in this document.

Its purpose is to understand the design space before selecting an architectural solution.

---

# Current State

The current SDK already provides the fundamental application contracts required to implement business use cases.

The Application layer currently defines:

- Command
- CommandHandler
- Query
- QueryHandler
- Repository
- UnitOfWork

The Domain layer defines:

- AggregateRoot
- DomainEvent
- DomainEvents

All public APIs have been reviewed, documented, and frozen as part of the v0.1.0 release.

Each abstraction has a clearly defined responsibility.

However, no component currently defines:

- how execution begins;
- how handlers are discovered;
- how requests are coordinated;
- where transactions begin;
- where transactions complete;
- when domain events are published;
- where cross-cutting concerns execute;
- how the complete application request lifecycle is managed.

The execution model is therefore intentionally undefined.

This architectural gap gives every application complete freedom to define its own coordination strategy.

Although flexible, this approach makes it difficult to establish a consistent Application architecture across projects built on top of the SDK.

The purpose of this research is to determine whether the platform should define a common execution model and, if so, what architectural characteristics such a model should possess.

---

# Research Questions

The following questions define the scope of this research.

They intentionally avoid proposing implementation details or architectural decisions.

Their purpose is to identify the questions that the future architecture must answer.

---

## 1. What is an Application Execution Model?

Should the platform define a common execution model for application requests?

If so:

what responsibilities belong to the execution model;
what responsibilities belong outside the execution model;
what defines the boundaries of the execution model?

---

## 2. How should commands be executed?

Should command execution follow a predefined lifecycle?

Questions include:

- where execution begins;
- how handlers are invoked;
- where transactions start;
- where transactions complete;
- when domain events are published.

---

## 3. How should queries be executed?

Should queries follow the same execution lifecycle as commands?

Questions include:

- which execution stages are shared;
- which stages differ;
- whether queries require transactions;
- whether queries should support caching.

---

## 4. Where should transaction boundaries exist?

State-changing operations frequently require transactional consistency.

This research should determine:

- who creates the transaction;
- who commits the transaction;
- who performs rollback;
- whether transaction management belongs inside the execution model or outside of it.

---

## 5. How should handlers be resolved?

The SDK defines handlers but intentionally leaves handler discovery undefined.

Questions include:

- who resolves handlers;
- whether resolution should be static or dynamic;
- whether handler resolution belongs to the execution model.

---

## 6. When should domain events be published?

Domain events represent completed business facts.

Questions include:

- when publication should occur;
- whether publication occurs before or after persistence;
- whether failed transactions publish events;
- which architectural component owns publication.

---

## 7. Where should cross-cutting concerns be applied?

Applications commonly require additional execution behaviors such as:

- validation;
- logging;
- authorization;
- metrics;
- tracing;
- retry policies.

This research should determine:

- which concerns belong to the Application layer;
- which belong to Infrastructure;
- whether the execution model should define extension points.

---

## 8. What should the public API look like?

The current SDK exposes only application contracts.

This research should determine:

- whether additional public abstractions are required;
- how small the public API can remain;
- which abstractions should remain internal.

---

## 9. How should the execution model evolve?

The execution model should support future capabilities without redesign.

Questions include:

- how future behaviors are introduced;
- how extensibility is achieved;
- how long-term architectural stability is preserved.

---

# Architectural Constraints

Any future solution must comply with the architectural principles already established by AIDA.

These constraints are considered mandatory.

---

## Domain Independence

The Domain layer must remain independent of:

- Application;
- Infrastructure;
- frameworks;
- transport protocols;
- persistence technologies;
- dependency injection.

---

## Stable Public API

The public SDK API should remain intentionally small.

New public abstractions should only be introduced when they provide clear architectural value.

---

## Explicit Architecture

Application execution should remain explicit and understandable.

Hidden execution paths, runtime magic, and implicit framework conventions should be avoided.

---

## Framework Independence

The execution model must remain independent of application frameworks.

Framework integrations should exist outside the SDK.

---

## Extensibility

The architecture should support future execution behaviors without redesigning the execution model.

Extension should be achieved through composition rather than modification.

---

## Single Responsibility

Execution coordination should never become responsible for business logic.

Business behavior belongs to application handlers and the Domain model.

---

## Predictable Execution

The complete request lifecycle should remain deterministic and understandable.

Every execution stage should have one clearly defined responsibility.

---

## Backward Compatibility

The introduction of an execution model should preserve compatibility with the existing SDK whenever reasonably possible.

Previously frozen public contracts should remain valid.

---

# Architectural Alternatives

This section evaluates different architectural ownership models.

It intentionally evaluates **coordination ownership**, not concrete execution mechanisms.

Execution mechanisms may be researched separately if required.

---

## Alternative A — Independent Execution

Applications coordinate execution independently.

### Advantages

- maximum flexibility;
- minimal SDK;
- no additional abstractions.

### Disadvantages

- duplicated infrastructure;
- inconsistent execution models;
- difficult knowledge sharing.

---

## Alternative B — Centralized Execution Model

The SDK owns request coordination.

Applications interact with a common execution model.

### Advantages

- consistent architecture;
- reusable execution lifecycle;
- shared behaviors.

### Disadvantages

- additional abstractions;
- increased SDK responsibility.

---

## Alternative C — Infrastructure-Driven Coordination

Execution coordination belongs entirely to external frameworks.

### Advantages

- smallest SDK;
- maximum framework flexibility.

### Disadvantages

- framework-dependent architecture;
- inconsistent execution lifecycle;
- difficult portability.

---

## Alternative D — Hybrid Coordination

The SDK defines the execution model.

Infrastructure extends its behavior.

### Advantages

- consistent architecture;
- framework independence;
- controlled extensibility.

### Disadvantages

- requires well-defined extension points;
- higher architectural complexity.

---

# Evaluation Criteria

Each architectural alternative should be evaluated using the same criteria.

---

## Domain Independence

Preserves Domain isolation.

---

## Explicitness

Execution remains understandable.

---

## Simplicity

Introduces the smallest useful architectural surface.

---

## Extensibility

Supports future evolution without redesign.

---

## Testability

Supports isolated testing of execution stages.

---

## Framework Independence

Remains portable across application environments.

---

## Stable Public API

Avoids unnecessary public abstractions.

---

## Separation of Responsibilities

Keeps business logic separate from execution coordination.

---

## Long-Term Maintainability

Supports long-term platform evolution.

---

## Consistency

Provides a consistent execution model for application requests.

---

# Risks

If no common execution model is introduced, applications built on top of the SDK may gradually diverge.

Potential risks include:

- duplicated execution infrastructure;
- inconsistent application architecture;
- incompatible extensions;
- higher maintenance costs;
- difficult onboarding of new contributors;
- reduced architectural consistency across projects.

---

# Conclusion

This research intentionally makes no architectural decisions.

Its purpose is to establish the architectural context required for evaluating possible execution models.

The alternatives presented in this document should be evaluated using the defined architectural constraints and evaluation criteria.

The selected architecture, if any, will be documented in **ADR-0006 - Application Execution Model**.

---

# Research Status

Current status:

- Problem defined
- Goals established
- Constraints identified
- Alternatives evaluated
- Evaluation criteria established

The research is ready for Architecture Decision.

No architectural decision has been made.
