import * as fs from 'node:fs';
import * as path from 'node:path';
import pc from 'picocolors';

interface InitOptions {
  husky?: boolean;
  github?: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
  const cwd = process.cwd();
  const packageRoot = path.resolve(import.meta.dirname, '../../..');

  console.log(pc.bold(pc.cyan('\n🎸 Initializing VibeScript governance...\n')));

  // 1. Copy .vibe/ folder
  const vibeSource = path.join(packageRoot, 'templates/vibe');
  const vibeTarget = path.join(cwd, '.vibe');

  if (fs.existsSync(vibeTarget)) {
    console.log(pc.yellow('  ⚠ .vibe/ folder already exists, skipping...'));
  } else {
    copyDirRecursive(vibeSource, vibeTarget);
    console.log(pc.green('  ✓ Created .vibe/ governance folder'));
  }

  // 2. Copy scripts to scripts/ folder
  const scriptsTarget = path.join(cwd, 'scripts');
  ensureDir(scriptsTarget);

  const scriptFiles = [
    { src: 'lib/vibe-checker.ts', dest: 'vibe-checker.ts' },
    { src: 'lib/vibe-guard.ts', dest: 'vibe-guard.ts' },
    { src: 'lib/vibe-manifest.ts', dest: 'vibe-manifest.ts' },
  ];

  for (const script of scriptFiles) {
    const srcPath = path.join(packageRoot, 'dist', script.src.replace('.ts', '.js'));
    const destPath = path.join(scriptsTarget, script.dest.replace('.ts', '.js'));

    // For init, we'll create wrapper scripts that call the library
    const wrapperContent = createScriptWrapper(script.src);
    fs.writeFileSync(path.join(scriptsTarget, script.dest), wrapperContent);
  }
  console.log(pc.green('  ✓ Created scripts/ with vibe utilities'));

  // 3. Update package.json
  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    pkg.scripts = pkg.scripts || {};
    pkg.scripts['vibe:check'] = 'vibescript check';  // Runs guard + checker
    pkg.scripts['vibe:guard'] = 'vibescript guard';  // Ownership only
    pkg.scripts['vibe:task'] = 'vibescript task';
    pkg.scripts['vibe:manifest'] = 'vibescript manifest';

    pkg.devDependencies = pkg.devDependencies || {};
    if (!pkg.devDependencies['typescript']) {
      pkg.devDependencies['typescript'] = '^5.3.0';
    }
    if (!pkg.devDependencies['ts-node']) {
      pkg.devDependencies['ts-node'] = '^10.9.0';
    }
    if (!pkg.devDependencies['vitest']) {
      pkg.devDependencies['vitest'] = '^1.0.0';
    }

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(pc.green('  ✓ Updated package.json with vibe scripts'));
  } else {
    console.log(pc.yellow('  ⚠ No package.json found, skipping script injection'));
  }

  // 4. GitHub Action
  if (options.github !== false) {
    const workflowSource = path.join(packageRoot, 'templates/github/workflows/vibe.yml');
    const workflowTarget = path.join(cwd, '.github/workflows/vibe.yml');

    if (fs.existsSync(workflowSource)) {
      ensureDir(path.dirname(workflowTarget));
      fs.copyFileSync(workflowSource, workflowTarget);
      console.log(pc.green('  ✓ Added GitHub Action workflow'));
    }
  }

  // 5. Husky hook
  if (options.husky !== false) {
    const huskyDir = path.join(cwd, '.husky');
    if (fs.existsSync(huskyDir)) {
      const hookSource = path.join(packageRoot, 'templates/husky/pre-commit');
      const hookTarget = path.join(huskyDir, 'pre-commit');

      if (fs.existsSync(hookSource)) {
        fs.copyFileSync(hookSource, hookTarget);
        fs.chmodSync(hookTarget, '755');
        console.log(pc.green('  ✓ Added Husky pre-commit hook'));
      }
    } else {
      console.log(pc.dim('  ○ Husky not detected, skipping hook'));
    }
  }

  // 6. Create docs entry
  const docsTarget = path.join(cwd, 'docs');
  if (!fs.existsSync(docsTarget)) {
    ensureDir(docsTarget);
  }

  const vibeDocsPath = path.join(docsTarget, 'vibescript.md');
  if (!fs.existsSync(vibeDocsPath)) {
    const docsContent = `# VibeScript Governance

This project uses VibeScript for AI-assisted coding governance.

## Quick Reference

- \`.vibe/\` - Governance configuration folder
- \`.vibe/spec.md\` - VibeScript specification
- \`.vibe/claude.instructions.md\` - Claude operating instructions
- \`.vibe/ownership.json\` - File ownership rules

## Commands

\`\`\`bash
pnpm vibe:check    # Run compliance checks
pnpm vibe:guard    # Run ownership validation
pnpm vibe:manifest # Create change manifest
\`\`\`

## File Conventions

- \`*.vibe.ts\` - AI-owned files (freely modifiable by AI)
- \`*.human.ts\` - Human-owned files (require @vibe:allowHumanEdits)
- \`*.lock.ts\` - Contract files (require test changes)

See \`.vibe/spec.md\` for complete documentation.
`;
    fs.writeFileSync(vibeDocsPath, docsContent);
    console.log(pc.green('  ✓ Created docs/vibescript.md'));
  }

  console.log(pc.bold(pc.green('\n✓ VibeScript initialized successfully!\n')));
  console.log(pc.dim('Next steps:'));
  console.log(pc.dim('  1. Review .vibe/spec.md for the VibeScript specification'));
  console.log(pc.dim('  2. Review .vibe/ownership.json to configure ownership rules'));
  console.log(pc.dim('  3. Run `pnpm vibescript task "my first task"` to create a .vibe.ts file'));
  console.log();
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyDirRecursive(src: string, dest: string): void {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function createScriptWrapper(scriptName: string): string {
  const name = path.basename(scriptName, '.ts');
  return `#!/usr/bin/env node
// Auto-generated VibeScript wrapper
// Run with: npx ts-node scripts/${name}.ts

import { run${toPascalCase(name)} } from '@ddnet-repo/vibescript';

run${toPascalCase(name)}().then(code => process.exit(code));
`;
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
