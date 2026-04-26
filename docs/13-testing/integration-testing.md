# Integration Testing

## Tool

Use `Vitest` for integration testing.

## Purpose

Integration tests validate meaningful collaboration between modules, adapters or services without jumping directly to full E2E coverage.

## Frontend examples

- route + query interactions
- form + validation + submission flows
- UI package integration with application wrappers

## Backend examples

- controller to application layer translation
- repository adapter behavior
- database-backed integration scenarios

## Rules

- integration tests should focus on seam validation
- they should remain narrower and cheaper than E2E tests
- package boundaries should still be respected in test setup
