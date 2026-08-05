# ADR-0005 — Domain Events

* Status: Accepted
* Date: 2026-08-03
* Deciders: AIDA Team
* Related:

  * ADR-0003 — Domain Object Modeling
  * ADR-0004 — Domain Identity
  * DD-0006 — Entity Model

---

# Context

Business operations frequently produce significant events that other parts of the system need to observe.

Examples include:

* UserRegistered
* ProjectCreated
* TaskAssigned
* InvoicePaid

These events represent business facts that have already occurred.

Without a consistent event model, business workflows become tightly coupled and difficult to evolve.

AIDA requires a mechanism for expressing domain events while preserving the independence of the domain layer.

---

# Decision

AIDA adopts Domain Events as immutable representations of completed business facts.

Aggregate Roots are responsible for recording Domain Events.

Aggregate Roots do not publish events.

Publishing and dispatching Domain Events are application and infrastructure concerns.

The domain layer remains unaware of message buses, event brokers, transports, or delivery mechanisms.

---

# Event Principles

## Events Represent Facts

A Domain Event describes something that has already happened.

Events shall use past-tense names.

Examples:

* UserRegistered
* EmailChanged
* ProjectArchived

Command-like names are prohibited.

Examples:

* RegisterUser
* ChangeEmail

---

## Events Are Immutable

Domain Events are immutable.

All observable properties shall be declared as `readonly`.

Events shall not expose mutation methods.

---

## Events Are Domain Objects

Domain Events belong to the domain layer.

They are independent of:

* messaging infrastructure;
* persistence;
* transport protocols;
* serialization frameworks.

---

## Events Are Recorded

Aggregate Roots record events as part of successful state transitions.

Recording an event is part of the domain model.

Publishing an event is not.

---

## Events Are Retrieved

Recorded events shall be retrieved after aggregate execution.

The retrieval mechanism is defined in the Aggregate Root design.

After successful retrieval, the recorded events are expected to be cleared.

---

# Responsibilities

## Aggregate Root

Responsible for:

* creating Domain Events;
* recording Domain Events;
* exposing recorded Domain Events.

Not responsible for:

* publishing;
* dispatching;
* retry logic;
* transport.

---

## Application Layer

Responsible for:

* retrieving recorded events;
* dispatching events;
* coordinating transactional boundaries.

---

## Infrastructure

Responsible for:

* message buses;
* brokers;
* persistence integration;
* delivery guarantees.

---

# Consequences

## Positive

* Loose coupling.
* Explicit business workflows.
* Clear separation of responsibilities.
* Testable domain model.
* Infrastructure independence.

## Negative

* Additional event lifecycle management.
* Event dispatch becomes an application concern.

These trade-offs are accepted.

---

# Compliance

All Domain Events shall follow the principles defined in this ADR.

Aggregate Roots shall record events instead of publishing them directly.

The domain layer shall not depend on messaging infrastructure.

---

# Related Documents

This decision is refined by:

* DD-0007 — Aggregate Root
* DD-0008 — Domain Events API
* DD-0009 — Repository Contracts
