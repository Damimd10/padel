# Testing Strategy

## Purpose

Define the primary testing model for frontend, backend and infrastructure work in this monorepo.

## Tooling decisions

- use `Vitest` for unit and integration tests
- use `Playwright` for end-to-end testing
- use `Storybook` for reusable UI documentation and component-focused validation

## Coverage model

- frontend work should include unit, component and route/integration coverage where appropriate
- backend work should include unit, use-case/application, adapter/integration and database-oriented coverage where appropriate
- infrastructure work should include validation and smoke checks where practical

## Execution model

- use Nx affected commands to scope local and CI validation where possible
- keep local checks fast enough for daily use
- keep CI checks aligned with the same task graph and boundaries

## Relationship to DX

Testing strategy should align with:

- `docs/15-developer-experience/testing-dx.md`
- `docs/15-developer-experience/quality-gates.md`
- `docs/15-developer-experience/github-actions-ci.md`
