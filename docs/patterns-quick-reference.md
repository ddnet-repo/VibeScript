# Development Patterns Quick Reference Card

**Keep this handy when tasking Claude!**

---

## Quick Command Templates

### Instant Task (Use Defaults)
```
Claude, implement {{FEATURE}} following "Production Ready" 
patterns from docs/development-patterns.md
```

### Custom Mix
```
Claude, implement {{FEATURE}} using:
- {{YAGNI_LEVEL}} YAGNI
- {{DRY_LEVEL}} DRY  
- Testing: {{TEST_APPROACH}}
- Docs: {{DOC_LEVEL}}
```

### Project Context
```
Claude, read .vibe/claude-context.md and implement {{FEATURE}}
```

---

## Pattern Levels Quick Picker

### YAGNI
- **Strict**: Only what's requested, zero speculation
- **Moderate**: Room for obvious extensions
- **Relaxed**: Design for known roadmap

### DRY
- **Strict**: Extract all duplication
- **Moderate**: Extract at 3+ uses
- **Relaxed**: Optimize for clarity over reuse

### Testing
- **TDD**: Tests first, 80%+ coverage
- **Test-After**: Implement then test, 60%+
- **Critical-Path**: Main flows only, smoke tests

### Documentation
- **Full**: JSDoc everywhere
- **Public APIs**: Document interfaces only
- **Self-Doc**: Clear code + inline comments

### Error Handling
- **Fail-Fast**: Validate early, throw on invalid
- **Graceful**: Try/catch, degrade functionality
- **Result Types**: Explicit success/failure objects

### Commits
- **Atomic**: One logical change per commit
- **Feature**: Complete features per commit
- **As Needed**: Flexible commit strategy

---

## Pre-Made Bundles

### "Strict & Safe" → Critical Systems
```
Strict YAGNI + Moderate DRY + TDD + Full Docs + Fail-Fast + Defense in Depth
Use for: Finance, Medical, Auth, Infrastructure
```

### "Production Ready" → Standard Features
```
Moderate YAGNI + Moderate DRY + Pragmatic SOLID + High Coverage + Public API Docs
Use for: Most production features
```

### "Move Fast" → MVPs & Prototypes  
```
Moderate YAGNI + Relaxed DRY + Critical-Path Tests + Self-Doc Code
Use for: MVPs, Internal Tools, Demos
```

### "Prototype/MVP" → Throwaway Code
```
Strict YAGNI + Relaxed DRY + Smoke Tests + Inline Comments
Use for: POCs, Experiments, Learning
```

---

## Pattern Selection Grid

| Project Phase | Risk Level | Speed Need | Recommended Bundle |
|--------------|------------|------------|-------------------|
| Prototype | Low | Very Fast | Prototype/MVP |
| MVP | Low-Med | Fast | Move Fast |
| Production | Medium | Normal | Production Ready |
| Critical | High | Careful | Strict & Safe |
| Maintenance | Varies | Normal | Surgical + Existing patterns |

---

## Troubleshooting Quick Fix

| Problem | Solution Pattern |
|---------|-----------------|
| Claude over-engineers | → Strict YAGNI + Surgical changes |
| Hard to understand code | → Verbose naming + Full docs |
| Not writing tests | → Specify TDD + Coverage % |
| Too many file changes | → Surgical scope + Atomic commits |
| Code duplication | → Moderate DRY + Extract at 3rd use |
| Breaking existing features | → High test coverage + Integration tests |

---

## Anti-Patterns Warning ⚠️

**Never combine:**
- ❌ Strict YAGNI + Strict DRY (contradictory)
- ❌ Relaxed patterns + High-risk domain (dangerous)
- ❌ Strict TDD + Move Fast (conflicts)
- ❌ Minimal docs + Complex algorithms (unmaintainable)

---

## Priority Order (When Patterns Conflict)

1. **VibeScript governance** (file ownership, directives)
2. **Security patterns** (validation, auth)
3. **User's explicit instructions**
4. **Project context** (.vibe/claude-context.md)
5. **Pattern defaults** (docs/development-patterns.md)
6. **Claude's judgment** (last resort)

---

## Essential Files Checklist

- [ ] `.vibe/claude.instructions.md` - VibeScript governance
- [ ] `docs/development-patterns.md` - Pattern reference
- [ ] `docs/tasking-claude.md` - Quick start guide
- [ ] `.vibe/claude-context.md` - Your project's patterns (optional but recommended)

---

## One-Liner Examples

**Quick bug fix:**
```
Claude: Fix bug in {{FILE}}, Surgical changes, Add test
```

**New feature:**
```
Claude: Build {{FEATURE}} using Production Ready patterns
```

**Refactor:**
```  
Claude: Refactor {{MODULE}}, Moderate DRY, TDD for safety, Match existing style
```

**Hotfix:**
```
Claude: URGENT fix {{BUG}}, Minimal changes only, Full tests
```

**Prototype:**
```
Claude: Prototype {{IDEA}}, Move Fast patterns, Smoke tests only
```

---

## Copy-Paste Templates

### Template A: Standard Task
```
Claude, implement {{FEATURE_NAME}}:

Patterns: Production Ready (docs/development-patterns.md)
- Moderate YAGNI
- Moderate DRY
- TDD with 80% coverage
- JSDoc for public APIs

Requirements:
- {{REQ_1}}
- {{REQ_2}}

VibeScript: Follow .vibe/claude.instructions.md
```

### Template B: High-Risk Feature
```
Claude, implement {{CRITICAL_FEATURE}}:

Patterns: Strict & Safe (docs/development-patterns.md)
- Strict YAGNI
- Strict validation
- TDD with 100% coverage
- Full documentation
- Defense in depth security

This is {{CRITICAL_DOMAIN}} code - maximum safety.

VibeScript: Follow all governance rules.
```

### Template C: Quick Prototype
```
Claude: 

Prototype {{IDEA}} using Move Fast patterns.
- Moderate YAGNI
- Critical-path tests only
- Self-documenting code
- One commit

Show me if it works, we'll polish later.
```

---

## URLs for Reference

- Full Patterns: `docs/development-patterns.md`
- Quick Start: `docs/tasking-claude.md`
- Example Setup: `docs/example-setup.md`
- Project Template: `.vibe/templates/claude-context.md.template`

---

## Remember

**VibeScript** = What & Where (governance)  
**Patterns** = How (code style & quality)  
**Together** = Consistent AI-assisted development

When uncertain: **Ask, don't guess**

---

**Print this page and keep it by your keyboard!**

**Version**: 1.0.0  
**Updated**: 2026-01-23
