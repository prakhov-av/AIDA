# DD-0007 — Aggregate Root Model

* Status: Approved
* Date: 2026-08-03
* Related:

  * ADR-0003 — Domain Object Modeling
  * ADR-0004 — Domain Identity
  * ADR-0005 — Domain Events
  * DD-0006 — Entity Model

---

# 1. Purpose

This document defines the design principles and implementation model for Aggregate Roots within the AIDA domain layer.

Aggregate Roots enforce consistency boundaries, coordinate state changes within an Aggregate, and record Domain Events resulting from successful business operations.

---

# 2. Design Goals

The Aggregate Root model shall be:

* consistency-oriented;
* behavior-driven;
* framework-independent;
* explicit;
* easy to test;
* independent of infrastructure concerns.

---

# 3. Definition

An Aggregate Root is a specialized Entity that:

* owns the Aggregate boundary;
* protects Aggregate invariants;
* coordinates changes to child Entities;
* records Domain Events.

Every Aggregate has exactly one Aggregate Root.

---

# 4. Aggregate Boundary

The Aggregate Root defines the transactional consistency boundary.

All modifications affecting multiple Entities within an Aggregate shall be coordinated through the Aggregate Root.

Objects outside the Aggregate shall never modify child Entities directly.

---

# 5. Responsibilities

The Aggregate Root is responsible for:

* protecting Aggregate invariants;
* coordinating child Entities;
* recording Domain Events;
* exposing Aggregate behavior.

It is not responsible for:

* persistence;
* event dispatching;
* transaction management;
* dependency resolution.

---

# 6. Child Entities

Child Entities belong exclusively to a single Aggregate.

They shall not be referenced directly from outside the Aggregate.

External components interact only through the Aggregate Root.

---

# 7. Invariant Protection

Aggregate-wide business rules shall be enforced by the Aggregate Root.

Individual Entities protect their own local invariants.

Rules involving multiple Entities belong exclusively to the Aggregate Root.

---

# 8. Domain Event Recording

Aggregate Roots record Domain Events after successful business operations.

Typical flow:

1. Validate business rules.
2. Modify Aggregate state.
3. Record Domain Event.

Events describe completed business facts.

---

# 9. Event Collection Lifecycle

Aggregate Roots maintain an internal collection of recorded Domain Events.

The collection shall:

* preserve event order;
* expose recorded events for retrieval;
* support clearing after successful retrieval.

The dispatch mechanism is outside the scope of the domain layer.

---

# 10. Repository Interaction

Repositories load and persist Aggregate Roots.

Repositories retrieve recorded Domain Events after successful persistence.

Repositories do not create Domain Events.

---

# 11. Base Class

AIDA adopts a lightweight abstract base class for Aggregate Roots.

Typical responsibilities include:

* event recording;
* event retrieval;
* event clearing.

Business logic remains in concrete Aggregate implementations.

---

# 12. Relationship with Entities

Aggregate Roots are Entities.

Every Aggregate Root has an Identifier.

Not every Entity is an Aggregate Root.

Only Aggregate Roots expose Aggregate-wide behavior.

---

# 13. Examples

Typical Aggregate Roots include:

* User
* Project
* Workspace
* Organization
* Invoice

Examples of child Entities include:

* ProjectMember
* InvoiceLine
* WorkspaceRole

---

# 14. Non-Goals

This design intentionally excludes:

* event publishing;
* repository implementation;
* persistence mapping;
* distributed transactions;
* messaging infrastructure.

These responsibilities belong to the application or infrastructure layers.

---

# 15. Future Extensions

Future versions may introduce support for:

* optimistic concurrency;
* event versioning;
* snapshot support;
* event metadata.

Such extensions shall preserve the semantics defined by this document.

---

# 16. Summary

Aggregate Roots define transactional consistency boundaries for the domain model.

They coordinate business behavior, protect Aggregate invariants, and record Domain Events while remaining independent of persistence and messaging infrastructure.
