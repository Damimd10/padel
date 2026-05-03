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

## Next Sprint Recommendation

- sprint goal: expand the competition operations surface with category and division management so organizers can configure the full structure needed for participant registration and match scheduling
- sprint dates or iteration label: `competition-structure-sprint`
- capacity assumptions:
  - the Better Auth runtime, frontend auth routes, and all shared UI primitives are delivered on `master`
  - competition creation is protected with authenticated identity (`TKT-017`)
  - the competition operations overview scaffold is in place but lacks category, division, and registration workflows
  - the shared UI package has table foundations, form primitives, feedback components, and date/numeric inputs ready for composition
- recommended committed tickets:
  - new backend ticket: add category management under an existing competition (epic `STRUC-01`)
  - new backend ticket: add division management under an existing competition (epic `STRUC-01`)
- recommended stretch tickets:
  - new frontend ticket: competition detail page with category and division management UI
  - new backend ticket: participant registration endpoint (epic `REG-01`)
- lane balance across frontend / backend / infrastructure:
  - backend: category and division management slices are the highest-value next step to unlock registration and scheduling
  - frontend: a competition detail page should follow once the backend contracts land
  - infrastructure: no additional infrastructure work required
- affected apps/packages summary:
  - new category/division backend tickets: `apps/api`, `packages/schemas`
  - new competition detail frontend ticket: `apps/web`, `packages/api-client`, `packages/ui`
- dependencies and blockers:
  - category and division management depend on the delivered Competition aggregate (`TKT-014`) and authenticated boundary (`TKT-017`)
  - frontend competition detail depends on backend category/division contracts landing first
- GitHub milestone / project view used for execution:
  - new milestone: `competition-structure-sprint`
- exit criteria:
  - category and division management endpoints land with hexagonal architecture compliance, schema contracts in `packages/schemas`, and integration tests against PostgreSQL
  - GitHub execution state stays synced so the sprint doc, issue metadata, and project board all reflect the same committed work
