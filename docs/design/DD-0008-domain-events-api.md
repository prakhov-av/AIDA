# DD-0008 — Domain Events API

* Status: Approved
* Date: 2026-08-03
* Related:

  * ADR-0005 — Domain Events
  * DD-0007 — Aggregate Root Model
  * DD-0005 — Identifier Strategy

---

# 1. Purpose

This document defines the public API and implementation guidelines for Domain Events used within the AIDA domain layer.

The objective is to provide a minimal, immutable, and framework-independent representation of business facts.

---

# 2. Design Goals

The Domain Event API shall be:

* immutable;
* explicit;
* serializable;
* framework-independent;
* easy to test;
* independent of transport mechanisms.

---

# 3. Definition

A Domain Event represents a business fact that has already occurred.

Events describe completed business behavior.

They do not represent commands or requests.

---

# 4. Event Structure

Every Domain Event shall be represented as an immutable object.

The event contains only information required to describe the business fact.

Example:

```ts
interface UserRegistered {
    readonly userId: UserId;
    readonly email: Email;
}
```

No infrastructure metadata is required.

---

# 5. Naming

Event names shall:

* use past tense;
* describe completed business facts;
* represent domain language.

Examples:

* UserRegistered
* EmailChanged
* ProjectArchived

Invalid examples:

* RegisterUser
* ChangeEmail
* ArchiveProject

---

# 6. Immutability

All properties shall be declared as `readonly`.

Events shall never expose mutation methods.

---

# 7. Serialization

Events shall be serializable without custom adapters.

Only domain data shall be serialized.

Transport-specific metadata belongs outside the domain model.

---

# 8. Lifecycle

The typical lifecycle is:

1. Aggregate executes business operation.
2. Aggregate records one or more Domain Events.
3. Repository persists the Aggregate.
4. Application retrieves recorded events.
5. Infrastructure dispatches events.
6. Aggregate clears its recorded event collection.

---

# 9. Infrastructure Separation

The Domain Event API intentionally excludes:

* event identifiers;
* transport identifiers;
* correlation identifiers;
* causation identifiers;
* retry information;
* broker metadata;
* delivery status.

These concerns belong to the application or infrastructure layers.

---

# 10. Examples

```ts
interface UserRegistered {
    readonly userId: UserId;
    readonly email: Email;
}

interface ProjectArchived {
    readonly projectId: ProjectId;
    readonly archivedBy: UserId;
}
```

---

# 11. Non-Goals

This design intentionally excludes:

* event dispatch;
* message buses;
* event stores;
* replay support;
* subscriptions;
* delivery guarantees.

---

# 12. Future Extensions

Infrastructure adapters may enrich Domain Events with transport metadata when required.

Such enrichment shall occur outside the domain layer.

---

# 13. Summary

Domain Events represent immutable business facts.

Their API remains intentionally minimal, ensuring that the domain model stays independent of messaging infrastructure while remaining easy to understand, serialize, and test.
