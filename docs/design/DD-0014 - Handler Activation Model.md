# DD-0014 — Handler Activation Model

## Decision

The Runtime Foundation introduces an explicit handler activation model separating handler registration from handler activation.

The model consists of:

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

`HandlerRegistry` stores activation sources rather than executable handlers.

`HandlerActivator` converts an activation source into an executable request handler.

`HandlerResolver` coordinates registry lookup and handler activation.

`RuntimeBuilder` remains the only Composition Root and creates the complete runtime activation chain during `build()`.

## HandlerActivationSource

`HandlerActivationSource` is an explicit discriminated union representing the supported activation mechanisms.

The Foundation supports:

* a directly available handler;
* a handler factory.

The activation source is explicit and strongly typed.

No runtime inference or implicit activation rules are used.

## HandlerActivator

`HandlerActivator` defines the stable activation boundary.

Its responsibility is limited to obtaining an executable handler from a `HandlerActivationSource`.

`DefaultHandlerActivator` provides the Foundation implementation without depending on dependency injection infrastructure.

The default implementation:

* returns a directly registered handler;
* invokes a handler factory.

## HandlerRegistry

`HandlerRegistry` remains responsible only for registration and lookup.

The registry does not:

* instantiate handlers;
* resolve dependencies;
* execute handlers;
* depend on a DI container.

The stored value is a `HandlerActivationSource`.

## HandlerResolver

`HandlerResolver` remains the execution-facing resolution boundary.

Its public contract continues to return an executable request handler.

The default implementation performs:

1. request type identification;
2. activation source lookup;
3. activation through `HandlerActivator`;
4. return of the executable handler.

The resolver does not implement handler construction itself.

## RuntimeBuilder

`RuntimeBuilder` remains the Runtime Composition Root.

The default implementation creates independent runtime components during every `build()` call.

The composition is:

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

Direct functional handler registration through `RuntimeBuilder.register()` remains supported.

The builder converts such registrations into explicit handler activation sources when constructing the runtime.

## Constraints

The following constraints are preserved:

* Runtime is the only Composition Root.
* Execution does not depend on Runtime.
* Foundation does not depend on DI.
* HandlerRegistry does not perform activation.
* HandlerActivator does not perform registration.
* HandlerResolver does not construct handlers directly.
* Pipeline execution does not know how handlers are activated.
* Existing functional handler execution semantics remain unchanged.
* Frozen Domain Foundation remains untouched.

## Extension Model

Future infrastructure integrations may provide custom `HandlerActivator` implementations.

Such implementations may obtain handlers from:

* factories;
* service providers;
* dependency injection containers;
* other infrastructure-specific mechanisms.

Those integrations remain outside the Runtime Foundation.

The Foundation therefore exposes an activation boundary without adopting an infrastructure dependency.

## Rationale

Separating registration from activation keeps each Runtime component focused on a single responsibility.

The explicit activation source provides strong typing and avoids implicit runtime inspection.

The activation boundary also allows future infrastructure integration without modifying the Execution Foundation or coupling the core Runtime to a specific dependency injection implementation.

## Status

Accepted and Frozen as part of Sprint 3 — Handler Activation Foundation.
