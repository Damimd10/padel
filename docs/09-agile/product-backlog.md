# Product Backlog

Approved backlog items live here before they are created or updated in GitHub Issues.

## Ticket template

For each ticket, include:

- ID
- type
- epic
- delivery lane (`frontend`, `backend`, `infrastructure`)
- affected apps/packages
- title
- story/task description
- acceptance criteria
- linked docs
- linked ADRs
- testing expectations
- estimate
- status
- implementation workflow (`frontend` or `backend`, optional for infra-only tickets)
- GitHub labels
- milestone/sprint
- GitHub issue URL or placeholder

## Status guidance

- `draft`: documented but not approved
- `approved`: ready to sync into GitHub Issues
- `planned`: selected for upcoming sprint consideration
- `in-sprint`: committed in sprint and represented on the GitHub board
- `done`: delivered and closed

## Backlog Items

### TKT-010 - Enforce module boundaries automatically in Nx

- ID: `TKT-010`
- type: `task`
- epic: `monorepo-foundation`
- delivery lane: `infrastructure`
- affected apps/packages: `apps/web`, `apps/api`, `packages/ui`, `packages/schemas`, `packages/api-client`, `packages/config`
- title: `Add explicit automated boundary enforcement beyond graph visibility`
- story/task description: Add approved automated module-boundary enforcement so invalid cross-package imports fail locally and in CI instead of relying on graph inspection and review only. The solution must follow ADR-008 and the documented boundary rules without introducing unapproved tooling.
- acceptance criteria:
  - an approved enforcement mechanism is documented or confirmed from existing ADRs before implementation starts
  - invalid imports across documented package boundaries fail through an automated local and CI check
  - the enforcement covers at least the boundaries in `/docs/10-monorepo/package-boundaries.md`
  - developer-facing docs explain where the rule runs and how violations are fixed
  - implementation does not introduce a new tool unless a supporting ADR is accepted first
- linked docs:
  - `/docs/10-monorepo/package-boundaries.md`
  - `/docs/10-monorepo/dependency-policy.md`
  - `/docs/10-monorepo/build-pipeline.md`
  - `/docs/15-developer-experience/nx-strategy.md`
  - `/docs/15-developer-experience/quality-gates.md`
- linked ADRs:
  - `/docs/07-adrs/adr-008-monorepo-tooling.md`
- testing expectations:
  - unit: n/a unless the selected enforcement mechanism requires custom validation code
  - integration: add a reproducible validation path that proves a boundary violation fails the configured check
  - e2e/manual: verify local and CI commands both surface the violation with actionable output
- estimate: `M`
- status: `approved`
- implementation workflow: `backend`
- GitHub labels: `type:task`, `lane:infrastructure`, `area:monorepo`, `area:nx`, `area:architecture`
- milestone/sprint: `next-foundation-sprint`
- GitHub issue URL or placeholder: `TBD`

### TKT-011 - Bootstrap Storybook for the shared UI package

- ID: `TKT-011`
- type: `task`
- epic: `ui-package-foundation`
- delivery lane: `frontend`
- affected apps/packages: `packages/ui`, `packages/config`
- title: `Bootstrap Storybook when packages/ui gets its first reusable component surface`
- story/task description: Initialize Storybook for `packages/ui` once the package exposes its first real reusable component API. The bootstrap should align with the documented UI package and Storybook strategy and establish the minimum validation path required for future reusable UI work.
- acceptance criteria:
  - Storybook is configured for `packages/ui` and can render the first reusable shared component surface
  - at least one real reusable UI component has stories covering default and relevant state examples
  - Nx targets and root scripts expose the agreed Storybook workflow
  - CI and review guidance document when Storybook validation must run
  - placeholder-only package exports are not treated as sufficient Storybook scope
- linked docs:
  - `/docs/13-ui-package-storybook/ui-package-overview.md`
  - `/docs/13-ui-package-storybook/storybook-guidelines.md`
  - `/docs/11-design-system/storybook-documentation-strategy.md`
  - `/docs/15-developer-experience/storybook-dx.md`
  - `/docs/13-testing/storybook-testing.md`
- linked ADRs:
  - `/docs/07-adrs/adr-008-monorepo-tooling.md`
- testing expectations:
  - unit: keep component-level tests aligned with the first real reusable component added to `packages/ui`
  - integration: verify Storybook build or validation target passes through Nx
  - e2e/manual: manually confirm stories render and document the intended component states
- estimate: `M`
- status: `approved`
- implementation workflow: `frontend`
- GitHub labels: `type:task`, `lane:frontend`, `area:ui-package`, `area:storybook`, `area:design-system`
- milestone/sprint: `next-foundation-sprint`
- GitHub issue URL or placeholder: `TBD`
