# DD-0002 — Result API Design

- Status: Approved
- Date: 2026-08-03
- Related:
  - AR-0002 — Result Implementations Research
  - ADR-0002 — Result Pattern

---

# 1. Purpose

This document specifies the public API and implementation guidelines for the `Result<T, E>` abstraction used throughout the AIDA project.

The goal is to provide a minimal, type-safe, immutable, dependency-free API for representing expected operation outcomes.

---

# 2. Design Goals

The implementation shall be:

- immutable;
- framework-independent;
- dependency-free;
- fully type-safe;
- tree-shake friendly;
- easy to compose;
- predictable;
- easy to test.

The API should remain intentionally small.

---

# 3. Public Types

## Result

```ts
type Result<T, E> = Ok<T> | Err<E>;
```

## Ok

```ts
type Ok<T> = {
    readonly success: true;
    readonly value: T;
};
```

## Err

```ts
type Err<E> = {
    readonly success: false;
    readonly error: E;
};
```

The `success` field is the discriminant used by TypeScript for type narrowing.

---

# 4. Factory Functions

Result instances shall only be created through factory functions.

## ok

```ts
ok<T>(value: T): Ok<T>
```

Creates a successful result.

---

## err

```ts
err<E>(error: E): Err<E>
```

Creates a failed result.

Direct object construction outside the Result module is discouraged.

---

# 5. Type Guards

The following guards shall be provided.

## isOk

```ts
isOk(result): boolean
```

Narrows `Result<T, E>` to `Ok<T>`.

---

## isErr

```ts
isErr(result): boolean
```

Narrows `Result<T, E>` to `Err<E>`.

---

# 6. Transformation Functions

Transformation helpers are implemented as standalone functions rather than methods.

## map

```ts
map(result, mapper)
```

Transforms the success value.

Errors pass through unchanged.

---

## mapError

```ts
mapError(result, mapper)
```

Transforms the error value.

Success values remain unchanged.

---

## flatMap

```ts
flatMap(result, mapper)
```

Chains operations returning another `Result`.

Nested `Result<Result<T>>` values shall never be produced.

---

# 7. Consumption Functions

## match

```ts
match(result, handlers)
```

Consumes both branches explicitly.

Preferred when both outcomes must be handled.

---

## unwrap

```ts
unwrap(result)
```

Returns the success value.

Throws only if called on an `Err`.

This function is intended primarily for tests and internal assertions.

---

## unwrapOr

```ts
unwrapOr(result, fallback)
```

Returns either the success value or a provided fallback.

---

# 8. Error Model

The Result type does not require a specific error implementation.

Domain operations are expected to use `DomainError` or one of its derived types.

Infrastructure errors shall be translated before crossing architectural boundaries.

---

# 9. Async Strategy

The first version does not introduce a dedicated asynchronous Result abstraction.

Instead, asynchronous operations return:

```ts
Promise<Result<T, E>>
```

A separate `ResultAsync` abstraction is intentionally excluded from the initial design.

---

# 10. Module Layout

```text
src/shared/result/
├── combinators.ts
├── factories.ts
├── guards.ts
├── result.ts
├── types.ts
└── index.ts
```

Responsibilities:

- `types.ts` — public type definitions.
- `factories.ts` — `ok()` and `err()`.
- `guards.ts` — type guards.
- `combinators.ts` — transformation and consumption helpers.
- `result.ts` — shared exports if required.
- `index.ts` — public module entry point.

---

# 11. Usage Examples

## Value Object Factory

```ts
const result = Email.create(input);

if (isErr(result)) {
    return result;
}

const email = result.value;
```

---

## Entity Factory

```ts
return flatMap(emailResult, (email) =>
    User.create(email)
);
```

---

## Domain Service

```ts
return map(result, transform);
```

---

## Application Service

```ts
return match(result, {
    ok: handleSuccess,
    err: handleFailure,
});
```

---

# 12. Non-Goals

The first version intentionally excludes:

- Result methods;
- async combinators;
- LINQ-style operators;
- implicit conversions;
- exception wrapping;
- logging helpers.

These features may be added later if justified.

---

# 13. Future Extensions

Potential future additions include:

- combine()
- sequence()
- tap()
- tapError()
- recover()
- filter()
- zip()

They are intentionally excluded from the initial implementation to keep the API focused.

---

# 14. Summary

The Result API is intentionally minimal.

It provides only the functionality required for domain modeling while remaining explicit, type-safe, dependency-free, and easy to compose.
