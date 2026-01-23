# VibeScript Specification

Version 1.0.0

## Overview

VibeScript is a governance framework for AI-assisted coding. It constrains AI agents through directives, manifests, ownership rules, and compliance checks.

**Core Principle**: Only `.vibe.ts` files are governed. Existing `.ts` files remain untouched until explicitly migrated. (Because we're not monsters—you opt in to the bureaucracy.)

## Directive Grammar

Directives are declared in TypeScript comments at the top of `.vibe.ts` files:

```typescript
// @vibe:key value
```

### Rules

1. Directives must appear in single-line comments
2. The `@vibe:` prefix is required
3. Key is a single word (alphanumeric)
4. Value extends to end of line
5. Multiple values use comma separation

### Required Directives

Every `.vibe.ts` file MUST contain these directives:

| Directive | Purpose | Example |
|-----------|---------|---------|
| `goal` | What this code accomplishes | `// @vibe:goal Implement user authentication flow` |
| `touch` | Glob patterns of files this task may modify | `// @vibe:touch src/auth/**/*.ts, src/types/user.ts` |
| `inputs` | Required data, context, or dependencies | `// @vibe:inputs User credentials, session store` |
| `outputs` | What this code produces | `// @vibe:outputs Authenticated session token` |
| `constraints` | Limitations and requirements | `// @vibe:constraints Must not store plaintext passwords` |
| `tests` | How to verify correctness | `// @vibe:tests Run auth.test.ts, verify session creation` |
| `risk` | Risk level (low/medium/high) | `// @vibe:risk medium` |
| `rollback` | How to undo changes | `// @vibe:rollback Revert commit, clear session store` |
| `security` | Security implications and mitigations | `// @vibe:security Validates input, requires auth, rate-limited` |
| `performance` | Performance characteristics | `// @vibe:performance O(1) lookup, handles 10k req/sec` |
| `dependencies` | External services and libraries | `// @vibe:dependencies Redis 6.0+, PostgreSQL, auth-service v2.1+` |
| `observability` | Monitoring and debugging approach | `// @vibe:observability Logs errors, emits latency metrics` |
| `breaking` | Breaking changes or "none" | `// @vibe:breaking Renamed getUserById to getUser` |

### Optional Directives

| Directive | Purpose | Example |
|-----------|---------|---------|
| `allowHumanEdits` | Permits AI to edit human-owned files | `// @vibe:allowHumanEdits true` |
| `depends` | Other .vibe.ts files this depends on | `// @vibe:depends src/core/database.vibe.ts` |
| `deadline` | Target completion date | `// @vibe:deadline 2024-03-15` |

## Touch Semantics

The `@vibe:touch` directive declares which files the task is permitted to modify.

### Format

```typescript
// @vibe:touch pattern1, pattern2, pattern3
```

### Glob Patterns

- `*` matches any characters except `/`
- `**` matches any characters including `/`
- `?` matches a single character
- `[abc]` matches any character in brackets
- `{a,b}` matches either `a` or `b`

### Examples

```typescript
// @vibe:touch src/auth/*.ts                    // All .ts files in src/auth/
// @vibe:touch src/auth/**/*.ts                 // All .ts files recursively
// @vibe:touch src/auth/login.ts, src/types.ts  // Specific files
// @vibe:touch **/*.vibe.ts                     // All .vibe.ts files anywhere
```

### Enforcement

The vibe-checker validates that:

1. Every changed file matches at least one `@vibe:touch` pattern across all changed `.vibe.ts` files
2. If a file is changed but not declared, the check fails
3. No, claiming you "forgot" or "it was just a small refactor" will not bypass this rule

## Manifest Requirements

Change manifests document significant modifications for review and rollback.

### When Required

Manifests are required when modifying files matching `require_manifest_for_globs` in `ownership.json`.

Default: All `.vibe.ts` and `.lock.ts` files require manifests.

### Manifest Structure

```markdown
# Change Manifest: [slug]

Date: YYYY-MM-DD

## Summary

Brief description of the change.

## Changes

- File 1: What changed
- File 2: What changed

## Testing

How the change was tested.

## Rollback

Steps to undo the change.
```

### Location

Manifests are stored in `.vibe/changes/` with filename format:

```
YYYY-MM-DDTHH-MM-SS-slug.md
```

## File Ownership Categories

### AI-Owned (`*.vibe.ts`)

- AI may freely create, modify, delete
- Must follow directive requirements (no shortcuts)
- Must declare `@vibe:touch` patterns (yes, *all* of them)

### Human-Owned (`*.human.ts`)

- AI may only modify if file contains `// @vibe:allowHumanEdits true`
- Intended for human-curated code that AI should not "improve"
- Missing directive causes vibe-guard failure (this is not a suggestion)

### Contract-Owned (`*.lock.ts`)

- Critical interface/contract files
- AI may modify but MUST also modify corresponding tests
- No test change = vibe-guard failure

### Blocked

- Files matching `blocked_globs` cannot be modified
- Typically: `dist/`, `build/`, `node_modules/`, `.next/`

### Exempt Files

Files matching `guard_exempt_globs` or `touch_exempt_globs` bypass their respective checks.

**Guard Exempt** (`guard_exempt_globs`):
- Skip ownership classification entirely
- Useful for docs, config, markdown files
- Default: `.vibe/**`, `docs/**`, `*.md`, `*.json`, `*.yml`, `.github/**`

**Touch Exempt** (`touch_exempt_globs`):
- Don't require `@vibe:touch` declaration
- Same defaults as guard exempt

This prevents bureaucratic failures when editing README.md or tsconfig.json.

## Ownership Configuration

The `ownership.json` file controls all governance behavior:

```json
{
  "ai_owned_globs": ["**/*.vibe.ts"],
  "human_owned_globs": ["**/*.human.ts"],
  "contract_owned_globs": ["**/*.lock.ts"],
  "blocked_globs": ["**/dist/**", "**/node_modules/**"],
  "require_manifest_for_globs": ["**/*.lock.ts"],
  "require_touch_enforcement": true,
  "touch_exempt_globs": ["docs/**", "*.md", "*.json"],
  "guard_exempt_globs": ["docs/**", "*.md", "*.json", ".github/**"]
}
```

## Checker Enforcement

The vibe-checker runs on every commit/PR and validates:

1. **Directive Completeness**: All required directives present
2. **Touch Coverage**: All changed files match declared touch patterns
3. **Risk Assessment**: Risk level is valid (low/medium/high)

### Exit Codes

- `0`: All checks passed
- `1`: One or more violations

### Report

Violations are written to `.vibe/reports/vibe-check.txt`

## Guard Enforcement

The vibe-guard validates ownership rules:

1. **Blocked Files**: No changes to blocked paths
2. **Ownership Coverage**: All files match an ownership glob
3. **Human-Owned Protection**: Require `@vibe:allowHumanEdits`
4. **Contract Protection**: Require accompanying test changes
5. **Manifest Requirement**: Required files need change manifest

### Exit Codes

- `0`: All checks passed
- `1`: One or more violations

### Report

Violations are written to `.vibe/reports/vibe-guard.txt`

## Compliance Workflow

1. Create/modify `.vibe.ts` file with complete directives
2. Declare all files to be touched in `@vibe:touch`
3. Create change manifest if required
4. Make code changes
5. Run `pnpm vibe:check` to validate directives
6. Run `pnpm vibe:guard` to validate ownership
7. Commit when all checks pass

## Migration Path

Existing projects adopt VibeScript incrementally:

1. Run `vibescript init` to create `.vibe/` folder
2. Existing `.ts` files are NOT governed
3. New AI work goes in `.vibe.ts` files
4. Optionally rename files to adopt governance:
   - `foo.ts` → `foo.vibe.ts` (AI-owned)
   - `foo.ts` → `foo.human.ts` (human-owned)
   - `foo.ts` → `foo.lock.ts` (contract-owned)
