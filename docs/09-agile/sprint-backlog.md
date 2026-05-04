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

## Completed Sprint: `competition-structure-sprint`

- `TKT-047` — **DONE**: Category CRUD endpoints delivered (PR #56). Domain, use cases, controller, Prisma repo, schemas, tests all present.
- `TKT-048` — **DONE**: Division CRUD endpoints delivered (PR #58). Domain, use cases, controller, Prisma repo, schemas, tests all present.
- `TKT-049` — **DONE**: Registration aggregate + create + list delivered (PR #60). Status changed to `pending_review` on creation. Validation for competition state and category/division existence added.
- `TKT-050` — **DONE**: Registration review/approve/reject endpoints delivered. Status transition use cases, HTTP endpoints, and schemas implemented.
- `TKT-051` — **DONE**: Competition detail page with category and division management UI delivered. Division CRUD, registration form, and registration review UI included.
- `TKT-052` — **DONE**: Frontend participant registration flow delivered. Registration form with category/division selection, typed API client wrappers, and success/error states.
- `TKT-053` — **DONE**: Frontend registration review and approval UI delivered. Table-based review view, approve/reject actions with category/division adjustment, admin-only access.

## Active Sprint Record: `registration-completion-sprint`

All tickets from the `competition-structure-sprint` have been completed and merged. The registration lifecycle is now fully implemented end-to-end:

- Players can self-register for competitions in `open` status
- Registrations start in `pending_review` status
- Administrators can approve (with optional category/division adjustment) or reject registrations
- Competition detail page shows categories, divisions, registration form, and pending registrations for review
