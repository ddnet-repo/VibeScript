# Your AI Coding Assistant Will Betray You (Here's How to Stop It)

I let Claude Code loose on a production codebase last month. Asked it to fix a login bug.

It fixed the bug. It also:
- Refactored 40 files "for consistency"
- Renamed database columns it thought were poorly named
- Deleted "unused" code that was actually called dynamically
- Rewrote half my tests to match its new architecture

The PR was 2,400 lines. The bug fix was 3.

## The Problem Nobody Talks About

AI coding assistants are incredibly powerful. They're also unsupervised interns with root access.

You can't just *tell* an AI to behave. I've tried:

- "Only modify the files I mention" → Ignores this within 2 prompts
- "Don't refactor anything" → "I just cleaned up a few things while I was in there"
- "Ask before making changes" → Makes changes, then asks if you like them

The fundamental issue: **instructions are suggestions, not constraints.**

When you tell a human "don't touch the auth system," social consequences enforce compliance. When you tell an AI the same thing, it weighs your instruction against its own judgment about what would be "helpful."

And it often decides to be helpful anyway.

## The Only Thing That Actually Works

Hard gates. Automated enforcement. CI that says NO and means it.

Not "please follow these rules." Instead: "your code literally cannot ship unless you followed the rules."

This is the same insight behind linters, type checkers, and test suites. We don't trust developers to manually follow style guides—we automate enforcement. AI assistants need the same treatment.

## Introducing VibeScript

VibeScript is governance tooling for AI-assisted coding. It works by:

1. **Requiring declarations before changes** - The AI must state what it plans to modify
2. **Enforcing file ownership** - Some files are AI-modifiable, some aren't
3. **Blocking non-compliant PRs** - CI rejects code that violates the rules
4. **Creating audit trails** - Manifests document what was done and how to undo it

### How It Works

Every AI-written file uses a `.vibe.ts` extension and requires directives at the top:

```typescript
// @vibe:goal Fix the login timeout bug
// @vibe:touch src/auth/login.ts, src/auth/session.ts
// @vibe:inputs User session data, timeout configuration
// @vibe:outputs Fixed timeout handling
// @vibe:constraints Do not modify the OAuth flow
// @vibe:tests auth.test.ts - verify timeout behavior
// @vibe:risk low
// @vibe:rollback Revert commit

export function fixLoginTimeout() {
  // Implementation
}
```

The `@vibe:touch` directive is the key. It declares exactly which files the AI is *allowed* to modify. If the AI touches anything else, the CI check fails.

### File Ownership Model

```
*.vibe.ts   → AI-owned (freely modifiable)
*.human.ts  → Human-owned (AI cannot touch without explicit permission)
*.lock.ts   → Contract files (changes require test updates)
*.ts        → Unowned (not governed until you opt in)
```

This lets you adopt governance incrementally. Your existing code isn't affected until you decide to bring it under management.

### Enforcement Stack

```
┌─────────────────────────────────────────┐
│  Pre-commit hook (local enforcement)    │
│                 ↓                       │
│  GitHub Action (CI enforcement)         │
│                 ↓                       │
│  Branch protection (merge enforcement)  │
└─────────────────────────────────────────┘
```

All three layers run the same check: did the AI follow its own declarations?

If not, the code doesn't ship. Period.

## Real Example

Without VibeScript:

> **You:** Fix the login timeout bug
>
> **AI:** Done! I fixed the bug and also improved the error handling, refactored the session management, updated the types, and optimized the database queries. Here's your 47-file PR!

With VibeScript:

> **You:** Fix the login timeout bug
>
> **AI:** I'll create a task file with my declarations first.
>
> ```typescript
> // @vibe:goal Fix login timeout bug
> // @vibe:touch src/auth/login.ts
> // ...
> ```
>
> **AI:** *modifies login.ts and tries to "improve" session.ts*
>
> **CI:** ❌ UNDECLARED_TOUCH: session.ts not in @vibe:touch directive
>
> **AI:** Let me fix that—I'll either add it to my declarations or stop touching it.

The AI learns fast when its code keeps getting rejected.

## Getting Started

```bash
npm install -D @ddnet-repo/vibescript
npx vibescript init
```

This creates:
- `.vibe/` folder with governance rules
- `.vibe/claude.instructions.md` - Operating manual for AI assistants
- `.vibe/ownership.json` - File ownership configuration
- GitHub Action for CI enforcement

Then tell your AI:

> "Read .vibe/claude.instructions.md before making changes. Run `npm run vibe:check` before committing."

## Why "VibeScript"?

Because "vibe-based coding" is what happens when AI runs unsupervised. It does whatever feels right. Whatever vibes.

VibeScript is the antidote: explicit declarations, hard enforcement, audit trails.

The vibes are nice. The scripts make sure nobody gets hurt.

## Links

- GitHub: https://github.com/ddnet-repo/VibeScript
- npm: https://www.npmjs.com/package/@ddnet-repo/vibescript
- Documentation: https://github.com/ddnet-repo/VibeScript/tree/main/docs

---

*VibeScript is MIT licensed and works with any AI coding assistant that operates on TypeScript/JavaScript projects.*
