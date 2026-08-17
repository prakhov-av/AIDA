# Task Requirements

Status: Accepted
Requirements Owner: Founder / Principal Engineer
Authority: Product / Domain Authority
Acceptance Authority: Founder / Principal Engineer
Scope: Product / Domain requirements for Task

## Scope

This document defines normative Product / Domain requirements for Task.

It does not define:

- aggregate design;
- lifecycle implementation;
- application API;
- persistence;
- infrastructure;
- technical implementation details.

## Authority

Requirements Owner: Founder / Principal Engineer

Authority: Product / Domain Authority

Acceptance Authority: Founder / Principal Engineer

## Explicit Requirements

### REQ-TASK-001

**Statement**

Task is the minimal unit of engineering work in AIDA.

**Rationale**

This requirement is grounded in historical AIDA domain materials that define Task as the minimal unit of engineering work.

**Source**

Historical AIDA domain materials reviewed during Task Requirements Discovery.

**Acceptance**

Accepted by the Product / Domain Authority as a normative AIDA Task requirement.

---

### REQ-TASK-002

**Statement**

A Task is performed by one Role.

**Rationale**

This requirement is grounded in historical AIDA domain materials that define Task as being performed by one Role.

**Source**

Historical AIDA domain materials reviewed during Task Requirements Discovery.

**Acceptance**

Accepted by the Product / Domain Authority as a normative AIDA Task requirement.

---

## Task Lifecycle Requirements

### REQ-TASK-LIFECYCLE-001

**Statement**

A Task lifecycle consists of the following states:

```text
Created
Planned
In Progress
Review
Testing
Completed
```

**Rationale**

These states are grounded in the existing AIDA Core Domain Task workflow and were explicitly accepted as the normative Task lifecycle state set during Task Lifecycle Requirements Expansion.

**Source**

Existing AIDA Core Domain Task workflow in `docs/architecture/core-domain.md`, reviewed during Task Lifecycle Requirements Expansion and explicitly accepted by the Product / Domain Authority.

**Acceptance**

Accepted by the Product / Domain Authority as a normative AIDA Task lifecycle requirement.

---

### REQ-TASK-LIFECYCLE-002

**Statement**

A Task is always in exactly one lifecycle state.

**Rationale**

A single current lifecycle state is required to establish an unambiguous Task lifecycle state machine.

**Source**

Task Lifecycle Requirements Expansion and accepted lifecycle architecture decisions.

**Acceptance**

Accepted by the Product / Domain Authority as a normative AIDA Task lifecycle requirement.

---

### REQ-TASK-LIFECYCLE-003

**Statement**

A Task may transition only through the following lifecycle transitions:

```text
Created → Planned
Planned → In Progress
In Progress → Review
Review → Testing
Testing → Completed
```

All other lifecycle transitions are invalid.

**Rationale**

The accepted Task lifecycle is strictly linear. Explicit transition rules prevent lifecycle behavior from being inferred implicitly from state names or domain event names.

**Source**

Task Lifecycle Requirements Expansion and accepted lifecycle architecture decisions, based on the existing AIDA Core Domain Task workflow.

**Acceptance**

Accepted by the Product / Domain Authority as a normative AIDA Task lifecycle requirement.

---

### REQ-TASK-LIFECYCLE-004

**Statement**

`Completed` is the only terminal lifecycle state of a Task. A Task in `Completed` cannot transition to another lifecycle state.

**Rationale**

The accepted lifecycle defines completion as the terminal point of Task execution.

**Source**

Task Lifecycle Requirements Expansion and accepted lifecycle architecture decisions.

**Acceptance**

Accepted by the Product / Domain Authority as a normative AIDA Task lifecycle requirement.

---

### REQ-TASK-LIFECYCLE-005

**Statement**

A Task is performed by exactly one Role. A Task cannot be performed simultaneously by multiple Roles.

**Rationale**

This lifecycle invariant makes the cardinality established by REQ-TASK-002 explicit for Task lifecycle behavior.

**Source**

REQ-TASK-002 and Task Lifecycle Requirements Expansion.

**Acceptance**

Accepted by the Product / Domain Authority as a normative AIDA Task lifecycle requirement.

---

### REQ-TASK-LIFECYCLE-006

**Statement**

A Role must be assigned to a Task before the Task may transition from `Created` to `Planned`. A Task without an assigned Role cannot enter `Planned`.

**Rationale**

Planning a Task requires its single performing Role to be established before the Task enters the planned lifecycle state.

**Source**

REQ-TASK-002 and Task Lifecycle Requirements Expansion.

**Acceptance**

Accepted by the Product / Domain Authority as a normative AIDA Task lifecycle requirement.

---

### REQ-TASK-LIFECYCLE-007

**Statement**

Role reassignment semantics are not defined by the current Task Lifecycle Requirements. No lifecycle behavior for changing an assigned Role may be inferred from these requirements.

**Rationale**

The current requirements establish Role cardinality and the prerequisite for entering `Planned`, but do not establish mutation semantics for an assigned Role. Leaving this behavior unresolved prevents unsupported lifecycle rules from being introduced.

**Source**

Task Lifecycle Requirements Expansion and accepted lifecycle architecture decisions.

**Acceptance**

Accepted by the Product / Domain Authority as a normative AIDA Task lifecycle boundary.

---

### REQ-TASK-LIFECYCLE-008

**Statement**

The following Domain Events are associated with the corresponding Task lifecycle facts:

| Domain Event | Lifecycle fact |
|---|---|
| `TaskCreated` | Task creation |
| `TaskAssigned` | Role assignment |
| `TaskStarted` | `Planned → In Progress` |
| `TaskCompleted` | `Testing → Completed` |

`TaskBlocked`, `TaskResumed`, and `TaskRejected` are not part of the current Task Lifecycle Contract because the current requirements do not define corresponding lifecycle states or transitions.

**Rationale**

Domain Event semantics must be grounded in accepted lifecycle behavior and must not be inferred from event names alone.

**Source**

Existing AIDA Domain Event definitions in `docs/architecture/domain-events.md`, reviewed against the accepted Task Lifecycle Requirements during Task Lifecycle Requirements Expansion.

**Acceptance**

Accepted by the Product / Domain Authority as a normative AIDA Task lifecycle requirement.

## Acceptance

Accepted by: Founder / Principal Engineer

Authority: Product / Domain Authority

Scope: REQ-TASK-001, REQ-TASK-002, REQ-TASK-LIFECYCLE-001 through REQ-TASK-LIFECYCLE-008

The above requirements are accepted as the authoritative Product / Domain requirements for the current Task requirements source.

The historical AIDA domain materials provide provenance for the requirements grounded in existing domain evidence. This document establishes their current normative status for AIDA.

Any future change to these requirements requires a new Product / Domain acceptance decision.

## Boundary

This document does not define or imply:

- Task Aggregate design;
- Task identity representation;
- commands;
- application API;
- persistence;
- implementation details;
- Task Aggregate consistency mechanisms;
- repository or infrastructure behavior.

The Task Lifecycle Requirements define the normative Product / Domain behavior required before the Task Lifecycle Contract and Task Aggregate are designed. They do not determine the Aggregate boundary or implementation structure.
