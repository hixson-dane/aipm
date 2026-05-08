# Architecture

## Overview

aipm should be designed as a layered system that separates portable artifact definition from runtime-specific agent behavior.

## Layers

The architecture is easiest to reason about in two complementary views:

1. **logical system layers** (how runtime responsibilities are separated)
2. **artifact/contract layers** (how portability is preserved across agents)

## Logical system layers (v1)

```text
┌────────────────────────────────────────────────────────────┐
│ UI layer (CLI + future API surface)                       │
├────────────────────────────────────────────────────────────┤
│ Core logic layer (manifests, validation, resolver, policy)│
├────────────────────────────────────────────────────────────┤
│ Storage layer (.ai project metadata, lock, installed data)│
├────────────────────────────────────────────────────────────┤
│ Integration layer (registry adapters, MCP, agent bindings)│
└────────────────────────────────────────────────────────────┘
```

- **UI layer**: user-facing commands such as install, resolve, inspect, and binding generation.
- **Core logic layer**: deterministic business logic for parsing manifests, dependency solving, contract compilation, and policy evaluation.
- **Storage layer**: repository-local state under `.ai/` (`project.json`, `lock.json`, `installed/`, `resolved/`, `bindings/`).
- **Integration layer**: external boundaries for registries, MCP server packaging, and agent-specific binding emitters.

### Layering rule

The UI and integrations can depend on core logic, but core logic must not depend on any specific agent runtime or registry implementation details.

## Artifact/contract layers

### 1. Artifact layer

This is the canonical, agent-neutral package definition layer.

An artifact should define things like:

- name and version
- artifact kind
- description and metadata
- dependencies
- input and output schemas
- instructions and examples
- required tools or MCP servers
- requested permissions
- policy requirements

This layer must avoid vendor-specific assumptions whenever possible.

### 2. Resolution layer

Installation should not only download files. It should also resolve artifacts into a normalized repository-level contract.

That resolved view should answer questions like:

- which artifacts are installed?
- what versions were selected?
- which MCP servers are active?
- which capabilities are available?
- what effective permissions and policies apply?

This is the layer that enables cross-agent portability.

### 3. Binding layer

Agent-specific bindings adapt the resolved contract into a format that a specific agent can consume.

Examples:

- Claude-oriented instruction and configuration output
- Copilot-oriented skill or instruction output
- OpenAI-compatible tool or task bindings
- local runtime integration files

The binding layer should be optional and generated from the portable source of truth.

## Cross-agent strategy

Cross-agent interoperability is handled through a compile pipeline:

1. **Author once** in an agent-neutral artifact manifest.
2. **Resolve once** into a normalized repository contract.
3. **Bind many times** by generating runtime-specific outputs from the same resolved contract.

This means agents collaborate through shared repository state rather than direct coupling:

- all agents read a common resolved contract
- each adapter generates only the wiring needed for its runtime
- switching or adding an agent should not require republishing artifacts

## v1 architectural constraints and decisions

- **Portable source of truth**: the artifact manifest and resolved contract are canonical; bindings are derived.
- **Repository-local determinism**: installation produces lockfile-backed, inspectable state under `.ai/`.
- **Least privilege**: permissions/capabilities must be explicit and enforceable at resolve/bind time.
- **No vendor lock-in in core schemas**: agent-specific fields cannot be required for core validity.
- **Extensible integration boundary**: new agent adapters and registries must be addable without changing core manifest semantics.

## Repository-local contract

A major design direction is to have each repository contain a standard directory for installed and resolved agent artifacts, likely under `.ai/`.

Possible structure:

```text
.ai/
  project.json
  lock.json
  installed/
  resolved/
  bindings/
```

### Intended responsibilities

- `project.json`: declared artifact dependencies for the repository — see [project-json.md](project-json.md) for the full schema and semantics
- `lock.json`: exact resolved versions and digests
- `installed/`: unpacked local artifact contents
- `resolved/`: normalized merged contract for all installed artifacts
- `bindings/`: generated agent-specific output

## Why this matters

This architecture lets aipm support multiple agents without requiring every package author to publish separate agent-specific packages.

Instead:

- authors publish portable artifacts
- aipm resolves them locally
- adapters translate them for specific agents

## Likely major components

At a high level, the system will need:

- a manifest format and schema definitions
- a package resolver
- an installer
- a lockfile generator
- a resolved contract compiler
- agent binding generators
- a CLI
- optional registry integration
