# Coding Standards

## Purpose

Define workspace-wide coding conventions that apply across frontend, backend and infrastructure work.

## Scope

Use this document for:

- naming rules shared across the monorepo
- directory and file organization rules
- import and dependency conventions
- shared TypeScript conventions
- documentation and test naming rules

Use architecture-specific documents for lane-specific rules:

- frontend: `docs/12-frontend-architecture/frontend-coding-standards.md`
- backend: `docs/16-backend-architecture/backend-coding-standards.md`

## Workspace conventions

- package and folder names should use `kebab-case`
- Markdown files should use `kebab-case`
- shared package public APIs should be explicit and stable
- avoid cross-app imports that bypass package boundaries
- prefer one responsibility per file/module when the domain boundary is meaningful
- tests should follow the naming pattern agreed by each lane
- when a lane uses co-located tests, place them next to the production file with `*.test.ts` or `*.test.tsx`

## Governance

When a style rule affects only one lane, do not place it here. Put it in the relevant frontend or backend standards doc.
