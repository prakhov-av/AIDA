# ADR-0004 — Domain Identity

* Status: Accepted
* Date: 2026-08-03
* Deciders: AIDA Team
* Related:

  * ADR-0003 — Domain Object Modeling
  * DD-0004 — Value Object Model
  * DD-0005 — Identifier Strategy

---

# Context

Identity is a fundamental concept of Domain-Driven Design.

While Value Objects are defined entirely by their values, Entities are defined by their identity.

A consistent identity model is required to:

* determine entity equality;
* support aggregate consistency;
* define repository behavior;
* avoid ambiguity across bounded contexts.

Without a common identity strategy, different parts of the system may implement inconsistent equality rules.

---

# Decision

AIDA adopts explicit domain identity.

Every Entity and Aggregate Root shall own a strongly typed Identifier represented as a specialized Value Object.

Entity identity is immutable throughout the lifetime of the entity.

Entity equality is based exclusively on identity.

Business state does not participate in equality.

---

# Identity Principles

## Identity Is Explicit

Identity shall never be represented by primitive values such as `string` or `number`.

Every identity shall be modeled as a dedicated Identifier Value Object.

---

## Identity Is Stable

An Entity's identity never changes after creation.

Business operations may modify state but shall never replace the identifier.

---

## Identity Is Unique

Identity uniquely distinguishes one Entity from another within its bounded context.

Identifier uniqueness is assumed by the domain model.

Generation strategy is an infrastructure concern.

---

## Equality

Two Entities are equal if and only if:

* they are of the same entity type;
* they have the same Identifier.

All other state is ignored.

Example:

```text
User(id=A, name=Alice)
User(id=A, name=Bob)
```

These objects represent the same Entity despite different state.

---

# Entity Lifecycle

An Entity shall not exist without identity.

Constructors and factory methods are expected to receive or assign an Identifier during creation.

The domain model does not support anonymous or transient entities.

---

# Relationship with Value Objects

Identifiers are Value Objects.

Entities own Identifiers but are not Value Objects themselves.

Changes to Entity state do not affect identity.

---

# Aggregate Identity

Every Aggregate Root owns exactly one Identifier.

All Entities within the aggregate derive their consistency from the Aggregate Root.

Repositories operate exclusively on Aggregate Root identity.

---

# Repository Implications

Repositories identify Aggregate Roots by their Identifier.

Repository contracts shall never expose primitive identifier types.

Example:

```ts
findById(id: UserId): Promise<Result<User, DomainError>>
```

---

# Infrastructure Independence

The domain layer is independent of:

* UUID libraries;
* database-generated keys;
* ORM identity mechanisms.

Infrastructure provides identifiers before or during object creation according to application requirements.

---

# Consequences

## Positive

* Consistent equality semantics.
* Strong type safety.
* Explicit domain modeling.
* Clear repository contracts.
* Reduced accidental identifier mixing.

## Negative

* Additional Identifier types must be defined.
* Slightly more implementation effort compared to primitive identifiers.

These costs are accepted in exchange for long-term maintainability.

---

# Compliance

All Entities and Aggregate Roots shall follow the identity model defined in this ADR.

Any deviation requires a new architectural decision.

---

# Related Documents

This decision is refined by:

* DD-0006 — Entity Model
* DD-0007 — Aggregate Root
* DD-0009 — Repository Contracts
