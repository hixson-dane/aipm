# Monorepo Structure

## Current setup

This repository uses **Nx** and npm workspaces.

Current top-level workspace settings include:

- `workspaces: ["packages/*"]` in `package.json`
- Nx configuration in `nx.json`
- TypeScript base configuration in `tsconfig.base.json`

At the moment, the `packages/` directory is still empty apart from a placeholder.

## Recommended package structure

A good initial package breakdown for aipm would be:

```text
packages/
  core/
  manifest/
  resolver/
  installer/
  contract/
  bindings/
  cli/
```

## Suggested responsibilities

### `packages/core`

Shared domain types, constants, errors, and utility helpers.

Examples:

- artifact kind enums
- shared type definitions
- common validation helpers
- lockfile types

### `packages/manifest`

Manifest schema definitions, parsing, validation, and normalization.

Examples:

- manifest loaders
- JSON schema generation or validation
- canonicalization logic

### `packages/resolver`

Dependency and version resolution for artifact graphs.

Examples:

- range resolution
- dependency graph building
- effective capability aggregation

### `packages/installer`

Installation and local workspace materialization.

Examples:

- fetching and unpacking artifacts
- writing `.ai/installed`
- writing `lock.json`

### `packages/contract`

Compilation of resolved artifacts into the normalized repository contract.

Examples:

- generation of `.ai/resolved/*`
- effective policy and capability merge logic

### `packages/bindings`

Agent-specific adapters and generators.

Examples:

- Claude binding generator
- Copilot binding generator
- generic adapter interfaces

This package may later split into multiple packages if bindings become large or independently versioned.

### `packages/cli`

User-facing command-line interface.

Examples:

- `aipm install`
- `aipm resolve`
- `aipm inspect`
- `aipm bind`

## Suggested implementation order

A practical order for building the monorepo is:

1. `core`
2. `manifest`
3. `resolver`
4. `contract`
5. `cli`
6. `installer`
7. `bindings`

This sequence allows the core domain model and manifest format to stabilize before filesystem and adapter work expand.

## Nx usage notes

As packages are created, each should expose clear build and test targets so the workspace can benefit from Nx task orchestration and caching.

Useful commands:

```sh
npx nx show projects
npx nx graph
npx nx build <project>
npx nx test <project>
npx nx typecheck <project>
```
