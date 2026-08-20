# ADR-0030 — Next Foundation Boundary Discovery


- **Status:** Accepted
- **Date:** 2026-08-20
- **Decision:** Do not materialize a new domain or application boundary until an actual application consumer exists.


---


## Context


AIDA has completed the Task Aggregate implementation boundary.


The following architectural boundaries are already established:


```text
Task Requirements
        ↓
Task Lifecycle Contract
        ↓
Task Aggregate Boundary
        ↓
Task Aggregate Implementation

The Foundation is frozen and the Task Aggregate is frozen. The repository already provides the generic application execution, repository, Unit of Work, runtime composition, and persistence contracts required by a future application consumer.

The next architectural question is whether the repository now contains sufficient evidence to materialize another domain or application boundary.

Repository inspection shows that the repository does not contain a concrete application consumer. The existing application execution and runtime components remain Foundation infrastructure rather than application-level consumers.

The repository also does not provide requirements or architectural evidence that would justify introducing a Role Aggregate, Task-specific Repository, additional Task lifecycle behavior, or another core-domain aggregate.

Therefore the next boundary must not be selected by speculation or by the mere existence of reusable Foundation infrastructure.

Repository Evidence

The current repository baseline is:

bceaddd feat(domain): implement task aggregate

The current Foundation and Task boundaries are frozen at this baseline.

The repository contains generic application execution and persistence contracts, including:

ApplicationExecutor;
command and query contracts;
handler contracts;
runtime composition contracts;
Repository;
UnitOfWork;
concrete in-memory persistence.

These components do not constitute a concrete application consumer.

The repository does not contain:

a concrete application-level request;
a concrete application use case consuming Task;
a Task command implementation;
a Task command handler;
an application composition implementation;
a Task-specific repository;
a concrete Role aggregate implementation justified by an established boundary.
Decision

AIDA will not materialize a new domain or application boundary in Sprint 22.

The next candidate boundary is identified as the Task Application Consumer Boundary, but it is not implementation-ready.

The candidate architecture is:

Task Aggregate
        ↓
Actual Application Consumer
        ↓
Application Composition

The Application Consumer boundary may only be materialized when an actual application responsibility exists in the repository and provides concrete requirements for the boundary.

The first consumer must pass a dedicated Architecture Check and Architecture Decision before application composition is introduced.

Application Consumer Trigger

The architectural trigger for the next boundary is a concrete application use case that consumes the Task Aggregate.

That consumer must establish, at minimum:

the application responsibility;
the request or command shape;
the required handler behavior;
aggregate loading requirements;
persistence coordination requirements;
Unit of Work usage;
post-commit Domain Event handling requirements;
the minimal stable public API.

No API is introduced before these requirements exist.

Explicit Exclusions

This decision does not introduce:

TaskRepository;
Task commands;
Task command handlers;
Task application services;
Role aggregate implementation;
Project aggregate implementation;
Mission aggregate implementation;
Goal aggregate implementation;
Objective aggregate implementation;
new Task lifecycle states;
new Task lifecycle events;
application composition implementation;
new Foundation abstractions;
persistence-specific Task behavior;
event transport or external dispatch infrastructure.

Existing Frozen Foundation modules must not be changed as a consequence of this decision.

Relationship to Existing Decisions

This decision preserves the Application Composition Consumer Boundary established by ADR-0023.

ADR-0023 states that Application Composition is deferred until an actual application consumer exists. This ADR confirms that the repository still does not satisfy that trigger.

The Task Aggregate implementation boundary established by ADR-0029 also remains unchanged. The Aggregate continues to own only its established domain invariants, lifecycle behavior, Role identity reference, and accepted Domain Events.

No decision in this ADR expands the Task domain contract.

Architecture Rule

The following rule is established for the next boundary:

No actual application consumer
        ↓
No Application Composition materialization
        ↓
No Task command or handler
        ↓
No Task-specific Repository
        ↓
No speculative API

The next implementation Sprint must begin with an Architecture Check triggered by a concrete application consumer.

Consequences

The current architecture remains stable and frozen.

The repository does not gain speculative application abstractions merely because the Foundation already supports them.

When an actual application consumer appears, its requirements become the source of truth for the next Architecture Check and for the minimal API required to compose the application runtime.

Until then, Sprint 22 is complete as a discovery and architectural boundary decision sprint without implementation.



### Изменения в репозитории


Добавляется только:


```text
docs/adr/ADR-0030 - Next Foundation Boundary Discovery.md

В изменённом файле выполнена проверка git diff --check — ошибок нет.

Коммит из моей изолированной копии не был создан: Git запросил локальные user.name / user.email. Поэтому я не считаю Commit выполненным и не буду выдумывать SHA.

Тесты

Для ADR-only изменения запускать TypeScript/Vitest не требуется.
