import * as fs from 'node:fs';
import * as path from 'node:path';
import pc from 'picocolors';
import { getBaseRef, getChangedFiles } from './git-utils.js';
import { parseDirectives } from './directive-parser.js';
import { matchesAnyGlob, findMatchingGlob } from './glob-matcher.js';
import { createReport, writeReport, printReport, type Violation } from './report.js';

export interface OwnershipConfig {
  ai_owned_globs: string[];
  human_owned_globs: string[];
  contract_owned_globs: string[];
  blocked_globs: string[];
  require_manifest_for_globs: string[];
  require_touch_enforcement: boolean;
  guard_exempt_globs?: string[];
}

function loadOwnershipConfig(cwd: string): OwnershipConfig | null {
  const configPath = path.join(cwd, '.vibe/ownership.json');

  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(content) as OwnershipConfig;
  } catch {
    return null;
  }
}

function getFileOwnership(
  file: string,
  config: OwnershipConfig
): 'ai' | 'human' | 'contract' | 'blocked' | 'exempt' | 'unowned' {
  // Check exempt first - these files skip all ownership checks
  if (config.guard_exempt_globs && matchesAnyGlob(file, config.guard_exempt_globs)) {
    return 'exempt';
  }
  if (matchesAnyGlob(file, config.blocked_globs)) {
    return 'blocked';
  }
  if (matchesAnyGlob(file, config.ai_owned_globs)) {
    return 'ai';
  }
  if (matchesAnyGlob(file, config.human_owned_globs)) {
    return 'human';
  }
  if (matchesAnyGlob(file, config.contract_owned_globs)) {
    return 'contract';
  }
  return 'unowned';
}

function isTestFile(file: string): boolean {
  return file.endsWith('.test.ts') || file.endsWith('.spec.ts') ||
         file.endsWith('.test.js') || file.endsWith('.spec.js') ||
         file.includes('__tests__/');
}

export async function runVibeGuard(baseRefOverride?: string): Promise<number> {
  const cwd = process.cwd();
  const baseRef = baseRefOverride || getBaseRef();

  console.log(pc.bold(pc.cyan('\n🛡️ Running VibeScript Guard...\n')));
  console.log(pc.dim(`Base ref: ${baseRef}`));

  // Load ownership config
  const config = loadOwnershipConfig(cwd);

  if (!config) {
    console.log(pc.red('\nError: Could not load .vibe/ownership.json'));
    console.log(pc.dim('Run `vibescript init` to create the governance folder.\n'));
    return 1;
  }

  // Get changed files
  const changedFiles = getChangedFiles(baseRef);

  if (changedFiles.length === 0) {
    console.log(pc.yellow('\nNo changed files detected.\n'));
    return 0;
  }

  console.log(pc.dim(`Changed files: ${changedFiles.length}\n`));

  const violations: Violation[] = [];
  const changedContractFiles: string[] = [];
  const hasNewManifest = changedFiles.some(f => f.includes('.vibe/changes/'));

  // Check each changed file
  for (const file of changedFiles) {
    // Skip .vibe internal files (except changes which need manifest check)
    if (file.startsWith('.vibe/') && !file.includes('.vibe/changes/')) {
      console.log(pc.dim(`  ${file} → internal (skipped)`));
      continue;
    }

    const ownership = getFileOwnership(file, config);

    console.log(pc.dim(`  ${file} → ${ownership}`));

    // Exempt files skip all checks
    if (ownership === 'exempt') {
      continue;
    }

    // Check 1: Blocked files
    if (ownership === 'blocked') {
      const matchedGlob = findMatchingGlob(file, config.blocked_globs);
      violations.push({
        file,
        type: 'BLOCKED_FILE',
        message: 'This file is in a blocked location and cannot be modified',
        details: `Matched blocked glob: ${matchedGlob}\nFIX: Don't modify files in blocked paths (dist/, node_modules/, etc.)`,
      });
      continue;
    }

    // Check 2: Unowned files
    if (ownership === 'unowned') {
      violations.push({
        file,
        type: 'UNOWNED_FILE',
        message: 'File matches no ownership glob',
        details:
          `FIX: Either:\n` +
          `  1. Add to guard_exempt_globs in .vibe/ownership.json (for docs/config)\n` +
          `  2. Rename to *.vibe.ts (AI-owned), *.human.ts, or *.lock.ts\n` +
          `  3. Add a matching pattern to ai_owned_globs`,
      });
      continue;
    }

    // Check 3: Human-owned files
    if (ownership === 'human') {
      const filePath = path.join(cwd, file);
      if (fs.existsSync(filePath)) {
        const directives = parseDirectives(filePath);
        if (!directives.allowHumanEdits) {
          violations.push({
            file,
            type: 'HUMAN_OWNED_VIOLATION',
            message: 'Human-owned file modified without @vibe:allowHumanEdits directive',
            details:
              `FIX: Add this to the top of the file:\n` +
              `  // @vibe:allowHumanEdits true\n` +
              `Or have a human make this change instead.`,
          });
        }
      }
    }

    // Check 4: Contract-owned files - track for test requirement check
    if (ownership === 'contract') {
      changedContractFiles.push(file);
    }

    // Check 5: Manifest requirement
    if (matchesAnyGlob(file, config.require_manifest_for_globs)) {
      if (!hasNewManifest) {
        violations.push({
          file,
          type: 'MISSING_MANIFEST',
          message: 'File requires a change manifest',
          details:
            `FIX: Create a manifest before committing:\n` +
            `  pnpm vibescript manifest "description-of-change"`,
        });
      }
    }
  }

  // Check contract files have corresponding test changes
  if (changedContractFiles.length > 0) {
    const hasTestChange = changedFiles.some(isTestFile);

    if (!hasTestChange) {
      for (const contractFile of changedContractFiles) {
        violations.push({
          file: contractFile,
          type: 'CONTRACT_NO_TEST',
          message: 'Contract-owned file changed without accompanying test changes',
          details:
            `FIX: Add or modify a test file (.test.ts or .spec.ts)\n` +
            `Contract files are critical interfaces that require test coverage.`,
        });
      }
    }
  }

  // Generate report
  const report = createReport('vibe-guard', baseRef, changedFiles, violations);

  // Write report
  const reportPath = path.join(cwd, '.vibe/reports/vibe-guard.txt');
  try {
    writeReport(report, reportPath);
    console.log(pc.dim(`\nReport written to ${reportPath}`));
  } catch {
    // .vibe/reports may not exist
  }

  // Print results
  console.log('');
  printReport(report);

  if (violations.length > 0) {
    console.log(pc.red(`\n✗ Vibe guard failed with ${violations.length} violation(s)\n`));
    return 1;
  }

  console.log(pc.green('\n✓ Vibe guard passed!\n'));
  return 0;
}
