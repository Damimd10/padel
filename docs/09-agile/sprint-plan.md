# Sprint Plan

Sprint planning is finalized here before execution starts.

## Required sections

- sprint goal
- sprint dates or iteration label
- capacity assumptions
- committed tickets
- stretch tickets
- lane balance across frontend / backend / infrastructure
- affected apps/packages summary
- dependencies and blockers
- GitHub milestone / project view used for execution
- exit criteria

## Ticket checklist

Every committed ticket must:

- exist in `product-backlog.md`
- exist as a GitHub Issue
- declare the correct delivery lane
- declare affected apps/packages
- be assigned the correct labels and milestone
- be placed in the correct GitHub Project status
- have clear acceptance criteria and testing expectations

## Planning Snapshot

- sprint goal: synchronize delivered backend foundation work and queue the next infrastructure and authentication blockers cleanly
- sprint dates or iteration label: `next-foundation-sprint`
- capacity assumptions:
  - monorepo, UI foundation, Storybook bootstrap, backend persistence, and the first competition-create backend slice are already delivered or accepted on `master`
  - the next delivery bottlenecks are local PostgreSQL infrastructure and authentication foundation, not another create-competition backend slice
- committed tickets:
  - none yet; the next candidates should be `TKT-015` and `TKT-016`
- stretch tickets:
  - `TKT-015` - provision local PostgreSQL with Docker for Prisma and Nest integration
  - `TKT-016` - establish Better Auth foundation for application authentication
- lane balance across frontend / backend / infrastructure:
  - infrastructure: `TKT-015`
  - frontend: completed foundation work only
  - backend: `TKT-016`
- affected apps/packages summary:
  - `TKT-015`: `apps/api`
  - `TKT-016`: `apps/api`, `apps/web`
- dependencies and blockers:
  - `TKT-015` unblocks a reproducible local PostgreSQL path for Prisma migrations, repository tests, and Better Auth persistence
  - `TKT-016` should follow `ADR-011` and is safer once `TKT-015` exists
- GitHub milestone / project view used for execution:
  - milestone: `next-foundation-sprint`
  - project status: sync after GitHub Issues are created
- exit criteria:
  - completed foundation tickets are reflected as delivered in backlog and GitHub
  - `TKT-013` is closed with the accepted persistence ADR linked
  - `TKT-014` is reflected as delivered in backlog and GitHub
  - `TKT-015` and `TKT-016` exist as GitHub Issues without reopening the already accepted Prisma or Better Auth tool choices
