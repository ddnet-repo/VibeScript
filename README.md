# VibeScript

**Governance tooling for AI-assisted coding.**

Put guardrails on Claude, Copilot, and other AI coding assistants so they can't go rogue in your codebase.

---

## The Problem

AI coding assistants are powerful but chaotic. Without constraints, they will:

- Modify files they shouldn't touch
- Refactor code nobody asked them to refactor
- Make sweeping changes without documenting what they did
- Break things in ways that are hard to trace back

You can't just *tell* an AI to behave. Instructions get ignored, forgotten, or misinterpreted. The only reliable way to constrain AI behavior is with **hard enforcement**: automated checks that block bad changes before they ship.

## The Solution

VibeScript creates a governance layer that:

1. **Defines ownership** - Which files can AI modify freely? Which require human approval? Which are off-limits?

2. **Requires declarations** - Before AI touches code, it must declare what it plans to modify and why

3. **Enforces compliance** - Automated checks in CI that block PRs if the AI violated the rules

4. **Creates audit trails** - Change manifests document what was done and how to undo it

**The key insight**: You don't convince an AI to follow rules. You trap it in a workflow where the only way forward is to pass the gates.

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  AI writes code in .vibe.ts files with required directives  │
│                            ↓                                │
│  vibe:check validates directives and file permissions       │
│                            ↓                                │
│  vibe:guard validates ownership rules and manifests         │
│                            ↓                                │
│  CI blocks merge if any check fails                         │
│                            ↓                                │
│  Code ships only when compliant                             │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

**Step 1**: Install VibeScript in your project

```bash
pnpm add -D @ddnet-repo/vibescript
pnpm vibescript init
```

**Step 2**: Tell your AI to read the rules

When starting a coding session with Claude Code or similar, say:

> "Before making any changes, read `.vibe/claude.instructions.md` and `.vibe/spec.md`. Follow the VibeScript governance rules. Run `pnpm vibe:check` before committing."

**Step 3**: Enable branch protection in GitHub

Go to Settings → Branches → Add rule for `main`:
- Require status checks to pass
- Select "Vibe Check" as required

Now the AI physically cannot merge code that violates the rules.

## What Gets Created

After running `vibescript init`:

```
.vibe/
  spec.md                 # The rules (AI reads this)
  claude.instructions.md  # Operating manual for Claude
  ownership.json          # Which files AI can touch
  templates/              # File templates
  reports/                # Violation reports
  changes/                # Change manifests

.github/workflows/
  vibe.yml                # CI enforcement
```

## File Ownership Model

| Extension | Who Owns It | AI Rights |
|-----------|-------------|-----------|
| `*.vibe.ts` | AI-owned | Freely create, modify, delete |
| `*.human.ts` | Human-owned | Cannot modify without explicit permission |
| `*.lock.ts` | Contract files | Must include test changes |
| `*.ts` | Unowned | Not governed (gradual adoption) |

**You choose what to govern.** Existing code isn't affected until you opt in by renaming files or configuring ownership globs.

## The Directive System

Every `.vibe.ts` file must declare its intent:

```typescript
// @vibe:goal What this code accomplishes
// @vibe:touch src/auth/**/*.ts, src/types/user.ts
// @vibe:inputs What data/context is needed
// @vibe:outputs What this produces
// @vibe:constraints Limitations and requirements
// @vibe:tests How to verify correctness
// @vibe:risk low|medium|high
// @vibe:rollback How to undo changes

export function myFeature() {
  // Implementation
}
```

The `@vibe:touch` directive is critical: it declares which files the AI is *allowed* to modify. If the AI touches files not in this list, the check fails.

## Enforcement Layers

| Layer | When | What It Catches |
|-------|------|-----------------|
| Pre-commit hook | Before commit | Immediate local feedback |
| GitHub Action | On PR | Blocks merge until fixed |
| Branch protection | On merge | Final gate, no bypass |

All three layers run `pnpm vibe:check`, which:
1. Validates ownership rules (vibe-guard)
2. Validates directives and touch coverage (vibe-checker)

## CLI Commands

```bash
vibescript init          # Set up governance in your project
vibescript task "desc"   # Create a new .vibe.ts file with directives
vibescript manifest "x"  # Create a change manifest
vibescript doctor        # Diagnose configuration issues
vibescript check         # Run all compliance checks
```

## Documentation

- [Quickstart Guide](docs/quickstart.md) - Get running in 5 minutes
- [CI/CD Setup](docs/ci-setup.md) - GitHub Actions and branch protection
- [Authoring Vibe Files](docs/authoring-vibe-files.md) - Writing good directives
- [Migration Guide](docs/making-existing-projects-compliant.md) - Adding to existing projects
- [Common Failures](docs/common-failures.md) - Troubleshooting

## Why "VibeScript"?

Because "vibe-based coding" is what happens when AI runs unsupervised. This is the antidote: explicit declarations, hard enforcement, and audit trails.

The vibes are nice. The scripts make sure nobody gets hurt.

## License

MIT

## Author

burtbyproxy <steve@datadigital.net>
