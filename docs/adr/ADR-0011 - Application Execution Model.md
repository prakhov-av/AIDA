# ADR-0011 - Application Execution Model

* Status: Proposed
* Date: 2026-08-05
* Authors: AIDA Team
* Related:

  * AR-0011 - Application Execution Model
  * DD-0011 - Application Execution Model

---

# Decision

The AIDA SDK SHALL define a common application execution model responsible for coordinating application requests.

The execution model belongs to the Application layer and provides a consistent architectural boundary for executing commands and queries.

The execution model SHALL have a single execution coordinator responsible for coordinating the application request lifecycle.

The execution coordinator SHALL remain independent from:

* Domain business logic;
* application framework integrations;
* transport mechanisms;
* dependency injection mechanisms;
* infrastructure-specific execution mechanisms.

This decision establishes architectural ownership of application request coordination.

The concrete execution strategy is defined separately by ADR-0012 - Execution Strategy.

---

# Motivation

The current Application SDK provides a collection of independent contracts, including commands, queries, handlers, repositories, and units of work.

These contracts intentionally avoid defining how application requests are coordinated.

Without a common execution model, every application built on top of the SDK would need to define its own request coordination lifecycle.

A common execution model provides a consistent architectural foundation while preserving the existing principles of the AIDA platform:

* Domain independence;
* explicit architecture;
* framework independence;
* stable public APIs;
* composition over implementation-specific patterns.

This decision establishes the architectural ownership required for application execution while keeping the concrete execution mechanism independently composable.

This decision is based on the research documented in AR-0011 - Application Execution Model.

---

# Architectural Ownership

The Application Execution Model has one architectural owner:

```text
Application Request
        ↓
Execution Coordinator
        ↓
Execution Strategy
        ↓
Application Handler
```

The Execution Coordinator owns application request coordination.

The Execution Strategy performs the concrete execution work delegated by the coordinator.

The Application Handler executes the application use case.

No other component may become a second owner of the complete application execution model.

Runtime composition remains outside the execution model.

The Domain remains independent from the execution model.

---

# Execution Boundary

The execution model defines the following architectural boundary:

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

The execution model is responsible for coordinating this flow.

The concrete mechanism used by the Execution Strategy is defined separately.

Persistence and Domain Event Publication remain architectural responsibilities associated with application execution as defined by the broader Application Execution architecture.

Their concrete orchestration is not introduced by this decision.

---

# Alternatives Considered

The architectural alternatives evaluated during the research phase are documented in **AR-0011 - Application Execution Model**.

The following approaches were considered:

* Independent execution;
* centralized execution model;
* infrastructure-driven coordination;
* hybrid coordination.

The centralized execution model was selected because it provides:

* a consistent execution boundary;
* explicit architectural ownership;
* framework independence;
* reusable application coordination;
* a stable foundation for composable execution strategies.

The decision does not prescribe a specific execution mechanism.

The concrete execution strategy is selected separately by ADR-0012 - Execution Strategy.

---

# Architectural Consequences

The platform will define a common application execution model responsible for coordinating application requests.

As a consequence:

* application execution becomes standardized;
* execution coordination becomes an explicit Application layer responsibility;
* the Execution Coordinator becomes the single owner of application request coordination;
* business logic remains inside application handlers and the Domain model;
* Domain remains independent from execution concerns;
* framework integrations remain external to the SDK;
* concrete execution mechanisms remain separate from execution ownership;
* execution behavior can be composed without transferring lifecycle ownership to the strategy implementation.

This decision establishes architectural direction without introducing a new technical abstraction solely for lifecycle semantics.

---

# Public API Impact

This decision introduces no new public API.

The existing public application contracts remain valid.

Previously frozen contracts remain unchanged.

The Execution Coordinator is an architectural responsibility and does not require a new public lifecycle abstraction.

Future public abstractions, if required, SHALL be introduced through dedicated architectural decisions and documented by subsequent Detailed Design documents.

---

# Migration

No migration is required.

This decision establishes architectural ownership and does not require replacement of existing application contracts.

Existing SDK consumers remain compatible with the architectural model.

---

# Implementation Constraints

Any implementation of the Application Execution Model SHALL preserve the following constraints:

* exactly one execution coordinator owns application request coordination;
* the coordinator contains no business logic;
* the coordinator remains independent from frameworks;
* the coordinator does not become responsible for Domain behavior;
* the execution strategy does not become the owner of the complete application execution model;
* handlers do not coordinate the application execution lifecycle;
* Runtime does not become an execution owner;
* persistence mechanisms remain separate from execution ownership;
* domain event publication mechanisms remain separate from execution ownership;
* no unnecessary public lifecycle abstraction is introduced.

---

# Related Documents

* AR-0011 - Application Execution Model
* DD-0011 - Application Execution Model
* ADR-0012 - Execution Strategy
* DD-0012 - Execution Strategy
