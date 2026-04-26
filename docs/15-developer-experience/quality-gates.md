# DX Quality Gates

## Purpose

Define the end-to-end quality gates enforced by local workflow and CI.

## Required gates

- formatting, linting and import organization with Biome
- package boundary compliance
- tests for the changed scope
- Storybook updates for reusable UI changes
- Nx affected validation locally and in CI where applicable
- GitHub Issue and docs alignment before implementation is considered complete

## Gate levels

- local development gates: fast feedback, mostly affected checks
- hook gates: fast blocking checks before commit/push
- CI gates: authoritative validation for changed scope
- review gates: architectural and documentation alignment

## Mandatory examples

- a `packages/ui` ticket without Storybook updates should fail review
- a backend ticket that breaks hexagonal boundaries should fail review even if tests pass
- a ticket without affected apps/packages specified should not be implementation-ready
