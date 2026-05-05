# Architecture

## Overview

aipm should be designed as a layered system that separates portable artifact definition from runtime-specific agent behavior.

## Layers

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

- `project.json`: declared artifact dependencies for the repository
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
