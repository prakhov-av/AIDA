# DD-0015 — Handler Registration Model

## Decision

The Runtime Foundation exposes two explicit handler registration operations:

```ts
register(request, handler)
registerFactory(request, factory)
```

Both operations are translated by `RuntimeBuilder` into the existing `HandlerActivationSource` abstraction.

The resulting composition is:

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

## Direct Handler Registration

`register()` accepts an already available functional request handler.

The builder creates a handler activation source representing the existing handler.

The builder does not perform activation.

## Factory Registration

`registerFactory()` accepts a factory that returns a request handler.

The builder creates a factory activation source.

The factory is not invoked during registration.

Activation occurs later through the existing `HandlerActivator` boundary.

This preserves the distinction between:

* registering a mechanism for obtaining a handler;
* obtaining the executable handler.

## RuntimeBuilder

`RuntimeBuilder` is responsible for collecting runtime configuration.

The builder stores registration configuration until `build()`.

During `build()` it creates:

```text
DefaultHandlerRegistry
+
DefaultHandlerActivator
+
DefaultHandlerResolver
+
DefaultPipelineBuilder
+
DefaultPipelineExecutor
+
DefaultApplicationExecutor
```

Each invocation of `build()` creates an independent runtime composition.

## HandlerActivationSource

No new activation source type is introduced.

The existing discriminated activation model remains the source of truth:

```text
handler
factory
```

`RuntimeBuilder` translates the public registration API into this internal representation.

## HandlerRegistry

`HandlerRegistry` stores activation sources.

Its responsibilities remain:

* registration;
* lookup.

The registry does not:

* invoke factories;
* create handlers;
* execute handlers;
* resolve dependencies;
* depend on RuntimeBuilder.

## HandlerActivator

`HandlerActivator` remains the activation boundary.

`DefaultHandlerActivator` performs activation according to the existing activation source:

* direct handler source → return handler;
* factory source → invoke factory and return handler.

No changes to activation semantics are required.

## HandlerResolver

`HandlerResolver` remains unchanged.

Resolution continues to perform:

1. request type identification;
2. registry lookup;
3. handler activation;
4. return of executable handler.

The resolver does not know whether the handler originated from `register()` or `registerFactory()`.

## Execution Isolation

The execution layer receives an executable request handler.

Execution does not depend on:

* `RuntimeBuilder`;
* registration APIs;
* `HandlerActivationSource`;
* handler factories;
* dependency injection.

The pipeline therefore remains independent of the registration mechanism.

## Public API

The stable public registration API is intentionally small:

```ts
register(request, handler)
registerFactory(request, factory)
addBehavior(behavior)
build()
```

The activation source representation is not required to construct normal application registrations.

## Constraints

The following constraints are preserved:

* Runtime is the only Composition Root.
* Execution does not depend on Runtime.
* Foundation does not depend on DI.
* HandlerRegistry does not perform activation.
* HandlerActivator does not perform registration.
* HandlerResolver does not construct handlers directly.
* Pipeline execution does not know how handlers are registered.
* Direct functional handlers remain supported.
* Factory registration is explicit.
* Frozen Domain and Execution Foundations remain untouched.

## Extension Model

Future infrastructure-specific activation mechanisms may still be introduced through custom `HandlerActivator` implementations.

This decision does not define:

* dependency injection;
* service provider integration;
* scopes;
* lifetimes;
* constructor injection;
* lifecycle management.

Those concerns remain outside the Handler Registration Model.

## Rationale

The public registration API should express application intent directly.

`register()` expresses:

> this executable handler handles this request.

`registerFactory()` expresses:

> this factory provides the handler for this request.

Keeping these operations separate avoids implicit activation detection and keeps the Runtime API strongly typed.

The internal activation model remains unchanged.

## Status

Accepted and Frozen as part of Sprint 3 — Handler Registration Foundation.
