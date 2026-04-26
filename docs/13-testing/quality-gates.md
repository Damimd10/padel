# Testing Quality Gates

## Purpose

Define the testing expectations that block or allow ticket completion.

## Required gates

- unit and integration coverage for the changed scope
- E2E validation for flows where the risk justifies it
- Storybook updates for `packages/ui` component changes
- no skipped or missing critical validation without explicit ticket-level justification

## DX alignment

- local fast checks should use Nx affected commands
- CI should enforce the same gate categories for changed scope
- Storybook should be enforced for reusable UI package changes
