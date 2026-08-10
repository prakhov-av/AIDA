# ADR-0013 - Runtime Composition

- Status: Accepted
- Date: 2026-08-10
- Authors: AIDA Team
- Related:
  - AR-0013 - Runtime Composition
  - DD-0013 - Runtime Composition
  - ADR-0011 - Application Execution Model
  - ADR-0012 - Execution Strategy
  - ADR-0014 - Handler Activation Model
  - ADR-0015 - Handler Registration Model

---

# Context

The Application Execution Model and Execution Strategy define how application requests are executed, but they intentionally do not define how the execution components are assembled into a complete runtime.

The Runtime Foundation requires an explicit composition boundary that can assemble the existing execution components without moving composition responsibilities into the Execution layer or introducing framework-specific infrastructure.

The Runtime Foundation also contains separate responsibilities for handler registration and handler activation. Runtime composition must connect these responsibilities without coupling execution to their implementation details.

---

# Decision

The AIDA SDK SHALL use `RuntimeBuilder` as the single Composition Root for the Runtime Foundation.

`RuntimeBuilder` SHALL collect runtime configuration and assemble the complete execution runtime during `build()`.

The Runtime composition SHALL connect the following responsibilities:

```text
RuntimeBuilder
      │
      ├── HandlerRegistry
      │       │
      │       ▼
      │   HandlerResolver
      │       ▲
      │       │
      ├── HandlerActivator
      │
      ├── PipelineBuilder
      │
      ▼
PipelineExecutor
      │
      ▼
ApplicationExecutor
```

The exact activation path is defined by ADR-0014. Handler registration is defined by ADR-0015.

The Runtime Foundation SHALL remain independent from dependency injection containers, reflection, decorators, metadata discovery, and application frameworks.

Each invocation of `build()` SHALL create an independent runtime composition.

A built runtime SHALL not expose configuration mutation through the `ApplicationExecutor` contract.

---

# Motivation

Runtime composition must provide an explicit boundary between configuration and execution.

The selected model provides:

- a single Composition Root;
- explicit runtime assembly;
- independent runtime instances;
- separation of registration, activation, resolution, and execution responsibilities;
- framework independence;
- a small public API;
- predictable construction and lifecycle semantics.

The decision follows the architectural evaluation documented in **AR-0013 - Runtime Composition**.

---

# Alternatives Considered

The following approaches were considered:

- Runtime Builder;
- mutable Runtime configuration;
- external application-level composition;
- dependency injection composition.

## Runtime Builder

Selected because it provides explicit composition, keeps configuration separate from execution, and allows each `build()` to create an independent runtime graph.

## Mutable Runtime

Rejected because configuration and execution would share mutable state and the lifecycle boundary would become less explicit.

## External Application-Level Composition

Rejected because every application would need to reproduce the same composition logic, increasing duplication and weakening the Runtime architectural boundary.

## Dependency Injection Composition

Rejected for the Foundation because it would couple the Runtime to an infrastructure mechanism that is not required by the core execution model.

Infrastructure-specific integration may provide custom implementations at a higher architectural layer without changing the Foundation contracts.

---

# Architectural Consequences

Runtime becomes the single architectural location responsible for assembling the application execution graph.

As a consequence:

- `RuntimeBuilder` owns composition but does not execute requests;
- `HandlerRegistry` remains responsible for registration and lookup;
- `HandlerActivator` remains responsible for activation;
- `HandlerResolver` remains responsible for resolving executable handlers;
- `PipelineBuilder` remains responsible for pipeline construction;
- `PipelineExecutor` remains responsible for pipeline execution;
- `ApplicationExecutor` remains the application execution entry point;
- Execution components remain unaware of Runtime composition;
- multiple independent runtimes can be built from separate builder instances;
- Foundation remains independent from DI and application frameworks.

The composition layer introduces no new execution semantics.

---

# Public API Impact

The Runtime Foundation exposes the following composition entry point:

```ts
RuntimeBuilder
DefaultRuntimeBuilder
```

The builder provides the configuration operations established by the Runtime Foundation:

```ts
register(request, handler)
registerFactory(request, factory)
addBehavior(behavior)
build()
```

The resulting runtime is exposed through the existing `ApplicationExecutor` contract.

No additional runtime abstraction is introduced.

---

# Migration

No migration is required.

The decision formalizes the composition model already implemented by the Runtime Foundation.

Existing Domain and Execution contracts remain unchanged.

---

# Scope

This decision covers Runtime composition only.

It does not define:

- handler activation semantics;
- handler registration semantics;
- dependency injection containers;
- service providers;
- handler lifecycle management;
- module discovery;
- reflection or decorator-based discovery;
- infrastructure-specific composition.

Handler activation is defined by **ADR-0014 - Handler Activation Model**.

Handler registration is defined by **ADR-0015 - Handler Registration Model**.

---

# Implementation Outcome

The Runtime Composition model has been implemented through `DefaultRuntimeBuilder`.

During `build()`, the builder creates and connects the runtime components required by the Foundation, including:

- `DefaultHandlerRegistry`;
- `DefaultHandlerActivator`;
- `DefaultHandlerResolver`;
- `PipelineBuilder`;
- `PipelineExecutor`;
- `ApplicationExecutor`.

Each `build()` creates an independent component graph.

Execution components do not depend on `RuntimeBuilder` and do not perform runtime composition.

---

# Validation

The implementation has been validated through:

- TypeScript type checking;
- Vitest unit tests;
- Architecture Review.

The current Foundation validation is:

```text
npx tsc --noEmit
npx tsc --noEmit -p tsconfig.vitest.json
npx vitest run
```

All 69 tests pass.

The resulting implementation preserves:

- a single Runtime Composition Root;
- explicit component composition;
- independent runtime instances;
- responsibility isolation;
- execution independence from Runtime;
- framework-independent Foundation contracts.
