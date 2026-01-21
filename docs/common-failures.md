# Common VibeScript Failures and Fixes

This guide covers the most frequent vibe-checker and vibe-guard failures and how to resolve them.

## Vibe-Checker Failures

### MISSING_DIRECTIVE

**Error:**
```
[MISSING_DIRECTIVE] src/feature.vibe.ts
  → Missing required directives: goal, touch, risk
```

**Cause:** The `.vibe.ts` file is missing one or more required directives.

**Fix:** Add the missing directives to the file header:

```typescript
// @vibe:goal Implement the feature
// @vibe:touch src/feature.vibe.ts
// @vibe:inputs None
// @vibe:outputs Feature functionality
// @vibe:constraints None
// @vibe:tests feature.test.ts
// @vibe:risk low
// @vibe:rollback Revert commit
```

All eight directives are required: `goal`, `touch`, `inputs`, `outputs`, `constraints`, `tests`, `risk`, `rollback`.

---

### UNDECLARED_TOUCH

**Error:**
```
[UNDECLARED_TOUCH] src/utils/helper.ts
  → File changed but not declared in any @vibe:touch directive
  Declared touch patterns: src/feature.vibe.ts
```

**Cause:** You modified a file that isn't declared in any `@vibe:touch` directive.

**Fix:** Add the file (or a matching glob) to your touch directive:

```typescript
// Before
// @vibe:touch src/feature.vibe.ts

// After
// @vibe:touch src/feature.vibe.ts, src/utils/helper.ts
```

Or use a glob pattern:
```typescript
// @vibe:touch src/feature.vibe.ts, src/utils/*.ts
```

---

### PARSE_ERROR

**Error:**
```
[PARSE_ERROR] src/feature.vibe.ts
  → Failed to parse file: Unexpected token
```

**Cause:** The file has a syntax error preventing directive parsing.

**Fix:** Check for:
- Malformed directive comments
- Invalid TypeScript syntax
- Encoding issues

Directives must be in this format:
```typescript
// @vibe:key value
```

---

### Invalid Risk Level

**Error:**
```
[MISSING_DIRECTIVE] src/feature.vibe.ts
  → Invalid risk level: moderate. Must be low, medium, or high.
```

**Cause:** The risk directive has an invalid value.

**Fix:** Use one of: `low`, `medium`, `high`

```typescript
// @vibe:risk medium
```

---

## Vibe-Guard Failures

### BLOCKED_FILE

**Error:**
```
[BLOCKED_FILE] dist/bundle.js
  → This file is in a blocked location and cannot be modified
  Matched blocked glob: **/dist/**
```

**Cause:** You modified a file in a blocked location (build artifacts, node_modules, etc.).

**Fix:**
- Don't modify files in blocked locations
- If you need to change build output, modify the source files instead
- If the glob is too restrictive, update `.vibe/ownership.json`

---

### UNOWNED_FILE

**Error:**
```
[UNOWNED_FILE] src/legacy/old-code.ts
  → File matches no ownership glob
```

**Cause:** The file doesn't match any ownership category (ai_owned, human_owned, contract_owned).

**Fix Options:**

1. **Rename the file** to match a category:
   - `old-code.vibe.ts` for AI ownership
   - `old-code.human.ts` for human ownership
   - `old-code.lock.ts` for contract ownership

2. **Expand ownership globs** in `.vibe/ownership.json`:
   ```json
   {
     "ai_owned_globs": [
       "**/*.vibe.ts",
       "src/legacy/**/*.ts"
     ]
   }
   ```

---

### HUMAN_OWNED_VIOLATION

**Error:**
```
[HUMAN_OWNED_VIOLATION] src/config/settings.human.ts
  → Human-owned file modified without @vibe:allowHumanEdits directive
```

**Cause:** You modified a human-owned file that doesn't permit AI edits.

**Fix Options:**

1. **Add the permission directive** to the file:
   ```typescript
   // @vibe:allowHumanEdits true

   export const settings = { ... };
   ```

2. **Have a human make the change** instead of AI.

3. **Reconsider ownership** - maybe this file should be AI-owned.

---

### CONTRACT_NO_TEST

**Error:**
```
[CONTRACT_NO_TEST] src/api/types.lock.ts
  → Contract-owned file changed without accompanying test changes
```

**Cause:** You modified a `.lock.ts` file but didn't modify any test files.

**Fix:** Add or modify a test file in the same commit:

- `*.test.ts`
- `*.spec.ts`
- Files in `__tests__/` directories

Contract files are critical interfaces, so test coverage is mandatory.

---

### MISSING_MANIFEST

**Error:**
```
[MISSING_MANIFEST] src/feature.vibe.ts
  → File requires a change manifest
```

**Cause:** You modified a file matching `require_manifest_for_globs` without creating a manifest.

**Fix:** Create a manifest before committing:

```bash
pnpm vibescript manifest "describe-your-change"
```

Then fill in the template at `.vibe/changes/`.

---

## CI/CD Failures

### GitHub Action Fails

**Symptoms:**
- vibe.yml workflow fails
- PR cannot merge

**Common Causes:**

1. **Missing VIBE_BASE_REF** - The workflow sets this automatically, but check the logs.

2. **Dependencies not installed** - Ensure `pnpm install` runs before checks.

3. **Fetch depth issue** - The workflow needs git history:
   ```yaml
   - uses: actions/checkout@v4
     with:
       fetch-depth: 0  # Full history needed
   ```

---

### Pre-commit Hook Fails

**Symptoms:**
- Commit rejected locally
- Error message about vibe check

**Fix:**
1. Run checks manually to see details:
   ```bash
   pnpm vibe:check
   pnpm vibe:guard
   ```

2. Fix the violations

3. Try committing again

**Bypass (not recommended):**
```bash
git commit --no-verify -m "message"
```

---

## Configuration Issues

### Doctor Reports Problems

Run the doctor to diagnose:
```bash
pnpm vibescript doctor
```

**Common Issues:**

| Issue | Fix |
|-------|-----|
| Missing .vibe folder | Run `vibescript init` |
| Missing ownership.json keys | Re-run `vibescript init` or add keys manually |
| Package.json scripts missing | Re-run `vibescript init` |
| Invalid JSON | Check for syntax errors in ownership.json |

---

### Ownership Globs Don't Match

**Symptoms:** Files unexpectedly unowned or in wrong category.

**Debug:**
1. Check glob syntax - VibeScript uses minimatch
2. Remember: `*` doesn't match `/`, use `**` for recursive
3. Test patterns:

```javascript
const { minimatch } = require('minimatch');
console.log(minimatch('src/deep/file.ts', 'src/**/*.ts')); // true
console.log(minimatch('src/deep/file.ts', 'src/*.ts'));    // false
```

---

## Quick Reference

| Error | Likely Fix |
|-------|-----------|
| MISSING_DIRECTIVE | Add missing directives to .vibe.ts |
| UNDECLARED_TOUCH | Add file to @vibe:touch |
| BLOCKED_FILE | Don't modify build artifacts |
| UNOWNED_FILE | Rename file or expand ownership globs |
| HUMAN_OWNED_VIOLATION | Add @vibe:allowHumanEdits or have human edit |
| CONTRACT_NO_TEST | Add/modify a test file |
| MISSING_MANIFEST | Run `vibescript manifest "slug"` |
