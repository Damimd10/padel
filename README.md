# Codex AI Workspace Template

Documentation-first AI workspace for a monorepo project.

## Target stack

- React + TypeScript
- SSR-ready frontend architecture
- TanStack Router
- TanStack Query
- TanStack Form
- TanStack Store
- Zod
- NestJS
- PostgreSQL
- Docker
- Shared UI package using Shadcn, Radix UI, Tailwind CSS
- Storybook for the design system
- GitHub Projects + GitHub Issues for planning and delivery
- GitHub Actions for CI

## Core rule

No application code is written until tickets are generated, mapped into GitHub Issues/Projects, and approved for a sprint.

Workflow:

```text
research
→ product
→ requirements/use cases
→ domain architecture
→ technical decisions
→ monorepo strategy
→ design system
→ frontend architecture
→ UI package + Storybook
→ backend architecture
→ developer experience
→ testing strategy
→ agile ticket generation
→ GitHub Issues/Projects ticketing
→ sprint planning
→ implement ticket
→ review ticket
```

## Codex structure

```text
.codex/
  agents/      # Project subagents. TOML files.
  skills/      # Project skills. Each skill contains SKILL.md.
  workflows/   # Decoupled workflows. Markdown instructions.
  config/      # MCP config.
  manifests/   # Selected upstream agents/skills lists.
```

## Important

This template includes:

1. Project-specific TOML agents for React SSR, TanStack, Storybook and design-system work.
2. Project management agents for GitHub-based backlog and sprint operations, including `github-issue-manager`.
3. A manifest of the VoltAgent subagents selected for this project.
4. A script that can install matching upstream VoltAgent `.toml` agents on your machine.
5. Project skills as `SKILL.md` folders.
6. A manifest of recommended skills from `VoltAgent/awesome-agent-skills`.

## Repo hygiene

This repo should stay free of:

- temporary cloned catalogs under `.codex/.tmp/`
- outdated Notion planning artifacts
- duplicate planning systems competing with GitHub Issues/Projects
- generated scratch files that are not part of the source-of-truth docs

The upstream repositories are:

- https://github.com/VoltAgent/awesome-codex-subagents
- https://github.com/VoltAgent/awesome-agent-skills

Run this after unzipping if you want to replace/add upstream `.toml` agents from VoltAgent:

```bash
bash scripts/install-voltagent-subagents.sh
```

Run this to create a local clone of the skills repo and produce a copy report:

```bash
bash scripts/install-selected-skills.sh
```

Some TanStack/Storybook/design-system skills are custom because public curated skills may not exist for every exact tool combination.

## Developer Experience

The DX stack for this workspace is:

- `pnpm` for workspace and package management
- `Nx` for project graph, affected commands, caching and module boundaries
- `Biome` for formatting, linting and import organization
- `Vitest` for unit and integration testing
- `Playwright` for E2E testing
- `Storybook` for reusable UI component documentation and validation
- `Lefthook` for fast local Git hooks
- `Commitlint` + Conventional Commits for commit hygiene
- `Changesets` for package versioning and changelogs
- `GitHub Actions` for CI
- `GitHub Projects` for sprint and ticket operations

The DX source-of-truth docs live under `docs/15-developer-experience/`.

## GitHub Delivery Flow

The planning and execution flow is:

```text
docs
→ docs/09-agile backlog and sprint artifacts
→ GitHub Issues / GitHub Projects
→ sprint execution
→ implementation by delivery lane
```

Reference material for this flow lives under `docs/14-github-projects/`.

## Delivery lanes

GitHub Projects and implementation workflows are separated by lane:

- `frontend`
- `backend`
- `infrastructure`

Frontend tickets follow the React/TanStack architecture and reusable UI rules.
Backend tickets follow the NestJS + PostgreSQL architecture with a hexagonal design.
