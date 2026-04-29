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

### TKT-012 - Establish the shared UI styling foundation and first reusable component surface

- ID: `TKT-012`
- type: `task`
- epic: `ui-package-foundation`
- delivery lane: `frontend`
- affected apps/packages: `packages/ui`, `packages/config`, `apps/web`
- title: `Establish the shared UI styling foundation and introduce a Button component in packages/ui`
- story/task description: Establish the shared styling and composition foundation required for `packages/ui` to follow the documented `shadcn/ui`, Radix UI and Tailwind CSS direction before Storybook is introduced. This ticket should add the shared Tailwind and CSS entrypoint strategy needed by consumers, define the minimal supporting package setup for reusable UI work, and then introduce a shared `Button` component as the first real reusable component surface built on that foundation.
- acceptance criteria:
  - the workspace has a documented and implemented shared styling foundation for `packages/ui` consumers, including the Tailwind and shared CSS entrypoint approach needed by future Storybook setup
  - `packages/ui` exports a real reusable `Button` component instead of only a placeholder marker export
  - the `Button` API follows the documented shared UI package boundaries and does not pull in app-specific data, routing or workflow logic
  - the component supports the baseline documented interactive states relevant to a shared button surface, including default, hover, focus-visible, active and disabled
  - styling and composition align with the documented `shadcn/ui` + Tailwind approach and are consumed through the shared foundation rather than ad hoc app-local setup
  - tests validate the new shared component surface and the placeholder-only baseline export is removed or no longer presented as the package's only meaningful API
- linked docs:
  - `/docs/11-design-system/component-inventory.md`
  - `/docs/11-design-system/component-states.md`
  - `/docs/12-frontend-architecture/ui-composition.md`
  - `/docs/13-ui-package-storybook/ui-package-overview.md`
  - `/docs/13-ui-package-storybook/component-testing.md`
- linked ADRs:
  - `/docs/07-adrs/adr-002-frontend-architecture.md`
  - `/docs/07-adrs/adr-008-monorepo-tooling.md`
- testing expectations:
  - unit: validate the shared `Button` API and expected baseline rendering or behavior states
  - integration: verify the shared styling foundation and component can be consumed from package entrypoints without app-specific dependencies leaking into the shared package boundary
  - e2e/manual: confirm the resulting foundation is credible input for upcoming Storybook bootstrap work
- estimate: `S`
- status: `done`
- implementation workflow: `frontend`
- GitHub labels: `type:task`, `lane:frontend`, `area:ui-package`, `target:packages-ui`, `target:packages-config`, `target:apps-web`
- milestone/sprint: `next-foundation-sprint`
- GitHub issue URL or placeholder: `https://github.com/Damimd10/padel/issues/10`

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
- status: `done`
- implementation workflow: `backend`
- GitHub labels: `type:task`, `lane:infrastructure`, `area:monorepo`, `area:nx`, `area:architecture`
- milestone/sprint: `next-foundation-sprint`
- GitHub issue URL or placeholder: `https://github.com/Damimd10/padel/issues/6`

### TKT-011 - Bootstrap Storybook for the shared UI package

- ID: `TKT-011`
- type: `task`
- epic: `ui-package-foundation`
- delivery lane: `frontend`
- affected apps/packages: `packages/ui`, `packages/config`
- title: `Bootstrap Storybook when packages/ui gets its first reusable component surface`
- story/task description: Initialize Storybook for `packages/ui` once the package exposes its first real reusable component API. The bootstrap should align with the documented UI package and Storybook strategy, load the shared Tailwind and design-token setup used by `shadcn/ui`-style components, support Radix-based interaction states, and establish the minimum validation path required for future reusable UI work.
- acceptance criteria:
  - Storybook is configured for `packages/ui` and can render the first reusable shared component surface
  - the Storybook preview environment loads the shared Tailwind, token and styling setup required by the documented `shadcn/ui` + Radix approach
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
- status: `done`
- implementation workflow: `frontend`
- GitHub labels: `type:task`, `lane:frontend`, `area:ui-package`, `area:storybook`, `area:design-system`
- milestone/sprint: `next-foundation-sprint`
- GitHub issue URL or placeholder: `https://github.com/Damimd10/padel/issues/7`

### TKT-013 - Choose the backend persistence implementation strategy for CORE-01

- ID: `TKT-013`
- type: `task`
- epic: `competition-management-core`
- delivery lane: `backend`
- affected apps/packages: `apps/api`
- title: `Document and approve the persistence approach for the first competition backend slice`
- story/task description: Before implementation work from `CORE-01` starts, document and approve the backend persistence implementation strategy for the NestJS modular monolith. The decision should translate the accepted PostgreSQL and hexagonal architecture direction into an implementation-ready approach for repositories, transactions, migrations, and backend integration testing without leaking ORM or persistence details into the domain layer.
- acceptance criteria:
  - an accepted ADR or equivalent approved technical decision defines the persistence implementation approach for `apps/api`
  - the chosen approach explains how repository ports stay owned by the core while persistence implementations remain in outbound adapters or infrastructure
  - transaction, migration, and local/CI testing implications are documented for the selected approach
  - the decision is explicit enough that the first `CORE-01` backend ticket can implement competition creation without reopening the persistence-tool choice
  - no backend feature implementation starts from `CORE-01` until this decision is accepted
- linked docs:
  - `/docs/16-backend-architecture/hexagonal-architecture.md`
  - `/docs/16-backend-architecture/database-strategy.md`
  - `/docs/16-backend-architecture/backend-coding-standards.md`
  - `/docs/05-architecture/domain-model.md`
  - `/docs/04-use-cases/use-cases.md`
- linked ADRs:
  - `/docs/07-adrs/adr-003-backend-architecture.md`
  - `/docs/07-adrs/adr-004-database-choice.md`
  - `/docs/07-adrs/adr-010-backend-persistence-implementation.md`
- testing expectations:
  - unit: n/a for the decision ticket itself unless supporting validation code is introduced
  - integration: document the expected backend integration-test path for persistence adapters under the selected approach
  - e2e/manual: architecture review confirms the decision is implementation-ready for `CORE-01`
- estimate: `S`
- status: `done`
- implementation workflow: `backend`
- GitHub labels: `type:task`, `lane:backend`, `area:backend`, `area:architecture`, `area:data`
- milestone/sprint: `next-foundation-sprint`
- GitHub issue URL or placeholder: `https://github.com/Damimd10/padel/issues/12`

### TKT-014 - Implement the first competition creation backend slice

- ID: `TKT-014`
- type: `task`
- epic: `competition-management-core`
- delivery lane: `backend`
- affected apps/packages: `apps/api`, `packages/schemas`
- title: `Implement the first backend slice for creating a competition`
- story/task description: Implement the first backend delivery slice under `CORE-01` for competition creation. This ticket should establish the minimal end-to-end backend path for creating a competition in draft state using the accepted hexagonal architecture and the persistence approach from `ADR-010`. The slice should cover the Competition aggregate boundary, a create-competition use case, repository port plus adapter implementation, request/response schemas, and an inbound HTTP endpoint without pulling category, division, or registration workflows into the same ticket.
- acceptance criteria:
  - a Competition aggregate or equivalent domain core model exists for the create-competition slice and enforces the minimum invariants required by `UC-01`, `FR-02`, and `BR-02`
  - an application-layer create-competition use case accepts validated input and persists a new competition in draft state
  - a repository port is owned by the core and an outbound persistence adapter implements it using the accepted persistence strategy from `ADR-010`
  - `packages/schemas` exposes the request and response contract for the create-competition endpoint
  - `apps/api` exposes an inbound HTTP endpoint for competition creation that validates input, maps errors consistently, and does not leak persistence details across the boundary
  - category management, division setup, and frontend form delivery remain out of scope for this ticket
- linked docs:
  - `/docs/04-use-cases/use-cases.md`
  - `/docs/05-architecture/domain-model.md`
  - `/docs/03-requirements/functional-requirements.md`
  - `/docs/03-requirements/business-rules.md`
  - `/docs/16-backend-architecture/backend-overview.md`
  - `/docs/16-backend-architecture/hexagonal-architecture.md`
  - `/docs/16-backend-architecture/backend-coding-standards.md`
  - `/docs/16-backend-architecture/database-strategy.md`
- linked ADRs:
  - `/docs/07-adrs/adr-003-backend-architecture.md`
  - `/docs/07-adrs/adr-004-database-choice.md`
  - `/docs/07-adrs/adr-005-api-communication-pattern.md`
  - `/docs/07-adrs/adr-009-testing-stack.md`
  - `/docs/07-adrs/adr-010-backend-persistence-implementation.md`
- testing expectations:
  - unit: cover competition domain invariants and the create-competition use case with fakes at the port boundary
  - integration: verify the repository adapter against real PostgreSQL and verify the HTTP endpoint through NestJS adapter tests
  - e2e/manual: n/a until a frontend flow or broader competition-management path is delivered
- estimate: `M`
- status: `done`
- implementation workflow: `backend`
- GitHub labels: `type:task`, `lane:backend`, `area:backend`, `area:competition`, `target:apps-api`, `target:packages-schemas`
- milestone/sprint: `next-foundation-sprint`
- GitHub issue URL or placeholder: `https://github.com/Damimd10/padel/issues/13`

### TKT-015 - Provision local PostgreSQL infrastructure for backend delivery

- ID: `TKT-015`
- type: `task`
- epic: `initial-monorepo-setup`
- delivery lane: `infrastructure`
- affected apps/packages: `apps/api`
- title: `Provision local PostgreSQL with Docker for Prisma and Nest integration`
- story/task description: Add the first real local database infrastructure path for the backend so Prisma migrations, repository integration tests, Better Auth persistence, and NestJS runtime development can run against PostgreSQL without requiring a shared external database. The scope should cover checked-in Docker-based local infrastructure, documented environment wiring, and a reproducible developer workflow for `apps/api`.
- acceptance criteria:
  - the repository includes a checked-in Docker-based local PostgreSQL setup suitable for `apps/api`
  - local developer instructions document how to boot the database, configure `DATABASE_URL`, and apply Prisma migrations
  - backend integration tests and Prisma-backed development can run against the local PostgreSQL instance without relying on a managed remote database
  - the local setup is explicit enough to support future Better Auth persistence and session tables
  - no competition-domain logic is bundled into this infrastructure ticket
- linked docs:
  - `/docs/15-developer-experience/local-development.md`
  - `/docs/16-backend-architecture/database-strategy.md`
  - `/docs/13-testing/integration-testing.md`
  - `/docs/08-tech-decisions/final-stack.md`
- linked ADRs:
  - `/docs/07-adrs/adr-004-database-choice.md`
  - `/docs/07-adrs/adr-007-deployment-strategy.md`
  - `/docs/07-adrs/adr-010-backend-persistence-implementation.md`
- testing expectations:
  - unit: n/a unless helper scripts or validation code are introduced
  - integration: verify Prisma migration and repository tests can run against the Docker-backed PostgreSQL instance
  - e2e/manual: manually confirm a developer can start the local database and connect `apps/api` successfully
- estimate: `M`
- status: `done`
- implementation workflow: `backend`
- GitHub labels: `type:task`, `lane:infrastructure`, `area:platform`, `area:data`, `target:apps-api`
- milestone/sprint: `next-foundation-sprint`
- GitHub issue URL or placeholder: `https://github.com/Damimd10/padel/issues/14`

### TKT-016 - Establish Better Auth application foundation

- ID: `TKT-016`
- type: `task`
- epic: `competition-management-core`
- delivery lane: `backend`
- affected apps/packages: `apps/api`, `apps/web`
- title: `Establish Better Auth foundation for application authentication`
- story/task description: Implement the first authentication foundation slice using Better Auth so the project has a real identity boundary before protected competition-management flows expand. The scope should cover base Better Auth wiring, PostgreSQL-backed auth persistence configuration, NestJS integration boundaries, and the minimum frontend or API contract needed to prove the auth foundation can support later protected workflows.
- acceptance criteria:
  - Better Auth is wired into the application stack in a way that preserves the documented backend boundaries
  - auth persistence uses PostgreSQL and is compatible with the accepted Prisma-backed backend environment
  - application code consumes authenticated identity through explicit boundaries instead of importing Better Auth types into domain entities
  - the implementation documents the required environment variables, cookie or session policy, and local development workflow
  - broader role or authorization rules for competition operations may remain for follow-up tickets, but the authentication foundation is real and reusable
- linked docs:
  - `/docs/16-backend-architecture/security-strategy.md`
  - `/docs/16-backend-architecture/backend-overview.md`
  - `/docs/08-tech-decisions/final-stack.md`
- linked ADRs:
  - `/docs/07-adrs/adr-003-backend-architecture.md`
  - `/docs/07-adrs/adr-004-database-choice.md`
  - `/docs/07-adrs/adr-011-authentication-strategy.md`
- testing expectations:
  - unit: cover any auth-related boundary mappers or wrappers introduced by the ticket
  - integration: verify Better Auth can persist and read auth state against PostgreSQL in the local backend environment
  - e2e/manual: prove at least one sign-in or session-establishment path end-to-end once the delivery slice is chosen
- estimate: `M`
- status: `done`
- implementation workflow: `backend`
- GitHub labels: `type:task`, `lane:backend`, `area:backend`, `area:platform`, `target:apps-api`, `target:apps-web`
- milestone/sprint: `next-foundation-sprint`
- GitHub issue URL or placeholder: `https://github.com/Damimd10/padel/issues/15`

### TKT-017 - Protect competition creation with authenticated organizer identity

- ID: `TKT-017`
- type: `task`
- epic: `competition-management-core`
- delivery lane: `backend`
- affected apps/packages: `apps/api`, `packages/schemas`
- title: `Require authenticated identity at the competition-create inbound boundary`
- story/task description: Build on the delivered Better Auth foundation by protecting the competition-creation flow with an explicit authenticated identity boundary. The slice should require a real session at the inbound HTTP layer, translate authenticated user identity into the application input contract, and remove the current need for external callers to provide `ownerId` directly when creating a competition.
- acceptance criteria:
  - the create-competition HTTP endpoint requires an authenticated session before a competition can be created
  - unauthenticated requests are rejected through the inbound auth boundary with a consistent HTTP response
  - the authenticated identity used for competition ownership is supplied by the auth boundary instead of trusting caller-provided ownership fields
  - the application and domain layers continue to avoid direct Better Auth type imports
  - tests verify both the authenticated success path and the unauthenticated rejection path
- linked docs:
  - `/docs/04-use-cases/use-cases.md`
  - `/docs/03-requirements/business-rules.md`
  - `/docs/16-backend-architecture/security-strategy.md`
  - `/docs/16-backend-architecture/backend-overview.md`
- linked ADRs:
  - `/docs/07-adrs/adr-003-backend-architecture.md`
  - `/docs/07-adrs/adr-005-api-communication-pattern.md`
  - `/docs/07-adrs/adr-011-authentication-strategy.md`
- testing expectations:
  - unit: cover any request-to-application identity mapping introduced by the ticket
  - integration: verify the protected HTTP endpoint blocks unauthenticated requests and accepts authenticated ones
  - e2e/manual: confirm a signed-in user can create a competition without manually passing an ownership field
- estimate: `M`
- status: `approved`
- implementation workflow: `backend`
- GitHub labels: `type:task`, `lane:backend`, `area:backend`, `area:platform`, `area:competition`, `target:apps-api`, `target:packages-schemas`
- milestone/sprint: `next-foundation-sprint`
- GitHub issue URL or placeholder: `https://github.com/Damimd10/padel/issues/19`
