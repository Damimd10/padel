# Agents and Skills

Agents are TOML files under `.codex/agents`.
Skills are folders with `SKILL.md` under `.codex/skills`.

## Core workflow agents

- `workflow-orchestrator`
- `documentation-engineer`
- `product-manager`
- `business-analyst`
- `architect-reviewer`
- `technical-writer`

## Delivery agents

The GitHub delivery flow in this workspace is primarily supported by:

- `github-issue-manager`
- `git-workflow-manager`
- `project-manager`
- `scrum-master`
- `technical-writer`

These agents support the operating model:

`docs -> GitHub Issues/Projects -> sprint -> ticket implementation workflow`

## DX agents

The DX and CI strategy is primarily supported by:

- `dx-optimizer`
- `build-engineer`
- `tooling-engineer`
- `dependency-manager`
- `platform-engineer`
- `qa-expert`

## Scope note

Keep only agents that materially support the documentation-first and GitHub-based delivery flow. Temporary clones and external catalogs should not live in the repo as working artifacts.
