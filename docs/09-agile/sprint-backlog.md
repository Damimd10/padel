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
- The next recommended backend ticket after that is `TKT-016`, establishing the Better Auth foundation.

## Active Sprint Record

- ticket ID and title: `TKT-015` - Provision local PostgreSQL with Docker for Prisma and Nest integration
- delivery lane: `infrastructure`
- affected apps/packages: `apps/api`
- owner: `unassigned`
- GitHub issue link: `https://github.com/Damimd10/padel/issues/14`
- current project status: `done`
- blocked/unblocked state: `unblocked`
- notes for carryover risk: `none; Better Auth foundation now depends on the delivered local PostgreSQL workflow instead of a remote/shared database`
