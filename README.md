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

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10 (`corepack enable && corepack prepare pnpm@10.6.3 --activate`)
- **Docker** + Docker Compose
- **Git**

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy the example env file and adjust as needed:

```bash
cp .env.example .env
```

Key variables:

| Variable | Default | Description |
|---|---|---|
| `POSTGRES_PORT` | `5432` | Host port for PostgreSQL. Change if 5432 is already in use (e.g. `5433`) |
| `DATABASE_URL` | `postgresql://padel:padel@localhost:5432/padel` | Must match `POSTGRES_PORT` |
| `POSTGRES_DB` | `padel` | Database name |
| `POSTGRES_USER` | `padel` | Database user |
| `POSTGRES_PASSWORD` | `padel` | Database password |
| `PORT` | `3000` | API server port |
| `BETTER_AUTH_SECRET` | `change-me-in-local-dev` | Auth secret for local dev |
| `BETTER_AUTH_URL` | `http://localhost:3000` | Auth base URL |

### 3. Start the database

```bash
pnpm db:up
```

Verify it's running:

```bash
pnpm db:ps
```

View logs:

```bash
pnpm db:logs
```

Stop the database:

```bash
pnpm db:down
```

### 4. Run Prisma migrations

```bash
pnpm --filter @padel/api prisma:migrate:dev
```

Generate the Prisma client:

```bash
pnpm --filter @padel/api prisma:generate
```

### 5. Start the API (backend)

```bash
pnpm --filter @padel/api dev
```

The API will be available at `http://localhost:${PORT:-3000}`.

### 6. Start the Web (frontend)

```bash
pnpm --filter @padel/web dev
```

The frontend will be available at `http://localhost:5173` (or the next available port).

### 7. Start Storybook (UI components)

```bash
pnpm storybook
```

Storybook will be available at `http://localhost:6006`.

### Quick start (all services)

Open separate terminals for each:

```bash
# Terminal 1 - Database
pnpm db:up

# Terminal 2 - API
pnpm --filter @padel/api dev

# Terminal 3 - Web
pnpm --filter @padel/web dev
```

### Useful commands

| Command | Description |
|---|---|
| `pnpm install` | Install all dependencies |
| `pnpm db:up` | Start PostgreSQL container |
| `pnpm db:down` | Stop PostgreSQL container |
| `pnpm db:ps` | Check container status |
| `pnpm db:logs` | Follow database logs |
| `pnpm build` | Build all apps and packages |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all apps and packages |
| `pnpm typecheck` | Typecheck all apps and packages |
| `pnpm check` | Run lint + boundaries + typecheck + test |
| `pnpm storybook` | Start Storybook for UI package |
| `pnpm graph` | Generate Nx dependency graph |
