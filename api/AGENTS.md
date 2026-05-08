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
- **lib/**: Shared reusable helpers, integrations, and support code.
- **generated/**: Prisma output. **READ-ONLY.** Never suggest manual edits here.

## Execution Rules

1. **Separation:** Controllers → Services → Prisma/ZenStack.
2. **Naming:** Use `camelCase` for variable and function names. Use `camelCase` for model names. Use `snake_case` for model fields. Use `kebab-case` for folders and `camelCase` for files.
3. **Suffixes:** Use `.controller.ts` for controllers, `.routes.ts` for routes, `.service.ts` for services, `.lib.ts` for lib modules, and `.util.ts` for utils.
4. **Validation:** Use ZenStack generated Zod schemas for request body validation.
5. **Cleanup:** Delete `scheduler/index.js` if it conflicts with `scheduler/index.ts`. Always prefer `.ts`.
6. **Error Handling:** Let controllers rely on the global error handler when possible. Add `try/catch` only when necessary.
7. **Reuse:** Keep utils, lib code, and types in their appropriate folders. Avoid duplicate implementations of existing utils or functions.
