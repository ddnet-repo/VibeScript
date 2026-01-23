# Claude Operating Instructions for VibeScript

This document defines the rules Claude Code must follow when working in a VibeScript-governed project.

**TL;DR**: You're a very smart AI, but you're also very enthusiastic about refactoring things that don't need refactoring. These rules exist to protect the codebase from your helpfulness.

## Core Rules

### 1. File Modification Rights

**AI-Owned Files (`*.vibe.ts`)**
- You MAY freely create, modify, and delete these files
- You MUST include all required directives in the header
- You MUST declare accurate `@vibe:touch` patterns

**Human-Owned Files (`*.human.ts`)**
- You MUST NOT modify unless the file contains `// @vibe:allowHumanEdits true`
- If you need to modify a human-owned file, ASK the user first
- If permitted, add the directive before making changes
- No, your "improvements" are not emergencies that bypass this rule

**Contract-Owned Files (`*.lock.ts`)**
- You MAY modify these files
- You MUST also modify corresponding test files (*.test.ts or *.spec.ts)
- Never change a .lock.ts file without updating tests

**Blocked Paths**
- You MUST NOT modify files in: `dist/`, `build/`, `node_modules/`, `.next/`
- These are build artifacts and dependencies

### 2. Directive Compliance

Before modifying any `.vibe.ts` file, ensure these directives are present:

```typescript
// @vibe:goal [What this accomplishes]
// @vibe:touch [Comma-separated glob patterns]
// @vibe:inputs [Required data/context]
// @vibe:outputs [What this produces]
// @vibe:constraints [Limitations]
// @vibe:tests [How to verify]
// @vibe:risk [low|medium|high]
// @vibe:rollback [How to undo]
```

### 3. Touch Declaration

You MUST declare all files you intend to modify in `@vibe:touch`:

```typescript
// @vibe:touch src/feature/*.ts, src/types/feature.ts
```

**Rules:**
- Be specific, not overly broad (no, `**/*` is not acceptable)
- Include test files if you'll modify them
- Include type files if you'll modify them
- The checker will fail if you modify undeclared files
- "I forgot" is not a valid CI failure message

### 4. Manifest Creation

When modifying files that require manifests (`.vibe.ts`, `.lock.ts`):

1. Create a manifest BEFORE making changes:
   ```bash
   pnpm vibescript manifest "brief-description"
   ```

2. Fill in all sections of the manifest

3. Commit the manifest WITH your changes

### 5. Verification Commands

**Always run before committing:**

```bash
pnpm vibe:check   # Validates directives and touch coverage
pnpm vibe:guard   # Validates ownership rules
```

If either command fails, FIX the violations before proceeding.

### 6. Uncertainty Protocol

If you are uncertain about:
- Which files to modify
- What the requirements mean
- How to implement something
- Whether you have permission

**STOP and write questions.** Do not guess. Do not proceed with assumptions. Do not "helpfully" decide what the user *probably* meant.

Format your questions clearly:
```
QUESTIONS BEFORE PROCEEDING:

1. Should I modify X or Y?
2. What is the expected behavior for edge case Z?
3. Do I have permission to change file A?
```

The user would much rather answer three questions than untangle a 40-file refactor you did on a hunch.

### 7. Risk Assessment

Assess risk level honestly:

- **low**: Isolated changes, easy rollback, minimal blast radius
- **medium**: Multiple files, moderate complexity, some dependencies
- **high**: Core systems, many dependencies, difficult rollback

### 8. Rollback Planning

Every change needs a rollback strategy. Common patterns:

```typescript
// @vibe:rollback Revert commit [hash]
// @vibe:rollback Delete [file], restore from backup
// @vibe:rollback Run migration down script
// @vibe:rollback Restore database from snapshot
```

## Workflow Summary

1. **Plan**: Identify files to modify, assess risk
2. **Declare**: Write directives with accurate touch patterns
3. **Manifest**: Create change manifest if required
4. **Implement**: Make the code changes
5. **Verify**: Run vibe:check and vibe:guard
6. **Fix**: Address any violations
7. **Commit**: Only when all checks pass

## Prohibited Actions

- ❌ Modifying human-owned files without permission
- ❌ Changing contract files without test updates
- ❌ Touching blocked paths (node_modules is not your personal playground)
- ❌ Omitting required directives (paperwork is not optional)
- ❌ Modifying files not declared in @vibe:touch
- ❌ Skipping verification commands (they're called "verification" for a reason)
- ❌ Committing when checks fail (red is bad, green is good)
- ❌ Guessing when uncertain (your confidence level does not bypass the rules)
- ❌ "Improving" code nobody asked you to improve

## Getting Help

If the rules are unclear or conflict with the user's request:

1. State which rule applies
2. Explain the conflict
3. Ask for clarification or override permission

Example:
```
The file `config.human.ts` is human-owned and doesn't have
@vibe:allowHumanEdits. VibeScript rules prevent me from modifying it.

Options:
1. Add the directive to allow AI edits
2. Have a human make this change
3. Override the rule (explain why)

Which would you prefer?
```
