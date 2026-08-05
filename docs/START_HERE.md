# START HERE

Welcome to AIDA.

Before writing a single line of code, read this document.

AIDA is an architecture-driven software platform. Every architectural decision, public API, and implementation follows explicit engineering principles designed to support long-term evolution.

Documentation is not supplementary material—it is the source of truth.

---

# Mission

AIDA (AI Development Agency) is a platform for building long-lived software systems through explicit architecture, domain-driven design, and disciplined engineering.

The objective is not simply to deliver working software, but to create an engineering platform that remains understandable, maintainable, extensible, and stable as it evolves.

Every implementation is expected to follow documented architectural decisions rather than individual interpretation.

---

# Engineering Philosophy

The project follows several fundamental principles.

1. Architecture before Implementation.
2. Documentation is the Source of Truth.
3. Decisions before Code.
4. Domain First.
5. Explicit over Implicit.
6. Composition over Inheritance.
7. Small Stable Abstractions.
8. Result over Exception.
9. Events are Facts.
10. Immutable by Default.
11. Stable Public APIs.
12. Human in the Loop.

These principles apply to every package, module, and contribution.

---

# Development Process

All significant engineering work follows the same lifecycle.

```text
Architecture Check
        ↓
Repository Check
        ↓
Implementation
        ↓
Type Check
        ↓
Unit Tests
        ↓
Documentation Check
        ↓
Review
        ↓
Freeze
        ↓
Architecture Decision Record (ADR)
        ↓
Release Review
        ↓
Release
```

Implementation must never begin before the architectural review has been completed.

Repository contents are always considered the source of truth.

---

# Documentation Structure

Documentation is organized into several categories.

## Vision

Defines the long-term direction of the platform.

## Architecture

Describes the overall architecture, engineering principles, and system boundaries.

## Architecture Research (AR)

Explores architectural alternatives without making implementation decisions.

Research documents never establish architecture.

## Architecture Decision Records (ADR)

Record architectural decisions together with their rationale, trade-offs, and consequences.

Only ADRs define accepted architectural decisions.

## Detailed Design (DD)

Defines public APIs, implementation contracts, and module behavior.

Implementation follows these specifications.

---

# Reading Order

New contributors should read the documentation in the following order.

1. README.md
2. Vision
3. Architecture
4. Architecture Research (AR)
5. Architecture Decision Records (ADR)
6. Detailed Design (DD)

Each document builds upon the previous ones.

Do not skip this order.

---

# Repository Organization

The repository is organized into logical areas.

```text
docs/
packages/
apps/
```

## docs

Contains architecture, engineering decisions, design documents, and supporting documentation.

Documentation drives implementation.

## packages

Contains reusable framework-independent platform modules.

Each package exposes a minimal, stable public API.

Packages may depend only on lower architectural layers.

## apps

Contains executable applications built on top of reusable packages.

Applications may depend on packages.

Packages must never depend on applications.

---

# Dependency Rules

Architectural dependencies follow a single direction.

```text
Interfaces
        ↓
Application
        ↓
Domain

Infrastructure
        ↓
Application
        ↓
Domain
```

The Domain layer must remain completely independent of:

- frameworks;
- databases;
- messaging systems;
- dependency injection containers;
- transport protocols;
- user interfaces.

Business rules always flow from the Domain outward.

Infrastructure adapts to the Domain—not the other way around.

---

# Shared Domain SDK

The current SDK provides the architectural building blocks shared across the platform.

Its public API includes:

- Result
- Option
- ValueObject
- Identity
- Entity
- AggregateRoot
- DomainEvent
- DomainEvents
- Repository
- Command
- CommandHandler
- Query
- QueryHandler
- UnitOfWork

These modules form the foundation of the platform and are considered stable.

---

# Public API Stability

The public API is intentionally minimal.

Before introducing any new public type or modifying an existing one, verify that:

- the architectural motivation is documented;
- the change is reviewed;
- backward compatibility has been evaluated;
- the documentation has been updated.

Frozen modules should remain stable across releases.

Breaking changes require a new architectural review and are introduced only through planned versioning.

---

# Engineering Rules

Before implementing any feature, verify that:

- the required architecture exists;
- the repository has been inspected;
- the affected public API has been reviewed;
- the implementation follows existing project conventions;
- architectural boundaries remain intact.

If documentation and implementation disagree, resolve the inconsistency through the documented engineering process rather than making assumptions.

Repository contents are always considered the source of truth.

---

# Pull Request Checklist

Before opening a Pull Request, ensure that:

- architecture has been reviewed;
- public APIs remain stable;
- documentation has been updated;
- TSDoc is complete for public APIs;
- all type checks pass;
- all unit tests pass;
- architectural boundaries are preserved.

Every Pull Request should represent a single logical change.

---

# Current Status

Current milestone:

**Sprint 2.5 — SDK Polish & Release Preparation**

Completed:

- Foundation
- Application
- Public API Review
- Public API TSDoc

Current objective:

Prepare the Shared Domain SDK for the **v0.1.0** release without changing the public API.

Remaining release activities include:

- documentation review;
- CHANGELOG preparation;
- ADR cleanup;
- release review;
- v0.1.0 release.

---

# Release Process

Every release follows the same engineering process.

```text
Architecture
        ↓
Implementation
        ↓
Type Check
        ↓
Tests
        ↓
Documentation
        ↓
Review
        ↓
Freeze
        ↓
Release
```

Documentation is considered part of the release.

A release is not complete until the documentation accurately reflects the implementation.

---

# Welcome

AIDA is built for long-term evolution rather than short-term delivery.

Architecture guides implementation.

Documentation guides architecture.

Engineering decisions are explicit.

Public APIs remain stable.

Every contribution should leave the platform more understandable than it was before.

Welcome aboard.