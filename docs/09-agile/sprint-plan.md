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

- sprint goal: deliver the next shared form-input wave in `packages/ui` so competition configuration and result-entry workflows can rely on approved numeric and date-oriented controls
- sprint dates or iteration label: `next-ui-package-sprint`
- capacity assumptions:
  - the shared UI foundation, Storybook bootstrap, form foundations, choice controls, layout primitives, and overlay primitives are already delivered on `master`
  - the next highest-value UI-package gap for product workflows is the numeric and date-oriented input wave documented under `TKT-029`
  - implementation should stay focused on shared input semantics and should not expand into feature-specific parsing, persistence, or async date-picker behavior
- committed tickets:
  - `TKT-029` - add advanced numeric and date-oriented form inputs in `packages/ui`
- stretch tickets:
  - none yet; keep the sprint focused on landing the numeric and date-oriented input contract cleanly before queueing the next shared-control wave
- lane balance across frontend / backend / infrastructure:
  - infrastructure: no sprint-critical infrastructure work is required for this wave
  - frontend: `TKT-029` is the only committed UI-package item and should own the sprint focus
  - backend: no backend ticket is committed in this sprint snapshot
- affected apps/packages summary:
  - `TKT-029`: `packages/ui`, `packages/config`
- dependencies and blockers:
  - `TKT-029` depends on the delivered `Field` contract and previously shipped shared form primitives already present in `packages/ui`
  - `Date Range Input` must stay generic enough to map into TanStack Form without introducing app-owned business rules into `packages/ui`
- GitHub milestone / project view used for execution:
  - milestone: `next-ui-package-sprint`
  - project status: issue `#29` is in `Padel Delivery` with status `In Sprint`
- exit criteria:
  - `TKT-029` lands with shared exports, Storybook coverage, and tests for `Numeric Input`, `Date Input`, and `Date Range Input`
  - the shipped APIs remain generic and compose with `Field` without feature-specific parsing or submission logic
  - Storybook documents invalid, disabled, read-only, and keyboard-relevant states clearly enough for competition-configuration and result-entry forms
  - GitHub execution state stays synced so the sprint doc, issue metadata, and project board all reflect the same committed work
