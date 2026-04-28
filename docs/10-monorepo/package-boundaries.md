# Package Boundaries

## Purpose

Define the allowed architectural boundaries between apps and packages in the monorepo.

## Boundary model

- `apps/web` may depend on `packages/ui`, `packages/schemas`, `packages/api-client`, and `packages/config`
- `apps/api` may depend on `packages/schemas` and `packages/config`
- `packages/ui` must not depend on application code
- `packages/api-client` must not depend on `apps/web`
- `packages/api-client` is the required frontend boundary for backend access unless an ADR explicitly approves an exception
- `packages/schemas` should stay framework-light and reusable across frontend and backend
- `packages/schemas` plus `packages/api-client` form the default contract coordination model between `apps/web` and `apps/api`
- `packages/config` may expose shared tooling configuration but should not become a general utility bucket

## Nx responsibility

Nx should enforce project graph visibility and module boundary rules so invalid cross-imports are caught before implementation spreads coupling.

## Automated enforcement

- run `pnpm run boundaries` to generate the Nx project graph and fail on forbidden internal dependencies
- the validator treats these dependencies as the enforced baseline:
  - `@padel/web` -> `@padel/ui`, `@padel/schemas`, `@padel/api-client`, `@padel/config`
  - `@padel/api` -> `@padel/schemas`, `@padel/config`
  - `@padel/ui` -> `@padel/schemas`, `@padel/config`
  - `@padel/api-client` -> `@padel/schemas`, `@padel/config`
  - `@padel/schemas` -> `@padel/config`
  - `@padel/config` -> no internal workspace packages
- if a boundary violation is reported, move the shared code into the documented package boundary or update the architecture docs and ADRs before changing the rule
- graph visibility alone is not considered sufficient; the boundary validator must pass locally and in CI

## Ticketing implication

Every ticket must declare affected apps/packages so boundary impact is explicit before implementation starts.
