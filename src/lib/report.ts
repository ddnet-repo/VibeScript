import * as fs from 'node:fs';
import * as path from 'node:path';

export interface Violation {
  file: string;
  type: string;
  message: string;
  details?: string;
}

export interface Report {
  timestamp: string;
  checkType: 'vibe-checker' | 'vibe-guard';
  baseRef: string;
  changedFiles: string[];
  violations: Violation[];
  passed: boolean;
}

export function createReport(
  checkType: Report['checkType'],
  baseRef: string,
  changedFiles: string[],
  violations: Violation[]
): Report {
  return {
    timestamp: new Date().toISOString(),
    checkType,
    baseRef,
    changedFiles,
    violations,
    passed: violations.length === 0,
  };
}

export function formatReport(report: Report): string {
  const lines: string[] = [];

  lines.push('═'.repeat(60));
  lines.push(`VIBESCRIPT ${report.checkType.toUpperCase()} REPORT`);
  lines.push('═'.repeat(60));
  lines.push('');
  lines.push(`Timestamp: ${report.timestamp}`);
  lines.push(`Base Ref:  ${report.baseRef}`);
  lines.push(`Status:    ${report.passed ? 'PASSED ✓' : 'FAILED ✗'}`);
  lines.push('');
  lines.push(`Changed Files (${report.changedFiles.length}):`);
  for (const file of report.changedFiles) {
    lines.push(`  - ${file}`);
  }
  lines.push('');

  if (report.violations.length > 0) {
    lines.push('─'.repeat(60));
    lines.push(`VIOLATIONS (${report.violations.length})`);
    lines.push('─'.repeat(60));
    lines.push('');

    for (const violation of report.violations) {
      lines.push(`[${violation.type}] ${violation.file}`);
      lines.push(`  → ${violation.message}`);
      if (violation.details) {
        lines.push(`    ${violation.details}`);
      }
      lines.push('');
    }
  } else {
    lines.push('No violations found.');
    lines.push('');
  }

  lines.push('═'.repeat(60));

  return lines.join('\n');
}

export function writeReport(report: Report, outputPath: string): void {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const content = formatReport(report);
  fs.writeFileSync(outputPath, content);
}

export function printReport(report: Report): void {
  console.log(formatReport(report));
}
