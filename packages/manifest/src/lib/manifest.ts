import type { ArtifactKind, ArtifactRef, SemVer } from '@aipm/core';

/**
 * A dependency declaration inside an artifact manifest.
 */
export interface ManifestDependency {
  name: string;
  version: SemVer;
}

/**
 * Permission grant declared by an artifact.
 */
export interface ManifestPermission {
  scope: string;
  reason?: string;
}

/**
 * The raw structure of an aipm artifact manifest (aipm.json).
 */
export interface ArtifactManifest {
  /** Artifact name, e.g. "@acme/my-skill" */
  name: string;
  version: SemVer;
  kind: ArtifactKind;
  description?: string;
  dependencies?: Record<string, SemVer>;
  permissions?: ManifestPermission[];
  capabilities?: string[];
}

/**
 * A parsed and validated artifact manifest with resolved metadata.
 */
export interface ParsedManifest extends ArtifactManifest {
  ref: ArtifactRef;
  resolvedDependencies: ManifestDependency[];
}

/**
 * Parse a raw manifest object, validating required fields.
 * Throws if the manifest is malformed.
 */
export function parseManifest(raw: unknown): ParsedManifest {
  if (typeof raw !== 'object' || raw === null) {
    throw new TypeError('Manifest must be a non-null object');
  }
  const obj = raw as Record<string, unknown>;
  if (typeof obj['name'] !== 'string' || !obj['name']) {
    throw new TypeError('Manifest must have a non-empty "name" field');
  }
  if (typeof obj['version'] !== 'string' || !obj['version']) {
    throw new TypeError('Manifest must have a non-empty "version" field');
  }
  const validKinds: ArtifactKind[] = [
    'skill',
    'mcp-server',
    'workflow',
    'policy',
    'eval',
    'agent-config',
  ];
  if (!validKinds.includes(obj['kind'] as ArtifactKind)) {
    throw new TypeError(
      `Manifest "kind" must be one of: ${validKinds.join(', ')}`,
    );
  }
  const manifest = obj as unknown as ArtifactManifest;
  const resolvedDependencies: ManifestDependency[] = Object.entries(
    manifest.dependencies ?? {},
  ).map(([name, version]) => ({ name, version }));

  return {
    ...manifest,
    ref: { name: manifest.name, version: manifest.version },
    resolvedDependencies,
  };
}
