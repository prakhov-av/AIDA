# DD-0005 — Identifier Strategy

* Status: Approved
* Date: 2026-08-03
* Related:

  * ADR-0003 — Domain Object Modeling
  * DD-0004 — Value Object Model
  * DD-0003 — Domain Error Model
  * DD-0002 — Result API Design

---

# 1. Purpose

This document defines the strategy for identifiers used throughout the AIDA domain model.

Identifiers are modeled as specialized Value Objects to provide explicit semantics, type safety, and strong separation between different domain concepts.

---

# 2. Design Goals

The identifier model shall be:

* immutable;
* strongly typed;
* framework-independent;
* serializable;
* self-validating;
* consistent across all bounded contexts.

---

# 3. Definition

An Identifier is a Value Object representing the identity of an Entity or Aggregate Root.

Identifiers:

* have no business behavior beyond identity;
* are immutable;
* compare by value;
* are globally unique within their type.

Identifiers are not interchangeable, even if they share the same underlying primitive representation.

---

# 4. Type Safety

Identifiers shall prevent accidental mixing of different domain concepts.

The following example is invalid:

```ts
function assign(userId: UserId, orderId: OrderId) {}

// Passing an OrderId where a UserId is expected
// shall be rejected by the type system.
```

Strong typing is preferred over primitive aliases.

---

# 5. Construction

Identifiers shall be created through factory methods.

Example:

```ts
const result = UserId.create(value);
```

Factories return:

```ts
Result<UserId, DomainError>
```

Construction validates the identifier format when required.

---

# 6. Generation

Identifier generation is an application concern.

The domain model accepts identifiers but should not generate them automatically.

Examples of generation mechanisms include:

* UUID;
* ULID;
* Snowflake identifiers;
* database-generated values.

The chosen generation strategy is independent from the domain model.

---

# 7. Equality

Identifiers compare by value.

Example:

```ts
userId.equals(otherUserId)
```

Two identifiers are equal only if:

* they represent the same identifier type;
* their values are equal.

---

# 8. Serialization

Identifiers shall provide a stable serialized representation suitable for persistence and transport.

Typical representations include:

* string;
* number.

Serialization format shall remain stable.

---

# 9. Validation

Validation rules belong inside the Identifier.

Typical rules include:

* required value;
* format validation;
* length constraints;
* character restrictions.

Invalid identifiers shall never be created.

---

# 10. Relationship with Value Objects

Identifiers are specialized Value Objects.

They inherit all Value Object principles:

* immutability;
* equality by value;
* explicit construction;
* validation at creation time.

No additional identity mechanism exists beyond the Identifier itself.

---

# 11. Infrastructure Independence

The domain layer shall not depend on any identifier generation library.

Infrastructure components may generate identifiers before passing them into the domain.

This keeps the domain deterministic and easy to test.

---

# 12. Examples

Typical identifiers include:

* UserId
* OrderId
* ProjectId
* SessionId
* WorkspaceId

Each identifier represents a distinct domain concept.

---

# 13. Non-Goals

This design intentionally excludes:

* identifier persistence;
* database sequences;
* UUID library selection;
* distributed identifier generation;
* transport encoding.

These concerns belong to infrastructure.

---

# 14. Future Extensions

Future versions may introduce:

* generic identifier base class;
* reusable validation helpers;
* strongly typed identifier generators;
* infrastructure adapters.

These additions shall preserve the semantics defined in this document.

---

# 15. Summary

Identifiers are explicit Value Objects representing the identity of domain entities.

They improve readability, prevent accidental type mixing, and maintain a clear separation between domain concepts while remaining independent from infrastructure concerns.
