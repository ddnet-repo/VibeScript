import * as fs from 'node:fs';
import * as path from 'node:path';
import pc from 'picocolors';

export async function manifestCommand(slug: string): Promise<void> {
  const cwd = process.cwd();
  const vibeDir = path.join(cwd, '.vibe');

  if (!fs.existsSync(vibeDir)) {
    console.log(pc.red('Error: .vibe/ folder not found. Run `vibescript init` first.'));
    process.exit(1);
  }

  const templatePath = path.join(vibeDir, 'templates/manifest.md.template');
  if (!fs.existsSync(templatePath)) {
    console.log(pc.red('Error: Manifest template not found at .vibe/templates/manifest.md.template'));
    process.exit(1);
  }

  const changesDir = path.join(vibeDir, 'changes');
  if (!fs.existsSync(changesDir)) {
    fs.mkdirSync(changesDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `${timestamp}-${slugify(slug)}.md`;
  const targetPath = path.join(changesDir, filename);

  if (fs.existsSync(targetPath)) {
    console.log(pc.red(`Error: Manifest already exists: ${targetPath}`));
    process.exit(1);
  }

  let template = fs.readFileSync(templatePath, 'utf-8');

  template = template
    .replace('{{SLUG}}', slug)
    .replace('{{DATE}}', new Date().toISOString().split('T')[0])
    .replace('{{TIMESTAMP}}', timestamp);

  fs.writeFileSync(targetPath, template);

  console.log(pc.bold(pc.green(`\n✓ Created manifest: ${targetPath}\n`)));
  console.log(pc.dim('Next steps:'));
  console.log(pc.dim('  1. Fill in the manifest sections'));
  console.log(pc.dim('  2. Commit the manifest with your changes'));
  console.log();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}
