# Copilot instructions for `queue-service`

## Build, test, and lint commands

This repository is multi-package (`api`, `client`, `producer-sdk`, `worker-sdk`, and `test/playground/worker-test`) with package-local scripts.

| Area                          | Install                                         | Lint                        | Build                                             | Test                                              |
| ----------------------------- | ----------------------------------------------- | --------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `client`                      | `cd client && npm install`                      | `cd client && npm run lint` | `cd client && npm run build`                      | No automated test runner is configured            |
| `api`                         | `cd api && npm install`                         | No lint script is defined   | `cd api && npm run build`                         | `npm test` is a placeholder that exits with error |
| `producer-sdk`                | `cd producer-sdk && npm install`                | No lint script is defined   | `cd producer-sdk && npm run build`                | `npm test` is a placeholder that exits with error |
| `worker-sdk`                  | `cd worker-sdk && npm install`                  | No lint script is defined   | `cd worker-sdk && npm run build`                  | `npm test` is a placeholder that exits with error |
| `test/playground/worker-test` | `cd test/playground/worker-test && npm install` | No lint script is defined   | `cd test/playground/worker-test && npm run build` | `npm test` is a placeholder that exits with error |

Additional API runtime/build commands:

- Generate ZenStack/Prisma client: `cd api && npm run generate`
- Run scheduler loop: `cd api && npm run scheduler:dev` (or `scheduler:prod`)

Single-test command support: no package currently has a real test framework configured, so single-test execution is not available yet.

## High-level architecture

- **API (`api`)** is an Express + TypeScript backend backed by PostgreSQL via ZenStack/Prisma.
    - `src/index.ts` mounts:
        - **Dashboard/JWT routes** (`/api/dashboard/...`) for authenticated web UI use.
        - **Worker/API-key routes** (`/api/worker/job/...`) for SDK-driven job processing.
    - Queue orchestration logic lives in `src/services/job/job.service.ts` and uses transactional state transitions plus `FOR UPDATE SKIP LOCKED` dequeueing to avoid duplicate job pickup across workers.
    - `src/scheduler/index.ts` runs monitor services to requeue/fail timed-out or dead-heartbeat jobs.

- **SDKs (`producer-sdk`, `worker-sdk`)** are TypeScript packages built with tsup.
    - Producer SDK posts jobs to `/api/worker/job/create`.
    - Worker SDK polls `/next-job`, sends heartbeats, and marks completion/failure.
    - SDK axios clients attach `x-api-key` + `x-producer-id` or `x-worker-id` headers required by API middleware.

- **Client (`client`)** is a React + Vite + TanStack Query dashboard app.
    - Uses context providers for auth/project state.
    - Uses a shared axios client with refresh-token response interceptor (`/api/auth/refresh-token`) and `withCredentials`.
    - Route wrappers enforce authenticated access and active project context before feature routes render.

- **Data model** is declared as modular ZenStack `.zmodel` files in `api/src/models/**/dbmodel`, imported into `api/schema.zmodel`, then generated into `api/src/generated/prisma-cli`.

## Key conventions in this codebase

- **Express request context is middleware-driven**: `req.db`, `req.user`, `req.project`, `req.worker_id`, `req.producer_id`, and `req.validQuery` are populated by middleware (`common/types/express.d.ts`, prisma/auth/header middlewares). Preserve this flow when adding endpoints.

- **Auth split is intentional**:
    - Dashboard/UI endpoints use `passport.authenticate("jwt")` + `attachPrismaContext`.
    - Worker endpoints use `passport.authenticate("api-key", { assignProperty: "project" })` plus worker/producer header extractors.

- **Job status transitions must stay coupled with side effects**: updates to `Job` state are typically performed in a transaction together with `job_events`, `queue_metrics`, and `worker_status` updates. Follow existing service patterns instead of partial updates.

- **Validation pattern**: request body/query validation is done with shared Zod middleware; query-validated data is read from `req.validQuery`; UUID params are validated with `validateId`.

- **Naming/shape across worker APIs is snake_case** (`queue_label`, `timeout_ms`, etc.) and SDKs already send this shape; keep compatibility.

- **Formatting/import conventions are strict**: Prettier uses tabs, semicolons, and `@trivago/prettier-plugin-sort-imports` with package-specific alias ordering. Match existing alias usage (`@config`, `@services`, `@features`, etc.) and import groups.

## Restricted Operations & CLI Safety

- **Migrations:**The source of truth is `schema.zmodel`. Always use `npm run generate` followed by `npm run migrate:dev` or the specific ZenStack migration flow.
    - For local development, Copilot CLI actions that update/generated DB code should run `cd api && npm run generate` and then `cd api && npm run migrate:dev` (or the ZenStack equivalent). Do NOT run any production migration commands or destructive migration resets without explicit user approval.
    - Data migration scripts: Ask for approval before executing any Prisma data migration script along with the migration sql query.
- **Dependency Management:** Before adding a new npm package, the agent must ask for permission. Do not autonomously run `npm install`.
- **Environment Variables:** Never create or modify `.env` files with real credentials. Only suggest changes to `.env.example`.
- **Generated Code:** Do not attempt to fix errors inside the `src/generated/` folder. Re-run the generation script instead.
- **Database Destructive Actions:** Strictly forbidden to suggest `npx prisma migrate reset` or any command that drops tables without explicit user confirmation.
- **Production Deployments:** Do not suggest or execute deployment scripts without explicit user approval. Always confirm the target environment and deployment strategy before proceeding.

# Workflow Rules

- **Branch Creation First:** Before executing any plan that involves code changes, file modifications, or deletions, the first step must always be to create a new Git branch from the main branch.
- **Branch Naming Logic:** Use the command `git checkout -b <prefix>/<scope>/<description>` using the following mapping:
    - `feat/`: New features or significant additions.
    - `fix/`: Bug fixes.
    - `chore/`: Maintenance tasks, dependencies, or configuration changes.
    - `hot-fix/`: Critical production fixes.
    - `refactor/`: Code changes that neither fix a bug nor add a feature.
    - Use scoped prefixes for all branch types: `b/` for backend, `f/` for frontend, `w/` for worker SDK, and `p/` for producer SDK. Example: `feat/b/add-jwt-auth`, `fix/f/button-styling`, `chore/w/update-dependencies`.
- **Description Format:** The `<description>` should be kebab-case and concise (e.g., `feat/add-jwt-auth`).
- **Pre-execution Check:** Always ensure `git status` is clean or warned before branching.
