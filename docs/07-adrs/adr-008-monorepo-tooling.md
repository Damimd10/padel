# ADR-008: Monorepo Tooling

## Status

Accepted

## Context

The repo already documents a monorepo strategy centered on:

- `apps/web`
- `apps/api`
- `packages/ui`
- `packages/schemas`
- `packages/api-client`
- `packages/config`

The tooling must support:

- team development,
- affected execution,
- boundary enforcement,
- shared contracts,
- and maintainability over time.

## Options

### Option A: `pnpm` + `Nx`

### Option B: `pnpm` + Turborepo

### Option C: Polyrepo split

## Pros and Cons

### Option A

Pros:

- Already documented in the repo.
- Strong project graph, task orchestration, caching, and affected execution.
- Good fit for enforcing boundaries in a documentation-first team setup.

Cons:

- More configuration surface area than simpler task runners.
- Teams need discipline to maintain project metadata accurately.

### Option B

Pros:

- Lighter mental model for some teams.
- Good build pipeline ergonomics.

Cons:

- Weaker fit when graph-aware boundary enforcement matters heavily.
- Less aligned with the repo’s documented tooling decisions.

### Option C

Pros:

- Strong repository isolation.
- Smaller per-repo cognitive footprint.

Cons:

- More contract drift risk.
- Worse local coordination between web, api, schemas, and api-client.
- More operational overhead for documentation-first cross-boundary work.

## Trade-offs

- Nx trades some setup complexity for stronger maintainability at team scale.
- Turborepo is viable but less differentiated for the repo’s explicit boundary needs.
- Polyrepo optimizes independence at the cost of coordination, which is the wrong trade here.

## Risks

- Shared packages becoming dumping grounds.
- Teams bypassing boundaries through direct imports.
- CI slowdown if affected execution and caching are not actually enforced.

## Decision

Use:

- `pnpm` for workspace/package management
- `Nx` for orchestration, affected execution, graph awareness, and boundary enforcement
- `Biome`, `Lefthook`, `Changesets`, and GitHub Actions as already documented

## Consequences

- The monorepo supports contract-first development with shared schemas and typed clients.
- CI remains scalable enough for team development.
- Architectural boundaries can be enforced instead of merely documented.
