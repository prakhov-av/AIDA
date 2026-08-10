# AR-0014 — Handler Activation Model

## Review Status

Approved

## Reviewed Scope

This review covers the Handler Activation Foundation introduced during Sprint 3.

The reviewed architecture consists of:

```text
RuntimeBuilder
      │
      ▼
HandlerRegistry
      │
      ▼
HandlerActivationSource
      │
      ▼
HandlerActivator
      │
      ▼
HandlerResolver
      │
      ▼
PipelineExecutor
```

## Architecture Review

### Runtime Composition Root

**Status: PASS**

`RuntimeBuilder` remains the only Composition Root.

The default runtime constructs the registry, activator, resolver, pipeline, and application executor during `build()`.

### Handler Registry Responsibility

**Status: PASS**

`HandlerRegistry` is limited to registration and lookup of `HandlerActivationSource`.

It does not activate, instantiate, or execute handlers.

### Handler Activation Responsibility

**Status: PASS**

`HandlerActivator` provides the explicit activation boundary.

`DefaultHandlerActivator` supports:

* direct handler activation;
* factory-based activation.

No dependency injection framework is required.

### Handler Resolver Responsibility

**Status: PASS**

`HandlerResolver` remains responsible for resolving an executable handler.

The default implementation:

1. identifies the request type;
2. retrieves the activation source;
3. delegates activation to `HandlerActivator`;
4. returns the executable handler.

The public resolver contract remains unchanged.

### Execution Isolation

**Status: PASS**

Execution components remain unaware of:

* handler registration;
* activation sources;
* activation strategy;
* dependency injection.

`PipelineExecutor` continues to operate only on the executable handler returned by the resolver.

### Dependency Inversion

**Status: PASS**

The Runtime Foundation depends on the `HandlerActivator` abstraction rather than a concrete infrastructure mechanism.

Custom activation implementations can be introduced without modifying Execution Foundation.

### Type Safety

**Status: PASS**

Activation mechanisms are represented explicitly through a discriminated union.

No implicit runtime inspection is required to determine the activation mechanism.

### Public API Stability

**Status: PASS**

`RuntimeBuilder.register()` continues to accept functional request handlers.

`HandlerResolver.resolve()` continues to return an executable request handler.

No Domain or Execution public API changes are required.

### DI Independence

**Status: PASS**

The Foundation contains no dependency on a DI framework or service container.

DI integration remains an infrastructure concern.

## Verification

The implementation passed:

```text
npx tsc --noEmit
npx tsc --noEmit -p tsconfig.vitest.json
npx vitest run
```

Unit tests:

```text
14 test files passed
67 tests passed
```

## Architectural Risks

No blocking architectural risks were identified.

The activation boundary is intentionally small and can support future infrastructure-specific activators without changing the frozen Execution Foundation.

## Decision

**APPROVED**

Handler Activation Foundation is architecturally consistent with the Runtime Foundation and may remain frozen.

## Freeze Recommendation

The following components are approved for reuse:

* `HandlerActivationSource`
* `HandlerActivator`
* `DefaultHandlerActivator`
* activation-aware `HandlerRegistry`
* activation-aware `HandlerResolver`
* Runtime composition of the activation chain

## Final Status

**Architecture Review: APPROVED**

**Foundation Status: FROZEN**
