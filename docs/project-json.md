# `.ai/project.json` Specification

## Purpose

`.ai/project.json` is the repository-level declaration file for aipm artifact dependencies.
It plays the same role that `package.json` plays for npm: it lets a repository state which
AI artifacts it wants to install and at what version ranges.

The file is intentionally kept minimal and human-editable. It is the source of truth that
the aipm resolver reads when computing an installation plan, and it is checked in to version
control alongside the rest of the repository.

See [architecture.md](architecture.md#repository-local-contract) for how this file fits into
the broader `.ai/` directory layout.

---

## File location

The file **must** be placed at:

```text
<repository-root>/.ai/project.json
```

No other location is supported.

---

## Schema

### Top-level object

| Field          | Type                      | Required | Description                                                          |
| -------------- | ------------------------- | -------- | -------------------------------------------------------------------- |
| `aipmVersion`  | `"1"`                     | **Yes**  | Schema version. Must be the string `"1"` for the v1 format.         |
| `dependencies` | `Record<string, string>`  | **Yes**  | Declared artifact dependencies (name → semver range). May be empty. |
| `description`  | `string`                  | No       | Human-readable description of the project's AI artifact setup.      |
| `agents`       | `string[]`                | No       | Target agent runtimes to generate bindings for during install.       |

---

## Field reference

### `aipmVersion` *(required)*

```json
"aipmVersion": "1"
```

Identifies the schema version of this file.

- **Type**: literal string `"1"`
- **Rules**: must be present; must equal `"1"`; any other value is a validation error
- **Purpose**: enables the toolchain to detect unsupported file formats and provide
  clear upgrade or migration guidance when new schema versions are introduced

### `dependencies` *(required)*

```json
"dependencies": {
  "@acme/code-review-skill": "^1.0.0",
  "@corp/git-workflow":       "~2.3.0",
  "@aipm/policy-base":        "1.4.2"
}
```

A map of artifact name to semver range that declares which artifacts the repository
wants to install.

- **Type**: object whose keys are artifact name strings and whose values are semver
  range strings
- **Rules**:
  - must be present; an empty object `{}` is valid and means no artifacts are currently
    declared
  - each key must be a non-empty string; by convention artifact names follow the
    `@<scope>/<name>` format but this is not enforced
  - each value must be a non-empty string; it is interpreted as a semver range at
    resolve time (e.g. `"^1.0.0"`, `"~2.3.0"`, `"1.4.2"`)
  - duplicate keys are not permitted (standard JSON object constraint)

### `description` *(optional)*

```json
"description": "AI artifact dependencies for the Acme platform repository"
```

A free-text description of the project's AI artifact setup. Used for documentation and
readability only; ignored by the resolver and installer.

- **Type**: string
- **Rules**: no length constraint; must be a string when present

### `agents` *(optional)*

```json
"agents": ["claude", "copilot"]
```

A list of target agent runtimes that bindings should be generated for during install.

- **Type**: array of non-empty strings
- **Rules**:
  - when absent, the installer generates bindings for all registered adapter targets
  - when present, only the listed targets are processed during binding generation
  - each entry must be a non-empty string
  - recognized values in v1: `"claude"`, `"copilot"`, `"openai"`; unrecognized values
    are accepted by the parser without error (future-proofing) but the installer
    may emit a warning when generating bindings for an unknown target

---

## Versioning and interoperability

### Schema version (`aipmVersion`)

The `aipmVersion` field is the primary compatibility signal.

| Value | Status   | Notes                              |
| ----- | -------- | ---------------------------------- |
| `"1"` | Current  | The only supported version in v1.  |

**Rules for future versions**:

- A new schema version will be introduced only when a breaking change is required (e.g.
  field renames, removed fields, structural changes to `dependencies`).
- Additive changes (new optional fields) do not require a version bump; older toolchain
  versions must ignore unknown fields.
- If a tool encounters an `aipmVersion` it does not recognize it must halt with a clear
  error instructing the user to upgrade aipm.

### Forward compatibility

Tools **must** silently ignore unknown top-level fields. This allows future optional
fields to be added without breaking existing installations.

### Lockfile relationship

`.ai/project.json` contains *declared* ranges. `.ai/lock.json` captures the *exact*
pinned versions and integrity hashes after resolution. The project file should be
edited by humans; the lockfile is managed exclusively by aipm.

---

## Validation rules

The following rules are enforced by `parseProjectManifest` (exported from
`@aipm/installer`).

| # | Rule                                                                                    | Error type    |
| - | --------------------------------------------------------------------------------------- | ------------- |
| 1 | The top-level value must be a non-null, non-array object.                               | `TypeError`   |
| 2 | `aipmVersion` must be present and equal to `"1"`.                                       | `TypeError`   |
| 3 | `dependencies` must be present and must be a non-null, non-array object.               | `TypeError`   |
| 4 | Each value in `dependencies` must be a non-empty string.                               | `TypeError`   |
| 5 | `agents`, when present, must be an array.                                               | `TypeError`   |
| 6 | Each entry in `agents` must be a non-empty string.                                     | `TypeError`   |

---

## Complete example

```json
{
  "aipmVersion": "1",
  "description": "AI artifact dependencies for the Acme platform monorepo",
  "dependencies": {
    "@acme/code-review-skill": "^1.2.0",
    "@acme/git-workflow":       "~3.0.0",
    "@aipm/policy-base":        "1.4.2",
    "@corp/mcp-search-server":  "^0.9.0"
  },
  "agents": ["claude", "copilot"]
}
```

A minimal valid file with no artifacts declared yet:

```json
{
  "aipmVersion": "1",
  "dependencies": {}
}
```

A standalone example file is also available at
[`docs/examples/project.json`](examples/project.json).

---

## Related documents

- [Architecture — Repository-local contract](architecture.md#repository-local-contract)
- [Artifact model](artifact-model.md)
- [Roadmap — Phase 3: local installation model](roadmap.md#phase-3-local-installation-model)
