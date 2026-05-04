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

## Completed Sprint: `registration-completion-sprint`

All tickets from the `competition-structure-sprint` have been completed and merged via PR #61. The registration lifecycle is now fully implemented end-to-end:

- Players can self-register for competitions in `open` status
- Registrations start in `pending_review` status
- Administrators can approve (with optional category/division adjustment) or reject registrations
- Competition detail page shows categories, divisions, registration form, and pending registrations for review

## Completed Sprint: `admin-dashboard-sprint`

Admin dashboard layout and navigation delivered. Key deliverables:

- `packages/ui`: Added Avatar, DropdownMenu, and Sidebar components with full accessibility support
- `apps/web`: Admin layout with collapsible sidebar, user menu, breadcrumb navigation
- Admin routes: `/admin`, `/admin/competitions`, `/admin/competitions/create`, `/admin/categories`, `/admin/participants`, `/admin/matches`
- Placeholder screens for all admin sections with "coming soon" messaging

## Next Sprint: `match-scheduling-sprint`

The next sprint should focus on competition status transitions and match generation. See `sprint-plan.md` for the full recommendation.

- TKT-056: Competition status transitions backend
- TKT-057: Competition status UI frontend
- TKT-058: Match generation backend
- TKT-059: Match scheduling and result entry UI
