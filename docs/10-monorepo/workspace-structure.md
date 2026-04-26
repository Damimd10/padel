# Workspace Structure

Expected high-level structure:

```text
package.json
pnpm-workspace.yaml
nx.json
biome.json
lefthook.yml
.changeset/
.github/
  workflows/
apps/
  web/
  api/
packages/
  ui/
  schemas/
  api-client/
  config/
```

## Intent

- `apps/web` owns the frontend application shell and composition of reusable UI.
- `apps/api` owns backend delivery with hexagonal boundaries.
- `packages/ui` owns reusable UI primitives and shared design-system components.
- `packages/schemas` owns cross-boundary contracts that are intentionally shared.
- `packages/api-client` owns typed client access to backend interfaces.
- `packages/config` owns shared tooling and configuration.

## DX root artifacts

- `pnpm-workspace.yaml` defines workspace package membership
- `nx.json` and per-project metadata define graph, caching and affected behavior
- `biome.json` defines default formatting and linting behavior
- `lefthook.yml` defines local hook orchestration
- `.changeset/` carries versioning metadata
- `.github/workflows/` carries CI workflow definitions
