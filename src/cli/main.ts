#!/usr/bin/env node

import { Command } from 'commander';
import pc from 'picocolors';
import { initCommand } from './commands/init.js';
import { taskCommand } from './commands/task.js';
import { manifestCommand } from './commands/manifest.js';
import { doctorCommand } from './commands/doctor.js';

const program = new Command();

program
  .name('vibescript')
  .description('Governance tooling for AI-assisted coding')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize VibeScript governance in the current project')
  .option('--no-husky', 'Skip Husky hook installation')
  .option('--no-github', 'Skip GitHub Action installation')
  .action(initCommand);

program
  .command('task')
  .description('Create a new .vibe.ts task file')
  .argument('<description>', 'Task description')
  .option('-d, --dir <directory>', 'Target directory', 'src')
  .action(taskCommand);

program
  .command('manifest')
  .description('Create a new change manifest')
  .argument('<slug>', 'Manifest slug identifier')
  .action(manifestCommand);

program
  .command('doctor')
  .description('Diagnose VibeScript configuration issues')
  .action(doctorCommand);

// Combined check command - runs guard then checker
program
  .command('check')
  .description('Run all vibe checks (guard + checker) - use this in CI')
  .option('--base <ref>', 'Git base reference')
  .option('--guard-only', 'Only run vibe-guard')
  .option('--checker-only', 'Only run vibe-checker')
  .action(async (options) => {
    const { runVibeGuard } = await import('../lib/vibe-guard.js');
    const { runVibeChecker } = await import('../lib/vibe-checker.js');

    let exitCode = 0;

    // Run guard first (ownership checks)
    if (!options.checkerOnly) {
      const guardCode = await runVibeGuard(options.base);
      if (guardCode !== 0) {
        exitCode = guardCode;
      }
    }

    // Run checker (directive + touch checks)
    if (!options.guardOnly) {
      const checkerCode = await runVibeChecker(options.base);
      if (checkerCode !== 0) {
        exitCode = checkerCode;
      }
    }

    if (exitCode === 0) {
      console.log(pc.bold(pc.green('\n✓ All vibe checks passed!\n')));
    } else {
      console.log(pc.bold(pc.red('\n✗ Vibe checks failed. Fix violations above.\n')));
    }

    process.exit(exitCode);
  });

// Standalone guard command
program
  .command('guard')
  .description('Run vibe-guard ownership checks only')
  .option('--base <ref>', 'Git base reference')
  .action(async (options) => {
    const { runVibeGuard } = await import('../lib/vibe-guard.js');
    const exitCode = await runVibeGuard(options.base);
    process.exit(exitCode);
  });

program.parse();
