# DD-0004 — Value Object Model

* Status: Approved
* Date: 2026-08-03
* Related:

  * ADR-0003 — Domain Object Modeling
  * ADR-0002 — Result Pattern
  * DD-0002 — Result API Design
  * DD-0003 — Domain Error Model

---

# 1. Purpose

This document defines the design principles and implementation model for Value Objects within the AIDA domain layer.

Value Objects represent immutable domain concepts whose identity is determined solely by their values.

---

# 2. Design Goals

The Value Object model shall be:

* immutable;
* self-validating;
* framework-independent;
* side-effect free;
* explicit;
* easy to test;
* consistent across the domain.

---

# 3. Definition

A Value Object is a domain object that:

* has no identity;
* is defined entirely by its value;
* is immutable;
* always represents a valid state.

Two Value Objects with equal values are considered equal regardless of where or when they were created.

---

# 4. Construction

Objects with business invariants shall not expose public constructors.

Creation shall be performed through static factory methods.

Example:

```ts
const result = Email.create(input);
```

Factories return:

```ts
Result<Email, DomainError>
```

Construction is the only place where validation may fail.

---

# 5. Validation

Validation shall occur during object creation.

A Value Object shall never exist in an invalid state.

Validation rules belong inside the Value Object and shall not be delegated to application services.

---

# 6. Equality

Value Objects compare by value rather than by reference.

Every Value Object shall provide an equality operation.

```ts
equals(other: this): boolean
```

The comparison shall consider all fields that define the object's meaning.

Reference equality shall not be used for business decisions.

---

# 7. Immutability

All observable state shall be immutable.

Properties shall be declared `readonly`.

Setter methods are prohibited.

Operations that conceptually change a value shall return a new Value Object.

---

# 8. Base Class

AIDA adopts a lightweight abstract base class for Value Objects.

The base class defines shared domain semantics but does not prescribe internal storage.

Example:

```ts
abstract class ValueObject {
    public abstract equals(other: this): boolean;
}
```

The base class shall remain intentionally minimal.

---

# 9. Single-Value and Composite Objects

The model supports both single-value and composite Value Objects.

Single-value example:

```text
Email
```

Composite example:

```text
Money
- amount
- currency
```

The base class shall not assume the existence of a single `value` property.

Each Value Object defines its own internal representation.

---

# 10. Serialization

A Value Object may expose methods that provide a serialized representation suitable for persistence or transport.

Typical examples include:

* `toString()`
* `toJSON()`
* `toPrimitive()`

Serialization shall not expose mutable state.

---

# 11. Interaction with Result

Creation failures shall be represented using the Result abstraction.

Example:

```ts
const email = Email.create(input);

if (isErr(email)) {
    return email;
}
```

Exceptions shall not be used for expected validation failures.

---

# 12. Domain Behavior

Value Objects may contain business behavior related to their own meaning.

Examples include:

* normalization;
* formatting;
* comparison;
* calculations.

Behavior unrelated to the Value Object's responsibility shall be implemented elsewhere.

---

# 13. Examples

Typical Value Objects include:

* Email
* Money
* UserId
* OrderId
* Url
* Percentage
* Currency
* Version

Each follows the same construction and validation principles.

---

# 14. Non-Goals

This design intentionally excludes:

* persistence concerns;
* dependency injection;
* ORM annotations;
* infrastructure metadata;
* framework-specific behavior.

---

# 15. Future Extensions

Future versions may introduce reusable helpers for:

* structural equality;
* serialization;
* validation utilities.

Such additions shall not change the public semantics defined by this document.

---

# 16. Summary

Value Objects are one of the fundamental building blocks of the AIDA domain model.

They encapsulate business concepts, protect invariants, and provide immutable, value-based semantics while remaining independent of infrastructure and application concerns.
