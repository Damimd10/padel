# GitHub Actions CI

## Decision

Use `GitHub Actions` for CI.

## Purpose

CI should mirror the same quality model developers use locally.

## Expected checks

- install dependencies with `pnpm`
- run Biome checks
- run type and validation tasks through Nx
- run affected unit/integration checks
- run Storybook-related checks when UI package scope changes
- run Playwright where affected scope or workflow policy requires it

## Suggested pipeline shape

1. checkout + install
2. restore or initialize Nx cache
3. run Biome and type/lint checks
4. run affected unit/integration tests
5. run affected Storybook or UI validation when `packages/ui` changes
6. run affected E2E checks when required
7. run Changesets or release checks on release-oriented workflows

## CI philosophy

- CI should mirror local DX rather than invent a separate validation model
- use Nx affected and caching to keep CI efficient
