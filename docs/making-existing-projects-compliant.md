# Making Existing Projects VibeScript-Compliant

This guide explains how to adopt VibeScript governance in an existing TypeScript project.

## Key Principle: Gradual Adoption

VibeScript is designed for incremental adoption:

- **Existing `.ts` files are NOT governed** - They continue working normally
- **Only `.vibe.ts` files are governed** - New AI work goes here
- **Migration is optional** - Rename files only when beneficial

## Step 1: Initialize VibeScript

```bash
pnpm add -D @ddnet-repo/vibescript
pnpm vibescript init
```

This creates the `.vibe/` folder without changing any existing files.

## Step 2: Understand Ownership Categories

Review `.vibe/ownership.json`:

```json
{
  "ai_owned_globs": ["**/*.vibe.ts"],
  "human_owned_globs": ["**/*.human.ts"],
  "contract_owned_globs": ["**/*.lock.ts"],
  "blocked_globs": ["**/dist/**", "**/node_modules/**"]
}
```

By default:
- Only `.vibe.ts` files are AI-owned
- Your existing `.ts` files match no ownership glob (unowned = ignored)

## Step 3: Start New Work in .vibe.ts Files

For new AI-assisted features, create `.vibe.ts` files:

```bash
pnpm vibescript task "implement feature X"
```

Example structure:
```
src/
  auth/
    login.ts          # Existing code (untouched)
    session.ts        # Existing code (untouched)
    oauth.vibe.ts     # New AI work (governed)
```

## Step 4: Migrate Files When Ready

When you want to bring existing code under governance, rename it:

### To AI-Owned (for AI to freely modify)

```bash
mv src/utils/helpers.ts src/utils/helpers.vibe.ts
```

Then add directives to the top:
```typescript
// @vibe:goal Utility functions for string manipulation
// @vibe:touch src/utils/helpers.vibe.ts
// @vibe:inputs String values
// @vibe:outputs Transformed strings
// @vibe:constraints Must be pure functions
// @vibe:tests helpers.test.ts
// @vibe:risk low
// @vibe:rollback Revert commit

export function capitalize(s: string): string {
  // ...
}
```

### To Human-Owned (protected from AI)

```bash
mv src/config/secrets.ts src/config/secrets.human.ts
```

AI cannot modify this file unless it contains `// @vibe:allowHumanEdits true`.

### To Contract-Owned (requires test changes)

```bash
mv src/api/types.ts src/api/types.lock.ts
```

AI can modify this, but must also change a `.test.ts` or `.spec.ts` file.

## Step 5: Expand Ownership Globs (Optional)

If you want to govern more files without renaming, expand the globs:

```json
{
  "ai_owned_globs": [
    "**/*.vibe.ts",
    "src/features/**/*.ts"
  ],
  "human_owned_globs": [
    "**/*.human.ts",
    "src/config/**/*.ts"
  ]
}
```

Now all files in `src/features/` are AI-owned, and all in `src/config/` are human-owned.

## Migration Strategies

### Strategy A: Feature-by-Feature

1. Keep existing features as-is
2. New features go in `.vibe.ts` files
3. Migrate old features when they need updates

**Pros**: Minimal disruption, natural migration over time
**Cons**: Mixed file conventions during transition

### Strategy B: Module-by-Module

1. Pick one module to migrate completely
2. Rename all files to appropriate conventions
3. Add directives to all `.vibe.ts` files
4. Repeat for other modules

**Pros**: Clean module boundaries
**Cons**: More upfront work per module

### Strategy C: Glob Expansion

1. Add existing paths to ownership globs
2. No file renaming needed
3. Existing code becomes governed by category

**Pros**: Quickest to implement
**Cons**: Less explicit than naming conventions

## Handling Edge Cases

### File Imports After Renaming

TypeScript handles imports by path. Update imports after renaming:

```typescript
// Before
import { helper } from './utils/helpers';

// After
import { helper } from './utils/helpers.vibe';
```

Or use path mapping in `tsconfig.json` for aliases.

### Test Files

Test files (`*.test.ts`, `*.spec.ts`) are typically left ungoverned. They're checked when modifying `.lock.ts` files but don't need directives.

### Configuration Files

Config files should usually be human-owned:

```json
{
  "human_owned_globs": [
    "**/*.human.ts",
    "**/*.config.ts",
    "**/tsconfig.json",
    "**/.env*"
  ]
}
```

### Shared Types

Type definition files used across modules should typically be contract-owned:

```json
{
  "contract_owned_globs": [
    "**/*.lock.ts",
    "src/types/**/*.ts"
  ]
}
```

## Verification After Migration

Run the doctor to verify configuration:

```bash
pnpm vibescript doctor
```

Then run checks to ensure compliance:

```bash
pnpm vibe:check
pnpm vibe:guard
```

## Common Migration Mistakes

1. **Forgetting to add directives** after renaming to `.vibe.ts`
2. **Breaking imports** without updating references
3. **Making ownership globs too broad** (include/exclude carefully)
4. **Not updating tests** when migrating to `.lock.ts`

## Rollback

If migration causes issues:

1. Rename files back to `.ts`
2. Remove ownership glob expansions
3. Run `git checkout` on modified files

The `.vibe/` folder can remain for future adoption.
