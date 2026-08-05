# DD-0006 — Entity Model

* Status: Approved
* Date: 2026-08-03
* Related:

  * ADR-0003 — Domain Object Modeling
  * ADR-0004 — Domain Identity
  * DD-0004 — Value Object Model
  * DD-0005 — Identifier Strategy
  * DD-0003 — Domain Error Model

---

# 1. Purpose

This document defines the design principles and implementation model for Entities within the AIDA domain layer.

Entities represent domain concepts that possess a stable identity while allowing their business state to evolve over time.

---

# 2. Design Goals

The Entity model shall be:

* identity-based;
* behavior-oriented;
* framework-independent;
* consistent with Domain-Driven Design;
* easy to test;
* independent of persistence concerns.

---

# 3. Definition

An Entity is a domain object that:

* has a stable identity;
* owns mutable business state;
* protects its invariants;
* exposes business behavior;
* participates in an Aggregate.

An Entity is defined by its identity rather than its current state.

---

# 4. Identity

Every Entity shall own exactly one Identifier.

The Identifier:

* is immutable;
* is assigned during creation;
* uniquely identifies the Entity within its bounded context.

The Identifier shall never change during the Entity lifecycle.

---

# 5. Construction

Entities shall not expose public constructors.

Creation shall occur through factory methods.

Example:

```ts
const result = User.create(id, email, name);
```

Factories return:

```ts
Result<User, DomainError>
```

All invariants must be validated during creation.

---

# 6. State Management

Entity state may evolve through business operations.

All state transitions shall preserve domain invariants.

Entities shall not expose generic setter methods.

Instead, they expose intention-revealing business operations.

Example:

```ts
user.changeEmail(newEmail);
```

instead of

```ts
user.setEmail(newEmail);
```

---

# 7. Invariants

An Entity is responsible for protecting its own consistency.

Business rules shall not rely on external validation after construction.

Every public operation shall leave the Entity in a valid state.

---

# 8. Equality

Entity equality is defined exclusively by Identifier.

Business state shall not participate in equality.

Example:

```text
User(id=A, email=x@example.com)
```

equals

```text
User(id=A, email=y@example.com)
```

because both represent the same Entity.

---

# 9. Relationship with Value Objects

Entities own Value Objects.

Value Objects encapsulate business concepts and validation.

Entities coordinate those Value Objects to implement business behavior.

---

# 10. Domain Behavior

Entities should expose business operations rather than data manipulation.

Examples include:

* activate();
* deactivate();
* rename();
* assignOwner();
* archive();

Operations shall express business intent.

---

# 11. Persistence Independence

Entities shall not contain:

* ORM annotations;
* persistence metadata;
* repository logic;
* database identifiers.

Persistence is an infrastructure concern.

---

# 12. Serialization

Serialization shall occur outside the Entity whenever possible.

Entities may expose read-only accessors required by persistence adapters.

Serialization formats are not part of the Entity contract.

---

# 13. Base Class

AIDA adopts a lightweight abstract base class for Entities.

The base class defines common semantics while avoiding framework dependencies.

Typical responsibilities include:

* exposing the Identifier;
* implementing equality;
* providing protected construction.

Business behavior belongs to concrete entities.

---

# 14. Relationship with Aggregates

Every Entity belongs to exactly one Aggregate.

Only the Aggregate Root may coordinate modifications involving multiple Entities.

Entities shall not enforce consistency beyond their own responsibility.

---

# 15. Non-Goals

This design intentionally excludes:

* persistence mapping;
* lazy loading;
* event publishing;
* dependency injection;
* transaction management.

These concerns belong outside the domain model.

---

# 16. Future Extensions

Future versions may introduce common support for:

* domain event collection;
* optimistic versioning;
* audit information.

These additions shall not alter the semantics defined by this document.

---

# 17. Summary

Entities represent identifiable domain concepts with evolving business state.

They protect invariants, expose meaningful business behavior, and remain independent from infrastructure while relying on strongly typed Identifiers and Value Objects.
