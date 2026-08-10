# AR-0013 - Runtime Composition

## Review Status

Approved

## Review Date

2026-08-10

## Reviewed Scope

This review covers the Runtime Composition Foundation and its role as the single Composition Root for the application execution runtime.

The reviewed architecture consists of:

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

Handler activation and registration details are reviewed separately by AR-0014 and AR-0015.

---

# Architecture Review

## Runtime Composition Root

**Status: PASS**

`RuntimeBuilder` is the only Composition Root.

The builder collects configuration and creates the registry, activator, resolver, pipeline, and application executor during `build()`.

Execution components do not compose other execution components.

## Explicit Composition

**Status: PASS**

Runtime components are created explicitly by `DefaultRuntimeBuilder`.

No reflection, decorators, metadata discovery, or dependency injection container is required for composition.

## Runtime Independence

**Status: PASS**

Each `build()` creates an independent runtime composition.

The builder is configuration-oriented, while the resulting `ApplicationExecutor` is execution-oriented.

## Handler Responsibility Isolation

**Status: PASS**

Runtime composition preserves the boundaries established by the Handler Activation and Handler Registration Foundations.

`HandlerRegistry` performs registration and lookup.

`HandlerActivator` performs activation.

`HandlerResolver` coordinates lookup and activation.

Runtime composition connects these components but does not absorb their responsibilities.

## Execution Isolation

**Status: PASS**

Execution components remain unaware of Runtime composition.

In particular, `PipelineExecutor` does not know:

- how handlers were registered;
- how handlers are activated;
- how the runtime was assembled;
- whether a dependency injection mechanism exists outside the Foundation.

It operates on the executable handler supplied by the existing resolver contract.

## Execution Strategy Compatibility

**Status: PASS**

Runtime composition preserves the Pipeline-based Execution Strategy defined by ADR-0012.

The Runtime Builder assembles the existing pipeline components without introducing new execution semantics.

## Public API Stability

**Status: PASS**

The composition model exposes `RuntimeBuilder` and `DefaultRuntimeBuilder` while retaining `ApplicationExecutor` as the resulting runtime contract.

The builder API remains explicit:

```ts
register(request, handler)
registerFactory(request, factory)
addBehavior(behavior)
build()
```

No additional runtime abstraction is required.

## Framework Independence

**Status: PASS**

The Runtime Foundation contains no dependency on a dependency injection framework, service container, reflection system, or application framework.

Infrastructure-specific composition can be implemented outside the Foundation through its existing abstractions.

## Scope Control

**Status: PASS**

The Runtime Composition implementation does not introduce:

- automatic handler discovery;
- dependency injection infrastructure;
- service providers;
- lifecycle management;
- scopes;
- reflection-based composition;
- new execution semantics.

The implementation is limited to explicit assembly of existing Foundation components.

---

# Verification

The Foundation validation is:

```text
npx tsc --noEmit
npx tsc --noEmit -p tsconfig.vitest.json
npx vitest run
```

The current test suite passes with:

```text
69 tests passed
```

---

# Architectural Risks

No blocking architectural risks were identified.

The composition boundary is intentionally small and explicit.

Future infrastructure-specific composition may be introduced through existing abstractions without changing the Runtime Composition contract.

---

# Decision

**APPROVED**

Runtime Composition is architecturally consistent with the Application Execution Model, Execution Strategy, Handler Activation Foundation, and Handler Registration Model.

`RuntimeBuilder` is approved as the single Runtime Composition Root.

---

# Freeze Recommendation

The following components and boundaries are approved for reuse:

- `RuntimeBuilder`;
- `DefaultRuntimeBuilder`;
- Runtime composition lifecycle;
- Runtime independence between `build()` calls;
- Handler Registry composition boundary;
- Handler Activation composition boundary;
- Handler Resolver composition boundary;
- Pipeline composition boundary;
- Application Executor composition boundary;
- Runtime independence from dependency injection infrastructure.

---

# Final Status

**Architecture Review: APPROVED**

**Foundation Status: FROZEN**
