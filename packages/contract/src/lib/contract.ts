import type { ArtifactRef } from '@aipm/core';
import type { ArtifactManifest } from '@aipm/manifest';
import type { DependencyGraph } from '@aipm/resolver';

/**
 * The merged effective capabilities for the repository contract.
 */
export interface EffectiveCapabilities {
  capabilities: string[];
  permissions: Array<{ scope: string; reason?: string }>;
}

/**
 * A single entry in the resolved contract.
 */
export interface ContractEntry {
  ref: ArtifactRef;
  manifest: ArtifactManifest;
}

/**
 * The normalized repository contract produced from a resolved dependency graph.
 * This is what gets written to `.ai/resolved/`.
 */
export interface RepositoryContract {
  generatedAt: string;
  artifacts: ContractEntry[];
  effective: EffectiveCapabilities;
}

/**
 * Compile a resolved dependency graph into a repository contract.
 */
export function compileContract(graph: DependencyGraph): RepositoryContract {
  const artifacts: ContractEntry[] = graph.order.map((ref) => {
    const node = graph.nodes.get(`${ref.name}@${ref.version}`)!;
    return { ref, manifest: node.manifest };
  });

  const capabilities = new Set<string>();
  const permissions: EffectiveCapabilities['permissions'] = [];

  for (const entry of artifacts) {
    for (const cap of entry.manifest.capabilities ?? []) {
      capabilities.add(cap);
    }
    for (const perm of entry.manifest.permissions ?? []) {
      permissions.push(perm);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    artifacts,
    effective: {
      capabilities: Array.from(capabilities).sort(),
      permissions,
    },
  };
}
