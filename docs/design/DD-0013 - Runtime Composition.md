# DD-0013 - Runtime Composition

- Status: Accepted
- Date: 2026-08-10
- Authors: AIDA Team
- Related:
  - AR-0013 - Runtime Composition
  - ADR-0013 - Runtime Composition
  - ADR-0012 - Execution Strategy
  - DD-0012 - Execution Strategy
  - ADR-0014 - Handler Activation Model
  - ADR-0015 - Handler Registration Model

---

# Purpose

This document defines the detailed design of the Runtime Composition model adopted by ADR-0013.

It describes how the Runtime Foundation assembles the existing execution components into an independent application runtime while preserving the responsibilities established by the Application Execution Model and Execution Strategy.

Implementation-specific framework integration remains outside the scope of this document.

---

# Architectural Invariants

## Explicit Composition

Runtime composition is explicit.

No component is discovered automatically through reflection, metadata, decorators, or framework-specific mechanisms.

## Single Composition Root

`RuntimeBuilder` is the only component responsible for assembling the Runtime Foundation.

Execution components do not compose other execution components.

## Independent Runtime Instances

Each invocation of `build()` creates a new runtime component graph.

Builder configuration is not shared with previously built runtime instances through mutable execution components.

## Configuration Before Execution

Runtime configuration is completed through the builder before `build()` returns the `ApplicationExecutor`.

The resulting executor exposes execution rather than configuration mutation.

## Component Isolation

Each runtime component retains a single architectural responsibility.

Composition connects responsibilities but does not move them between components.

## Framework Independence

Runtime composition does not require a dependency injection container, service provider, application framework, reflection, or metadata discovery mechanism.

---

# Architectural Overview

Runtime composition assembles the existing Foundation components into the following execution graph:

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
      │       │
      │       ▼
      │   PipelineExecutor
      │       │
      │       ▼
      └── ApplicationExecutor
```

`HandlerRegistry`, `HandlerActivator`, and `HandlerResolver` form the handler resolution path. Their detailed responsibilities are defined by ADR-0014 and ADR-0015.

`PipelineBuilder`, `PipelineExecutor`, and `ApplicationExecutor` implement the execution strategy defined by ADR-0012.

---

# Component Responsibilities

## RuntimeBuilder

Responsible for collecting configuration and assembling the runtime.

Responsibilities include:

- collecting handler registrations;
- collecting pipeline behaviors;
- creating runtime components;
- connecting runtime components;
- returning the configured `ApplicationExecutor`.

The builder does not execute application requests.

## Handler Registry

Responsible for registration and lookup of handler activation sources.

It does not activate or execute handlers.

The registration model is defined by ADR-0015.

## Handler Activator

Responsible for converting a registered activation source into an executable handler.

The activation model is defined by ADR-0014.

## Handler Resolver

Responsible for resolving an executable handler for an application request.

The resolver coordinates registry lookup and activation but does not own runtime composition.

## Pipeline Builder

Responsible for constructing the configured execution pipeline from the registered behaviors and resolver.

## Pipeline Executor

Responsible for executing the configured pipeline.

It does not know how handlers were registered or activated.

## Application Executor

Represents the completed application execution runtime.

It provides the application-facing execution entry point defined by the existing Execution Foundation.

---

# Runtime Builder API

The Runtime Foundation provides the following configuration operations:

```ts
register(request, handler)
registerFactory(request, factory)
addBehavior(behavior)
build()
```

`register()` and `registerFactory()` configure handler registration through the existing activation model.

`addBehavior()` contributes a pipeline behavior to runtime composition.

`build()` completes composition and returns an `ApplicationExecutor`.

No configuration operation is exposed by the resulting executor.

---

# Runtime Lifecycle

The lifecycle is:

1. Create a `RuntimeBuilder`.
2. Register direct handlers and/or handler factories.
3. Add pipeline behaviors.
4. Invoke `build()`.
5. Create a new registry, activator, resolver, pipeline, and application executor composition.
6. Return the configured `ApplicationExecutor`.
7. Execute application requests through the resulting runtime.

Each subsequent `build()` creates a separate runtime composition.

---

# Composition Boundaries

The following boundaries are fixed:

```text
Runtime
  owns composition

HandlerRegistry
  owns registration and lookup

HandlerActivator
  owns activation

HandlerResolver
  owns handler resolution

PipelineExecutor
  owns pipeline execution

ApplicationExecutor
  owns application execution entry
```

No component may bypass these boundaries to introduce implicit composition or activation behavior.

---

# Public API

The public Runtime Composition API consists of:

- `RuntimeBuilder`;
- `DefaultRuntimeBuilder`.

The built runtime is represented by the existing `ApplicationExecutor` contract.

No additional runtime abstraction is introduced by this design.

---

# Design Constraints

The implementation must preserve:

- explicit runtime composition;
- independent runtime instances;
- stable execution contracts;
- handler registration and activation separation;
- framework independence;
- minimal public API surface.

Runtime Composition must not modify the responsibilities of frozen Execution components.

---

# Out of Scope

The following remain outside this Foundation design:

- dependency injection containers;
- service providers;
- constructor injection;
- lifecycle and scope management;
- automatic module discovery;
- reflection-based handler discovery;
- decorator-based registration;
- infrastructure-specific runtime composition.

These concerns may be introduced by higher-level infrastructure through the existing Foundation extension points without changing the Runtime Composition contract.
