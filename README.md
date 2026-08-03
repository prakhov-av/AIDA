# AIDA

> **AI Development Agency**
>
> **Architecture-Driven Platform for Digital Software Engineering**

---

> **Build software the way engineering organizations work — not the way individual AI models think.**

---

## Overview

AIDA is an architecture-driven platform for orchestrating software development using specialized AI roles.

Instead of relying on a single AI assistant, AIDA coordinates a digital engineering organization where every participant has a clear responsibility and operates using a shared understanding of the project.

The human remains the Technical Lead and always makes the final engineering decisions.

---

## Why AIDA?

Modern AI models can generate code.

They cannot reliably collaborate on long-running engineering projects.

Developers still spend significant time:

* transferring context between models;
* maintaining architectural consistency;
* coordinating multiple AI tools;
* reviewing generated code;
* preserving project knowledge.

AIDA solves this problem by introducing a shared engineering intelligence model and an execution platform capable of coordinating AI specialists as a single engineering organization.

---

## Core Concepts

AIDA is built around five fundamental concepts.

### Mission

Everything starts with a Mission.

A Mission represents a business or engineering objective.

---

### Project Intelligence

A continuously evolving engineering model of the project.

It contains architecture, documentation, code, ADRs, RFCs, relationships and accumulated engineering knowledge.

---

### Organization Intelligence

A digital representation of an engineering organization.

It knows roles, responsibilities, capabilities and engineering processes.

---

### Context Engine

Builds the minimum engineering context required for a specific task.

Context is generated dynamically.

---

### Execution Kernel

The execution core of AIDA.

It coordinates Missions, publishes commands, reacts to domain events and manages engineering workflows.

---

## High-Level Architecture

```text
                    Human

                      │

                      ▼

              Execution Kernel

                      │

        ┌─────────────┼─────────────┐

        ▼                           ▼

Project Intelligence    Organization Intelligence

                      │

                      ▼

                Context Engine

                      │

                      ▼

                   AI Roles

                      │

                      ▼

                  Artifacts

                      │

                      ▼

            Project Intelligence
```

---

## Engineering Principles

* Architecture First
* Domain First
* Human in the Loop
* Context over Prompt
* Events are Facts
* AI Agnostic
* Framework Agnostic
* Documentation is Executable
* Test Before Merge
* Simplicity over Cleverness

---

## Repository Structure

```text
apps/          Applications

packages/      Core platform

docs/          Architecture Book

tools/         Engineering tools

scripts/       Automation
```

---

## Development Status

Current milestone:

**Foundation**

Completed:

* ✅ Vision
* ✅ Architecture Book
* ✅ Core Domain
* ✅ Intelligence Model
* ✅ Domain Events

In Progress:

* 🚧 Domain SDK

Next:

* Execution Kernel
* Planning Engine
* Context Engine

---

## Documentation

New contributors should begin here:

```
docs/START_HERE.md
```

---

## License

MIT
