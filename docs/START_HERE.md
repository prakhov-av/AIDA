# START HERE

Welcome to AIDA.

Before writing a single line of code, please read this document.

AIDA is not a traditional backend application.

It is an architecture-driven platform whose implementation follows its engineering model.

---

# Development Philosophy

Architecture comes first.

Documentation is the source of truth.

Code is an implementation of architecture.

Every engineering decision should be reflected in the documentation before it appears in the code.

---

# Read in this order

To understand AIDA, read the documentation in the following order.

1. README.md
2. Vision
3. Ubiquitous Language
4. Core Domain
5. Project Intelligence
6. Intelligence Model
7. Domain Events
8. Execution Kernel
9. RFC documents
10. ADR documents

Do not skip this order.

Every document builds on the previous one.

---

# Fundamental Principles

AIDA follows ten immutable engineering principles.

1. Architecture before Framework.
2. Domain First.
3. Human in the Loop.
4. Project Intelligence is the Source of Truth.
5. Context over Prompt.
6. Events are Facts.
7. Immutable by Default.
8. Result over Exception.
9. Documentation is Executable.
10. Simplicity over Cleverness.

These principles form the project's engineering constitution.

---

# Repository Organization

The repository is divided into three major areas.

## Knowledge

```
docs/
```

Contains the Architecture Book, RFCs, ADRs and engineering documentation.

---

## Platform

```
packages/
```

Contains reusable platform components.

Examples:

* domain
* kernel
* planning
* context
* intelligence
* events

Packages must remain framework independent.

---

## Applications

```
apps/
```

Contains executable applications such as:

* API
* CLI
* Worker
* Web

Applications depend on packages.

Packages never depend on applications.

---

# Dependency Rules

Allowed direction of dependencies:

```text
Applications

↓

Platform Packages

↓

Domain
```

The Domain package must never depend on any application, framework or infrastructure component.

---

# Engineering Workflow

Every change follows the same lifecycle.

Architecture

↓

Specification

↓

Implementation

↓

Tests

↓

Review

↓

Merge

Do not implement features without an approved architectural decision.

---

# Pull Request Checklist

Before opening a Pull Request verify:

* Architecture is respected.
* Public API is stable.
* Tests pass.
* Documentation is updated.
* No architectural invariants are violated.

---

# Current Development Phase

Current focus:

**Sprint 1 — Domain Foundation**

Objectives:

* Build the Domain SDK.
* Create foundational Value Objects.
* Implement Domain Events.
* Define Commands.
* Prepare the Execution Kernel.

No infrastructure code should be introduced before the Domain SDK is complete.

---

# Welcome

AIDA is built with a long-term perspective.

Our goal is not simply to generate code.

Our goal is to build a platform capable of coordinating a digital engineering organization.

If you are contributing to AIDA, welcome aboard.
