# Quick Start: Tasking Claude with Development Patterns

This guide shows you how to use the development patterns recipe when assigning tasks to Claude in VibeScript projects.

---

## The Basics

**VibeScript** provides governance (what files can be modified, what directives are required).

**Development Patterns** provide coding philosophy (how to write the code, what principles to follow).

Together, they create consistent, high-quality AI-assisted development.

---

## Quick Tasking Templates

Copy and customize these templates when assigning work to Claude:

### Template 1: Quick Task (Use Built-in Defaults)

```
Claude, implement {{FEATURE_NAME}}:

1. Follow VibeScript governance (read .vibe/claude.instructions.md)
2. Use the "Production Ready" pattern from docs/development-patterns.md
3. Create tests before implementation (TDD)
4. Document all public APIs with JSDoc

Acceptance criteria:
- {{CRITERIA_1}}
- {{CRITERIA_2}}
- {{CRITERIA_3}}
```

### Template 2: Custom Pattern Mix

```
Claude, implement {{FEATURE_NAME}} using:

Patterns from docs/development-patterns.md:
- YAGNI: Strict (only what's requested)
- DRY: Moderate (extract at 3rd use)
- Testing: Test-After with 70% coverage
- Documentation: Self-documenting code + README
- Error Handling: Fail-fast at boundaries
- Commits: Atomic

VibeScript: Follow all governance rules in .vibe/

Specific requirements:
- {{REQUIREMENT_1}}
- {{REQUIREMENT_2}}
```

### Template 3: Use Project Context File

```
Claude, implement {{FEATURE_NAME}}:

1. Read .vibe/claude-context.md for this project's patterns
2. Follow VibeScript governance rules
3. Ask before deviating from established patterns

The feature should:
- {{SPECIFICATION_1}}
- {{SPECIFICATION_2}}
```

### Template 4: Ad-hoc Simple Task

```
Claude:
- Fix bug in {{FILE_NAME}}
- Use Surgical change scope (minimal modifications)
- Follow existing code style
- Add regression test
- VibeScript: Create .vibe.ts file if needed
```

### Template 5: Greenfield Feature

```
Claude, create {{NEW_FEATURE}} from scratch:

Use "Move Fast" template from docs/development-patterns.md:
- YAGNI: Moderate
- Testing: Critical-path only  
- Documentation: Inline comments
- Commits: Feature-based

Architecture:
- {{ARCHITECTURE_DECISION_1}}
- {{ARCHITECTURE_DECISION_2}}

VibeScript: Create .vibe.ts files with all directives
```

---

## Pre-Made Pattern Bundles

Reference these bundles from `docs/development-patterns.md`:

### "Strict & Safe"
Best for: Production features, financial/medical systems, critical infrastructure
```
Use patterns: Strict YAGNI, Moderate DRY, Strict TDD, Full JSDoc, 
Fail-fast errors, Defense in depth security, Surgical changes
```

### "Production Ready"  
Best for: Standard production features, most business logic
```
Use patterns: Moderate YAGNI, Moderate DRY, Pragmatic SOLID, 
High test coverage (80%+), JSDoc for public APIs, Atomic commits
```

### "Move Fast"
Best for: MVPs, prototypes, internal tools
```
Use patterns: Moderate YAGNI, Relaxed DRY, Critical-path testing,
Self-documenting code, Feature commits
```

### "Prototype/MVP"
Best for: Proof of concepts, demos, throwaway code
```
Use patterns: Strict YAGNI, Relaxed DRY, Smoke tests only,
Inline comments, No premature optimization
```

---

## Step-by-Step: Setting Up a New Project

1. **Install VibeScript** in your project:
   ```bash
   pnpm add -D @ddnet-repo/vibescript
   pnpm vibescript init
   ```

2. **Choose your development patterns**:
   - Review `docs/development-patterns.md`
   - Select patterns that match your team's philosophy
   - Consider project phase and criticality

3. **Create project context** (optional but recommended):
   - Copy `.vibe/templates/claude-context.md.template`
   - Fill in your selected patterns
   - Save as `.vibe/claude-context.md`

4. **Task Claude**:
   ```
   Claude, I've set up VibeScript with custom patterns.
   
   Read:
   - .vibe/claude.instructions.md (governance rules)
   - .vibe/claude-context.md (development patterns)
   
   Then implement user authentication.
   ```

5. **Iterate and refine**:
   - Update `.vibe/claude-context.md` as you learn what works
   - Add project-specific rules and constraints
   - Document things to avoid

---

## Common Scenarios

### Scenario 1: New Team Member (Human or AI)

```
Welcome! This project uses VibeScript for governance.

Quick orientation:
1. Read .vibe/spec.md (5 min) - Full governance spec
2. Read .vibe/claude.instructions.md (3 min) - Your operating manual  
3. Read .vibe/claude-context.md (2 min) - Project patterns
4. Read docs/development-patterns.md (scan, 5 min) - Pattern reference

When tasked, follow the patterns in claude-context.md.
```

### Scenario 2: Changing Project Phase

**From Prototype to Production**:
```
Claude, the project is moving from prototype to production.

Update development patterns:
- Change: YAGNI from Relaxed to Moderate
- Change: Testing from Smoke to High coverage (80%+)
- Change: Documentation from Inline to Full JSDoc
- Add: Strict input validation
- Add: Defense in depth security

Apply these patterns to all new code.
Update .vibe/claude-context.md to reflect changes.
```

### Scenario 3: Refactoring Legacy Code

```
Claude, refactor the {{MODULE_NAME}} module:

Special instructions:
- Use Surgical change scope (minimal modifications)
- Match existing code patterns (even if not ideal)
- Add tests before refactoring (safety net)
- One module at a time
- Each refactor must pass all existing tests

Don't:
- Change APIs or interfaces
- Modify other modules
- Add new features while refactoring
```

### Scenario 4: Hotfix Production Bug

```
Claude, urgent bug fix needed:

Bug: {{BUG_DESCRIPTION}}

Requirements:
- MINIMAL changes only (surgical scope)
- Add regression test
- NO refactoring, NO improvements
- Fix ONLY the reported bug
- Atomic commit
- Full test suite must pass

Patterns: Fastest path to fix while maintaining safety
```

---

## Mixing Patterns Effectively

You can mix different pattern levels for different aspects:

**Example: Balanced Approach**
```
YAGNI: Strict (no speculation)
+ DRY: Moderate (some abstraction)
+ Testing: High coverage (80%+)
+ Documentation: Public APIs only
= Fast but safe development
```

**Example: Experimental Feature**
```
YAGNI: Moderate (design for known next steps)
+ DRY: Relaxed (optimize for learning)
+ Testing: Critical-path (main flows only)
+ Documentation: README-driven
= Rapid experimentation with minimal overhead
```

**Example: Critical Infrastructure**
```
YAGNI: Strict (no future-proofing)
+ DRY: Strict (eliminate duplication)
+ Testing: Full TDD with 100% coverage
+ Documentation: Full JSDoc + architecture docs
+ Security: Defense in depth
= Maximum safety and maintainability
```

---

## Pattern Anti-Combinations

Some pattern combinations don't work well:

❌ **Strict YAGNI + Strict DRY**: Contradictory (YAGNI says don't abstract, DRY says eliminate duplication)
  - Better: Strict YAGNI + Moderate DRY

❌ **Relaxed patterns + High-risk domain**: Dangerous (insufficient safety)
  - Better: Use Strict/Moderate for financial, medical, auth code

❌ **Strict TDD + Move Fast**: Contradictory goals
  - Better: Test-After or Critical-Path testing for speed

❌ **Minimal documentation + Complex algorithms**: Hard to maintain
  - Better: Document complex logic even if rest is self-documenting

---

## Troubleshooting

### "Claude is over-engineering solutions"
→ Specify: `Strict YAGNI, Surgical changes, only implement what's requested`

### "Claude's code is hard to understand"  
→ Specify: `Verbose naming, Full JSDoc, Explain complex logic with comments`

### "Claude isn't writing tests"
→ Specify: `Strict TDD, Write failing test first, 80%+ coverage required`

### "Claude is modifying too many files"
→ Specify: `Surgical change scope, Atomic commits, Touch only files listed`

### "Code is duplicated everywhere"
→ Specify: `Moderate DRY, Extract at 3rd use, Create utility modules`

### "Changes break existing features"
→ Specify: `Full test suite must pass, Add regression tests, Integration tests`

---

## For Claude: Understanding Pattern Priorities

When patterns conflict, use this priority:

1. **VibeScript governance** (highest priority - file ownership, directives)
2. **Security patterns** (strict validation, defense in depth)
3. **Explicit user instructions** (what the user specifically requested)
4. **Project context patterns** (from .vibe/claude-context.md)
5. **Development pattern defaults** (from docs/development-patterns.md)
6. **Your best judgment** (lowest priority - only when no guidance given)

When uncertain, ask. Don't guess.

---

## Creating a Team Pattern Guide

Share this template with your team:

```markdown
# Our Team's Development Patterns

## Default Patterns for New Features
- YAGNI: Moderate
- DRY: Moderate
- Testing: Test-After, 70% coverage
- Docs: JSDoc for public APIs
- Commits: Atomic

## When to Deviate
- Use Strict YAGNI for customer-facing features
- Use High Coverage (80%+) for payment/auth code
- Use Relaxed patterns for internal tools

## Project-Specific Rules
- [Your custom rules here]

## When Tasking Claude
Copy this: "Claude, use our team patterns from [link to this doc]"
```

---

## Further Reading

- **Full Pattern Reference**: `docs/development-patterns.md`
- **VibeScript Governance**: `.vibe/spec.md`
- **Claude Instructions**: `.vibe/claude.instructions.md`
- **Template Customization**: `.vibe/templates/claude-context.md.template`

---

## Quick Decision Tree

```
┌─ What am I building? ─────────────────────────┐
│                                               │
├─ Prototype/POC ────────► Use "Move Fast"     │
├─ MVP ──────────────────► Use "Moderate" mix  │
├─ Production feature ───► Use "Production Ready"│
├─ Critical system ─────► Use "Strict & Safe"  │
└───────────────────────────────────────────────┘

┌─ What's the risk? ────────────────────────────┐
│                                               │
├─ Low (internal tool) ──► Relaxed patterns    │
├─ Medium (standard) ────► Moderate patterns   │
├─ High (user-facing) ───► Strict patterns     │
├─ Critical (money/data)─► Strictest patterns  │
└───────────────────────────────────────────────┘

┌─ How fast do I need to move? ────────────────┐
│                                               │
├─ Very fast (demo) ─────► Minimal tests/docs  │
├─ Fast (sprint) ────────► Pragmatic coverage  │
├─ Normal (feature) ─────► Standard patterns   │
├─ Careful (migration) ──► Full TDD, high cov  │
└───────────────────────────────────────────────┘
```

Choose patterns based on where you land in these categories.

---

**Quick Start Complete!**

You now have everything needed to task Claude with consistent, project-appropriate development patterns. Start with the pre-made bundles and customize as you learn what works for your team.

**Version**: 1.0.0
**Last Updated**: 2026-01-23
