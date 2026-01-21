import * as fs from 'node:fs';
import * as path from 'node:path';
import pc from 'picocolors';
import { getBaseRef, getChangedFiles } from './git-utils.js';
import { validateDirectives, getTouchGlobs } from './directive-parser.js';
import { matchesAnyGlob } from './glob-matcher.js';
import { createReport, writeReport, printReport, type Violation } from './report.js';

interface OwnershipConfig {
  touch_exempt_globs?: string[];
  require_touch_enforcement?: boolean;
}

function loadOwnershipConfig(cwd: string): OwnershipConfig {
  const configPath = path.join(cwd, '.vibe/ownership.json');

  if (!fs.existsSync(configPath)) {
    return { touch_exempt_globs: [], require_touch_enforcement: true };
  }

  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch {
    return { touch_exempt_globs: [], require_touch_enforcement: true };
  }
}

export async function runVibeChecker(baseRefOverride?: string): Promise<number> {
  const cwd = process.cwd();
  const baseRef = baseRefOverride || getBaseRef();
  const config = loadOwnershipConfig(cwd);

  console.log(pc.bold(pc.cyan('\n🎸 Running VibeScript Checker...\n')));
  console.log(pc.dim(`Base ref: ${baseRef}`));

  // Get changed files
  const changedFiles = getChangedFiles(baseRef);

  if (changedFiles.length === 0) {
    console.log(pc.yellow('\nNo changed files detected.\n'));
    return 0;
  }

  console.log(pc.dim(`Changed files: ${changedFiles.length}`));

  // Find changed .vibe.ts files
  const vibeFiles = changedFiles.filter(f => f.endsWith('.vibe.ts'));

  if (vibeFiles.length === 0) {
    console.log(pc.yellow('\nNo .vibe.ts files in the changeset. Skipping directive checks.\n'));
    return 0;
  }

  console.log(pc.dim(`Vibe files: ${vibeFiles.length}\n`));

  const violations: Violation[] = [];
  const allTouchGlobs: string[] = [];
  const touchExemptGlobs = config.touch_exempt_globs || [];

  // Validate each .vibe.ts file
  for (const vibeFile of vibeFiles) {
    const filePath = path.join(cwd, vibeFile);
    console.log(pc.dim(`Checking ${vibeFile}...`));

    try {
      const validation = validateDirectives(filePath);

      if (!validation.valid) {
        for (const error of validation.errors) {
          violations.push({
            file: vibeFile,
            type: 'MISSING_DIRECTIVE',
            message: error,
            details: validation.missing.length > 0
              ? `FIX: Add these directives to the top of the file:\n` +
                validation.missing.map(d => `  // @vibe:${d} <value>`).join('\n')
              : undefined,
          });
        }
      }

      // Collect touch globs
      const touchGlobs = getTouchGlobs(validation.directives);
      allTouchGlobs.push(...touchGlobs);
    } catch (error) {
      violations.push({
        file: vibeFile,
        type: 'PARSE_ERROR',
        message: `Failed to parse file: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  // Verify all changed files match at least one touch glob
  if (config.require_touch_enforcement !== false && allTouchGlobs.length > 0) {
    for (const changedFile of changedFiles) {
      // Skip the .vibe.ts files themselves - they're always allowed
      if (changedFile.endsWith('.vibe.ts')) {
        continue;
      }

      // Skip files matching touch_exempt_globs
      if (matchesAnyGlob(changedFile, touchExemptGlobs)) {
        continue;
      }

      // Check if file matches any declared touch glob
      if (!matchesAnyGlob(changedFile, allTouchGlobs)) {
        // Find the closest matching vibe file for the suggestion
        const suggestedPattern = suggestTouchPattern(changedFile);

        violations.push({
          file: changedFile,
          type: 'UNDECLARED_TOUCH',
          message: `File changed but not declared in any @vibe:touch directive`,
          details:
            `Declared patterns: ${allTouchGlobs.join(', ') || '(none)'}\n` +
            `FIX: Add to @vibe:touch in your .vibe.ts file:\n` +
            `  // @vibe:touch ${suggestedPattern}\n` +
            `Or stop modifying this file.`,
        });
      }
    }
  }

  // Generate report
  const report = createReport('vibe-checker', baseRef, changedFiles, violations);

  // Write report to .vibe/reports/
  const reportPath = path.join(cwd, '.vibe/reports/vibe-check.txt');
  try {
    writeReport(report, reportPath);
    console.log(pc.dim(`\nReport written to ${reportPath}`));
  } catch {
    // .vibe/reports may not exist, that's okay
  }

  // Print results
  console.log('');
  printReport(report);

  if (violations.length > 0) {
    console.log(pc.red(`\n✗ Vibe check failed with ${violations.length} violation(s)\n`));
    printFixSummary(violations);
    return 1;
  }

  console.log(pc.green('\n✓ Vibe check passed!\n'));
  return 0;
}

function suggestTouchPattern(filePath: string): string {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);

  // Suggest a reasonable glob for the file
  if (dir === '.') {
    return filePath; // Root file, suggest exact match
  }

  // Suggest dir/**/*ext pattern
  return `${dir}/**/*${ext}`;
}

function printFixSummary(violations: Violation[]): void {
  const byType = new Map<string, Violation[]>();

  for (const v of violations) {
    const list = byType.get(v.type) || [];
    list.push(v);
    byType.set(v.type, list);
  }

  console.log(pc.bold('Quick fixes:\n'));

  if (byType.has('MISSING_DIRECTIVE')) {
    console.log(pc.yellow('Missing directives:'));
    console.log('  Add required directives to your .vibe.ts files.');
    console.log('  Required: goal, touch, inputs, outputs, constraints, tests, risk, rollback\n');
  }

  if (byType.has('UNDECLARED_TOUCH')) {
    const touchViolations = byType.get('UNDECLARED_TOUCH')!;
    const patterns = [...new Set(touchViolations.map(v => suggestTouchPattern(v.file)))];

    console.log(pc.yellow('Undeclared file changes:'));
    console.log('  Option 1: Add to @vibe:touch in your .vibe.ts:');
    for (const pattern of patterns.slice(0, 5)) {
      console.log(`    // @vibe:touch ${pattern}`);
    }
    if (patterns.length > 5) {
      console.log(`    ... and ${patterns.length - 5} more`);
    }
    console.log('  Option 2: Stop modifying files not in your touch list.\n');
  }
}
