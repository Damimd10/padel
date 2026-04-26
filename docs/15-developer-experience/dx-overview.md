# Developer Experience Overview

## Purpose

Define the complete Developer Experience strategy for this documentation-first monorepo.

## Core decisions

- `pnpm` for workspace and package management
- `Nx` for task orchestration, project graph, affected execution, caching and boundaries
- `Biome` for formatting, linting and import organization
- `Vitest` for unit and integration tests
- `Playwright` for E2E tests
- `Storybook` for reusable UI package documentation and validation
- `Lefthook` for local Git hooks
- `Commitlint` + Conventional Commits for commit discipline
- `Changesets` for package versioning and changelogs
- `GitHub Actions` for CI
- `GitHub Projects` + `GitHub Issues` for operational planning and delivery

## Project rule

DX tooling is designed before implementation so the first tickets land in a consistent, enforceable workflow.
