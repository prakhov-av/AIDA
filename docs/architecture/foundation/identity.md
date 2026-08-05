# Identity

**Status:** Frozen

## Overview

`Identity` is a specialized `ValueObject` that represents the unique identity of a domain entity.

It does not introduce additional behavior. Its purpose is to provide semantic meaning and strong typing while reusing the equality and immutability guarantees of `ValueObject`.

---

# ADR-001 — Identity Inherits ValueObject

## Status

Accepted

## Decision

`Identity` inherits from `ValueObject`.

## Rationale

An identity satisfies all characteristics of a value object:

- immutable;
- compared by value;
- has no lifecycle of its own.

Introducing a separate implementation would duplicate equality and immutability logic.

## Consequences

- One equality implementation.
- One immutability model.
- Consistent foundation for the domain model.

---

# ADR-002 — Identity Is Abstract

## Status

Accepted

## Decision

`Identity` is an abstract class.

Applications define concrete identity types by inheritance.

## Example

```ts
class UserId extends Identity<string> {}

class OrderId extends Identity<string> {}
```

## Rationale

Different identities represent different concepts even if their underlying values have the same type.

The type system should prevent accidental mixing.

---

# ADR-003 — Identity Reuses ValueObject Storage

## Status

Accepted

## Decision

Identity stores its value using the existing `ValueObject` storage model.

```ts
{
    value: T
}
```

## Rationale

A single storage model keeps the implementation simple and consistent.

---

# ADR-004 — Identity Adds No Behavior

## Status

Accepted

## Decision

Identity introduces no additional public behavior.

It does not provide:

- UUID generation;
- parsing;
- factories;
- formatting;
- serialization.

## Rationale

Those responsibilities belong to concrete identity implementations or dedicated services.

---

# ADR-006 — Identity Does Not Define Creation Policy

## Status

Accepted

## Decision

The constructor is protected.

Each concrete identity defines its own creation policy.

## Rationale

Different applications require different validation strategies.

The SDK should not impose one.

---

# ADR-011 — Identity Hides ValueObject Storage

## Status

Accepted

## Decision

Identity exposes

```ts
protected get value(): T
```

instead of requiring derived classes to access `props`.

## Rationale

`props` is an implementation detail of `ValueObject`.

Derived classes should work with the semantic concept of an identity value rather than the storage representation.

---

# Public API

```ts
abstract class Identity<T>
```

No additional public methods are provided.

---

# Design Principles

Identity follows the AIDA engineering principles:

- Explicit over implicit
- Small abstractions
- Strong typing
- Domain-first design
- Minimal public API
- Stable foundations