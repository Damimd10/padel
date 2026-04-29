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
  - local PostgreSQL infrastructure and the Better Auth foundation are now delivered, so the next backend bottleneck is protected competition-management behavior
- committed tickets:
  - `TKT-015` - provision local PostgreSQL with Docker for Prisma and Nest integration
- stretch tickets:
  - `TKT-016` - establish Better Auth foundation for application authentication
- lane balance across frontend / backend / infrastructure:
  - infrastructure: delivered through `TKT-015`
  - frontend: completed foundation work only
  - backend: `TKT-016` delivered; next recommendation is `TKT-017`
- affected apps/packages summary:
  - `TKT-015`: `apps/api`
  - `TKT-016`: `apps/api`, `apps/web`
  - `TKT-017`: `apps/api`, `packages/schemas`
- dependencies and blockers:
  - `TKT-015` delivered the reproducible local PostgreSQL path for Prisma migrations, repository tests, and Better Auth persistence
  - `TKT-016` followed `ADR-011` and now provides the reusable auth/session boundary needed before protected competition flows
  - `TKT-017` should consume the delivered auth foundation instead of reopening auth-tool or session-wiring decisions
- GitHub milestone / project view used for execution:
  - milestone: `next-foundation-sprint`
  - project status: sync after GitHub Issues are created
- exit criteria:
  - completed foundation tickets are reflected as delivered in backlog and GitHub
  - `TKT-013` is closed with the accepted persistence ADR linked
  - `TKT-014` is reflected as delivered in backlog and GitHub
  - `TKT-015` is reflected as delivered in backlog and GitHub without reopening the accepted Prisma choice
  - `TKT-016` is reflected as delivered in backlog and GitHub without reopening the accepted Better Auth choice
