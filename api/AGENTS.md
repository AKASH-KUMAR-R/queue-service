---
name: API Standards
description: Rules for the Express/ZenStack backend
---

# API Module: Domain-Driven Architecture

## Directory Responsibilities

- **common/**: Shared base logic (controller, middleware, service).
- **config/**: System-level configs (`.config.ts`).
- **controllers/**: Domain entry points (e.g., `job`, `queue`). Handles req/res only.
- **services/**: Business logic layer. One folder per domain. Logic MUST live here, not in controllers.
- **models/**: Data definitions and Zod/Type validators per domain.
- **routes/**: Route definitions with explicit middleware stacks.
- **errors/**: Custom application error classes (e.g., `QueueRateLimitExceeded.ts`).
- **utils/**: Pure, stateless helpers (ending in `.util.ts`).
- **generated/**: Prisma output. **READ-ONLY.** Never suggest manual edits here.

## Execution Rules

1. **Separation:** Controllers → Services → Prisma/ZenStack.
2. **Naming:** Use camelCase for files and folders. Suffix utilities with `.util.ts`.
3. **Validation:** Use ZenStack generated Zod schemas for request body validation.
4. **Cleanup:** Delete `scheduler/index.js` if it conflicts with `scheduler/index.ts`. Always prefer `.ts`.
5. **Error Handling:** Throw custom errors from `services/` and catch in `controllers/` to send appropriate HTTP responses.
