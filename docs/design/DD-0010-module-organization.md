# DD-0010 — Module Organization

* Status: Approved
* Date: 2026-08-03
* Related:

  * ADR-0003 — Domain Object Modeling
  * DD-0002 — Result API Design
  * DD-0003 — Domain Error Model
  * DD-0004 — Value Object Model
  * DD-0005 — Identifier Strategy
  * DD-0006 — Entity Model
  * DD-0007 — Aggregate Root Model
  * DD-0008 — Domain Events API
  * DD-0009 — Repository Contracts

---

# 1. Purpose

This document defines the module organization principles for the AIDA codebase.

The objective is to establish a predictable, scalable, and maintainable project structure while preserving architectural boundaries.

---

# 2. Design Goals

The module organization shall be:

* feature-oriented where appropriate;
* layer-aware;
* dependency-safe;
* framework-independent;
* easy to navigate;
* easy to evolve.

---

# 3. Architectural Layers

The project is organized into the following logical layers:

* Domain
* Application
* Infrastructure
* Interfaces
* Shared

Each layer has a clearly defined responsibility.

---

# 4. Dependency Direction

Dependencies shall follow a single direction.

```text
Interfaces
        ↓
Application
        ↓
Domain
```

Infrastructure depends on Domain and Application but neither Domain nor Application depends on Infrastructure.

Shared modules shall not depend on higher architectural layers.

---

# 5. Shared Module

The Shared module contains reusable building blocks that are independent of any bounded context.

Examples include:

* Result
* DomainError
* ValueObject
* Entity
* AggregateRoot
* DomainEvent

Business concepts do not belong in Shared.

---

# 6. Public Module API

Every module shall expose a single public entry point.

Example:

```text
src/shared/result/
    index.ts
```

Consumers shall import only through the public entry point.

Deep imports are prohibited.

Example:

```ts
import { ok } from "@/shared/result";
```

instead of:

```ts
import { ok } from "@/shared/result/factories";
```

---

# 7. Internal Organization

Internal files may evolve without affecting external consumers.

Only symbols exported by `index.ts` are considered public API.

Everything else is internal implementation.

---

# 8. Circular Dependencies

Circular dependencies are prohibited.

Modules shall be designed to maintain an acyclic dependency graph.

When circular dependencies appear, responsibilities shall be reconsidered rather than bypassed.

---

# 9. Visibility Rules

Modules expose only what is required by external consumers.

Internal implementation details shall remain private.

Public API should remain intentionally small and stable.

---

# 10. Naming

Directory names shall use kebab-case.

Type names shall use PascalCase.

Function names shall use camelCase.

File names should describe the primary exported concept.

---

# 11. Evolution

Adding new modules shall not require restructuring existing modules.

Backward compatibility of public APIs should be preserved whenever possible.

Breaking changes require an Architecture Decision Record.

---

# 12. Non-Goals

This document intentionally excludes:

* package management;
* build tooling;
* deployment structure;
* runtime configuration;
* CI/CD pipelines.

These concerns are outside module organization.

---

# 13. Future Extensions

Future versions may define:

* architectural lint rules;
* automated dependency validation;
* module ownership;
* public API compatibility checks;
* architectural fitness functions.

---

# 14. Summary

Module organization provides the structural foundation of the AIDA codebase.

A clear dependency direction, explicit public APIs, and strict module boundaries enable long-term maintainability while supporting independent evolution of individual modules.
