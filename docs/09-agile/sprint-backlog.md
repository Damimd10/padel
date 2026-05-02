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
- `TKT-017` remains the next available backend slice, but it is not part of the current frontend-focused sprint snapshot.
- `TKT-018`, `TKT-019`, `TKT-020`, and `TKT-021` are treated as delivered shared UI foundation work that enables the next input-focused wave.
- `TKT-029` is now the active planned frontend sprint item for `next-ui-package-sprint`.
- `TKT-042` is now in active delivery for `auth-self-service-foundation-sprint`, with GitHub issue `#42` moved into project status `In Progress` while the frontend auth routes and typed client wrappers are implemented.

## Active Sprint Record

- ticket ID and title: `TKT-029` - Add advanced numeric and date-oriented form inputs in `packages/ui`, including shadcn-style date pickers adapted to our design system
- delivery lane: `frontend`
- affected apps/packages: `packages/ui`, `packages/config`
- owner: `unassigned`
- GitHub issue link: `https://github.com/Damimd10/padel/issues/29`
- current project status: `In Sprint`
- blocked/unblocked state: `unblocked`
- notes for carryover risk: `none; GitHub issue metadata, project status, and sprint docs are aligned for implementation`

- ticket ID and title: `TKT-042` - Build frontend login and registration routes on top of the backend auth contracts
- delivery lane: `frontend`
- affected apps/packages: `apps/web`, `packages/api-client`, `packages/ui`
- owner: `codex`
- GitHub issue link: `https://github.com/Damimd10/padel/issues/42`
- current project status: `In Progress`
- blocked/unblocked state: `unblocked`
- notes for carryover risk: `depends on the backend self-service auth contract hardening ticket for final schema ownership convergence, but the current Better Auth endpoints already allow the frontend route and typed client slice to move forward`
