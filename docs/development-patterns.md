# Development Patterns Recipe for VibeScript Projects

**For Humans**: Use this document to customize Claude's behavior when working on your VibeScript projects. Mix and match patterns to create the perfect instructions for your team's coding standards.

**For Claude**: When a human references this document, apply the specified patterns to your work. These patterns complement VibeScript's governance framework by defining *how* you write code, while VibeScript defines *where* and *what* you can modify.

---

## How to Use This Recipe

This document provides a menu of common development patterns. When starting a project, select the patterns that match your team's philosophy:

```
"Claude, follow these patterns from development-patterns.md:
- YAGNI (strict)
- DRY (moderate)
- Testing: TDD approach
- Documentation: inline only
- Error handling: fail-fast"
```

Or create your own custom combination. Each pattern has multiple levels you can choose from.

---

## Core Development Philosophies

### YAGNI (You Aren't Gonna Need It)

**Strict Mode** - Only implement exactly what's requested, nothing more:
```
- No "future-proofing" or "what if" code
- No unused parameters or optional features
- No abstraction layers until third use case
- No helper functions until needed twice
- Single-purpose modules only
```

**Moderate Mode** - Balance current needs with obvious next steps:
```
- Implement requested features fully
- Add reasonable extension points (interfaces, hooks)
- Include one level of abstraction if pattern is clear
- Document obvious future considerations
- No speculative code, but leave room to grow
```

**Relaxed Mode** - Design for known roadmap:
```
- Implement current requirements
- Add abstraction for planned features
- Include configuration hooks for variants
- Build with next quarter's roadmap in mind
- Balance current simplicity with near-term needs
```

**When to apply**: Reference YAGNI level in your initial instructions to Claude.

---

### DRY (Don't Repeat Yourself)

**Strict Mode** - Eliminate all duplication:
```
- Extract any code repeated more than once
- Create abstractions for similar patterns
- Unify all related logic into single modules
- Factor out all magic numbers and strings
- Share utilities across all modules
```

**Moderate Mode** - Balance DRY with readability:
```
- Extract code repeated three or more times
- Create abstractions for clear patterns
- Keep related logic together even if slightly duplicated
- Allow some duplication if abstraction is complex
- Prefer clarity over maximum reuse
```

**Relaxed Mode** - Optimize for local clarity:
```
- Extract only obvious reusable utilities
- Prefer explicit code over clever abstractions
- Allow duplication if it improves readability
- Keep code self-contained in modules
- Optimize for understanding over brevity
```

**When to apply**: Specify DRY level when you want to control abstraction vs. explicitness tradeoff.

---

### SOLID Principles

**Full SOLID** - Apply all five principles strictly:
```
Single Responsibility: One class, one reason to change
Open/Closed: Extend via composition, not modification
Liskov Substitution: Subtypes fully substitutable
Interface Segregation: Small, focused interfaces
Dependency Inversion: Depend on abstractions, not concretions
```

**Pragmatic SOLID** - Apply where it adds value:
```
- Use SRP for large modules (>200 lines)
- Use OCP for plugin systems and extensions
- Use LSP when inheritance is necessary
- Use ISP for public APIs and contracts
- Use DIP for external dependencies only
```

**Minimal OOP** - Functional-first approach:
```
- Prefer functions over classes
- Use classes only for stateful entities
- Avoid inheritance hierarchies
- Use composition and interfaces sparingly
- Focus on data transformations
```

**When to apply**: Reference when working in OOP-heavy codebases or when architectural consistency matters.

---

## Code Organization Patterns

### Module Structure

**Domain-Driven** - Organize by business domain:
```
src/
  users/
    users.service.ts
    users.repository.ts
    users.types.ts
  orders/
    orders.service.ts
    orders.repository.ts
  shared/
    database.ts
    utils.ts
```

**Layer-Based** - Organize by technical layer:
```
src/
  controllers/
  services/
  repositories/
  models/
  utils/
```

**Feature-Based** - Organize by user-facing feature:
```
src/
  features/
    auth/
    checkout/
    profile/
  shared/
```

**When to apply**: Specify structure when adding new modules to ensure consistency.

---

### Naming Conventions

**Verbose & Explicit**:
```typescript
getUserByEmailAddressFromDatabase()
isUserAuthenticatedAndActive()
convertRawAPIResponseToUserModel()
```

**Balanced & Clear**:
```typescript
getUserByEmail()
isUserActive()
parseUserResponse()
```

**Terse & Conventional**:
```typescript
getUser()
isActive()
parse()
```

**When to apply**: Reference at project start to establish naming philosophy.

---

## Testing Patterns

### Test-Driven Development (TDD)

**Strict TDD** - Write tests first, always:
```
1. Write failing test for new behavior
2. Implement minimal code to pass test
3. Refactor while keeping tests green
4. Never write production code without a failing test
5. Commit test and implementation together
```

**Test-After Development (TAD)**:
```
1. Implement feature
2. Write comprehensive tests
3. Refactor based on test insights
4. Ensure high coverage before committing
```

**Critical-Path Testing**:
```
- Test all public APIs and exports
- Test error conditions and edge cases
- Skip testing private implementation details
- Focus on behavior, not implementation
```

**When to apply**: Specify testing approach for each task or globally for project.

---

### Test Coverage Philosophy

**High Coverage** (80%+ lines, 100% branches):
```
- Test all public functions
- Test all error paths
- Test edge cases and boundaries
- Include integration tests
- Mock external dependencies
```

**Pragmatic Coverage** (60%+ critical paths):
```
- Test core business logic thoroughly
- Test API contracts and interfaces
- Test known edge cases
- Skip trivial getters/setters
- Integration tests for critical flows
```

**Smoke Testing** (happy paths only):
```
- Test that main features work
- Test API endpoints return 200
- Test critical user flows
- Skip error handling tests
- Skip edge cases
```

**When to apply**: Specify coverage expectations per module or feature.

---

## Error Handling Patterns

### Fail-Fast

**Strict Validation**:
```typescript
function processPayment(amount: number) {
  if (amount <= 0) throw new Error('Invalid amount');
  if (amount > MAX_AMOUNT) throw new Error('Amount too large');
  if (!isConnected()) throw new Error('Service unavailable');
  // ... process
}
```

**Fail-fast at boundaries, handle internally elsewhere**

---

### Graceful Degradation

**Handle and Continue**:
```typescript
function processPayment(amount: number) {
  try {
    return chargeCard(amount);
  } catch (error) {
    logError(error);
    return fallbackPayment(amount);
  }
}
```

**Degrade functionality rather than crash**

---

### Return Error Values

**Result Type Pattern**:
```typescript
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function processPayment(amount: number): Result<Receipt> {
  if (amount <= 0) return { ok: false, error: 'Invalid amount' };
  // ...
  return { ok: true, value: receipt };
}
```

**Explicit success/failure without exceptions**

---

**When to apply**: Specify error handling strategy per module or project-wide.

---

## Documentation Patterns

### Inline Comments

**Verbose Inline**:
```typescript
// Calculate the user's total order value by iterating through
// all items in their cart and summing the price * quantity for each.
// Apply any active discount codes before returning the final total.
function calculateTotal(cart: Cart): number {
  // ...
}
```

---

### JSDoc/Documentation Comments

**Full API Documentation**:
```typescript
/**
 * Calculates the total cost of items in a shopping cart.
 * 
 * @param cart - The shopping cart containing items to total
 * @param discountCode - Optional discount code to apply
 * @returns The total cost after discounts
 * @throws {InvalidCartError} If cart is empty or invalid
 * @example
 * ```ts
 * const total = calculateTotal(cart, 'SAVE10');
 * ```
 */
function calculateTotal(cart: Cart, discountCode?: string): number {
  // ...
}
```

---

### Self-Documenting Code

**Minimal Documentation**:
```typescript
// Code structure and naming explain intent
// Only comment why, not what
function calculateTotal(cart: Cart): number {
  // Apply loyalty discount for premium members (business rule as of Q4 2024)
  const discount = cart.user.isPremium ? 0.1 : 0;
  return cart.items.reduce((sum, item) => sum + item.price, 0) * (1 - discount);
}
```

---

### README-Driven

**Comprehensive README files**:
```markdown
## Module: Payment Processing

### Purpose
Handles all payment transactions for orders.

### API
- `processPayment(order)` - Charges customer for order
- `refundPayment(orderId)` - Issues refund

### Dependencies
- Stripe API (external)
- Orders service (internal)

### Testing
Run: `npm test src/payment`
```

---

**When to apply**: Specify documentation level at project start or per-module.

---

## Performance Patterns

### Optimization Strategy

**Premature Optimization** (avoid unless specified):
```
- Don't optimize without profiling
- Don't add caching until needed
- Don't use complex algorithms without measuring
- Optimize only proven bottlenecks
```

**Proactive Performance**:
```
- Use efficient data structures from start
- Avoid N+1 queries in database code
- Batch network requests where obvious
- Cache expensive computations
- Profile after implementation
```

**Performance-Critical**:
```
- Profile before implementing
- Optimize all data access patterns
- Minimize allocations and copies
- Use appropriate algorithms (O(n) vs O(n²))
- Benchmark all changes
```

**When to apply**: Specify performance expectations for computationally intensive features.

---

## Security Patterns

### Input Validation

**Strict Validation**:
```typescript
- Validate all user inputs
- Whitelist allowed values
- Sanitize before use
- Validate types and ranges
- Reject invalid input immediately
```

### Authentication & Authorization

**Defense in Depth**:
```typescript
- Verify authentication at every endpoint
- Check authorization before all operations
- Don't trust client-side validation
- Log all security-relevant events
- Use parameterized queries (SQL injection)
- Escape outputs (XSS prevention)
```

**When to apply**: Always apply in production code; specify level for prototypes.

---

## Commit & Change Patterns

### Commit Size

**Atomic Commits** - One logical change per commit:
```
✓ "Add user email validation"
✓ "Fix off-by-one error in pagination"
✗ "Add feature, fix bugs, refactor utilities"
```

**Feature Commits** - Complete features per commit:
```
✓ "Implement user registration flow"
✓ "Add payment processing module"
```

**When to apply**: Specify commit granularity expectations.

---

### Change Scope

**Surgical Changes** - Minimal modifications only:
```
- Change only files necessary for the feature
- Don't refactor unrelated code
- Don't fix unrelated bugs
- Don't update formatting in unchanged code
- One concern per pull request
```

**Opportunistic Improvements**:
```
- Fix obvious bugs you encounter
- Update related documentation
- Refactor code you're modifying
- Improve tests for affected code
```

**When to apply**: Default to surgical for VibeScript; specify if broader changes allowed.

---

## Code Review Patterns

### Review Readiness

**Pre-Review Checklist**:
```
- [ ] All tests pass
- [ ] Code follows style guide
- [ ] No commented-out code
- [ ] No debug logging
- [ ] Documentation updated
- [ ] Commit messages clear
- [ ] VibeScript checks pass
```

---

## Mix & Match Templates

### Template: Strict & Safe
```
"Claude, use these patterns:
- YAGNI: Strict
- DRY: Moderate
- Testing: Strict TDD
- Error Handling: Fail-fast
- Documentation: Full JSDoc
- Changes: Surgical only
- Security: Defense in depth"
```

### Template: Move Fast
```
"Claude, use these patterns:
- YAGNI: Moderate
- DRY: Relaxed
- Testing: Critical-path only
- Error Handling: Graceful degradation
- Documentation: Self-documenting code
- Changes: Feature commits
- Performance: Don't optimize early"
```

### Template: Production Ready
```
"Claude, use these patterns:
- YAGNI: Moderate
- DRY: Moderate
- SOLID: Pragmatic
- Testing: High coverage (80%+)
- Error Handling: Fail-fast at boundaries
- Documentation: JSDoc for public APIs
- Security: Strict validation
- Changes: Atomic commits"
```

### Template: Prototype/MVP
```
"Claude, use these patterns:
- YAGNI: Strict (no speculation)
- DRY: Relaxed (optimize for speed)
- Testing: Smoke tests only
- Error Handling: Basic try-catch
- Documentation: Inline comments only
- Changes: Feature commits
- Performance: Premature optimization forbidden"
```

---

## Custom Pattern Definition

Create your own patterns:

```
"Claude, for this project:

Code Style:
- Use functional programming style
- Prefer immutability
- Use pipe operators for transforms

Architecture:
- Hexagonal architecture pattern
- Domain at core, adapters at edges
- No business logic in controllers

Testing:
- Contract testing for APIs
- Property-based testing for algorithms
- Integration tests for user flows

When uncertain:
- Ask before abstracting
- Prefer explicit over clever
- Choose readability over brevity"
```

---

## VibeScript Integration

**Important**: These patterns work *within* VibeScript's governance framework:

- VibeScript controls **what** and **where** you can modify
- These patterns control **how** you write the code
- Both must be satisfied

**Example Task**:
```
"Claude, implement user authentication using:
- VibeScript governance (read .vibe/claude.instructions.md)
- Development patterns: Production Ready template
- Create .vibe.ts files with all directives
- Follow SOLID pragmatic approach
- Write tests first (TDD)
- Document all public APIs with JSDoc"
```

---

## Anti-Patterns to Avoid

Unless explicitly permitted, avoid:

- ❌ **Premature abstraction** - Wait for third use case
- ❌ **God objects** - Classes with too many responsibilities
- ❌ **Magic numbers** - Use named constants
- ❌ **Copy-paste programming** - Extract to functions
- ❌ **Shotgun surgery** - Changes scattered across many files
- ❌ **Yo-yo problem** - Deep inheritance chains
- ❌ **Golden hammer** - Using same solution for everything
- ❌ **Not invented here** - Use existing libraries
- ❌ **Reinventing the wheel** - Don't rewrite standard functionality
- ❌ **Analysis paralysis** - Perfect is the enemy of done

---

## Pattern Selection Guide

**Choose patterns based on**:

1. **Project Phase**:
   - Prototype: Relaxed patterns, move fast
   - MVP: Moderate patterns, balance speed and quality
   - Production: Strict patterns, prioritize reliability
   - Maintenance: Surgical changes, high test coverage

2. **Team Size**:
   - Solo: Fewer constraints, optimize for personal preference
   - Small team: Moderate structure, some flexibility
   - Large team: Strict patterns, enforce consistency

3. **Domain Criticality**:
   - Experimental: Relaxed patterns
   - Business logic: Moderate to strict
   - Financial/medical: Strictest patterns, full testing
   - Infrastructure: Strict, high reliability

4. **Technical Debt Status**:
   - Green field: Establish patterns from start
   - Legacy with debt: Surgical changes, gradual improvement
   - Well-maintained: Match existing patterns

---

## For Future Claude Instances

**Self-Specification**: When starting a new project, you can define patterns for future instances:

```markdown
# Project Development Patterns

Based on my experience with this codebase, I recommend:

**Patterns That Worked**:
- YAGNI Strict: Kept codebase focused
- DRY Moderate: Good balance of reuse and clarity
- Test-After Development: Team preference
- JSDoc for public APIs only: Sufficient documentation

**Patterns to Avoid**:
- Don't extract utilities until third use
- Don't add abstractions in the auth module (already complex)
- Keep database queries in repositories only

**Project-Specific Rules**:
- All API routes must have integration tests
- All external calls must have retry logic
- Configuration must be in config/ folder
```

Save this as `.vibe/development-patterns.md` for the project.

---

## Quick Reference Card

| Pattern | Strict | Moderate | Relaxed |
|---------|--------|----------|---------|
| **YAGNI** | Only requested | Reasonable extension points | Design for roadmap |
| **DRY** | No duplication | Extract at 3+ uses | Optimize for clarity |
| **Testing** | TDD, 80%+ coverage | Test-after, 60%+ | Smoke tests |
| **Docs** | Full JSDoc | Public APIs only | Self-documenting |
| **Error** | Fail-fast | Graceful degradation | Basic try-catch |
| **Commits** | Atomic | Feature-based | As needed |

---

## Conclusion

This recipe provides a menu of proven development patterns. Mix and match to create the perfect instructions for your project's needs. Remember:

- **VibeScript** enforces governance and safety
- **These patterns** guide implementation style
- **Together** they create high-quality, maintainable AI-assisted code

When in doubt, ask your human collaborators which patterns they prefer. Every team has preferences, and these patterns adapt to your workflow.

---

**Version**: 1.0.0
**Last Updated**: 2026-01-23
**Maintained By**: VibeScript Team
