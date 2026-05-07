/**
 * Artifact kinds supported by aipm.
 */
export type ArtifactKind =
  | 'skill'
  | 'mcp-server'
  | 'workflow'
  | 'policy'
  | 'eval'
  | 'agent-config';

/**
 * Semantic version string, e.g. "1.2.3" or a semver range like "^1.0.0".
 */
export type SemVer = string;

/**
 * A fully-qualified artifact reference: `<name>@<version>`.
 */
export interface ArtifactRef {
  name: string;
  version: SemVer;
}

/**
 * Base error class for all aipm errors.
 */
export class AipmError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AipmError';
  }
}

/**
 * Thrown when a requested artifact cannot be found.
 */
export class NotFoundError extends AipmError {
  constructor(name: string, version?: string) {
    super(
      version
        ? `Artifact not found: ${name}@${version}`
        : `Artifact not found: ${name}`,
    );
    this.name = 'NotFoundError';
  }
}

/**
 * Thrown when a version constraint cannot be satisfied.
 */
export class ResolutionError extends AipmError {
  constructor(message: string) {
    super(message);
    this.name = 'ResolutionError';
  }
}
