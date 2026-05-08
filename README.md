# aipm

**aipm** is a package manager for agentic AI artifacts.

It is designed to do for agent resources what npm does for JavaScript packages: make them easy to define, version, publish, install, and compose. Unlike traditional package managers, aipm is built around **portable agent contracts** so that installed artifacts can work across different agent ecosystems such as Claude, Copilot, and other future runtimes.

## Vision

The core idea behind aipm is simple:

- install an artifact once in a repository
- make it available to any compatible agent
- keep the artifact format portable and agent-neutral
- generate agent-specific bindings only when needed

In practice, that means aipm is not just a registry for prompts. It is a system for packaging:

- skills
- MCP servers
- workflows
- policies
- evals
- agent configuration resources

## Design goals

aipm is being designed around a few key principles:

- **cross-agent portability**: artifacts should work across multiple agent runtimes
- **repo-local installation**: a repository should declare and resolve the artifacts it uses
- **declarative contracts**: artifacts should describe capabilities, schemas, permissions, and dependencies
- **least privilege**: permissions should be explicit, inspectable, and enforceable
- **reproducibility**: installations should produce lockfiles and deterministic resolved state
- **extensibility**: support MCP, agent bindings, and future runtime integrations

## High-level architecture

The project is currently organized around three conceptual layers:

1. **Artifact layer**
   - portable, agent-neutral package definitions
   - manifests, schemas, instructions, policies, and dependencies

2. **Resolved repository contract**
   - the normalized representation of installed artifacts in a repo
   - intended to live under a standard directory such as `.ai/`

3. **Agent binding layer**
   - adapters that translate the portable contract into agent-specific integrations
   - for example: Claude, Copilot, OpenAI-compatible runtimes, or custom local agents

## Monorepo

This repository uses **Nx** as the monorepo management system.

The monorepo will be used to separate concerns across packages such as:

- core domain types and schemas
- manifest parsing and validation
- dependency resolution
- repository contract generation
- CLI commands
- registry and publishing support
- agent binding adapters

Workspace conventions:

- reusable code lives in `packages/<name>` and uses the npm package name `@aipm/<name>`
- the package directory, Nx project name, and `scope:<name>` tag should stay aligned
- repo-local applications should live in `apps/<name>` when introduced, and packages must not depend on apps
- internal dependencies should continue to follow the documented layering from foundational packages like `core` up to orchestration packages like `cli`

See [docs/monorepo.md](docs/monorepo.md) for more details.

## Documentation

Project documentation lives in the [`docs/`](docs/) directory.

Start here:

- [Documentation index](docs/README.md)
- [Workspace setup and contributing](docs/contributing.md)
- [Project overview](docs/overview.md)
- [Architecture](docs/architecture.md)
- [Artifact model](docs/artifact-model.md)
- [Monorepo structure](docs/monorepo.md)
- [Roadmap](docs/roadmap.md)

## Current status

This project is in the design and foundation stage. The repository currently contains the Nx workspace setup and initial package structure, and the next step is to build out the first working implementation slices within those packages.

## Near-term implementation direction

A practical v1 will likely focus on:

- a portable artifact manifest format
- repo-local installation metadata
- a lockfile and resolver
- MCP server packaging support
- a CLI for install, inspect, and resolve operations
- generated resolved state that any agent can consume

For measurable v1 acceptance criteria, see the [Roadmap v1 success criteria](docs/roadmap.md#v1-success-criteria).

## Development

Because this is an Nx workspace, most work will happen through Nx-managed packages and tasks.

For a full onboarding walkthrough — prerequisites, first-time setup, workspace configuration, and all key workflows — see [docs/contributing.md](docs/contributing.md).

Quick reference:

```sh
# Install dependencies (first time or after pulling changes)
npm install

# List all workspace projects
npx nx show projects

# Visualize the dependency graph
npx nx graph

# Build / test / lint / typecheck a single package
npx nx build <project>
npx nx test <project>
npx nx lint <project>
npx nx typecheck <project>

# Build and typecheck everything
npx nx run-many -t build,typecheck --all
```
