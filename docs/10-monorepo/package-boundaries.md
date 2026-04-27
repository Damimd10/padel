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

## Ticketing implication

Every ticket must declare affected apps/packages so boundary impact is explicit before implementation starts.
