# ADR-009: Testing Stack

## Status

Accepted

## Context

The main product risks are not mostly visual. They are:

- invalid registrations,
- broken category/division rules,
- wrong competition progression,
- bad result validation,
- and incorrect competition closure.

Testing must therefore protect business rules and workflow correctness first, while still supporting frontend quality and team maintainability.

## Options

### Option A: Vitest + Playwright + Storybook validation + contract tests + backend integration tests

### Option B: Jest-centric stack with Cypress

### Option C: Minimal unit-test approach with manual QA emphasis

## Pros and Cons

### Option A

Pros:

- Already aligned with documented repo tooling.
- Vitest is fast and ergonomic for TypeScript unit/integration tests.
- Playwright is strong for critical end-to-end competition workflows.
- Storybook validation helps protect reusable UI quality.
- Supports domain-focused backend integration and contract verification.

Cons:

- Requires discipline to avoid over-indexing on UI tests while under-testing domain invariants.
- E2E can become slow if critical-path scope is not kept tight.

### Option B

Pros:

- Familiar to many teams.
- Large ecosystem.

Cons:

- Misaligned with the repo’s documented DX decisions.
- No clear upside strong enough to justify a tooling fork.

### Option C

Pros:

- Lower up-front test setup cost.

Cons:

- Too risky for a workflow system where correctness and trust are core product requirements.
- Would push validation burden into manual release processes.

## Trade-offs

- A layered test stack costs more up front but directly supports product trust and maintainability.
- Minimal testing buys speed only until the first broken competition progression incident.

## Risks

- Slow CI if test scope is not layered and affected-aware.
- Gaps in domain coverage if frontend tests dominate.
- Contract drift if schema/client boundaries are not tested explicitly.

## Decision

Use:

- Vitest for frontend and backend unit/integration tests
- Playwright for end-to-end critical workflows
- Storybook validation for reusable UI package changes
- contract/schema validation in CI
- backend integration tests for persistence and adapters
- targeted end-to-end coverage for:
  - create competition
  - register participant
  - approve registration
  - generate structure
  - record result
  - close competition

## Consequences

- Testing aligns with the real business risk profile of the product.
- The team gets fast local feedback plus strong workflow confidence.
- CI can remain maintainable if Nx affected execution is enforced consistently.
