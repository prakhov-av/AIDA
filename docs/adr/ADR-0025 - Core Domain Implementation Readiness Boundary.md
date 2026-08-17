# ADR-0025 — Core Domain Implementation Readiness Boundary

## Status

Accepted

## Context

Sprint 13 evaluated the AIDA Core Domain after the Foundation stability boundary established by ADR-0024.

The repository contains documented Core Domain concepts including:

* Project
* Mission
* Goal
* Objective
* Task
* Workflow
* Context
* Artifact
* Project Intelligence
* Organization Intelligence
* Role
* Capability
* Provider
* Model

The current Core Domain documentation defines responsibilities and conceptual relationships, but it remains Draft / In Progress.

The Task concept is the most clearly defined operational domain concept. It is described as the minimal unit of engineering work, executed by one Role, with its own lifecycle and serving as the main unit of planning and execution.

However, the repository does not contain a normative Task Lifecycle Contract defining:

* Task identity;
* authoritative initial state;
* allowed transitions;
* rejected transitions;
* terminal states;
* lifecycle invariants;
* Role assignment mutation rules;
* domain event triggers.

The documented Workflow states are therefore not sufficient to establish a Frozen state machine or Aggregate boundary.

The repository also contains Foundation-level DDD and Domain Event infrastructure, but no AIDA-specific Task implementation. The Foundation is Frozen and does not require modification for this architectural decision.

## Decision

AIDA Core Domain implementation is not yet ready for implementation.

The Task concept remains a candidate consistency boundary, but `Task` is not declared a Frozen Aggregate Root.

The following boundaries are established for the current architectural state:

```text
Task
    ├── owns candidate lifecycle state
    ├── has execution responsibility
    ├── has an assignment relationship with Role
    ├── has a requirement relationship with Capability
    ├── uses transient Domain Context
    └── produces Artifact
```

`Workflow` is not declared an Aggregate Root or persistence boundary.

`Domain Context` is not declared an Entity or Aggregate. It remains a Task-scoped transient domain execution concept. It must remain distinct from the existing Pipeline Context used by the execution infrastructure.

`Artifact` is not declared part of Task lifecycle ownership. Its relationship with Task is currently treated as a production relationship, with Artifact subsequently participating in Project Intelligence.

AIDA-specific Domain Events are not Frozen until their triggering state transitions and semantic requirements are established.

## Consequences

### Positive

* No premature Core Domain API is introduced.
* No Aggregate boundary is invented from conceptual relationships.
* No unsupported Task state machine is materialized.
* Foundation remains unchanged and Frozen.
* Domain implementation remains evidence-driven.
* Future Task implementation can be based on an explicit lifecycle contract rather than inferred event names or documentation examples.

### Negative

* Core Domain implementation remains deferred.
* No Task, TaskRepository, Workflow implementation, or Task-specific Domain Events can be considered stable implementation targets yet.
* A separate architectural prerequisite is required before Core Domain implementation can begin.

## Required Prerequisite

Before Core Domain implementation begins, the repository must contain an accepted Task Lifecycle Contract defining at minimum:

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

After that contract is established, the architecture must be re-evaluated to determine whether the evidence is sufficient to Freeze `Task` as an Aggregate Root.

## Scope

This decision does not modify or reopen the Frozen Foundation boundaries:

* ApplicationExecutor
* RuntimeBuilder
* HandlerRegistry
* HandlerActivator
* HandlerResolver
* Repository
* UnitOfWork
* DomainEventDispatcher
* InMemoryPersistence

No application composition boundary is introduced by this decision.

## Rejected Alternatives

### Implement Task as an Aggregate immediately

Rejected because the repository does not provide sufficient evidence for a stable Task identity, invariant set, or normative transition contract.

### Treat the documented Workflow states as a Frozen state machine

Rejected because the current documentation describes them as a typical workflow rather than a normative transition contract.

### Create TaskRepository and Task Domain Events immediately

Rejected because persistence and event boundaries must follow a confirmed domain consistency boundary and confirmed state transitions.

### Introduce a separate Workflow Aggregate

Rejected because no independent Workflow identity, invariant, lifecycle, or consistency requirement has been established.

### Treat Domain Context as an Entity

Rejected because the current documentation describes Context as temporary, while the existing domain model does not support anonymous or transient Entity semantics.

## Result

Sprint 13 establishes a Core Domain implementation readiness boundary rather than a Core Domain implementation.

The next Core Domain architectural prerequisite is the explicit Task Lifecycle Contract.

Until that contract is accepted, Core Domain implementation remains intentionally deferred.
