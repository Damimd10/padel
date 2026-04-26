# DX Decision Summary

## Why this stack

### pnpm

Chosen for workspace and package management because it is efficient, deterministic and well suited to internal package linking in a monorepo.

### Nx

Chosen for project graph visibility, affected commands, caching and module boundary enforcement across apps and packages.

### Biome

Chosen as the default formatter, linter and import organizer because it is fast and consolidates common source hygiene tasks.

### Lefthook

Chosen for fast local Git hooks so developers get immediate validation before code reaches CI.

### Vitest and Playwright

Chosen to provide a layered testing strategy: Vitest for fast unit/integration loops and Playwright for critical E2E validation.

### Storybook

Chosen as the mandatory documentation and validation layer for reusable UI components in `packages/ui`.

### GitHub Actions

Chosen for CI so the repository can mirror the same validation model used locally.

### GitHub Projects

Chosen as the operational sprint and ticket workflow so execution state lives in one shared agile board.

### Changesets

Chosen for package versioning and changelog generation so release management aligns to package boundaries.
