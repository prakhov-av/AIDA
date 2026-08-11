# ADR-0017 - UnitOfWork Contract Foundation

* Status: Accepted
* Date: 2026-08-11
* Authors: AIDA Team
* Related:

  * ADR-0009 - Repository Contract
  * ADR-0016 - Application Execution Lifecycle
  * DD-0016 - Application Execution Lifecycle

---

# Context

The AIDA SDK contains a UnitOfWork contract representing a transactional boundary for application-level persistence coordination.

The current contract is intentionally minimal:

```text
UnitOfWork
    ├── commit()
    └── rollback()