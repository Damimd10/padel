# Testing DX

## Purpose

Define how testing fits into the day-to-day developer workflow.

## Loop design

- fast loop: Biome + focused unit checks
- medium loop: affected unit/integration suites
- slower loop: Playwright and broader workflow validation

## Tooling alignment

- Vitest handles the everyday unit/integration feedback loop
- Playwright handles critical cross-boundary regression checks
- Storybook supports component-focused validation for reusable UI
