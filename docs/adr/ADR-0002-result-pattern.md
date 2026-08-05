# ADR-0002 — Result Pattern

- Status: Accepted
- Date: 2026-08-03
- Deciders: AIDA Team
- Related:
  - AR-0002 — Result Implementations Research

---

# Context

The AIDA domain layer requires a consistent mechanism for representing the outcome of business operations.

Expected business failures such as validation errors, rule violations, or missing entities are part of the domain model and should not be represented using exceptions.

The chosen approach must:

- make success and failure explicit in function signatures;
- integrate naturally with TypeScript's type system;
- support functional composition;
- remain lightweight and framework-independent;
- avoid unnecessary external dependencies;
- align with Domain-Driven Design principles.

The alternatives evaluated in AR-0002 include exceptions, nullable values, boolean status objects, discriminated unions, third-party libraries, and a custom implementation.

---

# Decision

AIDA adopts a custom `Result<T, E>` abstraction for representing expected operation outcomes.

The implementation shall be based on a discriminated union and maintained as part of the core domain.

The project shall not depend on third-party Result libraries.

Construction of Result instances shall be performed through dedicated factory functions rather than direct object creation.

Expected business failures shall be represented as `Err` values.

Successful operations shall be represented as `Ok` values.

Unexpected failures, programming errors, invariant violations, and unrecoverable infrastructure failures may still be represented using exceptions.

---

# Rationale

This decision provides several advantages.

## Explicit Contracts

Every operation clearly communicates whether it can fail.

Failure becomes part of the public API instead of hidden runtime behavior.

---

## Strong Type Safety

The compiler guarantees that consumers explicitly handle both success and failure.

Impossible states are eliminated through discriminated unions.

---

## Functional Composition

Operations can be composed without nested exception handling.

Business workflows become easier to read and test.

---

## Domain-Driven Design

Business failures become first-class domain concepts instead of exceptional runtime events.

The domain model remains independent from infrastructure concerns.

---

## Independence

Maintaining an internal implementation avoids coupling to external libraries and allows the API to evolve according to project requirements.

---

# Consequences

## Positive

- Explicit error handling.
- Improved readability.
- Better testability.
- Strong compiler guarantees.
- Stable public API.
- Zero runtime dependencies.

## Negative

- Additional implementation effort.
- Developers must learn the Result workflow.
- Helper functions must be maintained internally.

These costs are considered acceptable given the architectural benefits.

---

# Scope

This decision applies to:

- Domain layer
- Application layer
- Domain services
- Use cases
- Value object factories
- Entity factories
- Repository contracts

Infrastructure components may internally use exceptions where appropriate but shall convert expected failures into `Result` values before crossing architectural boundaries.

---

# Out of Scope

This decision does not specify:

- concrete API design;
- helper function signatures;
- implementation details;
- naming conventions;
- asynchronous composition helpers.

These topics are defined in the corresponding Detailed Design document.

---

# Compliance

New domain operations that may fail are expected to return `Result<T, E>`.

Returning `null`, `undefined`, or boolean status values as substitutes for expected business failures is discouraged unless explicitly justified.

Exceptions should be reserved for truly exceptional situations.

---

# Related Documents

- AR-0002 — Result Implementations Research
- DD-0002 — Result API Design (planned)