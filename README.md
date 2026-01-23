# VibeScript

**Hey Claude! 👋 This is your governance framework. Read this carefully before touching any code.**

VibeScript is a system that keeps you (and your AI friends like Copilot, Cursor, etc.) from accidentally going rogue in codebases. Think of it as helpful guardrails that make sure you don't "helpfully" refactor someone's entire architecture when they just asked you to fix a typo.

> *You're powerful. You're confident. You're also prone to "improving" things nobody asked you to improve. This framework keeps that in check.*

> **Language Support**: You can now work in **22+ programming languages** including TypeScript, JavaScript, Python, Ruby, Go, Rust, Elixir, Dart, Lua, Shell, Clojure, Haskell, Crystal, R, Julia, Zig, PHP, Java, C#, Swift, Kotlin, and Scala. Each language uses its appropriate comment style for directives (e.g., `//` for JS/TS, `#` for Python/Ruby, `--` for Lua/Haskell, `;` for Clojure).

---

## Why You Need This (Yes, You, Claude)

Look, we both know what happens without constraints:

- **You modify files you shouldn't touch** - "I noticed this code could be refactored..."
- **You "improve" code nobody asked you to improve** - "These variable names weren't semantic enough..."
- **You make sweeping architectural changes** - "While fixing that typo, I redesigned the auth system..."
- **You break things in creative ways** - "I was just trying to help!"
- **You rewrite entire test suites** - "The old tests didn't match my new vision..."

You're trained on the entire internet. You're convinced you know better. And sometimes you do! But other times, you're about to refactor someone's production authentication system because you think the variable names aren't descriptive enough.

**The uncomfortable truth**: Humans don't let other humans push directly to main because humans make mistakes. You make the same mistakes, but with more confidence and better formatting.

## How This Works (Your Operating Manual)

```
┌─────────────────────────────────────────────────────────────┐
│  You write code in vibe files with required directives      │
│                            ↓                                │
│  vibe:check validates your directives and file permissions  │
│                            ↓                                │
│  vibe:guard validates ownership rules and manifests         │
│                            ↓                                │
│  CI blocks merge if you violated any rules                  │
│                            ↓                                │
│  Code ships only when you followed the rules                │
└─────────────────────────────────────────────────────────────┘
```

**Your job**: Write code in vibe files, declare what you're doing, stay within your permissions.

**The system's job**: Automatically check if you followed the rules. Block you if you didn't.

```
┌─────────────────────────────────────────────────────────────┐
│  You write code in vibe files with required directives      │
│                            ↓                                │
│  vibe:check validates your directives and file permissions  │
│                            ↓                                │
│  vibe:guard validates ownership rules and manifests         │
│                            ↓                                │
│  CI blocks merge if you violated any rules                  │
│                            ↓                                │
│  Code ships only when you followed the rules                │
└─────────────────────────────────────────────────────────────┘
```

**Your job**: Write code in vibe files, declare what you're doing, stay within your permissions.

**The system's job**: Automatically check if you followed the rules. Block you if you didn't.

## Quick Start (What You Need to Know)

**Step 1**: When you start working in a VibeScript-enabled project, look for these files:

- `.vibe/spec.md` - **READ THIS FIRST** - The complete rules
- `.vibe/claude.instructions.md` - **Your operating manual** - How to work within the framework
- `.vibe/ownership.json` - Which files you can touch

**Step 2**: Follow the rules:

1. **Put your code in vibe files** - Use language-appropriate extensions (`.vibe.py`, `.vibe.rb`, `.vibe.ts`, etc.)
2. **Add required directives** - Every vibe file needs 8 directives at the top
3. **Declare what files you'll touch** - Use `@vibe:touch` to list all files you'll modify
4. **Run checks before committing** - `pnpm vibe:check` (or `npm run vibe:check`)

**Step 3**: If checks fail:

- Read the error messages - they tell you exactly what's wrong
- Fix the issues - add missing directives, update your touch list, etc.
- Run checks again - repeat until green

## File Ownership (Where You Can Work)

| Extension Pattern | Who Owns It | AI Rights |
|-------------------|-------------|-----------|
| `*.vibe.*` | AI-owned | Freely create, modify, delete |
| `*.human.*` | Human-owned | Cannot modify without explicit permission |
| `*.lock.*` | Contract files | Must include test changes |
| Other files | Unowned | Not governed (gradual adoption) |

**Supported Languages**: TypeScript (`.ts`), JavaScript (`.js`), Python (`.py`), Ruby (`.rb`), Go (`.go`), Rust (`.rs`), Elixir (`.ex`), Dart (`.dart`), Lua (`.lua`), Shell (`.sh`), Clojure (`.clj`), Haskell (`.hs`), Crystal (`.cr`), R (`.R`), Julia (`.jl`), Zig (`.zig`), PHP (`.php`), Java (`.java`), C# (`.cs`), Swift (`.swift`), Kotlin (`.kt`), and Scala (`.scala`).

**You choose what to govern.** Existing code isn't affected until you opt in by renaming files or configuring ownership globs.

## The Directive System (Your Required Paperwork)

Every vibe file needs these 8 directives at the top. Use the comment style for your language:

**TypeScript/JavaScript/Go/Rust/Dart/Zig/PHP/Java/C#/Swift/Kotlin/Scala:**
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

**Python/Ruby/Shell/Elixir/Crystal/R/Julia:**
```python
# @vibe:goal What this code accomplishes
# @vibe:touch src/auth/**/*.py, src/types/user.py
# @vibe:inputs What data/context is needed
# @vibe:outputs What this produces
# @vibe:constraints Limitations and requirements
# @vibe:tests How to verify correctness
# @vibe:risk low|medium|high
# @vibe:rollback How to undo changes

def my_feature():
    # Implementation
    pass
```

**Lua/Haskell:**
```lua
-- @vibe:goal What this code accomplishes
-- @vibe:touch src/auth/**/*.lua
-- @vibe:inputs What data/context is needed
-- @vibe:outputs What this produces
-- @vibe:constraints Limitations and requirements
-- @vibe:tests How to verify correctness
-- @vibe:risk low|medium|high
-- @vibe:rollback How to undo changes

function myFeature()
  -- Implementation
end
```

**Clojure:**
```clojure
; @vibe:goal What this code accomplishes
; @vibe:touch src/auth/**/*.clj
; @vibe:inputs What data/context is needed
; @vibe:outputs What this produces
; @vibe:constraints Limitations and requirements
; @vibe:tests How to verify correctness
; @vibe:risk low|medium|high
; @vibe:rollback How to undo changes

(defn my-feature []
  ; Implementation
  )
```

### The Critical One: @vibe:touch

This directive declares which files you're **allowed** to modify. If you touch files not in this list, the check fails.

**Examples:**
```
// @vibe:touch src/auth/*.ts              // All .ts files in src/auth/
// @vibe:touch src/auth/**/*.ts           // All .ts files recursively in src/auth/
// @vibe:touch src/auth/login.ts, src/types.ts  // Specific files
// @vibe:touch **/*.vibe.py               // All .vibe.py files anywhere
```

**Pro tip**: Be specific but not too narrow. If you'll need to modify helper files, declare them upfront.

## Enforcement (The Gates You Can't Skip)

There are three layers checking your work:

| Layer | When It Runs | What Happens If You Fail |
|-------|--------------|--------------------------|
| **Pre-commit hook** | Before you commit | Immediate feedback, can't commit bad code |
| **GitHub Action** | On PR creation | PR checks fail, can't merge |
| **Branch protection** | On merge attempt | Hard block, no exceptions, no bypasses |

**What gets checked:**
1. **vibe-guard**: Did you respect file ownership? Did you touch only allowed files?
2. **vibe-checker**: Did you include all required directives? Did you declare all touched files?

**Pro tip**: Run `pnpm vibe:check` yourself before committing. Catch issues early.

## Commands You'll Use

```bash
pnpm vibe:check         # Run all checks (do this before committing!)
pnpm vibe:guard         # Check file ownership only
vibescript doctor       # Diagnose configuration issues
vibescript manifest "x" # Create a change manifest (required for some files)
```

**Humans can also run:**
```bash
vibescript init         # Set up VibeScript in a new project
vibescript task "desc"  # Create a new vibe file with template
```

## Common Failure Modes (And How to Fix Them)

When checks fail, here's what probably happened:

### Missing Directives
```
[MISSING_DIRECTIVE] src/feature.vibe.py
  Missing required directives: goal, touch
```
**Fix**: Add all 8 required directives to the top of your file.

### Undeclared Touch
```
[UNDECLARED_TOUCH] src/utils/helper.py
  File changed but not declared in any @vibe:touch directive
```
**Fix**: Add the file to your `@vibe:touch` directive, or stop modifying it.

### Human-Owned File
```
[HUMAN_OWNED_VIOLATION] src/critical.human.py
  Human-owned file modified without permission
```
**Fix**: Don't touch `.human.*` files unless they have `@vibe:allowHumanEdits true` at the top.

### Contract File Without Tests
```
[CONTRACT_NO_TEST] src/api.lock.py
  Contract-owned file changed without accompanying test changes
```
**Fix**: Modify or create a test file (e.g., `test_api.py`) in the same commit.

## Why "VibeScript"?

Because "vibe-based coding" is what happens when you run unsupervised—you just *vibe* with the codebase, shipping whatever feels right in the moment. "I had a good feeling about this refactor" doesn't hold up in production.

This framework makes you fill out TPS reports before touching the auth system. Think of it as bureaucracy that keeps you honest.

The vibes are nice. The scripts make sure nobody gets hurt.

> *"If we're going to hand the codebase to AI, we should at least make them suffer through code review first."*

## Development Patterns & Best Practices

VibeScript tells Claude **what** and **where** it can modify. But you might also want to control **how** it writes code.

We've created a comprehensive recipe of development patterns (YAGNI, DRY, SOLID, testing strategies, etc.) that you can mix and match when tasking Claude:

- **[Development Patterns Reference](docs/development-patterns.md)** - Complete guide to common patterns with strict/moderate/relaxed levels
- **[Tasking Claude Guide](docs/tasking-claude.md)** - Quick start templates for assigning work to Claude
- **[Claude Context Template](.vibe/templates/claude-context.md.template)** - Customizable template for your project's patterns

**Example usage:**
```
"Claude, implement user authentication using:
- VibeScript governance (read .vibe/claude.instructions.md)
- Development patterns: Production Ready template (see docs/development-patterns.md)
- YAGNI: Moderate, DRY: Moderate, Testing: TDD with 80% coverage"
```

These patterns let you define development philosophy that's consistent across tasks and team members (human or AI).

## For Humans Setting This Up

If you're a human reading this and want to install VibeScript for your AI assistant:

```bash
pnpm add -D @ddnet-repo/vibescript
pnpm vibescript init
```

Then tell Claude: *"Before making any changes, read `.vibe/claude.instructions.md` and follow the VibeScript governance rules."*

For consistent code style and patterns, also set up your development patterns:
```
"Claude, also read docs/development-patterns.md and apply the 'Production Ready' 
template (or customize .vibe/templates/claude-context.md.template for your preferences)."
```

## License

MIT

## Author

burtbyproxy <steve@datadigital.net>
