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

- sprint goal: open a parallel `packages/ui` delivery track while keeping the next backend protection slice available
- sprint dates or iteration label: `next-foundation-sprint`
- capacity assumptions:
  - monorepo, UI foundation, Storybook bootstrap, backend persistence, and the first competition-create backend slice are already delivered or accepted on `master`
  - local PostgreSQL infrastructure and the Better Auth foundation are now delivered, so the next backend bottleneck is protected competition-management behavior
  - `packages/ui` and Storybook are ready for the next reusable shared-component wave without reopening stack decisions
- committed tickets:
  - `TKT-018` - establish the form foundations for reusable data-entry controls in `packages/ui`
- stretch tickets:
  - `TKT-019` - add selection and choice controls in `packages/ui`
  - `TKT-020` - add layout and feedback primitives in `packages/ui`
  - `TKT-021` - add interactive overlays in `packages/ui`
  - `TKT-017` - require authenticated identity at the competition-create inbound boundary
- lane balance across frontend / backend / infrastructure:
  - infrastructure: no new sprint-critical infrastructure work is required for this wave
  - frontend: `TKT-018` opens the next shared UI lane, with `TKT-019` and `TKT-020` eligible to run in parallel after that baseline lands
  - backend: `TKT-017` remains available as the next backend slice without blocking the UI package track
- affected apps/packages summary:
  - `TKT-017`: `apps/api`, `packages/schemas`
  - `TKT-018`: `packages/ui`, `packages/config`
  - `TKT-019`: `packages/ui`, `packages/config`
  - `TKT-020`: `packages/ui`, `packages/config`
  - `TKT-021`: `packages/ui`, `packages/config`
- dependencies and blockers:
  - `TKT-018` should establish the field-level baseline and Storybook documentation contract before more specialized shared input components expand the API surface
  - `TKT-019` and `TKT-020` can run in parallel once `TKT-018` lands because they touch different component families
  - `TKT-021` depends on the shared overlay documentation and portal behavior already established by the Storybook foundation and should avoid reopening package-boundary decisions
  - `TKT-017` should consume the delivered auth foundation instead of reopening auth-tool or session-wiring decisions
- GitHub milestone / project view used for execution:
  - milestone: `next-foundation-sprint`
  - project status: sync after GitHub Issues are created
- exit criteria:
  - `TKT-018` is implemented with stories and tests and becomes the approved baseline for subsequent form-related controls
  - `TKT-019` and `TKT-020` can be executed independently without duplicating shared helpers or component taxonomy
  - `TKT-021` is only started once overlay states and accessibility expectations are explicit in the shared docs and Storybook setup
  - `TKT-017` remains ready for execution in parallel with the frontend track if backend capacity is available
