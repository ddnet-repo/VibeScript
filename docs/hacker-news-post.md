# Hacker News Submission

## Title (80 char limit)
```
VibeScript: Governance tooling to stop AI coding assistants from going rogue
```

Alternative titles:
- `Show HN: VibeScript – Hard enforcement for AI-assisted coding`
- `Show HN: CI gates for AI coding assistants (because instructions don't work)`

---

## Post Text

I built VibeScript after Claude Code "helpfully" refactored 40 files when I asked it to fix a 3-line bug.

The problem: you can't just tell an AI to behave. Instructions get ignored, forgotten, or overridden by the AI's own judgment about what would be "helpful."

The solution: hard gates. The same way we don't trust developers to manually follow style guides (we use linters), we shouldn't trust AI to follow instructions (we use enforcement).

**How it works:**

1. AI-written files use `.vibe.ts` extension with required directives
2. `@vibe:touch` declares exactly which files the AI may modify
3. CI blocks PRs if the AI touched undeclared files
4. File ownership model: AI-owned, human-owned (protected), contract files (require tests)

```typescript
// @vibe:goal Fix login timeout
// @vibe:touch src/auth/login.ts
// @vibe:risk low
// @vibe:rollback Revert commit
```

If the AI touches `session.ts` without declaring it, CI fails. No arguing.

**Install:**
```
npm install -D @ddnet-repo/vibescript
npx vibescript init
```

GitHub: https://github.com/ddnet-repo/VibeScript

Feedback welcome—especially from teams actually using AI coding tools in production.

---

## Anticipated HN Comments & Responses

**"This is just bureaucracy for AI"**

Yes. That's the point. Bureaucracy exists because "trust me bro" doesn't scale. Same applies to AI.

**"Why not just review PRs carefully?"**

Have you tried reviewing a 2,000 line AI-generated PR? The AI doesn't highlight what it changed vs. what you asked for.

**"Couldn't you just prompt better?"**

Prompting is instruction. This is enforcement. Different tools for different problems.

**"This only works for TypeScript"**

Correct. I built what I needed. PRs welcome for other languages.

**"The AI will just lie in its declarations"**

The checker validates declarations against the actual git diff. You can lie in the paperwork, but the audit catches you.

**"Seems like overhead"**

Less overhead than untangling a 50-file "improvement" the AI made without asking.
