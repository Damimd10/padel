# Monorepo Tooling

## Tool map

| Tool | Primary role |
| --- | --- |
| `pnpm` | workspace and dependency management |
| `Nx` | task graph, affected commands, caching, boundaries |
| `Biome` | formatting, linting, import organization |
| `Vitest` | unit and integration tests |
| `Playwright` | E2E tests |
| `Storybook` | reusable UI documentation and validation |
| `Lefthook` | local Git hooks |
| `Commitlint` | Conventional Commit enforcement |
| `Changesets` | versioning and changelogs |
| `GitHub Actions` | CI |
| `GitHub Projects` | planning and execution operations |

## Design principle

Each tool should solve one clear problem and align with the same local-to-CI workflow rather than introducing overlapping systems.
