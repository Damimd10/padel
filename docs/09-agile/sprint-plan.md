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

- sprint goal: finalize the next approved foundation steps after the initial pnpm + Nx workspace bootstrap
- sprint dates or iteration label: `next-foundation-sprint`
- capacity assumptions:
  - infrastructure work is available after monorepo bootstrap review is accepted
  - frontend Storybook work should start only when `packages/ui` has a real reusable component surface
- committed tickets:
  - none yet; the next two candidates are approved but not committed into an active sprint
- stretch tickets:
  - `TKT-010` - automate module boundary enforcement
  - `TKT-012` - establish the shared UI styling foundation and first reusable `packages/ui` component surface
  - `TKT-011` - bootstrap Storybook for `packages/ui`
- lane balance across frontend / backend / infrastructure:
  - infrastructure: `TKT-010`
  - frontend: `TKT-012`, `TKT-011`
  - backend: none in this follow-up set
- affected apps/packages summary:
  - `TKT-010`: `apps/web`, `apps/api`, `packages/ui`, `packages/schemas`, `packages/api-client`, `packages/config`
  - `TKT-012`: `packages/ui`, `packages/config`, `apps/web`
  - `TKT-011`: `packages/ui`, `packages/config`
- dependencies and blockers:
  - `TKT-010` depends on confirming the approved enforcement mechanism from existing docs/ADRs or accepting a new ADR if a new mechanism is required
  - `TKT-012` depends on preserving documented shared UI package boundaries while introducing the shared styling foundation and first real reusable component surface
  - `TKT-011` depends on `TKT-012` establishing the shared styling foundation and introducing the first real reusable UI component surface in `packages/ui`
- GitHub milestone / project view used for execution:
  - milestone: `next-foundation-sprint`
  - project status: sync after GitHub Issues are created
- exit criteria:
  - `TKT-010`, `TKT-011` and `TKT-012` are represented as GitHub Issues before entering active sprint scope
  - `TKT-010` has a documented enforcement approach
  - `TKT-011` is not pulled into active delivery until reusable UI scope exists through `TKT-012` or an equivalent approved prerequisite
