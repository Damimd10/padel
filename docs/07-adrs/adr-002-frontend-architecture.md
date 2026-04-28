# ADR-002: Frontend Architecture

## Status

Accepted

## Context

The product is a competition workflow system for clubs and organizers. The frontend must support:

- admin-heavy workflows,
- route-aware data loading,
- form-heavy operations,
- end-to-end type safety,
- maintainable team development in a monorepo.

The repo already contains a frontend direction based on React, TanStack Router, TanStack Query, TanStack Form, TanStack Store, and shared contract packages.

## Options

### Option A: React + TanStack Router + TanStack Query + TanStack Form + TanStack Store

### Option B: Next.js App Router + React Server Components

### Option C: Remix-style fullstack routing model

## Pros and Cons

### Option A

Pros:

- Strong alignment with existing repo docs and ADR-001.
- Clear separation between server state, UI state, and forms.
- Excellent fit for admin/workflow applications with predictable route loading.
- Works well with separate `apps/web` and `apps/api` deployables.
- Avoids over-coupling frontend delivery to backend runtime choices.

Cons:

- Requires discipline to keep TanStack Store limited to UI-owned state.
- SSR is available but less batteries-included than Next.js.
- Team familiarity may be lower than with React + Next.js defaults.

### Option B

Pros:

- Large ecosystem and strong SSR defaults.
- Good for SEO-heavy or content-heavy experiences.
- Familiar to many React teams.

Cons:

- The product is not content-first or SEO-first.
- React Server Components add complexity that is not obviously justified for competition admin workflows.
- Stronger coupling between frontend data model and framework conventions.
- Can blur boundaries with a separately owned backend API.

### Option C

Pros:

- Good route/data coupling.
- Strong mutation-first workflow model.
- Solid ergonomics for forms.

Cons:

- Less aligned with the already documented stack.
- Smaller local ecosystem fit relative to the repo’s chosen TanStack direction.
- Lower payoff if the backend remains a separate NestJS application.

## Trade-offs

- Choosing TanStack-based frontend architecture favors explicitness and separation over framework-centralized convenience.
- Choosing Next.js would optimize for ecosystem popularity more than for the documented domain and delivery model.
- Choosing Remix would improve some route workflows but would not materially outperform the current documented direction enough to justify stack divergence.

## Risks

- Team misuse of TanStack Store as a second server-state cache.
- Inconsistent route loader/query coordination if ADR-001 is not enforced.
- Overuse of SSR where it adds complexity without domain value.

## Decision

Use:

- React + TypeScript in `apps/web`
- TanStack Router for route architecture
- selective SSR only where it adds real value
- TanStack Query for server state
- TanStack Form + Zod for forms
- TanStack Store only for UI-owned local/global state

## Consequences

- Frontend architecture stays aligned with the documented monorepo and contract-sharing model.
- The team gets strong route-aware data loading without introducing a second mental model for server state.
- The frontend remains independently deployable from the backend while preserving end-to-end type safety through shared schemas and API client boundaries.
