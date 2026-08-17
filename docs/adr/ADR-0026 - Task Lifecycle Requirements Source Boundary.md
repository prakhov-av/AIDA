# ADR-0026 — Task Lifecycle Requirements Source Boundary

## Status

Accepted

## Context

Sprint 14 investigated the missing normative Core Domain contract identified by ADR-0025.

The repository contains multiple sources describing AIDA domain intent and Task behavior:

* Vision and Mission documentation;
* `docs/architecture/core-domain.md`;
* `docs/architecture/domain-model.md`;
* `docs/architecture/domain-events.md`;
* Foundation DDD contracts;
* Foundation Domain Event infrastructure;
* existing architecture ADRs.

These sources establish that `Task` is:

* the minimal unit of engineering work;
* executed by one Role;
* a primary unit of planning and execution;
* a domain concept with its own lifecycle.

The Core Domain documentation also describes a typical Task workflow:

```text
Created
Planned
In Progress
Review
Testing
Completed
```

However, the relevant Core Domain documents are Draft / In Progress and the documented workflow is descriptive rather than a normative transition contract.

The repository does not establish sufficient normative requirements for:

* Task identity;
* authoritative initial state;
* allowed transitions;
* rejected transitions;
* terminal states;
* Role assignment mutation rules;
* lifecycle invariants;
* Domain Event triggers.

Foundation DDD and Domain Event infrastructure provide generic implementation contracts, but do not define AIDA-specific Task lifecycle semantics.

ADR-0025 therefore requires an accepted Task Lifecycle Contract before Core Domain implementation can begin.

Sprint 14 evaluated whether the existing domain documentation could directly provide that contract.

## Decision

AIDA will separate conceptual Core Domain authority from the normative behavioral contract required for Task implementation.

`docs/architecture/domain-model.md` remains the conceptual Core Domain authority for domain concepts, responsibilities, relationships, and domain semantics.

A separate accepted Task Lifecycle Contract is required to define normative Task lifecycle behavior.

The authority boundary is:

```text
Domain Model
    ↓
defines what Task is

Task Lifecycle Contract
    ↓
defines what Task may do

Task Aggregate
    ↓
defines how Task consistency is enforced
```

The Task Lifecycle Contract must be established from explicit domain requirements and accepted architectural evidence.

The existing descriptive workflow:

```text
Created
Planned
In Progress
Review
Testing
Completed
```

must not be promoted to a normative state machine without explicit supporting requirements.

Task states, transitions, invariants, assignment rules, and event triggers must not be invented from conceptual documentation or event names alone.

## Required Task Lifecycle Requirements

Before Core Domain implementation begins, the repository must contain accepted requirements sufficient to determine at minimum:

```text
Task Identity
Initial State
Allowed Transitions
Rejected Transitions
Terminal States
Role Assignment Rules
Lifecycle Invariants
Domain Event Triggers
```

Each requirement must be traceable to an authoritative source.

Missing evidence must remain explicitly unresolved rather than being replaced with assumptions.

## Source-of-Truth Boundary

The following hierarchy is established:

```text
Vision / Mission
    ↓
Product Intent

Domain Model
    ↓
Conceptual Core Domain Authority

Task Lifecycle Requirements
    ↓
Normative Task Behavioral Contract

Task Aggregate Design
    ↓
Consistency Boundary

Implementation
```

These levels must not be conflated.

In particular:

* Vision and Mission do not define Task state transitions.
* Conceptual Domain Model does not automatically define a normative state machine.
* Domain Event names do not define state transitions.
* Generic Foundation DDD contracts do not define AIDA-specific Task semantics.
* Task Lifecycle Contract does not automatically determine the Aggregate boundary.

## Consequences

### Positive

* Core Domain implementation remains evidence-driven.
* The conceptual Domain Model retains a clear responsibility.
* Normative Task behavior receives an explicit architectural boundary.
* No unsupported Task state machine is introduced.
* No Task Aggregate is prematurely Frozen.
* Foundation remains unchanged and Frozen.
* Domain Event semantics remain dependent on confirmed lifecycle transitions.
* Future implementation can trace behavior to accepted domain requirements.

### Negative

* Core Domain implementation remains deferred.
* A Task Lifecycle Contract must be established before Task implementation.
* Additional domain requirements are required where repository evidence is currently insufficient.
* The repository temporarily contains a deliberate implementation-readiness gap.

## Rejected Alternatives

### Make the existing `domain-model.md` directly implementation-ready

Rejected because the document currently combines conceptual domain modeling with broader architectural material and remains Draft / In Progress.

### Promote the documented Workflow to a normative state machine

Rejected because the workflow is descriptive and does not establish the required transition, invariant, assignment, terminal-state, or event semantics.

### Derive the lifecycle from Domain Events

Rejected because event names do not independently establish state transitions or lifecycle invariants.

### Implement Task and refine the lifecycle later

Rejected because implementation would establish behavior before the normative domain contract exists and would violate the implementation-readiness boundary established by ADR-0025.

### Modify Foundation to resolve the Core Domain gap

Rejected because the missing requirements are AIDA-specific Core Domain semantics and do not require modification of the Frozen Foundation.

## Scope

This decision applies to the AIDA Core Domain Task lifecycle.

It does not modify or reopen the Frozen Foundation boundaries:

* ApplicationExecutor
* RuntimeBuilder
* HandlerRegistry
* HandlerActivator
* HandlerResolver
* Repository
* UnitOfWork
* DomainEventDispatcher
* InMemoryPersistence

It does not introduce:

* Task implementation;
* Task Aggregate Root;
* TaskRepository;
* Task-specific Domain Events;
* Workflow Aggregate;
* new public Core Domain API.

## Result

Sprint 14 establishes the normative source boundary required for the next Core Domain phase.

The repository currently provides sufficient evidence for the existence and responsibility of Task, but not sufficient normative requirements to define its lifecycle.

Therefore:

```text
Task Lifecycle Requirements
    → missing

Task Lifecycle Contract
    → not yet defined

Task Aggregate
    → not Frozen

Core Domain implementation
    → deferred

Foundation
    → Frozen
```

The next Core Domain work must establish accepted Task Lifecycle Requirements before defining the Task Lifecycle Contract or implementing Task.
