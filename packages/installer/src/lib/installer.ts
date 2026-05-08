import type { ArtifactRef } from '@aipm/core';
import type { DependencyGraph } from '@aipm/resolver';
import type { RepositoryContract } from '@aipm/contract';

/**
 * The raw structure of `.ai/manifest.json`.
 * Declares the artifact dependencies intended for a repository.
 */
export interface ProjectManifest {
  /**
   * aipm schema version. Must be `"1"` for the v1 format.
   * This field enables forward-compatible parsing and migration checks.
   */
  aipmVersion: '1';
  /**
   * Human-readable description of the project's AI artifact setup.
   * Intended for documentation purposes only; not used by the resolver.
   */
  description?: string;
  /**
   * Declared artifact dependencies for this repository.
   * Maps artifact name (e.g. `"@acme/my-skill"`) to a semver range string
   * (e.g. `"^1.0.0"`).  An empty object is valid and means no
   * artifacts are currently declared.
   */
  dependencies: Record<string, string>;
  /**
   * Target agent runtimes to generate bindings for during install.
   * When absent, the installer generates bindings for all registered
   * targets.  When present, only the listed targets are generated.
   * Example values: `"claude"`, `"copilot"`, `"openai"`.
   */
  agents?: string[];
}

/**
 * Parse and validate a raw value as a {@link ProjectManifest}.
 * Throws a {@link TypeError} with an actionable message if validation fails.
 */
export function parseProjectManifest(raw: unknown): ProjectManifest {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new TypeError('manifest.json must be a non-null object');
  }
  const obj = raw as Record<string, unknown>;
  if (obj['aipmVersion'] !== '1') {
    throw new TypeError(
      'manifest.json "aipmVersion" must be "1" (the only supported schema version)',
    );
  }
  if (
    typeof obj['dependencies'] !== 'object' ||
    obj['dependencies'] === null ||
    Array.isArray(obj['dependencies'])
  ) {
    throw new TypeError('manifest.json "dependencies" must be an object');
  }
  for (const [name, version] of Object.entries(
    obj['dependencies'] as Record<string, unknown>,
  )) {
    if (typeof version !== 'string' || !version) {
      throw new TypeError(
        `manifest.json dependency "${name}" must have a non-empty string version range`,
      );
    }
  }
  if (obj['agents'] !== undefined) {
    if (!Array.isArray(obj['agents'])) {
      throw new TypeError(
        'manifest.json "agents" must be an array when present',
      );
    }
    for (const agent of obj['agents'] as unknown[]) {
      if (typeof agent !== 'string' || !agent) {
        throw new TypeError(
          'manifest.json each entry in "agents" must be a non-empty string',
        );
      }
    }
  }
  return obj as ProjectManifest;
}

/**
 * Configuration for where aipm writes its installation artifacts.
 */
export interface InstallPaths {
  /** Root directory, e.g. `.ai/` */
  root: string;
  /** Path for the lockfile, e.g. `.ai/lock.json` */
  lockfile: string;
  /** Directory for installed artifact metadata, e.g. `.ai/installed/` */
  installed: string;
  /** Directory for resolved contract files, e.g. `.ai/resolved/` */
  resolved: string;
}

/** Default install paths relative to the repository root. */
export const DEFAULT_INSTALL_PATHS: InstallPaths = {
  root: '.ai',
  lockfile: '.ai/lock.json',
  installed: '.ai/installed',
  resolved: '.ai/resolved',
};

/**
 * An entry in the lockfile, capturing the exact version pinned during resolution.
 */
export interface LockEntry {
  name: string;
  version: string;
  integrity?: string;
}

/**
 * The aipm lockfile structure written to `.ai/lock.json`.
 */
export interface Lockfile {
  lockfileVersion: number;
  packages: LockEntry[];
}

/**
 * Describes the outcome of an install operation.
 */
export interface InstallResult {
  installed: ArtifactRef[];
  lockfile: Lockfile;
  contract: RepositoryContract;
}

/**
 * Interface for a component that can fetch and unpack artifact tarballs.
 */
export interface ArtifactFetcher {
  fetch(ref: ArtifactRef, destDir: string): Promise<void>;
}

/**
 * Install all artifacts from a resolved dependency graph.
 * Writes lockfile and installed metadata; returns a summary of the operation.
 *
 * NOTE: This is a stub. File I/O is not yet implemented.
 */
export async function install(
  graph: DependencyGraph,
  contract: RepositoryContract,
  _fetcher: ArtifactFetcher,
  _paths: InstallPaths = DEFAULT_INSTALL_PATHS,
): Promise<InstallResult> {
  const installed = graph.order;
  const lockfile: Lockfile = {
    lockfileVersion: 1,
    packages: installed.map((ref) => ({
      name: ref.name,
      version: ref.version,
    })),
  };
  return { installed, lockfile, contract };
}
