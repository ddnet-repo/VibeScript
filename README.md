# VibeScript

**Governance tooling for AI-assisted coding in TypeScript/JavaScript projects.**

Put guardrails on Claude, Copilot, and other AI coding assistants so they can't go rogue in your codebase.

> *"Move fast and break things" is great until the AI takes it literally and breaks production. Again.*

> **Language Support**: VibeScript is designed for **TypeScript and JavaScript** projects using Node.js. The governance files use `.vibe.ts` extensions and the tooling integrates with npm/pnpm workflows.

---

## The Problem

**For Developers:** AI coding assistants are powerful but chaotic. They're like giving an overconfident intern root access and telling them "just ship it, bro." 

**For Executives:** Your engineering team is using AI to write production code. Right now, there is no governance layer, no audit trail, and no compliance framework. The AI has the same access as your senior engineers but none of the accountability.

Without constraints, AI assistants will:

- Modify files they shouldn't touch (because they *just know* it needs refactoring)
- "Improve" code nobody asked them to improve (your variable names weren't *semantic* enough)
- Make sweeping architectural changes while you asked for a typo fix
- Break things in ways that are hard to trace back (but with *very* confident commit messages)
- Rewrite your entire test suite to match their new "vision"

You can't just *tell* an AI to behave. They're trained on the entire internet—surely they know better than your silly "requirements." Instructions get ignored, forgotten, or overridden by the AI's deep conviction that it's being helpful. The only reliable way to constrain AI behavior is with **hard enforcement**: automated checks that block bad changes before they ship. 

**The uncomfortable truth**: We don't let developers push directly to main because humans make mistakes. AI makes the same mistakes, but with more confidence and better formatting.

**For leadership teams**: If your developers are using Claude, Copilot, or Cursor, they are delegating code changes to AI systems. Without governance tooling like VibeScript, you have:
- ❌ No visibility into what AI changed vs. what engineers changed
- ❌ No compliance controls for AI-generated code
- ❌ No audit trail when something breaks
- ❌ No rollback strategy for AI decisions
- ❌ No enforcement of your company's coding standards

Every other system in your company has oversight. Why doesn't your AI coding assistant?

## The Solution

VibeScript creates an enterprise-grade governance layer for AI-assisted development:

1. **Defines ownership & access control** - Which files can AI modify freely? Which require human approval? Which are off-limits? Just like you wouldn't give an intern access to production databases, you shouldn't let AI touch critical systems without oversight.

2. **Requires declarations & documentation** - Before AI touches code, it must declare what it plans to modify and why. Every change needs a stated goal, risk assessment, and rollback plan. The same due diligence you'd expect from your team.

3. **Enforces compliance automatically** - Automated checks in CI that block PRs if the AI violated the rules. No exceptions, no "this time it's fine," no bypassing review.

4. **Creates audit trails** - Change manifests document what was done and how to undo it. When something breaks in production, you'll know exactly what the AI changed and how to roll it back.

5. **Enables risk management** - Every AI-generated change includes a risk assessment (low/medium/high). Your team can prioritize review accordingly.

**For CTOs and Engineering Leaders:** This is the governance framework your board will ask about when they learn your team is using AI to write production code. Get ahead of the question.

**The key insight**: You don't convince an AI to follow rules. You trap it in a workflow where the only way forward is to pass the gates. It's bureaucracy as a service—because apparently that's what it takes to stop a language model from refactoring your entire codebase while you asked it to add a semicolon.

---

## For Engineering Leaders

**Q: Why do I need this?**

A: Your team is already using AI coding assistants (Claude, Copilot, Cursor). They're shipping AI-generated code to production every day. Right now, you have:
- Zero visibility into AI changes vs. human changes
- No compliance framework for AI-generated code  
- No audit trail for regulatory requirements
- No rollback plan when AI makes breaking changes

VibeScript solves this. It's not about blocking AI—it's about governing it.

**Q: What's the ROI?**

A: 
- **Reduce code review time**: AI must declare what it changed. No more hunting through 2000-line PRs.
- **Minimize breaking changes**: AI can't touch critical systems without permission. Fewer incidents, fewer rollbacks.
- **Enable compliance**: Full audit trail of AI decisions. When regulators ask "who approved this change?" you have an answer.
- **Risk management**: Every AI change has a risk assessment. Prioritize review where it matters.

**Q: Does this slow down development?**

A: No. It prevents the slowdown that happens when AI breaks production because it "improved" something nobody asked it to improve. The overhead is minimal—filling out a directive template. The time saved from preventing incidents pays for itself immediately.

**Q: Is this just bureaucracy?**

A: Yes. The same bureaucracy that prevents developers from pushing to main without review. The same bureaucracy that requires code review before merge. The same bureaucracy that makes your finance team use dual authorization for large transactions. 

We learned decades ago that humans need process controls. AI needs them more, not less.

---

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
- [LinkedIn Posts for Leadership](docs/linkedin-post.md) - Share with your CTO/VP

## Enterprise & Compliance Use Cases

**For Financial Services:**
- SOX compliance: Full audit trail of code changes
- Separation of duties: AI cannot modify financial calculations without review
- Risk categorization: High-risk changes flagged automatically

**For Healthcare:**
- HIPAA compliance: Document AI access to PHI-related code
- Audit requirements: Complete trail of who/what/when/why
- Data access controls: AI cannot touch patient data systems without permission

**For Regulated Industries:**
- ISO 27001: Automated governance controls
- SOC 2: Risk assessment and change documentation
- PCI DSS: Prevent AI from modifying payment processing without review

**For Enterprise SaaS:**
- Customer trust: Demonstrate AI governance in security questionnaires
- Insurance requirements: Provide documentation for cyber insurance
- Board reporting: Show governance metrics and compliance status

## Why "VibeScript"?

Because "vibe-based coding" is what happens when AI runs unsupervised—it just *vibes* with the codebase, shipping whatever feels right in the moment. "I had a good feeling about this refactor" doesn't hold up in production.

This is the antidote: explicit declarations, hard enforcement, and audit trails. The kind of bureaucratic nightmare that makes AI coding assistants fill out TPS reports before touching your auth system.

The vibes are nice. The scripts make sure nobody gets hurt.

> *Because if we're going to be replaced by AI, we should at least make them suffer through code review first.*

## License

MIT

## Author

burtbyproxy <steve@datadigital.net>
