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

I built VibeScript after Claude Code "helpfully" refactored 40 files when I asked it to fix a 3-line bug. It was very confident this was an improvement. My CI/CD pipeline was very confident it was not.

The problem: you can't just tell an AI to behave. Instructions get ignored, forgotten, or overridden by the AI's deep-seated belief that it knows your codebase better than you do (spoiler: it doesn't).

The solution: hard gates. The same way we don't trust developers to manually follow style guides (we use linters), we shouldn't trust AI to follow instructions (we use enforcement). If we've learned anything from the last 50 years of software engineering, it's that humans are bad at following rules. AI is humans, but faster and more confident.

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

Yes. That's the point. Bureaucracy exists because "trust me bro" doesn't scale. Turns out, "trust the AI bro" scales even worse. We tried vibe-based development and got 2000-line PRs that "improve code consistency."

**"Why not just review PRs carefully?"**

Have you tried reviewing a 2,000 line AI-generated PR? It's like playing "spot the actual bug fix" but the AI rewrote your entire type system for "type safety" and you have a standup in 10 minutes.

**"Couldn't you just prompt better?"**

"Please don't break production" is apparently not a clear enough prompt. Prompting is instruction. This is enforcement. Different tools for different problems. One makes suggestions, the other physically blocks your code from shipping.

**"This only works for TypeScript"**

Correct. I built what I needed. PRs welcome for other languages.

**"The AI will just lie in its declarations"**

The checker validates declarations against the actual git diff. You can lie in the paperwork, but the audit catches you. It's like taxes for code—the AI can *say* it only touched one file, but git knows the truth.

**"Seems like overhead"**

Less overhead than untangling a 50-file "improvement" the AI made without asking. Less overhead than explaining to your manager why the AI decided to migrate your database schema while fixing a typo. Sometimes the real overhead is the unsupervised refactoring we made along the way.
