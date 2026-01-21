# VibeScript Quickstart

Get up and running with VibeScript governance in minutes.

## Installation

```bash
pnpm add -D @ddnet-repo/vibescript
```

Or run without installing:

```bash
pnpm dlx @ddnet-repo/vibescript init
```

## Initialize Your Project

```bash
pnpm vibescript init
```

This creates:
- `.vibe/` - Governance configuration folder
- `.vibe/spec.md` - VibeScript specification
- `.vibe/claude.instructions.md` - AI operating instructions
- `.vibe/ownership.json` - File ownership rules
- `.github/workflows/vibe.yml` - CI workflow
- Package.json scripts for running checks

## Run Your First Check

```bash
pnpm vibe:check
```

If there are no `.vibe.ts` files changed, the check passes automatically.

## Create Your First .vibe.ts File

```bash
pnpm vibescript task "implement user login"
```

This creates a new file with the directive template. Fill in the prompts:

```
Goal: Implement user authentication
Touch globs: src/auth/*.ts, src/types/user.ts
Inputs: User credentials
Outputs: Session token
Constraints: No plaintext passwords
Tests: auth.test.ts
Risk: medium
Rollback: Revert commit
```

## Understanding Directives

Every `.vibe.ts` file needs these directives at the top:

```typescript
// @vibe:goal What this code accomplishes
// @vibe:touch src/auth/*.ts, src/types.ts
// @vibe:inputs What data/context is needed
// @vibe:outputs What this produces
// @vibe:constraints Limitations and requirements
// @vibe:tests How to verify correctness
// @vibe:risk low
// @vibe:rollback How to undo changes

export function myFeature() {
  // Implementation
}
```

## The Touch Directive

`@vibe:touch` declares which files your task may modify:

```typescript
// @vibe:touch src/auth/**/*.ts    // All .ts files in auth recursively
// @vibe:touch src/auth/login.ts   // Specific file
// @vibe:touch **/*.vibe.ts        // All .vibe.ts files anywhere
```

The vibe-checker ensures every changed file matches a declared pattern.

## Running Checks

```bash
# Validate directives and touch coverage
pnpm vibe:check

# Validate ownership rules
pnpm vibe:guard

# Check manifest status
pnpm vibe:manifest
```

## Creating Change Manifests

When modifying governed files, create a manifest:

```bash
pnpm vibescript manifest "add-user-auth"
```

Fill in the template at `.vibe/changes/YYYY-MM-DDTHH-MM-SS-add-user-auth.md`.

## Diagnosing Issues

```bash
pnpm vibescript doctor
```

This checks:
- Required files exist
- Package.json scripts configured
- Ownership.json valid
- GitHub workflow present

## Next Steps

1. Read `.vibe/spec.md` for the complete specification
2. Review `.vibe/ownership.json` to customize ownership rules
3. See [Authoring Vibe Files](authoring-vibe-files.md) for best practices
4. Check [Common Failures](common-failures.md) for troubleshooting
