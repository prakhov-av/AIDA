# ADR-0027 — Task Lifecycle Contract Boundary

- **Status:** Accepted
- **Date:** 2026-08-17
- **Decision:** Establish the Task Lifecycle Contract as the frozen normative domain contract between accepted Task Lifecycle Requirements and the future Task Aggregate.

---

## Context

AIDA requires an explicit Task Lifecycle Contract before the Task Aggregate is designed or implemented.

The authoritative Task requirements are established in:

`docs/requirements/task-requirements.md`

The requirements define the accepted Task lifecycle states, lifecycle transitions, lifecycle invariants, Role boundary, and accepted Domain Event facts.

The Task Lifecycle Contract is defined in:

`docs/architecture/task-lifecycle-contract.md`

ADR-0026 established the boundary that Task Lifecycle behavior must be based on explicit authoritative domain requirements and that the Task Lifecycle Contract must exist before the Task Aggregate.

The remaining architectural question is the boundary and status of the Task Lifecycle Contract itself.

Without an explicit boundary, lifecycle behavior could be reinterpreted during Aggregate design or implementation.

---

## Decision

AIDA establishes the **Task Lifecycle Contract** as a separate normative domain contract between authoritative Task Lifecycle Requirements and the future Task Aggregate.

The authority chain is:

```text
Authoritative Task Requirements
        ↓
Task Lifecycle Contract
        ↓
Task Aggregate
        ↓
Implementation
```

The Task Lifecycle Contract is the authoritative source for Task lifecycle behavior.

The Task Aggregate must preserve the lifecycle rules established by the frozen contract.

The Task Lifecycle Contract is an architectural and domain contract, not a runtime domain object.

No runtime abstraction is required solely to represent the contract.

---

## Contract Responsibilities

The Task Lifecycle Contract defines:

- lifecycle states;
- initial lifecycle state;
- allowed lifecycle transitions;
- terminal state;
- lifecycle invariants;
- Role lifecycle boundary;
- accepted Domain Event facts;
- explicit lifecycle exclusions.

The current contract is defined in:

`docs/architecture/task-lifecycle-contract.md`

---

## Aggregate Boundary

The Task Lifecycle Contract does not define:

- Task Aggregate structure;
- Task identity representation;
- Aggregate consistency mechanisms;
- commands;
- application API;
- persistence;
- repository behavior;
- infrastructure behavior;
- implementation details.

These concerns require separate architectural decisions.

The future Task Aggregate is responsible for realizing the frozen lifecycle contract within its consistency boundary.

---

## Runtime Boundary

The Task Lifecycle Contract is not a runtime object and does not require a dedicated runtime abstraction.

Implementation must not introduce a separate lifecycle abstraction solely because this contract exists.

Any future runtime representation of lifecycle state or transitions must be justified by the Task Aggregate architecture and must preserve the frozen contract.

---

## Stability

The Task Lifecycle Contract is frozen after Architecture Review.

Changes to:

- lifecycle states;
- initial state;
- allowed transitions;
- terminal state;
- lifecycle invariants;
- Role lifecycle semantics;
- accepted lifecycle Domain Event facts;

require a new Product / Domain acceptance decision and appropriate Architecture Review.

Changes to the contract must not be introduced implicitly during Task Aggregate implementation.

---

## Consequences

### Positive

- Task lifecycle behavior has an explicit normative boundary.
- Task Aggregate design can rely on a stable lifecycle contract.
- Lifecycle rules cannot be silently inferred from implementation details.
- Requirements, lifecycle contract, Aggregate, and implementation remain separate architectural layers.
- Future implementation can be validated against a frozen lifecycle contract.

### Negative

- Lifecycle changes require explicit architectural and Product / Domain review.
- The Task Aggregate cannot independently redefine lifecycle behavior.
- Some lifecycle behavior remains intentionally outside the current contract.

---

## Alternatives Considered

### Derive lifecycle behavior directly from the Core Domain model

Rejected.

The Core Domain model contains descriptive lifecycle evidence but is not by itself the authoritative source for normative lifecycle rules.

### Define lifecycle behavior directly inside the Task Aggregate

Rejected.

This would allow Aggregate design to become the implicit source of lifecycle requirements and would violate the established requirements-to-contract boundary.

### Create a dedicated runtime Task Lifecycle object

Rejected.

The lifecycle contract is an architectural/domain contract and does not require a runtime object.

---

## Relationship to ADR-0026

ADR-0026 establishes the **requirements source boundary** for Task Lifecycle behavior.

This ADR establishes the **contract boundary** between those authoritative requirements and the future Task Aggregate.

Therefore:

```text
ADR-0026
    ↓
Authoritative Task Lifecycle Requirements
    ↓
ADR-0027
    ↓
Frozen Task Lifecycle Contract
    ↓
Future Task Aggregate
```

ADR-0027 does not replace or modify ADR-0026.
