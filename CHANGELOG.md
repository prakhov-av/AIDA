# Changelog

All notable changes to AIDA are documented in this file.

The format is based on **Keep a Changelog**.

This project follows **Semantic Versioning**.

---

## [0.1.0] - 2026-08-05

Initial public release.

### Added

#### Foundation

- Added `Result` abstraction.
- Added `Option` abstraction.
- Added `ValueObject`.
- Added `Identity`.
- Added `Entity`.
- Added `AggregateRoot`.
- Added `DomainEvent`.
- Added `DomainEvents`.

#### Application

- Added `Repository` contract.
- Added `Command`.
- Added `CommandHandler`.
- Added `Query`.
- Added `QueryHandler`.
- Added `UnitOfWork`.

#### Quality

- Added comprehensive unit test suite.
- Added strict TypeScript type checking.
- Added public API review.
- Added TSDoc for all public APIs.

#### Documentation

- Added `START_HERE.md`.
- Improved `README.md`.
- Documented engineering process.
- Documented architectural principles.

### Changed

- Frozen Foundation public API.
- Frozen Application public API.
- Established stable SDK contracts.
- Standardized public API documentation.

### Security

No security issues are known for this release.

---

## Versioning Policy

This project follows Semantic Versioning.

- **MAJOR** — incompatible public API changes.
- **MINOR** — backward-compatible functionality.
- **PATCH** — backward-compatible fixes.

---

## Release Policy

Every release must complete the following engineering process:

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
ADR
        ↓
Release Review
        ↓
Release
```

Documentation is considered part of every release.