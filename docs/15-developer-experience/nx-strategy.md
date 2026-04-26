# Nx Strategy

## Decision

Use `Nx` as the monorepo orchestrator.

## Responsibilities

- define project graph
- power affected commands
- enable local and CI caching
- express task dependencies
- enforce module boundaries

## Expected usage

- local developers should prefer `nx affected` for scoped validation
- CI should use the same affected model wherever safe
- boundary rules should reflect the architectural decisions in `/docs`

## Core expectations

- Nx should model every app and package in the workspace graph
- targets should be named consistently across projects where possible
- cacheable tasks should be declared intentionally
- affected calculations should be the default path for lint, test and build validation
- module boundaries should reflect the monorepo and architectural docs, not folder convenience

## Typical target families

- `lint`
- `format`
- `typecheck`
- `test`
- `build`
- `storybook`
- `e2e`

## Boundary role

Nx should help prevent:

- app-to-app leakage
- accidental UI/package boundary violations
- backend architectural layering shortcuts
