# Monorepo Structure

## Current setup

This repository uses **Nx** and npm workspaces.

Current top-level workspace settings include:

- `workspaces: ["packages/*"]` in `package.json`
- Nx configuration in `nx.json`
- TypeScript base configuration in `tsconfig.base.json`
- seven workspace packages under `packages/`: `core`, `manifest`, `resolver`, `contract`, `installer`, `bindings`, and `cli`

The workspace currently contains reusable packages only. If repo-local applications are introduced later, they should live under `apps/` and the workspace glob should be expanded at that time.

## Naming conventions

Use one canonical name segment for each project and keep it aligned everywhere:

- directory: `packages/<name>` for reusable packages, `apps/<name>` for repo-local applications
- Nx project name: `<name>`
- npm package name for reusable packages: `@aipm/<name>`
- Nx tags: `scope:<name>` plus exactly one type tag such as `type:lib`, `type:cli`, or `type:app`

Examples from the current workspace:

| Directory           | Nx project | npm package      | Tags                         |
| ------------------- | ---------- | ---------------- | ---------------------------- |
| `packages/core`     | `core`     | `@aipm/core`     | `scope:core`, `type:lib`     |
| `packages/manifest` | `manifest` | `@aipm/manifest` | `scope:manifest`, `type:lib` |
| `packages/cli`      | `cli`      | `@aipm/cli`      | `scope:cli`, `type:cli`      |

Additional rules:

- package names should stay short, singular, and capability-oriented (`resolver`, not `dependency-resolvers`)
- the package directory name, Nx project name, npm package suffix, and `scope:*` tag should always match
- reusable packages should continue to expose their source condition as `@org/source` so local TypeScript resolution stays aligned with `tsconfig.base.json`
- applications should not claim an `@aipm/*` package name unless they are intentionally being published as reusable packages

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

## Internal dependency conventions

Internal dependencies should move inward toward more foundational packages, never outward toward orchestration layers.

Current allowed dependency directions are:

- `core`: foundational leaf package with no internal dependencies
- `manifest`: may depend on `core`
- `resolver`: may depend on `core` and `manifest`
- `contract`: may depend on `core`, `manifest`, and `resolver`
- `installer`: may depend on `core`, `manifest`, `resolver`, and `contract`
- `bindings`: may depend on `core` and `contract`
- `cli`: top-level composition package; may depend on the lower-level packages above, but no package should depend on `cli`

Rules for adding or changing dependencies:

- declare cross-package dependencies in `package.json` using the workspace package name (for example `@aipm/core`) and keep the range workspace-resolved with `"*"`
- import other packages through their public entry point (`@aipm/<name>`), not by reaching into another package's `src/` or `dist/` tree
- packages under `packages/` must never depend on projects under `apps/`
- applications under `apps/` may depend on packages, but should be treated as the outermost layer
- avoid cycles; if a new dependency would reverse the current layering, split shared code into a lower-level package instead

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
