# Example: Setting Up Development Patterns for Your Project

This example demonstrates how to use the development patterns recipe in a real-world VibeScript project.

---

## Scenario

You're building an e-commerce API with the following requirements:
- **Phase**: Production-ready
- **Team**: 3 developers + AI assistance
- **Criticality**: High (handles payments)
- **Tech**: Node.js, TypeScript, PostgreSQL, Express

---

## Step 1: Install VibeScript

```bash
pnpm add -D @ddnet-repo/vibescript
pnpm vibescript init
```

This creates:
- `.vibe/` directory with governance files
- `.vibe/claude.instructions.md` - Operating rules for Claude
- `.vibe/spec.md` - Complete VibeScript specification

---

## Step 2: Choose Development Patterns

Review `docs/development-patterns.md` and select patterns for your team:

**Selected Patterns for E-Commerce API:**
- **YAGNI**: Moderate (plan for known features, not speculation)
- **DRY**: Moderate (extract at 3rd use)
- **SOLID**: Pragmatic (apply where it adds value)
- **Testing**: TDD with 80% coverage (high-value code)
- **Documentation**: JSDoc for public APIs
- **Error Handling**: Fail-fast at boundaries, graceful internally
- **Security**: Defense in depth
- **Commits**: Atomic

---

## Step 3: Create Your Project Context

Copy and customize the template:

```bash
cp .vibe/templates/claude-context.md.template .vibe/claude-context.md
```

**Filled Example** (`.vibe/claude-context.md`):

```markdown
# E-Commerce API Development Context

## Quick Instructions
Claude, use: Moderate YAGNI, Moderate DRY, TDD with 80% coverage, 
JSDoc for public APIs, Fail-fast at boundaries, Atomic commits

## Custom Rules
- All database queries must use the repository pattern
- API responses must follow JSON:API specification
- All external API calls require retry logic with exponential backoff
- Use Zod for runtime input validation
- No business logic in controllers (must be in services)
- All async operations must have proper error handling
- Use functional programming style where appropriate

## Architecture Constraints
- Hexagonal architecture: domain at core, adapters at edges
- Database schema changes require migration files
- All secrets in environment variables (never hardcoded)
- External dependencies must be mockable for testing
- Rate limiting on all public endpoints

## Must Avoid
- ❌ Don't use `any` type in TypeScript
- ❌ Don't query database directly from controllers
- ❌ Don't add npm packages without checking vulnerabilities
- ❌ Don't expose internal error details to clients
- ❌ Don't skip input validation

## Project-Specific Vocabulary
- **SKU**: Stock Keeping Unit, unique product identifier
- **Cart**: Shopping cart stored in Redis with 24hr TTL
- **Fulfillment**: Order packing and shipping process
- **Inventory Reserve**: Temporary hold on stock during checkout

## Security Requirements
- Strict input validation using Zod schemas
- Parameterized queries (prevent SQL injection)
- Rate limiting and request throttling
- Authentication on all endpoints except public health check
- Authorization checks before all data access
- Audit logging for sensitive operations (payments, user data changes)

## Testing Requirements
- Write tests before implementation (TDD)
- 80%+ code coverage for services and repositories
- 100% coverage for payment and auth modules
- Integration tests for all API endpoints
- Unit tests must be fast (<100ms each)
- Mock external services (payment gateway, email, etc.)

## VibeScript Compliance
Read .vibe/claude.instructions.md and follow all governance rules.
Create .vibe.ts files with all required directives.
Run vibe:check before committing.
```

---

## Step 4: Task Claude with Context

Now when you assign work to Claude, reference the context:

### Example Task 1: New Feature

```
Claude, implement user registration with email verification:

1. Read .vibe/claude-context.md for project patterns
2. Follow VibeScript governance (.vibe/claude.instructions.md)

Requirements:
- POST /api/users endpoint
- Validate email format and uniqueness
- Hash passwords with bcrypt
- Send verification email
- Return JWT on successful registration

Acceptance Criteria:
- All inputs validated with Zod
- TDD approach (write tests first)
- 80%+ code coverage
- Integration test for full flow
- Error handling for duplicate emails
- Audit logging for new registrations
```

### Example Task 2: Bug Fix

```
Claude, fix the cart expiration bug:

Context: .vibe/claude-context.md (Surgical changes mode)

Bug: Carts aren't expiring after 24 hours in Redis

Requirements:
- Minimal changes only
- Add regression test
- Fix only the reported issue
- No refactoring
- Full test suite must pass

Follow project patterns for error handling and testing.
```

### Example Task 3: Refactoring

```
Claude, refactor the payment service:

1. Read .vibe/claude-context.md
2. Use TDD approach (tests first for safety)
3. Apply Moderate DRY (extract repeated logic)

Goals:
- Extract duplicate Stripe API code
- Improve error handling consistency
- Add retry logic for failed transactions
- Maintain 100% test coverage

Constraints:
- Don't change payment APIs or interfaces
- One service at a time
- All existing tests must pass
```

---

## Step 5: Monitor and Adjust

After a few tasks, review what's working:

**What Worked Well:**
- ✅ TDD caught bugs early
- ✅ Moderate YAGNI kept codebase focused
- ✅ Zod validation prevented bad data

**Adjustments Needed:**
- 📝 Add pattern: All errors must include correlation IDs
- 📝 Update: Increase test coverage to 85% for new code
- 📝 Add: Require performance tests for endpoints handling >1000 req/min

Update `.vibe/claude-context.md` with these learnings.

---

## Step 6: Onboard New Team Members

Share your context with new developers (human or AI):

```
Welcome to the E-Commerce API project!

Setup:
1. Clone repo
2. Read docs/development-patterns.md (10 min)
3. Read .vibe/claude-context.md (5 min)
4. Read .vibe/claude.instructions.md (5 min)

When working with Claude:
"Claude, read .vibe/claude-context.md and implement [feature]"

Our patterns are documented and Claude will follow them consistently.
```

---

## Real Task Example

Here's what a complete task looks like:

```
Claude, implement shopping cart abandonment notifications:

## Context
- Read .vibe/claude-context.md for project patterns
- Follow VibeScript governance rules
- This is a production feature (moderate risk)

## Requirements
POST endpoint to send cart reminder emails after 2 hours

## Specifications
1. Background job checks for carts abandoned >2 hours
2. Send email with cart contents and checkout link
3. Mark cart as "reminder sent" (send only once)
4. Log all email attempts for debugging

## Acceptance Criteria
- [ ] TDD approach (tests first)
- [ ] Zod validation for all inputs
- [ ] Repository pattern for data access
- [ ] Retry logic for email service failures
- [ ] 80%+ code coverage
- [ ] Integration test with mocked email service
- [ ] Error handling for all edge cases
- [ ] Audit log for privacy compliance
- [ ] All 13 VibeScript directives completed (including security, performance, dependencies, observability, breaking)

## Out of Scope
- Don't add cart analytics (separate feature)
- Don't modify cart expiration logic
- Don't change email templates (use existing)

## VibeScript
- Create .vibe.ts files with all directives
- Declare all touched files in @vibe:touch
- Run vibe:check before committing
```

**Claude's Response:**

Claude will:
1. Read the project context
2. Apply Moderate YAGNI (implement only what's requested)
3. Write tests first (TDD)
4. Use repository pattern (project convention)
5. Add Zod validation (project requirement)
6. Implement retry logic (project standard)
7. Achieve 80%+ coverage (project threshold)
8. Create proper VibeScript directives
9. Use atomic commits

The result: consistent, high-quality code that matches your team's standards.

---

## Common Patterns Usage

### Pattern: Quick Bug Fix
```
Claude:
- Context: .vibe/claude-context.md (Surgical changes)
- Fix bug in src/cart/redis.service.ts
- Add regression test
- Minimal changes only
```

### Pattern: New Module
```
Claude:
- Context: .vibe/claude-context.md (Full patterns)
- Create inventory management module
- Follow hexagonal architecture
- TDD with 80% coverage
- JSDoc for all public APIs
```

### Pattern: Security Enhancement
```
Claude:
- Context: .vibe/claude-context.md (Security: Defense in Depth)
- Add rate limiting to /api/checkout
- Implement sliding window algorithm
- Test under load
- Add monitoring metrics
```

---

## Benefits Achieved

**Consistency**: All code follows same patterns, whether written by humans or AI

**Quality**: High standards enforced automatically (TDD, coverage, validation)

**Onboarding**: New team members reference same docs as AI

**Evolution**: Update patterns in one place, all future work adapts

**Audit Trail**: VibeScript tracks what was changed and why

**Safety**: Multiple layers prevent accidental breaking changes

---

## Advanced: Pattern Evolution

As your project matures, update patterns:

```markdown
# .vibe/claude-context.md

## Phase: Production → Maintenance

**Updated Patterns (2026-02-01):**
- Changed: YAGNI from Moderate → Strict (codebase is stable)
- Changed: Testing from TDD → Test-After (faster iterations)
- Changed: Coverage from 80% → 70% (focus on critical paths)
- Added: Performance testing for high-traffic endpoints
- Added: Database query optimization review

**New Constraints:**
- All DB queries must use indexes
- Cache frequently accessed data (Redis)
- Monitor P95 latency for all endpoints

**Project Maturity Notes:**
Architecture is stable. Focus on performance and stability over new features.
```

Update tasks to reference the new patterns automatically.

---

## Conclusion

This example demonstrates:
1. How to set up development patterns for a real project
2. How to task Claude with consistent expectations
3. How to evolve patterns as your project matures
4. How patterns and VibeScript work together

Result: **Consistent, maintainable, high-quality AI-assisted development**.

---

**Created**: 2026-01-23
**Project**: VibeScript Examples
**Type**: Complete Tutorial
