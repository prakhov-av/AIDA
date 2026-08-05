# ADR-0003 — Domain Object Modeling

* Status: Accepted
* Date: 2026-08-03
* Deciders: AIDA Team
* Related:

  * ADR-0002 — Result Pattern
  * DD-0002 — Result API Design
  * DD-0003 — Domain Error Model

---

# Context

The AIDA domain layer is built according to Domain-Driven Design principles.

Several architectural approaches exist for modeling domain objects in TypeScript:

* inheritance through abstract base classes;
* interfaces with composition;
* purely functional modeling;
* hybrid approaches.

The selected approach must:

* remain framework-independent;
* minimize accidental complexity;
* provide strong type safety;
* encourage explicit domain models;
* support testing without infrastructure;
* remain maintainable over the lifetime of the project.

This decision establishes the common modeling principles for all domain objects.

---

# Decision

AIDA adopts a hybrid modeling approach.

Domain objects may use abstract base classes when they represent stable domain concepts with shared behavior.

Interfaces shall be used to define contracts.

Composition shall be preferred over inheritance unless inheritance provides meaningful semantic value.

Inheritance shall not be used solely to reduce code duplication.

---

# Modeling Principles

## Explicit Domain Model

Business concepts shall be represented as explicit domain objects.

Primitive values shall not replace meaningful domain concepts.

---

## Rich Domain Objects

Validation and business rules belong inside domain objects.

Domain objects shall protect their own invariants.

---

## Immutability by Default

Domain objects shall be immutable unless mutability is an essential business requirement.

State transitions should produce new objects or be controlled by aggregate behavior.

---

## Framework Independence

The domain layer shall not depend on:

* persistence frameworks;
* web frameworks;
* dependency injection containers;
* serialization libraries.

---

## Behavior over Data

Domain objects should expose business behavior rather than acting as passive data containers.

Anemic domain models are discouraged.

---

## Explicit Construction

Objects with invariants shall not expose public constructors.

Creation shall be performed through factory methods returning `Result<T, DomainError>`.

---

# Inheritance Policy

Abstract base classes are permitted only when they define common domain semantics.

Examples include:

* ValueObject
* Entity
* AggregateRoot

Base classes shall remain lightweight and focused.

Deep inheritance hierarchies are prohibited.

---

# Composition Policy

Composition is preferred for reusable functionality such as:

* validation;
* formatting;
* parsing;
* normalization;
* policies;
* specifications.

Shared behavior that is not part of an object's identity should be extracted into dedicated collaborators.

---

# Interface Policy

Interfaces define contracts between components.

Interfaces shall not contain business logic.

Public abstractions should be expressed through interfaces where appropriate.

---

# Consequences

## Positive

* Consistent domain modeling.
* Clear separation of responsibilities.
* Reduced coupling.
* Easier testing.
* Stable architectural foundation.

## Negative

* Slightly more design effort.
* Additional base abstractions to maintain.

These trade-offs are acceptable given the long-term maintainability goals of the project.

---

# Compliance

All future domain modeling documents shall follow the principles defined in this ADR.

Any deviation shall be documented through a new ADR.

---

# Related Documents

The following documents refine this decision:

* DD-0004 — Value Object Model
* DD-0005 — Identifier Strategy
* DD-0006 — Entity Model
* DD-0007 — Aggregate Root
