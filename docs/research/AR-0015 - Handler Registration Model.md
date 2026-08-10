# AR-0015 — Handler Registration Model

## Review Status

Approved

## Reviewed Scope

This review covers the Handler Registration Model introduced as the next Foundation block after the Handler Activation Foundation.

The reviewed architecture consists of:

```text
RuntimeBuilder
      │
      ├── register()
      │
      └── registerFactory()
               │
               ▼
     HandlerActivationSource
               │
               ▼
        HandlerRegistry
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

The builder collects registration configuration and creates the complete runtime composition during `build()`.

Each `build()` creates an independent runtime composition.

### Direct Handler Registration

**Status: PASS**

`RuntimeBuilder.register()` continues to support directly available functional handlers.

The builder converts the registration into the existing handler activation source.

No activation is performed during registration.

### Factory Registration

**Status: PASS**

`RuntimeBuilder.registerFactory()` exposes the factory activation mechanism already established by the Handler Activation Foundation.

The builder converts the factory into the existing factory activation source.

The factory is invoked only by `HandlerActivator`.

No new activation mechanism is introduced.

### Handler Registry Responsibility

**Status: PASS**

`HandlerRegistry` remains responsible only for registration and lookup.

It stores `HandlerActivationSource` values.

It does not:

* activate handlers;
* invoke factories;
* execute handlers;
* resolve dependencies.

### Handler Activation Responsibility

**Status: PASS**

`HandlerActivator` remains the activation boundary.

`DefaultHandlerActivator` supports both:

* direct handler activation;
* factory-based activation.

The registration API does not bypass the activator.

### Handler Resolver Responsibility

**Status: PASS**

`HandlerResolver` remains responsible for resolving executable request handlers.

It does not distinguish between handlers registered directly and handlers registered through factories.

Resolution continues to delegate activation to `HandlerActivator`.

### Execution Isolation

**Status: PASS**

Execution components remain unaware of:

* RuntimeBuilder;
* registration methods;
* activation sources;
* handler factories;
* dependency injection.

`PipelineExecutor` continues to operate on executable handlers.

### Public API Stability

**Status: PASS**

The existing `RuntimeBuilder.register()` contract remains available.

The new `registerFactory()` operation is additive and explicit.

No changes are required to the Domain or Execution public contracts.

### Type Safety

**Status: PASS**

Direct handler registration and factory registration use distinct strongly typed APIs.

The activation source remains an explicit discriminated representation.

No implicit runtime inspection is introduced.

### DI Independence

**Status: PASS**

The Foundation contains no dependency on a DI framework or service container.

Factory registration uses the existing activation abstraction and does not introduce infrastructure dependencies.

### Scope Control

**Status: PASS**

The implementation does not introduce:

* lifecycle management;
* scopes;
* constructor injection;
* service providers;
* automatic handler discovery;
* reflection-based activation.

The change is limited to exposing the already supported factory activation mechanism through the Runtime Builder.

## Verification

The implementation passed:

```text
npx tsc --noEmit
npx tsc --noEmit -p tsconfig.vitest.json
npx vitest run
```

The test suite passed successfully with:

```text
14 test files passed
69 tests passed
```

## Architectural Risks

No blocking architectural risks were identified.

The public registration API remains small and explicit.

The factory registration path reuses the existing Handler Activation Foundation rather than introducing another activation abstraction.

## Decision

**APPROVED**

The Handler Registration Model is architecturally consistent with the frozen Runtime and Handler Activation Foundations.

## Freeze Recommendation

The following API is approved for reuse:

```ts
register(request, handler)
registerFactory(request, factory)
```

The following architectural boundaries remain frozen:

* `HandlerRegistry`
* `HandlerActivationSource`
* `HandlerActivator`
* `DefaultHandlerActivator`
* `HandlerResolver`
* Runtime Composition Root
* Execution isolation

## Final Status

**Architecture Review: APPROVED**

**Foundation Status: FROZEN**
