# CI/CD Setup for VibeScript

This guide covers enforcing VibeScript checks in your CI pipeline with GitHub Actions and branch protection.

## Why CI Enforcement Matters

LLMs don't "respect" rules through instruction alone. The only reliable enforcement is a hard gate that blocks merges when checks fail. This is how you make VibeScript governance non-optional.

## GitHub Actions Workflow

The workflow is automatically added by `vibescript init` at `.github/workflows/vibe.yml`.

### What It Does

1. Checks out code with full git history (required for diff comparison)
2. Installs dependencies
3. Sets `VIBE_BASE_REF` for proper diff comparison
4. Runs `pnpm vibe:check` (which runs guard + checker)
5. Uploads violation reports on failure

### Key Configuration

```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    fetch-depth: 0  # CRITICAL: Full history needed for git diff
```

Without `fetch-depth: 0`, git diff will fail or give wrong results.

### Base Ref Logic

```yaml
- name: Set base ref for comparison
  run: |
    if [ "${{ github.event_name }}" == "pull_request" ]; then
      echo "VIBE_BASE_REF=origin/${{ github.base_ref }}" >> $GITHUB_ENV
    else
      echo "VIBE_BASE_REF=HEAD~1" >> $GITHUB_ENV
    fi
```

- **Pull requests**: Compare against the target branch (usually `main`)
- **Direct pushes**: Compare against the previous commit

## Branch Protection Setup

This is the enforcement mechanism. Without it, PRs can merge even when checks fail.

### Step-by-Step Setup

1. Go to your repo on GitHub
2. Click **Settings** → **Branches**
3. Click **Add branch protection rule** (or edit existing)
4. Set **Branch name pattern** to `main` (or your default branch)

### Required Settings

Check these boxes:

- [x] **Require a pull request before merging**
  - Prevents direct pushes to main

- [x] **Require status checks to pass before merging**
  - Click **Search for status checks**
  - Select **Vibe Check** (the job name from vibe.yml)

- [x] **Require branches to be up to date before merging**
  - Ensures checks run against current main

### Recommended Settings

- [x] **Do not allow bypassing the above settings**
  - Even admins must pass checks

- [x] **Require linear history** (optional)
  - Forces rebase workflow, cleaner history

### What This Achieves

With branch protection enabled:

1. No one can push directly to main
2. All changes must go through PRs
3. PRs cannot merge until `vibe:check` passes
4. Even admins cannot bypass (if configured)

## Local Pre-commit Hook

The Husky hook provides local enforcement before code even reaches CI.

### How It Works

```bash
# .husky/pre-commit
pnpm vibe:check

if [ $? -ne 0 ]; then
  echo "❌ Vibe check failed. Fix violations before committing."
  exit 1
fi
```

### Bypass (When Absolutely Necessary)

```bash
git commit --no-verify -m "message"
```

Use sparingly. CI will still catch violations.

## Complete Enforcement Stack

For maximum governance:

| Layer | Tool | When | Bypass |
|-------|------|------|--------|
| Local | Husky pre-commit | Before commit | `--no-verify` |
| CI | GitHub Actions | On PR | None (if branch protection enabled) |
| Merge | Branch protection | Before merge | None (if bypass disabled) |

## Troubleshooting CI Failures

### "No changed files detected"

The diff comparison couldn't find changes. Check:
- `fetch-depth: 0` is set
- `VIBE_BASE_REF` is correct
- The PR actually has commits

### "Undeclared touch" for files you didn't change

Your PR includes changes from an outdated branch. Solution:
```bash
git fetch origin main
git rebase origin/main
```

### Workflow not appearing in status checks

- The workflow must run at least once before it appears
- Make sure the workflow file is on the default branch
- Check the workflow file for YAML syntax errors

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VIBE_BASE_REF` | Git ref to compare against | `origin/main` or `HEAD~1` |

Set in CI or locally:
```bash
VIBE_BASE_REF=origin/develop pnpm vibe:check
```

## Multiple Environments

For repos with multiple protected branches:

```yaml
on:
  pull_request:
    branches: [main, develop, staging]
```

Create separate branch protection rules for each.
