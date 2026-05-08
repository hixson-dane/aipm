import type { ArtifactRef } from '@aipm/core';
import type { DependencyGraph } from '@aipm/resolver';
import type { RepositoryContract } from '@aipm/contract';

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
