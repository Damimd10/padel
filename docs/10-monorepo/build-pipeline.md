# Build Pipeline

## Purpose

Define the build, check and validation pipeline before implementation begins.

## Pipeline principles

- local and CI workflows should mirror each other
- Nx should orchestrate task graph execution
- affected execution should be the default optimization path
- caching should reduce repeat work without hiding broken boundaries

## Expected pipeline stages

1. format/lint/import organization with Biome
2. typecheck
3. unit and integration tests with Vitest
4. Storybook validation for reusable UI changes
5. E2E tests with Playwright when affected
6. release or versioning checks with Changesets when relevant

## Local vs CI

- local hooks should run the fastest reliable subset
- CI should run the full required quality gates for changed scope
- release pipelines should add versioning and changelog validation

## Nx role

- define project graph
- define task dependencies
- enable caching
- enable affected commands
- support module boundary enforcement
