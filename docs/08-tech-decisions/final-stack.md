# Final Stack Summary

## Context

These decisions are based on:

- `docs/01-research/`
- `docs/02-product/`
- `docs/03-requirements/`
- `docs/04-use-cases/`
- `docs/05-architecture/`
- `docs/06-diagrams/`
- existing repo architecture and DX docs

The system is a competition workflow product, not a generic club platform. The stack therefore optimizes for:

- maintainability,
- team development,
- explicit domain boundaries,
- transactional correctness,
- and end-to-end type safety.

## Final decisions

## Frontend architecture

Decision:

- React + TypeScript in `apps/web`
- TanStack Router
- selective SSR only where it adds clear value
- TanStack Query for server state
- TanStack Form + Zod for forms
- TanStack Store only for UI-owned state

Why:

- Best fit for route-aware admin workflows without forcing a framework-heavy fullstack runtime model.
- More aligned with current repo decisions than switching to Next.js or Remix.

Main risk:

- State discipline must be enforced so TanStack Store does not become an unstructured second source of truth.

## Backend architecture

Decision:

- NestJS + TypeScript
- modular monolith
- hexagonal architecture

Why:

- Best fit for the documented domain, use cases, and team maintainability goals.
- Avoids premature microservices while preserving strong module boundaries.

Main risk:

- Framework leakage into domain code if architectural boundaries are not enforced rigorously.

## Database

Decision:

- PostgreSQL

Why:

- Best match for the relational and consistency-heavy competition domain.

Main risk:

- Poor migration discipline can still compromise maintainability and operational safety.

## API communication

Decision:

- REST-style HTTP APIs
- shared Zod schemas in `packages/schemas`
- typed client in `packages/api-client`

Why:

- Strong transport clarity, explicit contracts, and end-to-end type safety without frontend/backend over-coupling.

Main risk:

- Contract drift if teams bypass the shared schema and client boundary.

## Authentication

Decision:

- Better Auth
- PostgreSQL-backed auth persistence
- backend-owned auth wiring with protected identity crossing into application use cases through explicit boundaries

Why:

- Best fit for a TypeScript-first stack that wants owned authentication without rebuilding security-sensitive commodity flows from scratch.

Main risk:

- Auth and session models can leak into product modules if Better Auth is not kept at inbound and infrastructure boundaries.

## State management

Decision:

- TanStack Query for server state
- TanStack Form + Zod for form state and validation
- TanStack Store only for UI-owned state

Why:

- Best separation of concerns for a workflow-heavy admin application.

Main risk:

- Mutation invalidation and state ownership rules must be enforced consistently.

## Deployment strategy

Decision:

- separate deployables for `apps/web` and `apps/api`
- Docker packaging
- managed container hosting
- managed PostgreSQL
- automatic preview/staging deploys
- manual production promotion initially

Why:

- Intentionally boring infrastructure is the right trade-off for this stage.

Main risk:

- Weak observability or release discipline could still create painful competition-day failures.

## Monorepo tooling

Decision:

- `pnpm` + `Nx`
- `Biome`
- `Lefthook`
- `GitHub Actions`
- `Changesets`

Why:

- Best fit for boundary enforcement, affected execution, shared contracts, and team maintainability.

Main risk:

- Shared packages can become a dumping ground if boundaries are not actively enforced.

## Testing stack

Decision:

- Vitest
- Playwright
- Storybook validation
- contract/schema validation
- backend integration tests

Why:

- Best aligns with the actual risk profile: business-rule correctness over superficial popularity.

Main risk:

- CI can become slow or noisy if E2E scope grows without discipline.

## Critical challenges to assumptions

- Popularity alone is not a reason to choose Next.js, GraphQL, Kubernetes, Redux, or microservices here.
- The documented stack is mostly justified, but only if the team actually enforces architectural boundaries and contract discipline.
- The biggest system failures for this product are likely to be incorrect competition state and low operational trust, not raw scale bottlenecks.

## ADR index

- [ADR-001: Frontend Data Loading and Contract Coordination](/Users/damian/Projects/padel/docs/07-adrs/adr-001-frontend-data-loading-and-contract-coordination.md)
- [ADR-002: Frontend Architecture](/Users/damian/Projects/padel/docs/07-adrs/adr-002-frontend-architecture.md)
- [ADR-003: Backend Architecture](/Users/damian/Projects/padel/docs/07-adrs/adr-003-backend-architecture.md)
- [ADR-004: Database Choice](/Users/damian/Projects/padel/docs/07-adrs/adr-004-database-choice.md)
- [ADR-005: API Communication Pattern](/Users/damian/Projects/padel/docs/07-adrs/adr-005-api-communication-pattern.md)
- [ADR-006: State Management Approach](/Users/damian/Projects/padel/docs/07-adrs/adr-006-state-management-approach.md)
- [ADR-007: Deployment Strategy](/Users/damian/Projects/padel/docs/07-adrs/adr-007-deployment-strategy.md)
- [ADR-008: Monorepo Tooling](/Users/damian/Projects/padel/docs/07-adrs/adr-008-monorepo-tooling.md)
- [ADR-009: Testing Stack](/Users/damian/Projects/padel/docs/07-adrs/adr-009-testing-stack.md)
- [ADR-010: Backend Persistence Implementation](/Users/damian/Projects/padel/docs/07-adrs/adr-010-backend-persistence-implementation.md)
- [ADR-011: Authentication Strategy](/Users/damian/Projects/padel/docs/07-adrs/adr-011-authentication-strategy.md)
