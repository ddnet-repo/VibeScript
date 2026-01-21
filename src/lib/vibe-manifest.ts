import * as fs from 'node:fs';
import * as path from 'node:path';
import pc from 'picocolors';

export interface ManifestMetadata {
  slug: string;
  date: string;
  timestamp: string;
  filePath: string;
}

export function listManifests(cwd: string = process.cwd()): ManifestMetadata[] {
  const changesDir = path.join(cwd, '.vibe/changes');

  if (!fs.existsSync(changesDir)) {
    return [];
  }

  const files = fs.readdirSync(changesDir).filter(f => f.endsWith('.md'));
  const manifests: ManifestMetadata[] = [];

  for (const file of files) {
    // Parse filename: YYYY-MM-DDTHH-MM-SS-slug.md
    const match = file.match(/^(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})-(.+)\.md$/);

    if (match) {
      manifests.push({
        slug: match[2],
        date: match[1].split('T')[0],
        timestamp: match[1],
        filePath: path.join(changesDir, file),
      });
    }
  }

  return manifests.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function getLatestManifest(cwd: string = process.cwd()): ManifestMetadata | null {
  const manifests = listManifests(cwd);
  return manifests[0] || null;
}

export function readManifest(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

export function validateManifest(content: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredSections = [
    '## Summary',
    '## Changes',
    '## Testing',
    '## Rollback',
  ];

  for (const section of requiredSections) {
    if (!content.includes(section)) {
      errors.push(`Missing required section: ${section}`);
    }
  }

  // Check for placeholder text
  if (content.includes('{{') || content.includes('}}')) {
    warnings.push('Manifest contains unresolved template placeholders');
  }

  // Check for TODO markers
  if (content.toLowerCase().includes('todo') || content.includes('[ ]')) {
    warnings.push('Manifest contains TODO items');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export async function runVibeManifest(): Promise<number> {
  const cwd = process.cwd();

  console.log(pc.bold(pc.cyan('\n📋 VibeScript Manifest Status\n')));

  const manifests = listManifests(cwd);

  if (manifests.length === 0) {
    console.log(pc.yellow('No manifests found in .vibe/changes/'));
    console.log(pc.dim('\nCreate one with: vibescript manifest "description"\n'));
    return 0;
  }

  console.log(`Found ${manifests.length} manifest(s):\n`);

  for (const manifest of manifests) {
    const content = readManifest(manifest.filePath);
    const validation = validateManifest(content);

    const statusIcon = validation.valid ? pc.green('✓') : pc.yellow('⚠');
    console.log(`${statusIcon} ${manifest.date} - ${manifest.slug}`);
    console.log(pc.dim(`   ${manifest.filePath}`));

    if (validation.errors.length > 0) {
      for (const error of validation.errors) {
        console.log(pc.red(`   ✗ ${error}`));
      }
    }

    if (validation.warnings.length > 0) {
      for (const warning of validation.warnings) {
        console.log(pc.yellow(`   ⚠ ${warning}`));
      }
    }

    console.log('');
  }

  return 0;
}
