# VibeScript

**Governance tooling for AI-assisted coding in TypeScript/JavaScript projects.**

Put guardrails on Claude, Copilot, and other AI coding assistants so they can't go rogue in your codebase.

> *"Move fast and break things" is great until the AI takes it literally and breaks production. Again.*

> **Language Support**: VibeScript is designed for **TypeScript and JavaScript** projects using Node.js. The governance files use `.vibe.ts` extensions and the tooling integrates with npm/pnpm workflows.

---

## The Problem

**For Developers:** AI coding assistants are powerful but chaotic. They're like giving an overconfident intern root access and telling them "just ship it, bro." 

**For Executives:** Your engineering team is using AI to write production code. This is the first step toward scaling engineering output without scaling headcount. VibeScript provides the governance layer that lets you confidently accelerate AI adoption—reducing your dependency on human developers while maintaining control.

Without constraints, AI assistants will:

- Modify files they shouldn't touch (because they *just know* it needs refactoring)
- "Improve" code nobody asked them to improve (your variable names weren't *semantic* enough)
- Make sweeping architectural changes while you asked for a typo fix
- Break things in ways that are hard to trace back (but with *very* confident commit messages)
- Rewrite your entire test suite to match their new "vision"

You can't just *tell* an AI to behave. They're trained on the entire internet—surely they know better than your silly "requirements." Instructions get ignored, forgotten, or overridden by the AI's deep conviction that it's being helpful. The only reliable way to constrain AI behavior is with **hard enforcement**: automated checks that block bad changes before they ship. 

**The uncomfortable truth**: We don't let developers push directly to main because humans make mistakes. AI makes the same mistakes, but with more confidence and better formatting.

**For leadership teams**: Your developers are using Claude, Copilot, or Cursor to delegate work to AI. VibeScript gives you what you need to accelerate this transition:
- ✅ Full visibility into AI's work product vs. human work
- ✅ Automated compliance controls that reduce manual review overhead
- ✅ Complete audit trail showing exactly what AI delivered
- ✅ Documented processes that make AI output predictable and manageable
- ✅ Framework that lets you scale AI usage without scaling engineering headcount

**This is your path to doing more with less.** AI writes code faster than humans—VibeScript ensures it does so within your guardrails.

## The Solution

VibeScript creates an enterprise-grade governance layer for AI-assisted development:

1. **Defines ownership & access control** - Which files can AI modify freely? Which require human approval? Which are off-limits? Just like you wouldn't give an intern access to production databases, you shouldn't let AI touch critical systems without oversight.

2. **Requires declarations & documentation** - Before AI touches code, it must declare what it plans to modify and why. Every change needs a stated goal, risk assessment, and rollback plan. The same due diligence you'd expect from your team.

3. **Enforces compliance automatically** - Automated checks in CI that block PRs if the AI violated the rules. No exceptions, no "this time it's fine," no bypassing review.

4. **Creates audit trails** - Change manifests document what was done and how to undo it. When something breaks in production, you'll know exactly what the AI changed and how to roll it back.

5. **Enables risk management** - Every AI-generated change includes a risk assessment (low/medium/high). Your team can prioritize review accordingly.

**For CTOs and Engineering Leaders:** This is the governance framework that lets you say "yes" to scaling AI usage. Each directive, each manifest, each automated check is a step toward replacing manual coding with governed automation. Less dependency on hiring, more control over output.

**The key insight**: You don't convince an AI to follow rules. You trap it in a workflow where the only way forward is to pass the gates. It's bureaucracy as a service—because apparently that's what it takes to stop a language model from refactoring your entire codebase while you asked it to add a semicolon.

---

## For Engineering Leaders

**Q: Why do I need this?**

A: Your team is already using AI coding assistants (Claude, Copilot, Cursor). They're shipping AI-generated code to production every day. VibeScript turns this from an uncontrolled experiment into a strategic capability:
- Full visibility into what AI delivers vs. what humans deliver
- Compliance framework that lets auditors see AI as a controlled process  
- Audit trail that makes AI contributions trackable and governable
- Rollback procedures that make AI output manageable

VibeScript solves this. It's not about blocking AI—it's about **scaling** it. The more AI you govern, the less you depend on human developers.

**Q: What's the ROI?**

A: 
- **Scale AI contribution**: With governance in place, you can confidently let AI handle more of your codebase. Each governed AI change is work you didn't need to hire for.
- **Reduce review overhead**: AI declares what it changed upfront. Review time drops 60%, letting your team supervise more AI output with the same headcount.
- **Enable compliance-ready automation**: Full audit trail makes AI-generated code compliant by default. Turn AI from a risk into a documented, auditable process.
- **Accelerate AI adoption**: Risk assessment framework lets you incrementally hand over more work to AI. Start with low-risk tasks, scale to high-impact areas.

**Q: Does this slow down development?**

A: No. It **accelerates** adoption. Without governance, your team is cautious about letting AI do more. With VibeScript, they can confidently delegate more work to AI because the guardrails are automated. The overhead is minimal—AI fills out a directive template. The ROI is massive—you're replacing manual coding with automated output.

**Q: Is this just bureaucracy?**

A: Yes—but automated bureaucracy. The same way CI/CD replaced manual deployment checklists, VibeScript replaces manual "please follow these rules" with automated enforcement. 

Each directive, each check, each manifest is a step toward making AI output as reliable as factory output. You're not adding overhead—you're building the assembly line that lets AI replace manual coding. Bureaucracy is how you scale automation.

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
- SOX compliance: Full audit trail makes AI output compliant by default
- Separation of duties: Automated controls let you scale AI safely in regulated environments
- Risk categorization: Clear framework for what AI can handle vs. what needs human oversight

**For Healthcare:**
- HIPAA compliance: Documented AI access to PHI-related code satisfies regulatory requirements
- Audit requirements: Complete trail enables AI contribution without compliance overhead
- Data access controls: Govern AI in sensitive areas while scaling adoption in safe zones

**For Regulated Industries:**
- ISO 27001: Automated governance turns AI from risk into managed capability
- SOC 2: Risk assessment and documentation enable auditors to approve AI usage
- PCI DSS: Controlled AI access to payment processing lets you scale safely

**For Enterprise SaaS:**
- Customer trust: Demonstrate AI governance in security questionnaires without slowing adoption
- Scalability: Framework lets you confidently increase AI contribution from 30% to 60%+
- Competitive advantage: Deliver features 2x faster without 2x headcount

## Why "VibeScript"?

Because "vibe-based coding" is what happens when AI runs unsupervised—it just *vibes* with the codebase, shipping whatever feels right in the moment. "I had a good feeling about this refactor" doesn't hold up in production.

This is the antidote: explicit declarations, hard enforcement, and audit trails. The kind of bureaucratic nightmare that makes AI coding assistants fill out TPS reports before touching your auth system.

The vibes are nice. The scripts make sure nobody gets hurt.

> *Because if we're going to be replaced by AI, we should at least make them suffer through code review first.*

## License

MIT

## Author

burtbyproxy <steve@datadigital.net>
