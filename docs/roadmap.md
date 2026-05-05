# Roadmap

## Phase 0: foundation

Goal: establish the workspace, documentation, and core design vocabulary.

Deliverables:

- replace scaffold README
- add design documentation
- define first package boundaries
- agree on naming and core concepts

## Phase 1: manifest and types

Goal: define the portable artifact format.

Deliverables:

- artifact manifest schema
- shared domain types
- parser and validator
- sample artifacts for development

## Phase 2: resolver and lockfile

Goal: resolve declared artifacts into a reproducible installation plan.

Deliverables:

- dependency graph resolution
- version selection rules
- lockfile format
- effective capability aggregation

## Phase 3: local installation model

Goal: materialize resolved artifacts into the repository.

Deliverables:

- `.ai/project.json` conventions
- `.ai/installed/` layout
- lockfile writer
- initial install and inspect commands

## Phase 4: resolved repository contract

Goal: generate a normalized representation of installed artifacts that agents can consume.

Deliverables:

- `.ai/resolved/skills.json`
- `.ai/resolved/mcp.json`
- `.ai/resolved/policies.json`
- merged capability and policy rules

## Phase 5: bindings

Goal: make installed artifacts usable from multiple agents.

Deliverables:

- generic binding API
- first adapter targets
- generated binding output for at least one or two agent ecosystems

## Phase 6: publishing and registry support

Goal: support artifact distribution.

Deliverables:

- package packing format
- publish flow
- registry protocol assumptions
- integrity and provenance model

## Phase 7: trust and policy hardening

Goal: make the system safe and auditable.

Deliverables:

- permission inspection
- install-time policy checks
- artifact verification model
- audit command design

## Immediate next steps

The highest-value next tasks are:

1. create the initial packages under `packages/`
2. draft the first manifest schema
3. define the `.ai/` repo contract format
4. build a minimal CLI that can parse and inspect a local manifest
