# Authoring .vibe.ts Files

This guide covers best practices for writing well-structured `.vibe.ts` files.

## File Structure

Every `.vibe.ts` file should follow this structure:

```typescript
// @vibe:goal Clear, concise goal statement
// @vibe:touch pattern1, pattern2
// @vibe:inputs What this code needs
// @vibe:outputs What this code produces
// @vibe:constraints Limitations and rules
// @vibe:tests How to verify correctness
// @vibe:risk low|medium|high
// @vibe:rollback How to undo
//
// Created: YYYY-MM-DD
// ---

// Imports
import { something } from './somewhere';

// Implementation
export function myFunction(): ReturnType {
  // ...
}
```

## Writing Effective Directives

### @vibe:goal

The goal should be a single, clear sentence describing what the code accomplishes.

**Good:**
```typescript
// @vibe:goal Implement JWT token validation for API authentication
```

**Bad:**
```typescript
// @vibe:goal Do auth stuff
// @vibe:goal Implement the feature from ticket #1234 that John mentioned
```

### @vibe:touch

Declare file patterns this task may modify. Be specific but complete.

**Good:**
```typescript
// @vibe:touch src/auth/jwt.vibe.ts, src/auth/middleware.ts, src/types/auth.ts
```

**Overly Broad (avoid):**
```typescript
// @vibe:touch **/*.ts
```

**Incomplete (will fail check):**
```typescript
// @vibe:touch src/auth/jwt.vibe.ts
// But you also modify src/types/auth.ts - vibe-checker fails
```

### @vibe:inputs

List all data, context, or dependencies the code needs.

**Good:**
```typescript
// @vibe:inputs JWT token string, public key from env, user claims schema
```

**Bad:**
```typescript
// @vibe:inputs stuff
// @vibe:inputs See ticket
```

### @vibe:outputs

Describe what the code produces or returns.

**Good:**
```typescript
// @vibe:outputs Validated user object or throws AuthenticationError
```

**Bad:**
```typescript
// @vibe:outputs data
```

### @vibe:constraints

Document limitations, rules, and non-functional requirements.

**Good:**
```typescript
// @vibe:constraints Must validate in <10ms, no external network calls, OWASP compliant
```

**Also Good:**
```typescript
// @vibe:constraints None
```

### @vibe:tests

Specify how correctness is verified.

**Good:**
```typescript
// @vibe:tests jwt.test.ts covers valid/invalid/expired tokens, integration test in auth.spec.ts
```

**Bad:**
```typescript
// @vibe:tests TBD
// @vibe:tests Will add later
```

### @vibe:risk

Assess the risk level honestly:

- **low**: Isolated changes, easy rollback, minimal dependencies
- **medium**: Multiple files, moderate complexity, some system impact
- **high**: Core systems, many dependencies, hard to roll back

**Good:**
```typescript
// @vibe:risk medium
```

**Bad:**
```typescript
// @vibe:risk kind of medium I guess
```

### @vibe:rollback

Document how to undo the change if something goes wrong.

**Good:**
```typescript
// @vibe:rollback Revert commit, no data migration needed
// @vibe:rollback Revert commit, run pnpm db:migrate:down, restore cache
```

**Bad:**
```typescript
// @vibe:rollback git revert
// @vibe:rollback Ask John
```

## Glob Pattern Reference

Common patterns for `@vibe:touch`:

| Pattern | Matches |
|---------|---------|
| `src/auth/*.ts` | All .ts files directly in src/auth/ |
| `src/auth/**/*.ts` | All .ts files in src/auth/ recursively |
| `src/auth/login.ts` | Exactly this file |
| `**/*.vibe.ts` | All .vibe.ts files anywhere |
| `src/{auth,user}/*.ts` | Files in either auth or user folders |
| `src/api/*.{ts,tsx}` | .ts and .tsx files in src/api/ |

## Code Organization

### Single Responsibility

Each `.vibe.ts` file should have a single, focused purpose:

**Good:**
```typescript
// @vibe:goal Validate JWT tokens

export function validateToken(token: string): Claims { ... }
export function isTokenExpired(claims: Claims): boolean { ... }
```

**Bad (too many responsibilities):**
```typescript
// @vibe:goal Handle all authentication

export function validateToken() { ... }
export function createUser() { ... }
export function sendPasswordReset() { ... }
export function updateUserProfile() { ... }
```

### Exports

Export functions and types that other modules need:

```typescript
// Named exports preferred
export function validateToken(): Claims { ... }
export type Claims = { ... };

// Default export for main functionality (optional)
export default {
  validateToken,
  isTokenExpired,
};
```

### Error Handling

Document and handle errors explicitly:

```typescript
// @vibe:outputs Validated claims or throws TokenValidationError

export class TokenValidationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'TokenValidationError';
  }
}

export function validateToken(token: string): Claims {
  if (!token) {
    throw new TokenValidationError('Token required', 'MISSING_TOKEN');
  }
  // ...
}
```

## Examples

### Minimal Valid File

```typescript
// @vibe:goal Add two numbers
// @vibe:touch src/math/add.vibe.ts
// @vibe:inputs Two numbers a and b
// @vibe:outputs Sum of a and b
// @vibe:constraints None
// @vibe:tests add.test.ts
// @vibe:risk low
// @vibe:rollback Revert commit

export function add(a: number, b: number): number {
  return a + b;
}
```

### Complex Feature File

```typescript
// @vibe:goal Implement rate limiting middleware for API endpoints
// @vibe:touch src/middleware/rate-limit.vibe.ts, src/types/middleware.ts, src/config/limits.ts
// @vibe:inputs Request object, rate limit config, Redis client
// @vibe:outputs Middleware function that enforces rate limits
// @vibe:constraints Max 100 requests/minute default, configurable per-route, must not block event loop
// @vibe:tests rate-limit.test.ts covers normal/exceeded/reset scenarios
// @vibe:risk medium
// @vibe:rollback Revert commit, existing requests unaffected
//
// Created: 2024-01-15
// ---

import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';
import { RateLimitConfig, RateLimitResult } from '../types/middleware';

export function createRateLimiter(
  redis: Redis,
  config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }
) {
  return async function rateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const key = `ratelimit:${req.ip}`;
    const result = await checkRateLimit(redis, key, config);

    res.setHeader('X-RateLimit-Limit', config.maxRequests);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', result.resetTime);

    if (result.exceeded) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }

    next();
  };
}

async function checkRateLimit(
  redis: Redis,
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // Implementation...
}
```

## Common Mistakes

1. **Vague goals** - Be specific about what the code does
2. **Incomplete touch patterns** - Include ALL files you'll modify
3. **Missing error documentation** - Document what can go wrong
4. **Optimistic risk assessment** - Be honest about complexity
5. **No rollback plan** - Always have a way to undo
6. **Multiple responsibilities** - Keep files focused
