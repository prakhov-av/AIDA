# DD-0003 — Domain Error Model

- Status: Approved
- Date: 2026-08-03
- Related:
  - ADR-0002 — Result Pattern
  - DD-0002 — Result API Design

---

# 1. Purpose

This document defines the error model used throughout the AIDA domain layer.

The goal is to represent business failures as immutable domain objects rather than exceptions, enabling explicit and type-safe error handling through the `Result<T, E>` abstraction.

---

# 2. Design Goals

The error model shall be:

- immutable;
- framework-independent;
- serializable;
- explicit;
- type-safe;
- easy to extend;
- suitable for logging and diagnostics.

Errors represent business facts rather than runtime failures.

---

# 3. DomainError Contract

Every domain error shall implement the following contract.

```ts
export interface DomainError {
    readonly code: string;
    readonly message: string;
}
```

The contract intentionally remains minimal.

---

# 4. Error Code

Every error shall expose a unique, stable error code.

Example:

```text
user.email.invalid
```

or

```text
customer.not-found
```

Error codes are intended for:

- machine processing;
- API mapping;
- localization;
- diagnostics;
- monitoring.

Error codes shall remain stable over time.

---

# 5. Error Message

The `message` property provides a human-readable description.

Example:

```text
Email address has an invalid format.
```

Messages are primarily intended for:

- logs;
- debugging;
- developer tooling.

Applications may replace messages with localized text.

---

# 6. Immutability

Domain errors are immutable.

Their properties shall be declared as `readonly`.

Errors shall not expose mutation methods.

---

# 7. Error Hierarchy

The domain model does not require inheritance.

Errors may be represented as plain immutable objects implementing `DomainError`.

Example:

```ts
export interface InvalidEmailError extends DomainError {
    readonly code: "user.email.invalid";
}
```

Inheritance through base classes is intentionally avoided to keep the model lightweight.

---

# 8. Relationship with Result

Expected business failures shall be returned as:

```ts
Result<T, DomainError>
```

or

```ts
Result<T, InvalidEmailError>
```

The domain layer shall not return raw strings or generic `Error` objects as business failures.

---

# 9. Exception Policy

Domain errors are **not exceptions**.

They shall not be thrown during normal business execution.

Exceptions remain reserved for:

- programming defects;
- invariant violations;
- unrecoverable infrastructure failures.

When appropriate, exceptions shall be translated into `DomainError` instances before crossing architectural boundaries.

---

# 10. Serialization

Domain errors shall be serializable without custom logic.

Example:

```json
{
    "code": "user.email.invalid",
    "message": "Email address has an invalid format."
}
```

No runtime metadata shall be required.

---

# 11. Module Layout

```text
src/shared/errors/
├── domain-error.ts
├── index.ts
```

The initial implementation intentionally remains minimal.

Concrete business errors belong to their respective bounded contexts rather than the shared kernel.

---

# 12. Usage Example

```ts
return err({
    code: "user.email.invalid",
    message: "Email address has an invalid format.",
});
```

---

# 13. Non-Goals

This design intentionally excludes:

- HTTP status codes;
- exception inheritance;
- stack traces;
- logging facilities;
- localization;
- infrastructure-specific metadata.

These concerns belong outside the domain layer.

---

# 14. Future Extensions

Future versions may introduce optional fields such as:

- `details`;
- `cause`;
- `metadata`;
- `context`.

These additions shall remain backward compatible with the base `DomainError` contract.

---

# 15. Summary

The domain error model is intentionally simple.

A minimal immutable contract enables explicit business error modeling while remaining independent from infrastructure concerns and fully compatible with the `Result` abstraction.