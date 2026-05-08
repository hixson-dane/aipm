# Contributing and Workspace Setup

This document covers everything you need to get the aipm monorepo running locally, understand its structure, and work effectively with Nx.

## Prerequisites

- **Node.js** v20 or later
- **npm** v10 or later (bundled with Node.js 20)

Verify your versions:

```sh
node --version   # should print v20.x.x or higher
npm --version    # should print 10.x.x or higher
```

## First-time setup

1. **Clone the repository**

   ```sh
   git clone https://github.com/hixson-dane/aipm.git
   cd aipm
   ```

2. **Install dependencies**

   From the repository root, run:

   ```sh
   npm install
   ```

   This installs all root-level and workspace-package dependencies in one step, because the root `package.json` declares `"workspaces": ["packages/*"]`.

3. **Verify the workspace**

   ```sh
   npx nx show projects
   ```

   You should see the seven packages listed: `bindings`, `cli`, `contract`, `core`, `installer`, `manifest`, and `resolver`.

## Workspace structure

```text
aipm/
  packages/           # reusable workspace packages
    core/             # shared domain types, errors, and helpers
    manifest/         # manifest schema, parsing, and validation
    resolver/         # dependency and version resolution
    contract/         # normalized repository contract compilation
    installer/        # local artifact materialization
    bindings/         # agent-specific adapters and generators
    cli/              # user-facing CLI (top-level compositor)
  docs/               # project documentation
  nx.json             # Nx workspace configuration
  tsconfig.base.json  # shared TypeScript base configuration
  package.json        # root workspace manifest
```

Each package under `packages/` has:

- `package.json` — npm package metadata and dependency declarations
- `project.json` — Nx project metadata and target overrides (if any)
- `src/` — TypeScript source
- `tsconfig.json` and `tsconfig.lib.json` — per-package TypeScript configuration that extends `tsconfig.base.json`

## Key Nx commands

All Nx commands should be run from the repository root using `npx nx` to avoid relying on a globally installed Nx binary.

### Inspect the workspace

```sh
# List all projects
npx nx show projects

# Show the dependency graph in the browser
npx nx graph

# Show detailed configuration for a specific project
npx nx show project core
```

### Build

```sh
# Build a single package
npx nx build core

# Build all packages (respects dependency order)
npx nx run-many -t build --all
```

### Typecheck

```sh
# Typecheck a single package
npx nx typecheck core

# Typecheck all packages
npx nx run-many -t typecheck --all
```

### Test

```sh
# Test a single package
npx nx test core

# Test all packages
npx nx run-many -t test --all
```

### Lint

```sh
# Lint a single package
npx nx lint core

# Lint all packages
npx nx run-many -t lint --all
```

### Build and typecheck everything

```sh
npx nx run-many -t build,typecheck --all
```

### Run affected tasks only

Nx tracks which files changed and can run tasks only for the packages that are actually affected:

```sh
npx nx affected -t build
npx nx affected -t test
npx nx affected -t lint
```

## Workspace configuration

### `nx.json`

The central Nx configuration file. Key sections:

- **`namedInputs`** — reusable input sets used by caching rules. The `default` input includes all project files; `production` currently mirrors `default`.
- **`plugins`** — the `@nx/js/typescript` plugin auto-detects `build` and `typecheck` targets from each package's `tsconfig.lib.json`.
- **`targetDefaults`** — global defaults applied to every target of a given executor. The `@nx/js:swc` defaults enable caching and declare that each build depends on the builds of its dependencies (`"dependsOn": ["^build"]`).
- **`neverConnectToCloud`** / **`analytics`** — Nx Cloud and analytics are disabled for this workspace.

### `tsconfig.base.json`

Shared TypeScript compiler options inherited by every package. Notable settings:

- `"module": "nodenext"` and `"moduleResolution": "nodenext"` — native ESM with Node.js resolution semantics.
- `"customConditions": ["@org/source"]` — enables TypeScript to resolve other workspace packages directly from their `src/` tree during local development, via the `@org/source` export condition in each package's `exports` map.
- `"strict": true` plus several additional checks (`noImplicitReturns`, `noUnusedLocals`, etc.).

### Package `exports` map

Each package exposes three resolution conditions:

```json
{
  "@org/source": "./src/index.ts",
  "types": "./dist/index.d.ts",
  "import": "./dist/index.js",
  "default": "./dist/index.js"
}
```

- **`@org/source`** — used by TypeScript during local development (matches `tsconfig.base.json` `customConditions`).
- **`types`** — TypeScript declaration files from a built `dist/`.
- **`import`** / **`default`** — compiled JavaScript for runtime consumption.

## Adding a new package

1. **Create the directory** under `packages/<name>`.

2. **Add `package.json`** following the existing convention:

   ```json
   {
     "name": "@aipm/<name>",
     "version": "0.0.1",
     "private": true,
     "type": "module",
     "main": "./dist/index.js",
     "module": "./dist/index.js",
     "types": "./dist/index.d.ts",
     "exports": {
       "./package.json": "./package.json",
       ".": {
         "@org/source": "./src/index.ts",
         "types": "./dist/index.d.ts",
         "import": "./dist/index.js",
         "default": "./dist/index.js"
       }
     },
     "dependencies": {
       "@swc/helpers": "~0.5.18"
     }
   }
   ```

3. **Add `project.json`** with the Nx project name and tags:

   ```json
   {
     "name": "<name>",
     "$schema": "../../node_modules/nx/schemas/project.json",
     "tags": ["scope:<name>", "type:lib"]
   }
   ```

4. **Add TypeScript configuration** files — copy `tsconfig.json` and `tsconfig.lib.json` from an existing package such as `core` and adjust paths.

5. **Create `src/index.ts`** as the public entry point.

6. **Declare internal dependencies** in `package.json` using the workspace range:

   ```json
   "@aipm/core": "*"
   ```

7. **Run `npm install`** from the repository root to link the new package.

8. **Verify** the package appears in the workspace:

   ```sh
   npx nx show projects
   ```

For the naming conventions and allowed dependency directions between packages, see [monorepo.md](monorepo.md).

## Key development workflows

### Iterating on a single package

```sh
# Watch-mode build that rebuilds when sources change
npx nx build core --watch

# Or use watch-deps to rebuild a package and its dependencies together
npx nx watch-deps core
```

### Working across multiple packages

When a change touches several packages, use `affected` to run only what needs to run:

```sh
npx nx affected -t build,typecheck,test
```

### Checking the dependency graph

Use `npx nx graph` to open an interactive visualization of all project dependencies in the browser. This is useful when verifying that new dependency edges follow the documented [layer order](monorepo.md#internal-dependency-conventions).

### Formatting

The workspace uses [Prettier](https://prettier.io/) with single-quote style. Format all files from the repository root:

```sh
npx prettier --write .
```

Check without writing:

```sh
npx prettier --check .
```

### Before opening a pull request

Run the full build and typecheck to ensure nothing is broken:

```sh
npx nx run-many -t build,typecheck --all
```

## Troubleshooting

### `Cannot find module '@aipm/<name>'`

A workspace package is not linked. Run `npm install` from the repository root to regenerate symlinks.

### Nx cache returning stale results

Clear the local Nx cache:

```sh
npx nx reset
```

### TypeScript cannot find types after a build

Ensure the package you depend on has been built first:

```sh
npx nx build <dependency>
```

Or build all dependencies at once:

```sh
npx nx run-many -t build --all
```
