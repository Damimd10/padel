# Sprint Backlog

This document mirrors the active sprint scope selected from the approved backlog.

## Per-ticket tracking

Track:

- ticket ID and title
- delivery lane
- affected apps/packages
- owner
- GitHub issue link
- current project status
- blocked/unblocked state
- notes for carryover risk

## Sync rule

If this document and the GitHub Project disagree, update both and record the reason for the change.

## Current State

- `TKT-010`, `TKT-011` and `TKT-012` are delivered on `master` and should be treated as completed foundation work rather than open sprint candidates.
- `TKT-013` is completed through `ADR-010`.
- `TKT-014` is delivered as the first backend implementation slice for competition creation under `CORE-01`.
- `TKT-015` is delivered as the local PostgreSQL infrastructure path for Prisma, NestJS integration, and repository-backed database tests.
- `TKT-016` is delivered as the Better Auth foundation for application authentication, including PostgreSQL-backed session persistence and documented local validation.
- `TKT-017` is delivered: the competition creation endpoint is protected with `AuthenticatedGuard`, `ownerId` is derived from the authenticated session, and unauthenticated requests are rejected consistently.
- `TKT-018`, `TKT-019`, `TKT-020`, and `TKT-021` are delivered as shared UI foundation work (form primitives, choice controls, layout/feedback primitives, interactive overlays).
- `TKT-029` is delivered: `Numeric Input`, `Date Picker`, and `Date Range Picker` are exported from `packages/ui` with Storybook coverage and tests.
- `TKT-030` is delivered: `Inline Alert`, `Toast`, and `Empty State` are exported from `packages/ui` with Storybook coverage and tests.
- `TKT-031` is delivered: `Inline Metadata List`, `Key-Value Summary Block`, and `Progress Indicator` are exported from `packages/ui` with Storybook coverage and tests.
- `TKT-032` is delivered: shared table foundations with row-state support are exported from `packages/ui` with Storybook coverage and tests.
- `TKT-042` is delivered: sign-in, sign-up, forget-password, and reset-password routes are implemented in `apps/web` with typed auth client wrappers in `packages/api-client`, guest-only redirect behavior, and authenticated route protection.
- `TKT-043` is delivered: backend self-service auth contracts for sign-up, sign-in, sign-out, session, forget-password, and reset-password are implemented in `apps/api` with schemas in `packages/schemas`.
- `TKT-045` (backend forgot-password and reset-password flows) and `TKT-046` (frontend forgot-password and reset-password screens) are delivered as part of the auth self-service sprint.
- Both `next-ui-package-sprint` and `auth-self-service-foundation-sprint` milestones are complete.
- `TKT-047` through `TKT-053` are the new approved backlog items for the `competition-structure-sprint`, covering category management, division management, participant registration, and their frontend UIs.

## Active Sprint Record

- ticket ID and title: `TKT-047` - Add backend category management endpoints for competitions
- delivery lane: `backend`
- affected apps/packages: `apps/api`, `packages/schemas`
- owner: `unassigned`
- GitHub issue link: `https://github.com/Damimd10/padel/issues/49`
- current project status: `In Sprint`
- blocked/unblocked state: `unblocked`
- notes for carryover risk: `none; depends on delivered Competition aggregate (TKT-014) and authenticated boundary (TKT-017)`

- ticket ID and title: `TKT-048` - Add backend division management endpoints for competitions
- delivery lane: `backend`
- affected apps/packages: `apps/api`, `packages/schemas`
- owner: `unassigned`
- GitHub issue link: `https://github.com/Damimd10/padel/issues/50`
- current project status: `In Sprint`
- blocked/unblocked state: `unblocked`
- notes for carryover risk: `none; depends on delivered Competition aggregate (TKT-014) and authenticated boundary (TKT-017)`

- ticket ID and title: `TKT-049` - Add backend participant registration endpoint for competitions
- delivery lane: `backend`
- affected apps/packages: `apps/api`, `packages/schemas`
- owner: `unassigned`
- GitHub issue link: `https://github.com/Damimd10/padel/issues/52`
- current project status: `Planned`
- blocked/unblocked state: `depends on TKT-047 and TKT-048`
- notes for carryover risk: `registration requires categories and divisions to exist before it can validate category/division assignment`

- ticket ID and title: `TKT-050` - Add backend registration review, approval, and rejection endpoints
- delivery lane: `backend`
- affected apps/packages: `apps/api`, `packages/schemas`
- owner: `unassigned`
- GitHub issue link: `https://github.com/Damimd10/padel/issues/54`
- current project status: `Planned`
- blocked/unblocked state: `depends on TKT-049`
- notes for carryover risk: `review workflow requires registrations to exist first`

- ticket ID and title: `TKT-051` - Build frontend competition detail page with category and division management UI
- delivery lane: `frontend`
- affected apps/packages: `apps/web`, `packages/api-client`, `packages/ui`
- owner: `unassigned`
- GitHub issue link: `https://github.com/Damimd10/padel/issues/51`
- current project status: `Planned`
- blocked/unblocked state: `depends on TKT-047 and TKT-048`
- notes for carryover risk: `frontend UI requires backend category and division contracts to be stable`

- ticket ID and title: `TKT-052` - Build frontend participant registration flow for competitions
- delivery lane: `frontend`
- affected apps/packages: `apps/web`, `packages/api-client`, `packages/ui`
- owner: `unassigned`
- GitHub issue link: `https://github.com/Damimd10/padel/issues/53`
- current project status: `Planned`
- blocked/unblocked state: `depends on TKT-047, TKT-048, and TKT-049`
- notes for carryover risk: `registration form requires categories, divisions, and registration endpoint to exist`

- ticket ID and title: `TKT-053` - Build frontend registration review and approval UI for competition administrators
- delivery lane: `frontend`
- affected apps/packages: `apps/web`, `packages/api-client`, `packages/ui`
- owner: `unassigned`
- GitHub issue link: `https://github.com/Damimd10/padel/issues/55`
- current project status: `Planned`
- blocked/unblocked state: `depends on TKT-049 and TKT-050`
- notes for carryover risk: `review UI requires registration submission and review endpoints to exist`
