# Frontend Coding Standards

## Purpose

Define frontend-specific coding style and structural conventions.

## Naming

- route folders and non-component file names should use `kebab-case`
- component file naming should follow the team convention consistently; if exported as React components, use `PascalCase` component identifiers even when file names use `kebab-case`
- CSS utility composition helpers and hooks should use descriptive names

## Structure

- feature folders should be organized by route or feature boundary
- colocate route-specific UI, loaders and tests when it improves traceability
- avoid dumping unrelated hooks, components and query logic into generic shared folders

## UI rules

- consume reusable UI from `packages/ui`
- app-local wrappers should be thin and intentional
- accessibility behavior must not be hidden behind vague abstractions

## State rules

- query logic belongs near the feature boundary
- avoid duplicate query key patterns across features
- form schemas should stay close to their use case unless intentionally shared

## Examples of what belongs here

- `kebab-case` for route files
- component organization rules
- query-key naming conventions
- frontend test placement conventions
