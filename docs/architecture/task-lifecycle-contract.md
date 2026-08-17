# Task Lifecycle Contract

**Version:** 0.1

**Status:** Frozen

---

# Purpose

This document defines the normative behavioral contract for the AIDA Task lifecycle.

The Task Lifecycle Contract is derived from the accepted Task Lifecycle Requirements in `docs/requirements/task-requirements.md`.

It defines lifecycle states, allowed transitions, lifecycle invariants, and domain event facts.

It does not define the Task Aggregate, runtime implementation, persistence, application API, or infrastructure behavior.

---

# Authority

The authority chain is:

```text
Task Requirements
    ↓
Task Lifecycle Contract
    ↓
Task Aggregate
    ↓
Implementation
```

The Task Lifecycle Contract is normative for Task lifecycle behavior.

The conceptual Task description in `docs/architecture/core-domain.md` remains the Core Domain conceptual authority.

The requirements in `docs/requirements/task-requirements.md` remain the authoritative Product / Domain requirements source.

---

# Lifecycle States

A Task has exactly one current lifecycle state.

The complete lifecycle state set is:

```text
Created
Planned
In Progress
Review
Testing
Completed
```

No other lifecycle states are defined by this contract.

---

# Initial State

A newly created Task starts in:

```text
Created
```

---

# Allowed Transitions

The Task lifecycle is strictly linear.

The only allowed transitions are:

```text
Created → Planned
Planned → In Progress
In Progress → Review
Review → Testing
Testing → Completed
```

Any transition not listed above is invalid.

This includes:

- transitions that skip a lifecycle state;
- reverse transitions;
- transitions between non-adjacent states;
- transitions from `Completed`.

---

# Terminal State

`Completed` is the only terminal lifecycle state.

A Task in `Completed` cannot transition to another lifecycle state.

---

# Lifecycle Invariants

The following invariants apply:

1. A Task is always in exactly one lifecycle state.
2. A Task may transition only through an allowed transition.
3. `Completed` has no allowed outgoing lifecycle transition.
4. A Task is performed by exactly one Role.
5. A Role must be assigned before the Task may transition from `Created` to `Planned`.

---

# Role Boundary

A Task is performed by exactly one Role.

A Task without an assigned Role cannot enter `Planned`.

Role reassignment semantics are not defined by this contract.

No implementation behavior for changing an assigned Role may be inferred from this contract.

---

# Domain Event Facts

The following domain events are associated with accepted Task lifecycle facts:

| Domain Event | Lifecycle fact |
|---|---|
| `TaskCreated` | Task creation |
| `TaskAssigned` | Role assignment |
| `TaskStarted` | `Planned → In Progress` |
| `TaskCompleted` | `Testing → Completed` |

These event facts do not introduce additional lifecycle states or transitions.

The following existing Task event names are outside the current Task Lifecycle Contract:

- `TaskBlocked`
- `TaskResumed`
- `TaskRejected`

They require separate accepted domain requirements before they can become normative lifecycle behavior.

---

# Explicit Exclusions

This contract does not define:

- Task Aggregate design;
- Task identity representation;
- commands;
- application API;
- persistence;
- repository behavior;
- infrastructure behavior;
- implementation details;
- Role reassignment semantics;
- `Blocked`, `Rejected`, or other additional lifecycle states;
- lifecycle transitions not explicitly listed in this document.

---

# Architectural Boundary

The Task Lifecycle Contract defines **what Task may do** within its lifecycle.

It does not define **how Task consistency is enforced**.

The Aggregate boundary, consistency mechanisms, runtime API, and implementation structure require separate architectural decisions.

Therefore:

```text
Task Lifecycle Contract
    ↓
defines Task lifecycle behavior

Task Aggregate
    ↓
defines Task consistency boundary

Implementation
    ↓
realizes the accepted contract
```

---

# Stability

Changes to the normative lifecycle state set, transitions, terminal state, lifecycle invariants, or domain event facts require a new Product / Domain acceptance decision and an appropriate architecture review.

The contract must remain consistent with the authoritative Task requirements source.
