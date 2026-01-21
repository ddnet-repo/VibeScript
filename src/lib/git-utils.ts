import { execSync } from 'node:child_process';

export function getBaseRef(): string {
  // Priority 1: Environment variable
  if (process.env.VIBE_BASE_REF) {
    return process.env.VIBE_BASE_REF;
  }

  // Priority 2: origin/main if it exists
  try {
    execSync('git rev-parse --verify origin/main', { stdio: 'pipe' });
    return 'origin/main';
  } catch {
    // origin/main doesn't exist
  }

  // Priority 3: origin/master if it exists
  try {
    execSync('git rev-parse --verify origin/master', { stdio: 'pipe' });
    return 'origin/master';
  } catch {
    // origin/master doesn't exist
  }

  // Fallback: HEAD~1
  return 'HEAD~1';
}

export function getChangedFiles(baseRef: string): string[] {
  try {
    // Try three-dot diff first (for branch comparison)
    const output = execSync(`git diff --name-only ${baseRef}...HEAD`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return output.trim().split('\n').filter(Boolean);
  } catch {
    // Fallback to two-dot diff
    try {
      const output = execSync(`git diff --name-only ${baseRef} HEAD`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      return output.trim().split('\n').filter(Boolean);
    } catch {
      // Last resort: staged + unstaged changes
      const output = execSync('git diff --name-only HEAD', {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      return output.trim().split('\n').filter(Boolean);
    }
  }
}

export function getStagedFiles(): string[] {
  try {
    const output = execSync('git diff --name-only --cached', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return output.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

export function isGitRepo(): boolean {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

export function getCurrentBranch(): string | null {
  try {
    return execSync('git branch --show-current', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

export function getRepoRoot(): string | null {
  try {
    return execSync('git rev-parse --show-toplevel', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}
