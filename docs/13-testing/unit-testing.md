# Unit Testing

## Tool

Use `Vitest` for unit testing.

## Purpose

Unit tests should validate isolated logic quickly and run frequently in local development and CI.

## Scope examples

- frontend hooks, utilities and small state transitions
- backend domain services, value objects and use-case helpers
- pure data transformation and validation helpers

## Rules

- unit tests should not depend on unrelated infrastructure
- unit tests should be fast enough to participate in affected local checks
- naming and placement conventions should stay predictable within each lane
