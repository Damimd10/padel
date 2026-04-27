# ADR-001: Frontend Data Loading and Contract Coordination

## Status

Accepted

## Context

The frontend stack uses React, TanStack Router, TanStack Query, TanStack Form, TanStack Store, Zod, and a shared monorepo with `packages/schemas` and `packages/api-client`.

We need one explicit rule set for:

- when SSR is worth using
- how route loaders and components coordinate data loading
- how server state differs from UI state
- how forms are validated
- how frontend and backend share contracts safely

## Decision

- Use server rendering only where it provides real value for initial load performance, SEO, or security-sensitive delivery.
- Use route loaders to prefetch route-critical data with `ensureQueryData`.
- Use `useSuspenseQuery` in route components with the same query options used by the loader prefetch.
- Use TanStack Query as the only default mechanism for server state, caching, refetching, and mutations.
- Use TanStack Store only for UI-owned local or global state.
- Use TanStack Form with Zod for form state and validation.
- Invalidate specific queries after mutations instead of broad cache resets.
- Use `packages/schemas` and `packages/api-client` as the default frontend/backend coordination boundary.
- Require `packages/api-client` to validate backend responses with Zod-backed schemas before frontend consumption.

## Consequences

- Route-level data loading becomes predictable and SSR-friendly.
- Frontend features avoid duplicating server state into local UI stores.
- Shared schemas reduce contract drift between backend and frontend.
- The API client becomes the stable boundary for backend consumption from `apps/web`.
- SSR remains intentional instead of becoming the default for every route.
