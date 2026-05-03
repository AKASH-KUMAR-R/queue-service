# AGENTS.md — Client Copilot Context

Use this file as the default context for coding and planning tasks in `client/`.

## 1) Module snapshot

- Stack: **React 19 + TypeScript + Vite**, React Router, TanStack Query, Axios, React Hook Form + Zod, Sonner.
- App bootstrap/provider order is important: `ThemeProvider -> Toaster -> QueryClientProvider -> AuthProvider -> ProjectProvider -> AppLayout`.
- Routing is centralized in `src/app/routes/index.tsx` and composed from route modules.

## 2) Commands

- Install: `cd client && npm install`
- Dev: `cd client && npm run dev`
- Lint: `cd client && npm run lint`
- Build: `cd client && npm run build`
- Tests: no automated test runner is configured in `client` yet.

## 3) Code organization conventions

- Use path aliases from `tsconfig.app.json`: `@app/*`, `@shared/*`, `@features/*`, `@entities/*`, `@widgets/*`, `@pages/*`.
- Keep feature logic in `src/features/<feature>/...` with:
  - `services/` for API calls
  - `data/` for React Query hooks and keys
  - `components/` for UI
- Keep shared primitives in `src/shared/` (`api`, `ui`, `utils`, `types`, `hooks`).
- Keep route definitions typed with `AppRouteObject` and include breadcrumb metadata through `handle` when appropriate.

## 4) API and data best practices

- Use the shared clients from `@shared/api`:
  - `api` for authenticated calls
  - `unauthorizedApi` for login/signup flows
- Do not create new ad-hoc Axios instances in features.
- Preserve cookie auth behavior (`withCredentials`) and token-refresh behavior in the response interceptor.
- Build query strings with `generateQueryParams` from `@shared/api/utils/requestUtils`.
- Transform server payloads to entity-safe client shapes using `@entities/*/utils/transform` helpers before returning data from services.

## 5) React Query best practices

- Define stable query keys in `data/keys.ts` files (`projectKeys`, `queueKeys`, `jobKeys`, etc.).
- Keep hooks thin (`useQuery`/`useMutation`) and delegate network details to `services`.
- After successful mutations, invalidate the relevant query key namespace (or clear client only when intentional, e.g., login/logout flows).
- Use project-aware and filter-aware keys (include ids/filter objects in keys like current code does).

## 6) Forms, errors, and UX best practices

- Use `react-hook-form` + `zodResolver` for forms.
- Parse API errors via `handleError` / `prettifyFieldErrors` and map field errors with `mapServerFieldErrorToFormFields`.
- Surface user-facing results with `toast.success|error|info` from Sonner.
- Keep loading/empty states explicit (spinners/empty-state UI), especially in wrappers and route-level screens.

## 7) Auth/project context and route guards

- Access auth only via `useAuth()` and project state via `useProject()`.
- Keep existing guard/wrapper flow intact:
  - `CommonLayoutWrapper` handles session bootstrap and login redirect.
  - `ProjectsExistenceWrapper` hydrates projects/current project.
  - `CurrentProjectAttachWrapper` syncs `projectId` to URL.
- Do not bypass wrappers with direct page-level auth/project checks unless there is a strong reason.

## 8) Formatting and linting conventions

- Follow Prettier config in this package: tabs, semicolons, sorted imports via `@trivago/prettier-plugin-sort-imports`.
- Keep imports grouped and ordered; prefer aliases over long relative paths.
- Keep TypeScript strictness intact (do not add `any` unless absolutely unavoidable).

## 9) Planning template for Copilot tasks

For non-trivial tasks, plan in this order:

1. **Scope**: list touched routes/features/services and expected behavior changes.
2. **Data path**: define API/service changes and required entity transforms.
3. **State/cache**: update/add query keys and invalidation strategy.
4. **UI/forms**: define loading/error/success states and toast behavior.
5. **Guards/routing**: verify wrappers and breadcrumb handles are still correct.
6. **Quality gate**: run `npm run lint` and `npm run build` in `client`.

## 10) Task output template

When implementing, prefer this response structure:

- **Outcome**: what changed.
- **Files**: key files touched.
- **Behavior**: user-visible or API-visible effects.
- **Notes**: follow-up constraints or caveats (only when necessary).
