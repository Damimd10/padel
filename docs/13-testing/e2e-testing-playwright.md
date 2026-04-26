# E2E Testing with Playwright

## Tool

Use `Playwright` for E2E testing.

## Purpose

E2E tests validate critical user journeys and high-value regression paths across application boundaries.

## When to use

- core frontend flows that cross route boundaries
- authentication or checkout-style critical journeys
- backend/API flows that are only trustworthy when exercised through the app boundary

## Rules

- keep E2E coverage focused on critical flows
- do not duplicate lower-level coverage already handled by unit and integration tests
- use affected scope to decide when E2E should run locally vs in CI
