import * as fs from 'node:fs';
import * as path from 'node:path';
import pc from 'picocolors';

interface DiagnosticResult {
  check: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

export async function doctorCommand(): Promise<void> {
  const cwd = process.cwd();
  const results: DiagnosticResult[] = [];

  console.log(pc.bold(pc.cyan('\n🔍 VibeScript Doctor - Diagnosing configuration...\n')));

  // Check .vibe folder exists
  const vibeDir = path.join(cwd, '.vibe');
  if (fs.existsSync(vibeDir)) {
    results.push({ check: '.vibe folder', status: 'pass', message: 'Found' });
  } else {
    results.push({ check: '.vibe folder', status: 'fail', message: 'Missing - run `vibescript init`' });
  }

  // Check required .vibe files
  const requiredVibeFiles = [
    'spec.md',
    'claude.instructions.md',
    'ownership.json',
    'templates/task.vibe.ts.template',
    'templates/manifest.md.template',
  ];

  for (const file of requiredVibeFiles) {
    const filePath = path.join(vibeDir, file);
    if (fs.existsSync(filePath)) {
      results.push({ check: `.vibe/${file}`, status: 'pass', message: 'Found' });
    } else {
      results.push({ check: `.vibe/${file}`, status: 'fail', message: 'Missing' });
    }
  }

  // Check .vibe directories
  const requiredVibeDirs = ['reports', 'changes'];
  for (const dir of requiredVibeDirs) {
    const dirPath = path.join(vibeDir, dir);
    if (fs.existsSync(dirPath)) {
      results.push({ check: `.vibe/${dir}/`, status: 'pass', message: 'Found' });
    } else {
      results.push({ check: `.vibe/${dir}/`, status: 'warn', message: 'Missing - will be created on first use' });
    }
  }

  // Check package.json scripts
  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const requiredScripts = ['vibe:check', 'vibe:guard', 'vibe:manifest'];

    for (const script of requiredScripts) {
      if (pkg.scripts?.[script]) {
        results.push({ check: `package.json script: ${script}`, status: 'pass', message: pkg.scripts[script] });
      } else {
        results.push({ check: `package.json script: ${script}`, status: 'fail', message: 'Missing' });
      }
    }

    // Check devDependencies
    const requiredDeps = ['typescript', 'ts-node', 'vitest'];
    for (const dep of requiredDeps) {
      if (pkg.devDependencies?.[dep] || pkg.dependencies?.[dep]) {
        results.push({ check: `dependency: ${dep}`, status: 'pass', message: pkg.devDependencies?.[dep] || pkg.dependencies?.[dep] });
      } else {
        results.push({ check: `dependency: ${dep}`, status: 'warn', message: 'Not installed' });
      }
    }
  } else {
    results.push({ check: 'package.json', status: 'fail', message: 'Not found' });
  }

  // Check ownership.json validity
  const ownershipPath = path.join(vibeDir, 'ownership.json');
  if (fs.existsSync(ownershipPath)) {
    try {
      const ownership = JSON.parse(fs.readFileSync(ownershipPath, 'utf-8'));
      const requiredKeys = [
        'ai_owned_globs',
        'human_owned_globs',
        'contract_owned_globs',
        'blocked_globs',
        'require_manifest_for_globs',
        'require_touch_enforcement',
      ];

      for (const key of requiredKeys) {
        if (key in ownership) {
          results.push({ check: `ownership.json: ${key}`, status: 'pass', message: 'Defined' });
        } else {
          results.push({ check: `ownership.json: ${key}`, status: 'fail', message: 'Missing key' });
        }
      }
    } catch (e) {
      results.push({ check: 'ownership.json', status: 'fail', message: 'Invalid JSON' });
    }
  }

  // Check GitHub workflow
  const workflowPath = path.join(cwd, '.github/workflows/vibe.yml');
  if (fs.existsSync(workflowPath)) {
    results.push({ check: 'GitHub workflow', status: 'pass', message: 'Found at .github/workflows/vibe.yml' });
  } else {
    results.push({ check: 'GitHub workflow', status: 'warn', message: 'Not found - CI will not run vibe checks' });
  }

  // Check Husky hook
  const huskyHookPath = path.join(cwd, '.husky/pre-commit');
  if (fs.existsSync(huskyHookPath)) {
    const hookContent = fs.readFileSync(huskyHookPath, 'utf-8');
    if (hookContent.includes('vibe:check') || hookContent.includes('vibescript')) {
      results.push({ check: 'Husky pre-commit', status: 'pass', message: 'Found with vibe check' });
    } else {
      results.push({ check: 'Husky pre-commit', status: 'warn', message: 'Found but no vibe check configured' });
    }
  } else {
    results.push({ check: 'Husky pre-commit', status: 'warn', message: 'Not found' });
  }

  // Print results
  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const warnCount = results.filter(r => r.status === 'warn').length;

  for (const result of results) {
    const icon = result.status === 'pass' ? pc.green('✓') : result.status === 'fail' ? pc.red('✗') : pc.yellow('⚠');
    const statusColor = result.status === 'pass' ? pc.green : result.status === 'fail' ? pc.red : pc.yellow;
    console.log(`  ${icon} ${pc.bold(result.check)}: ${statusColor(result.message)}`);
  }

  console.log();
  console.log(pc.bold('Summary:'));
  console.log(`  ${pc.green(`${passCount} passed`)} | ${pc.red(`${failCount} failed`)} | ${pc.yellow(`${warnCount} warnings`)}`);
  console.log();

  if (failCount > 0) {
    console.log(pc.red('Some checks failed. Run `vibescript init` to fix missing configuration.'));
    process.exit(1);
  } else if (warnCount > 0) {
    console.log(pc.yellow('Some warnings detected. Review and address as needed.'));
  } else {
    console.log(pc.green('All checks passed! VibeScript is properly configured.'));
  }
  console.log();
}
