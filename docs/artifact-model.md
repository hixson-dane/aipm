# Artifact Model

## Goals

The artifact model should define a portable unit that can be installed once and used across multiple agent runtimes.

## Candidate artifact kinds

Initial kinds to support:

- `skill`
- `mcp-server`
- `workflow`

Possible future kinds:

- `policy`
- `eval`
- `agent`
- `toolkit`

## Portable artifact contract

Each artifact should have a canonical manifest that describes:

- identity
  - name
  - version
  - publisher
  - description
- type
  - kind
- interfaces
  - invocation mode
  - input schema
  - output schema
- resources
  - instructions
  - examples
  - schemas
  - policies
  - templates
- capabilities
  - tools
  - MCP servers
  - network requirements
  - filesystem requirements
  - secret references
- dependencies
  - runtime dependencies
  - peer dependencies
  - optional dependencies
- trust metadata
  - integrity
  - signatures
  - provenance

## Binding strategy

The portable contract should remain the source of truth.

Bindings for specific agents should be additive, not primary.

That means a package may optionally provide hints or adapter data for:

- Claude
- Copilot
- OpenAI-compatible runtimes
- custom local runtimes

But the package should still be useful even if those bindings do not exist.

## Installation model

Installing an artifact should produce:

1. installed artifact contents
2. a locked resolution result
3. a normalized resolved contract for the repository

This enables any agent integration to inspect the repository and understand what has been installed.

## Important constraint

The artifact model should not depend on a single vendor's prompt structure or runtime model.

The more the core manifest depends on one agent ecosystem, the less useful aipm becomes as a cross-agent package manager.
