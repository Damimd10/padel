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

## Completed Sprint Snapshots

### Sprint: `next-ui-package-sprint` (COMPLETED)

- sprint goal: deliver the next shared form-input wave in `packages/ui` so competition configuration and result-entry workflows can rely on approved numeric and date-oriented controls
- committed tickets: `TKT-029`
- stretch tickets delivered: `TKT-030`, `TKT-031`, `TKT-032`
- exit criteria met: all shipped with shared exports, Storybook coverage, and tests

### Sprint: `auth-self-service-foundation-sprint` (COMPLETED)

- sprint goal: deliver the first user-facing self-service authentication entry flow so the web app has real login, registration, guest-only routing, and a credible post-login landing path on top of the Better Auth backend surface
- committed tickets: `TKT-042`
- stretch tickets delivered: `TKT-043`, `TKT-045`, `TKT-046`
- exit criteria met: sign-in, sign-up, forget-password, and reset-password routes implemented with typed auth client wrappers, guest-only redirect behavior, and authenticated route protection

### Sprint: `competition-structure-sprint` (COMPLETED)

- sprint goal: expand the competition operations surface with category and division management so organizers can configure the full structure needed for participant registration and match scheduling
- committed tickets: `TKT-047`, `TKT-048`
- stretch tickets delivered: `TKT-049`, `TKT-050`, `TKT-051`, `TKT-052`, `TKT-053`
- exit criteria met: category and division management endpoints landed with hexagonal architecture compliance, schema contracts, and integration tests. Registration lifecycle fully implemented end-to-end: players can self-register, administrators can review/approve/reject, and competition detail page shows full management UI.

## Next Sprint Recommendation

- sprint goal: implement match scheduling and result entry workflows so competitions can progress from registration through to completion
- sprint dates or iteration label: `match-scheduling-sprint`
- capacity assumptions:
  - registration lifecycle is fully implemented end-to-end
  - competition detail page shows categories, divisions, registrations, and review UI
  - shared UI package has all primitives needed for forms, tables, feedback, and overlays
  - competition status transitions (draft -> open -> closed) need to be implemented
- recommended committed tickets:
  - competition status transitions (backend): allow organizers to open/close competitions
  - match creation and scheduling (backend): generate matches from approved registrations
  - match result entry (backend + frontend): allow organizers to record match results
- lane balance across frontend / backend / infrastructure:
  - backend: status transitions, match generation, result persistence
  - frontend: match scheduling UI, result entry forms, bracket/standings display
  - infrastructure: no additional work required
- affected apps/packages summary:
  - backend: `apps/api`, `packages/schemas`
  - frontend: `apps/web`, `packages/api-client`, `packages/ui`
- dependencies and blockers:
  - match generation depends on approved registrations existing
  - result entry depends on matches being created
- GitHub milestone / project view used for execution:
  - new milestone: `match-scheduling-sprint`
- exit criteria:
  - organizers can open/close competitions to control registration windows
  - matches can be generated from approved registrations
  - results can be recorded and displayed
  - all endpoints have hexagonal architecture compliance, schema contracts, and integration tests
