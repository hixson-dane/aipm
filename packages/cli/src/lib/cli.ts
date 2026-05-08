/**
 * Top-level CLI entry point for aipm.
 *
 * Commands:
 *   aipm install   - Resolve and install artifacts declared in aipm.json
 *   aipm resolve   - Print the resolved dependency graph without installing
 *   aipm inspect   - Inspect a specific artifact or the installed contract
 *   aipm bind      - Generate agent-specific bindings from the resolved contract
 */

/** Available top-level CLI commands. */
export type CliCommand = 'install' | 'resolve' | 'inspect' | 'bind';

/** Parsed CLI arguments. */
export interface CliArgs {
  command: CliCommand;
  args: string[];
  flags: Record<string, string | boolean>;
}

/**
 * Parse raw process.argv into a structured CliArgs object.
 * Throws if the command is missing or unrecognised.
 */
export function parseArgs(argv: string[]): CliArgs {
  const [, , command, ...rest] = argv;
  const validCommands: CliCommand[] = ['install', 'resolve', 'inspect', 'bind'];
  if (!command || !validCommands.includes(command as CliCommand)) {
    throw new Error(
      `Unknown command: "${command ?? ''}". Valid commands: ${validCommands.join(', ')}`,
    );
  }

  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (const token of rest) {
    if (token.startsWith('--')) {
      const [key, value] = token.slice(2).split('=');
      flags[key] = value ?? true;
    } else {
      args.push(token);
    }
  }

  return { command: command as CliCommand, args, flags };
}

/**
 * Print usage information to stdout.
 */
export function printUsage(): void {
  console.log(
    [
      'Usage: aipm <command> [options]',
      '',
      'Commands:',
      '  install   Resolve and install artifacts',
      '  resolve   Print resolved dependency graph',
      '  inspect   Inspect installed artifacts or contract',
      '  bind      Generate agent-specific bindings',
      '',
      'Options:',
      '  --help     Show this help message',
      '  --version  Print the version and exit',
    ].join('\n'),
  );
}
