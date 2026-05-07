import type { ArtifactRef } from '@aipm/core';
import type { RepositoryContract } from '@aipm/contract';

/**
 * Identifies the target agent runtime for a binding.
 */
export type AgentTarget = 'claude' | 'copilot' | 'openai' | string;

/**
 * A generated binding artifact for a specific agent runtime.
 */
export interface AgentBinding {
  target: AgentTarget;
  /** The generated file content, keyed by relative output path. */
  files: Record<string, string>;
}

/**
 * Interface that every agent-specific binding generator must implement.
 */
export interface BindingGenerator {
  readonly target: AgentTarget;
  generate(
    ref: ArtifactRef,
    contract: RepositoryContract,
  ): Promise<AgentBinding>;
}

/**
 * Registry of binding generators indexed by agent target name.
 */
export class BindingRegistry {
  private generators = new Map<AgentTarget, BindingGenerator>();

  register(generator: BindingGenerator): void {
    this.generators.set(generator.target, generator);
  }

  get(target: AgentTarget): BindingGenerator | undefined {
    return this.generators.get(target);
  }

  targets(): AgentTarget[] {
    return Array.from(this.generators.keys());
  }
}

/** Shared default binding registry. */
export const defaultRegistry = new BindingRegistry();
