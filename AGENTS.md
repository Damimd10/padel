# AGENTS.md

## Project mode

This is a documentation-first project.

Do not write application code until:

1. Research is completed.
2. Product scope is approved.
3. Requirements and use cases are documented.
4. Architecture is reviewed.
5. Technical decisions are accepted as ADRs.
6. Monorepo strategy is documented.
7. Design system is documented.
8. Frontend architecture is documented.
9. UI package + Storybook strategy is documented.
10. Backend architecture is documented.
11. Testing strategy is documented.
12. Agile tickets are generated and approved.

## Target stack

- React
- TypeScript
- TanStack Router
- TanStack Query
- TanStack Form
- TanStack Store
- Zod
- NestJS
- PostgreSQL
- Docker
- Shadcn
- Radix UI
- Tailwind CSS
- Storybook
- Monorepo with `apps/*` and `packages/*`

## Source of truth

- Markdown docs under `/docs` are the technical source of truth.
- GitHub Issues and GitHub Projects are the execution source of truth for backlog, sprint scope and delivery status.
- Storybook is the source of truth for reusable UI components.
- GitHub Issues/Projects should be updated whenever approved work moves into delivery.

## Development gate

Before writing code, there must be tickets under:

- `/docs/09-agile/product-backlog.md`
- `/docs/09-agile/sprint-plan.md`

And the approved sprint scope must be represented in GitHub Issues/Projects.

Each ticket must include:

- type
- epic
- delivery lane (`frontend`, `backend`, `infrastructure`)
- affected apps/packages
- story/task description
- acceptance criteria
- linked docs
- linked ADRs
- testing expectations
- estimate
- status
- GitHub labels
- milestone/sprint
- project status
- implementation workflow (`frontend` or `backend`)

## DX rules

- Do not generate code before tickets exist and are approved.
- Every ticket must specify affected apps/packages.
- Every implementation must include tests.
- UI package changes require Storybook stories and Storybook validation.
- Package boundary rules must be respected.
- Use Nx affected commands for local and CI checks.
- Use Biome for formatting, linting and import organization.
- Use Lefthook for local pre-commit and pre-push validation.

## Architecture guardrails

- Frontend implementation must follow the frontend architecture docs under `/docs/12-frontend-architecture`.
- Backend implementation must follow the backend architecture docs under `/docs/16-backend-architecture`.
- Backend design is hexagonal: domain, application, inbound adapters, outbound adapters, and infrastructure concerns must stay separated.

## Coding style rules

- Workspace-wide conventions belong in `/docs/10-monorepo/coding-standards.md`.
- Frontend-specific conventions belong in `/docs/12-frontend-architecture/frontend-coding-standards.md`.
- Backend-specific conventions belong in `/docs/16-backend-architecture/backend-coding-standards.md`.
- DX tooling, local workflow and quality gates belong in `/docs/15-developer-experience/`.
