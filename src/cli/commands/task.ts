import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';
import pc from 'picocolors';

interface TaskOptions {
  dir: string;
}

export async function taskCommand(description: string, options: TaskOptions): Promise<void> {
  const cwd = process.cwd();
  const vibeDir = path.join(cwd, '.vibe');

  if (!fs.existsSync(vibeDir)) {
    console.log(pc.red('Error: .vibe/ folder not found. Run `vibescript init` first.'));
    process.exit(1);
  }

  const templatePath = path.join(vibeDir, 'templates/task.vibe.ts.template');
  if (!fs.existsSync(templatePath)) {
    console.log(pc.red('Error: Task template not found at .vibe/templates/task.vibe.ts.template'));
    process.exit(1);
  }

  const slug = slugify(description);
  const targetDir = path.join(cwd, options.dir);
  const targetFile = path.join(targetDir, `${slug}.vibe.ts`);

  if (fs.existsSync(targetFile)) {
    console.log(pc.red(`Error: File already exists: ${targetFile}`));
    process.exit(1);
  }

  console.log(pc.bold(pc.cyan('\n🎸 Creating new VibeScript task...\n')));
  console.log(pc.dim(`Description: ${description}`));
  console.log(pc.dim(`Target: ${targetFile}\n`));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (question: string, defaultValue = ''): Promise<string> => {
    return new Promise((resolve) => {
      const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
      rl.question(prompt, (answer) => {
        resolve(answer || defaultValue);
      });
    });
  };

  try {
    const goal = await ask('Goal (what does this task accomplish?)', description);
    const touch = await ask('Touch globs (comma-separated file patterns)', `${options.dir}/${slug}.vibe.ts`);
    const inputs = await ask('Inputs (what data/context is needed?)', 'none');
    const outputs = await ask('Outputs (what does this produce?)', 'none');
    const constraints = await ask('Constraints (limitations/requirements)', 'none');
    const tests = await ask('Tests (how to verify?)', 'manual verification');
    const risk = await ask('Risk level (low/medium/high)', 'low');
    const rollback = await ask('Rollback strategy', 'revert commit');
    const security = await ask('Security (implications and mitigations)', 'none');
    const performance = await ask('Performance (characteristics)', 'acceptable for expected load');
    const dependencies = await ask('Dependencies (external services/libraries)', 'none');
    const observability = await ask('Observability (monitoring/debugging)', 'standard application logging');
    const breaking = await ask('Breaking changes', 'none');

    rl.close();

    let template = fs.readFileSync(templatePath, 'utf-8');

    template = template
      .replace('{{GOAL}}', goal)
      .replace('{{TOUCH}}', touch)
      .replace('{{INPUTS}}', inputs)
      .replace('{{OUTPUTS}}', outputs)
      .replace('{{CONSTRAINTS}}', constraints)
      .replace('{{TESTS}}', tests)
      .replace('{{RISK}}', risk)
      .replace('{{ROLLBACK}}', rollback)
      .replace('{{SECURITY}}', security)
      .replace('{{PERFORMANCE}}', performance)
      .replace('{{DEPENDENCIES}}', dependencies)
      .replace('{{OBSERVABILITY}}', observability)
      .replace('{{BREAKING}}', breaking)
      .replace('{{FUNCTION_NAME}}', toCamelCase(slug))
      .replace('{{DATE}}', new Date().toISOString().split('T')[0]);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetFile, template);

    console.log(pc.bold(pc.green(`\n✓ Created ${targetFile}\n`)));
    console.log(pc.dim('Next steps:'));
    console.log(pc.dim('  1. Implement the task function'));
    console.log(pc.dim('  2. Run `pnpm vibe:check` to validate'));
    console.log();
  } catch (err) {
    rl.close();
    throw err;
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

function toCamelCase(str: string): string {
  return str
    .split('-')
    .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('');
}
