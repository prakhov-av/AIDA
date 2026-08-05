# DD-0009 — Repository Contracts

* Status: Approved
* Date: 2026-08-03
* Related:

  * ADR-0003 — Domain Object Modeling
  * ADR-0004 — Domain Identity
  * ADR-0005 — Domain Events
  * DD-0002 — Result API Design
  * DD-0003 — Domain Error Model
  * DD-0005 — Identifier Strategy
  * DD-0007 — Aggregate Root Model
  * DD-0008 — Domain Events API

---

# 1. Purpose

This document defines the design principles and public contracts for Repositories in the AIDA domain layer.

Repositories provide access to Aggregate Roots while preserving the independence of the domain model from persistence technology.

---

# 2. Design Goals

Repository contracts shall be:

* aggregate-oriented;
* technology-independent;
* explicit;
* easy to mock;
* easy to test;
* stable over time.

---

# 3. Definition

A Repository represents a collection of Aggregate Roots.

Its responsibility is to:

* retrieve Aggregate Roots;
* persist Aggregate Roots;
* remove Aggregate Roots.

Repositories do not implement business logic.

---

# 4. Scope

Repositories operate exclusively on Aggregate Roots.

Repositories shall not expose:

* child Entities;
* Value Objects;
* persistence models;
* DTOs.

---

# 5. Repository Contracts

Repository interfaces belong to the domain layer.

Implementations belong to the infrastructure layer.

Example:

```ts
interface UserRepository {
    findById(id: UserId): Promise<Result<User, DomainError>>;

    save(user: User): Promise<Result<void, DomainError>>;

    delete(id: UserId): Promise<Result<void, DomainError>>;
}
```

---

# 6. Error Handling

Repository operations shall return `Result`.

Expected failures shall not be represented using exceptions.

Infrastructure failures shall be translated into appropriate domain or application errors before crossing architectural boundaries.

---

# 7. Persistence Independence

Repository contracts shall not expose:

* SQL;
* ORM APIs;
* document databases;
* HTTP clients;
* cache implementations.

The persistence mechanism is an implementation detail.

---

# 8. Aggregate Consistency

Repositories persist Aggregate Roots as consistency boundaries.

Repositories shall never persist child Entities independently.

Aggregate integrity is preserved through Aggregate Root persistence.

---

# 9. Domain Events

Repositories are responsible for persisting Aggregate state.

Repositories do not publish Domain Events.

Application services retrieve recorded Domain Events after successful persistence and coordinate their dispatch.

---

# 10. Query Responsibilities

Repositories provide aggregate retrieval.

Complex reporting, projections, analytics, and read models are outside the scope of Repository contracts.

Separate query services may be introduced when appropriate.

---

# 11. Naming

Repository interfaces shall use the following naming convention:

* UserRepository
* ProjectRepository
* WorkspaceRepository

Implementation-specific names shall remain in the infrastructure layer.

---

# 12. Non-Goals

This design intentionally excludes:

* transaction management;
* caching;
* pagination;
* query builders;
* ORM mapping;
* optimistic locking.

These concerns belong outside the repository contract.

---

# 13. Future Extensions

Future versions may introduce:

* Specification support;
* Unit of Work integration;
* streaming queries;
* batch operations.

These additions shall preserve the repository semantics defined in this document.

---

# 14. Summary

Repositories provide persistence abstractions for Aggregate Roots while preserving the separation between the domain model and infrastructure.

They expose explicit contracts, return `Result` values, and treat Aggregate Roots as the fundamental persistence unit.
