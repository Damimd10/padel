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
  - implementation should stay focused on shared input semantics and shadcn-style date-picker composition, and should not expand into feature-specific parsing, persistence, presets, or business-rule-specific date workflows
- committed tickets:
  - `TKT-029` - add advanced numeric and date-oriented form inputs in `packages/ui`
- stretch tickets:
  - `TKT-030` - add shared operational feedback primitives in `packages/ui`
  - `TKT-031` - add shared summary and metadata display primitives in `packages/ui`
  - `TKT-032` - add shared table foundations for dense operational views in `packages/ui`
- lane balance across frontend / backend / infrastructure:
  - infrastructure: no sprint-critical infrastructure work is required for this wave
  - frontend: `TKT-029` remains the committed UI-package item, with `TKT-030` and `TKT-031` as the next parallelizable display layers once the input baseline is stable
  - backend: no backend ticket is committed in this sprint snapshot
- affected apps/packages summary:
  - `TKT-029`: `packages/ui`, `packages/config`
  - `TKT-030`: `packages/ui`, `packages/config`
  - `TKT-031`: `packages/ui`, `packages/config`
  - `TKT-032`: `packages/ui`, `packages/config`
- dependencies and blockers:
  - `TKT-029` depends on the delivered `Field` contract and previously shipped shared form primitives already present in `packages/ui`
  - `Date Picker` and `Date Range Picker` should build on shared `Popover` and calendar primitives while remaining generic enough to map into TanStack Form without introducing app-owned business rules into `packages/ui`
  - `TKT-031` should consume the shared status and feedback semantics clarified by `TKT-030` before hardening summary and progress display contracts
  - `TKT-032` should follow the feedback and summary-display wave so table states inherit a stable operational vocabulary
- GitHub milestone / project view used for execution:
  - milestone: `next-ui-package-sprint`
  - project status: issue `#29` is in `Padel Delivery` with status `In Sprint`, and issue `#31` is represented on the board as `Planned`
- exit criteria:
  - `TKT-029` lands with shared exports, Storybook coverage, and tests for `Numeric Input`, `Date Picker`, and `Date Range Picker`
  - the shipped APIs remain generic and compose with `Field` without feature-specific parsing or submission logic
  - Storybook documents invalid, disabled, read-only, and keyboard-relevant states clearly enough for competition-configuration and result-entry forms
  - GitHub execution state stays synced so the sprint doc, issue metadata, and project board all reflect the same committed and planned work

## Supplemental Sprint Snapshot

- sprint goal: deliver the first user-facing self-service authentication entry flow so the web app has real login, registration, guest-only routing, and a credible post-login landing path on top of the Better Auth backend surface
- sprint dates or iteration label: `auth-self-service-foundation-sprint`
- capacity assumptions:
  - the Better Auth backend foundation is already delivered and running through `apps/api`
  - frontend implementation can begin against the live Better Auth session endpoints while backend contract hardening continues in parallel
  - this slice should stay focused on sign-up, sign-in, sign-out, current-session handling, and guest-only route behavior
- committed tickets:
  - `TKT-042` - build frontend login and registration routes on top of the backend auth contracts
- stretch tickets:
  - `TKT-043` - expose backend sign-up, sign-in, sign-out, and session contracts for self-service auth
- lane balance across frontend / backend / infrastructure:
  - frontend: `TKT-042` is the active implementation slice for authenticated entry and landing behavior
  - backend: `TKT-043` remains the contract-hardening companion ticket for explicit schema ownership and auth error mapping
  - infrastructure: no additional sprint-critical infrastructure work is required beyond the already delivered local PostgreSQL and Better Auth foundation
- affected apps/packages summary:
  - `TKT-042`: `apps/web`, `packages/api-client`, `packages/ui`
  - `TKT-043`: `apps/api`, `packages/schemas`
- dependencies and blockers:
  - `TKT-042` depends on the delivered Better Auth runtime from `TKT-016` and can scaffold the frontend route layer before `TKT-043` is fully complete
  - the frontend slice must keep auth-specific mutation logic in `apps/web` and `packages/api-client`, not in `packages/ui`
  - final long-term ownership of the auth transport contracts should converge with `TKT-043` once the backend companion slice is complete
- GitHub milestone / project view used for execution:
  - milestone: `auth-self-service-foundation-sprint`
  - project status: issue `#42` is represented in `Padel Delivery` as `In Progress`
- exit criteria:
  - `TKT-042` lands with typed auth client wrappers, login and registration routes, guest-only redirect behavior, and tests for route and form-state handling
  - authenticated users reach a credible post-login landing route rather than remaining on guest-only entry screens
  - the sprint doc, issue metadata, and GitHub project status remain aligned throughout delivery
