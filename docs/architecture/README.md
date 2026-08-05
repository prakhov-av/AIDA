# Domain Foundation Roadmap

- Status: Frozen
- Last Updated: 2026-08-03

## Purpose

This document provides an overview of the Domain Foundation architecture.

It serves as the entry point for all foundational design documents.

The implementation of the Domain Foundation begins only after all documents listed below are completed and frozen.

---

# Architecture Flow

Research
    ↓
Architecture Decisions
    ↓
Detailed Design
    ↓
Architecture Review
    ↓
Freeze
    ↓
Implementation

---

# Research

| ID | Title | Status |
|----|-------|--------|
| AR-0002 | Result Implementations Research | ✅ |

---

# Architecture Decisions

| ID | Title | Status |
|----|-------|--------|
| ADR-0002 | Result Pattern | ✅ |
| ADR-0003 | Domain Object Modeling | ✅ |
| ADR-0004 | Domain Identity | ✅ |
| ADR-0005 | Domain Events | ✅ |

---

# Detailed Design

| ID | Title | Status |
|----|-------|--------|
| DD-0002 | Result API | ✅ |
| DD-0003 | Domain Error Model | ✅ |
| DD-0004 | Value Object Model | ✅ |
| DD-0005 | Identifier Strategy | ✅ |
| DD-0006 | Entity Model | ✅ |
| DD-0007 | Aggregate Root Model | ✅ |
| DD-0008 | Domain Events API | ✅ |
| DD-0009 | Repository Contracts | ✅ |
| DD-0010 | Module Organization | ✅ |

---

# Current Status

The Domain Foundation design is complete.

The next milestone is:

1. Architecture Review
2. Freeze
3. Implementation

No implementation shall begin before the review is completed.

---

# Reading Order

New contributors should read the documents in the following order:

1. ADR-0003 — Domain Object Modeling
2. ADR-0004 — Domain Identity
3. ADR-0005 — Domain Events
4. DD-0004 — Value Object Model
5. DD-0006 — Entity Model
6. DD-0007 — Aggregate Root Model
7. DD-0009 — Repository Contracts
8. DD-0010 — Module Organization

---

# Deliverables

After implementation the Shared Kernel is expected to contain:

- Result
- DomainError
- ValueObject
- Identifier
- Entity
- AggregateRoot
- DomainEvent
- Repository contracts
