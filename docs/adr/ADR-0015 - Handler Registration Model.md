# ADR-0015 — Handler Registration Model

## Status

Accepted

## Date

2026-08-10

## Context

The Runtime Foundation provides an explicit Handler Activation Model through `HandlerActivationSource`, `HandlerActivator`, and `HandlerResolver`.

The activation model supports two activation sources:

* an already available functional handler;
* a handler factory.

The internal activation architecture therefore already supports factory-based activation. However, the public `RuntimeBuilder` API previously exposed only direct handler registration through `register()`.

This created an incomplete boundary between the public Runtime composition API and the frozen Handler Activation Foundation.

The Runtime Foundation must expose factory registration without introducing a dependency on dependency injection infrastructure or exposing activation implementation details as the primary public registration API.

The following architectural constraints must remain unchanged:

* Runtime is the only Composition Root.
* Execution must not depend on Runtime.
* Foundation must not depend on a dependency injection framework.
* `HandlerRegistry` must remain responsible for registration and lookup.
* `HandlerActivator` must remain responsible for activation.
* `HandlerResolver` must remain responsible for resolving executable handlers.
* Pipeline execution must remain independent of handler registration and activation.
* Functional handlers must remain directly registerable.
* `build()` must continue to create an independent runtime composition.

## Decision

Extend the `RuntimeBuilder` registration API with explicit factory registration.

The public Runtime registration model is:

```text
RuntimeBuilder
    │
    ├── register(request, handler)
    │
    └── registerFactory(request, factory)
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

### Direct Handler Registration

`RuntimeBuilder.register()` continues to register an already available functional handler.

The builder converts the registration into an explicit handler activation source.

### Factory Registration

`RuntimeBuilder.registerFactory()` registers a factory capable of producing a request handler.

The builder converts the registration into an explicit factory activation source.

The builder does not invoke the factory during registration.

Factory activation remains the responsibility of `HandlerActivator`.

### HandlerRegistry

`HandlerRegistry` continues to store `HandlerActivationSource` instances.

The registry remains responsible only for:

* registration;
* lookup.

It does not create, activate, or execute handlers.

### HandlerActivator

`HandlerActivator` continues to provide the activation boundary.

`DefaultHandlerActivator` remains responsible for converting:

* direct handler sources into executable handlers;
* factory sources into executable handlers.

No new activation mechanism is introduced by this decision.

### HandlerResolver

`HandlerResolver` remains unchanged as the execution-facing resolution boundary.

It continues to:

1. identify the request type;
2. retrieve the corresponding activation source;
3. delegate activation to `HandlerActivator`;
4. return the executable handler.

### RuntimeBuilder

`RuntimeBuilder` remains the Runtime Composition Root.

The builder exposes only the stable registration operations required by application composition:

```ts
register(request, handler)
registerFactory(request, factory)
```

The builder does not expose activation implementation details as part of the normal registration flow.

Each `build()` continues to create an independent runtime composition.

## Rationale

Factory registration is already supported by the Handler Activation Foundation.

Exposing `registerFactory()` completes the public Runtime boundary without introducing another abstraction or changing the execution model.

The explicit API is preferable to accepting a union of handlers and factories because the two registration semantics are materially different:

* direct registration provides an already available handler;
* factory registration provides a mechanism for obtaining a handler.

Separate methods keep the public API explicit and strongly typed.

The activation source remains an internal composition detail between `RuntimeBuilder`, `HandlerRegistry`, and `HandlerActivator`.

## Consequences

### Positive

* Factory-based handler activation is available through the public Runtime composition API.
* Direct functional handlers remain supported.
* Registration semantics remain explicit.
* `HandlerRegistry` and `HandlerActivator` retain separate responsibilities.
* No dependency injection framework is introduced.
* Execution remains independent of Runtime composition.
* Existing Handler Activation Foundation contracts remain reusable.
* The public API remains small and strongly typed.

### Negative

* `RuntimeBuilder` exposes one additional registration method.
* Runtime composition contains two explicit registration paths.
* Applications must choose between direct handler and factory registration.

These costs are intentional and reflect the existing activation model.

## Rejected Alternatives

### Single registration method accepting a union

Rejected because it would make the registration API less explicit and require callers and/or the builder to distinguish activation mechanisms implicitly.

### Expose `HandlerActivationSource` directly

Rejected because application composition should not need to construct internal activation descriptors.

The Runtime Builder should provide the stable public API while retaining control over the internal activation representation.

### Register factory through `register()`

Rejected because a factory and an executable handler have different semantics and should remain explicit at the public API boundary.

### Add a dependency injection container

Rejected because dependency injection is infrastructure and is outside the Runtime Foundation scope.

### Add lifecycle or scope management

Rejected because this decision only exposes the already existing factory activation capability. Lifecycle management is a separate architectural concern.

## Scope

This decision applies only to Runtime handler registration.

It does not change:

* Domain Foundation;
* Application Execution Model;
* Execution Strategy;
* Pipeline execution semantics;
* Handler Activation semantics;
* Handler Resolver public contract;
* dependency injection infrastructure;
* handler lifecycle management.

## Freeze Criteria

The Handler Registration Model may be frozen when:

* `RuntimeBuilder.register()` remains stable;
* `RuntimeBuilder.registerFactory()` is stable;
* direct handler registration creates a handler activation source;
* factory registration creates a factory activation source;
* activation remains delegated to `HandlerActivator`;
* `HandlerRegistry` remains limited to registration and lookup;
* execution remains independent of registration;
* TypeScript checks pass;
* Vitest passes;
* Architecture Review is complete.

## Result

The Runtime Foundation provides an explicit public registration API for both direct functional handlers and factory-based handler activation while preserving the existing activation and execution boundaries.
