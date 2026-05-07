import type { ArtifactRef } from '@aipm/core';
import type { ParsedManifest } from '@aipm/manifest';

/**
 * A node in the resolved dependency graph.
 */
export interface ResolvedNode {
  ref: ArtifactRef;
  manifest: ParsedManifest;
  /** Transitive dependencies of this node. */
  dependencies: ArtifactRef[];
}

/**
 * The fully resolved dependency graph for a workspace.
 */
export interface DependencyGraph {
  /** All resolved nodes, keyed by "<name>@<version>". */
  nodes: Map<string, ResolvedNode>;
  /** Topological order of the resolved artifacts (dependencies first). */
  order: ArtifactRef[];
}

/**
 * Interface for a registry that can look up manifests by name and version.
 */
export interface ManifestRegistry {
  resolve(name: string, versionRange: string): Promise<ParsedManifest>;
}

/**
 * Resolve a set of root dependencies into a full dependency graph.
 * Performs a depth-first traversal, resolving transitive dependencies.
 */
export async function resolveDependencies(
  roots: ArtifactRef[],
  registry: ManifestRegistry,
): Promise<DependencyGraph> {
  const nodes = new Map<string, ResolvedNode>();
  const order: ArtifactRef[] = [];

  async function visit(ref: ArtifactRef): Promise<void> {
    const key = `${ref.name}@${ref.version}`;
    if (nodes.has(key)) return;

    const manifest = await registry.resolve(ref.name, ref.version);
    const node: ResolvedNode = {
      ref,
      manifest,
      dependencies: manifest.resolvedDependencies.map((d) => ({
        name: d.name,
        version: d.version,
      })),
    };
    nodes.set(key, node);

    for (const dep of node.dependencies) {
      await visit(dep);
    }
    order.push(ref);
  }

  for (const root of roots) {
    await visit(root);
  }

  return { nodes, order };
}
