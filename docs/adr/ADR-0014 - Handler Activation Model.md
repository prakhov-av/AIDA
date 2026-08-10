# ADR-0014 — Handler Activation Model

## Status

Accepted

## Date

2026-08-10

## Context

The Runtime Foundation currently resolves application handlers through `HandlerRegistry` and `HandlerResolver`.

The initial Runtime Foundation model stored executable handlers directly in the registry. This model is sufficient for stateless functional handlers, but it does not provide an explicit extension point for handler activation.

Future integrations may require handlers to be obtained through factories, external service providers, or dependency injection containers. The Runtime Foundation must support such activation without introducing a dependency on any specific dependency injection mechanism.

The following architectural constraints must remain unchanged:

* Runtime is the only Composition Root.
* Execution must not depend on Runtime.
* Foundation must not depend on a dependency injection framework.
* `HandlerRegistry` must remain responsible for registration and lookup.
* `HandlerResolver` must remain responsible for resolving an executable handler.
* Pipeline execution must remain independent of handler activation.
* The public `RuntimeBuilder.register()` API must continue to support direct functional handlers.

## Decision

Introduce an explicit Handler Activation model.

The Runtime Foundation separates handler registration from handler activation through the following abstractions:

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

### HandlerRegistry

`HandlerRegistry` stores a `HandlerActivationSource` associated with a request constructor.

The registry is responsible only for:

* registering activation sources;
* looking up activation sources.

The registry does not create or resolve executable handlers.

### HandlerActivationSource

`HandlerActivationSource` explicitly describes how a handler can be activated.

The Foundation supports:

* an already available handler;
* a handler factory.

The source uses an explicit discriminated representation rather than implicit runtime inspection.

### HandlerActivator

`HandlerActivator` converts a `HandlerActivationSource` into an executable request handler.

The Foundation provides `DefaultHandlerActivator`.

`DefaultHandlerActivator`:

* returns a directly registered handler;
* invokes a registered factory;
* has no dependency on a DI container.

### HandlerResolver

`HandlerResolver` remains responsible for resolving an executable handler for an application request.

The default resolver:

1. determines the request type;
2. looks up the corresponding activation source in `HandlerRegistry`;
3. passes the source to `HandlerActivator`;
4. returns the resulting executable handler.

The public `HandlerResolver.resolve()` contract remains unchanged.

### RuntimeBuilder

`RuntimeBuilder` remains the Runtime Composition Root.

The default builder:

1. creates a new `DefaultHandlerRegistry`;
2. converts direct handler registrations into explicit handler activation sources;
3. creates a new `DefaultHandlerActivator`;
4. creates a `DefaultHandlerResolver` using the registry and activator;
5. creates the remaining execution pipeline.

Each `build()` continues to create an independent runtime composition.

## Rationale

The separation prevents the registry from becoming responsible for object creation.

It also creates a stable extension point for future activation mechanisms without coupling the Foundation to dependency injection.

A future integration may provide a custom `HandlerActivator` capable of obtaining handlers from an external container while leaving:

* Domain;
* Execution;
* Pipeline;
* HandlerRegistry;
* HandlerResolver public contracts

independent of that container.

The explicit activation source also avoids implicit handler detection and keeps activation semantics strongly typed.

## Consequences

### Positive

* Handler registration and handler activation have separate responsibilities.
* Runtime remains the only Composition Root.
* Execution remains independent of activation mechanisms.
* No dependency injection framework is required by Foundation.
* Direct functional handlers remain supported.
* Factory-based activation is supported.
* Future DI integrations can be implemented outside the Foundation.
* The public `HandlerResolver` execution contract remains stable.

### Negative

* The Runtime Foundation now contains an additional activation abstraction.
* Registry consumers must work with activation sources rather than directly with executable handlers.
* Runtime composition becomes slightly more explicit.

These costs are intentional and limited to the Runtime boundary.

## Rejected Alternatives

### Registry creates handlers

Rejected because registration and object creation would become the responsibility of the same component.

### Resolver creates handlers directly

Rejected because the resolver would become coupled to handler construction and future activation mechanisms.

### Direct dependency on a DI container

Rejected because Foundation must remain independent of infrastructure and external dependency injection frameworks.

### Implicit activation based on runtime type inspection

Rejected because it weakens type safety and introduces implicit behavior into the Runtime Foundation.

## Scope

This decision applies only to Handler Activation within Runtime Foundation.

It does not change:

* Domain Foundation;
* Application Execution Model;
* Execution Strategy;
* Pipeline execution semantics;
* existing request handler execution semantics.

## Freeze Criteria

The Handler Activation Foundation may be frozen when:

* `HandlerActivationSource` is stable;
* `HandlerActivator` is stable;
* `DefaultHandlerActivator` is stable;
* `HandlerRegistry` stores activation sources;
* `HandlerResolver` activates sources through `HandlerActivator`;
* `RuntimeBuilder` composes the complete activation chain;
* TypeScript checks pass;
* Vitest passes;
* Architecture Review is complete.

## Result

Handler activation is established as an explicit Runtime extension point without introducing dependency injection into Foundation.
