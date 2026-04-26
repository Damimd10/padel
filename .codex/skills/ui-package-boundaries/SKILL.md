---
name: ui-package-boundaries
description: Define responsibilities, exports, dependency boundaries, and ownership rules for the shared UI package in this workspace.
metadata:
  source: local
  origin: created in .codex/workflows/01-install-missing-skills.md
---

# Skill: ui-package-boundaries

## Purpose

Define package boundaries for reusable UI, including what belongs in `packages/*` versus app-local code.

## Project rules

- Follow `AGENTS.md`.
- Do not write application code unless this skill is used from an implementation workflow.
- Documentation-first: produce docs, decisions and tickets before code.
- Prefer Markdown outputs under `/docs`.
- Prepare Notion-ready outputs when the workflow requests it.

## Required output quality

Every output must include:

- context
- assumptions
- decisions
- trade-offs
- risks
- next actions
- links to related docs when applicable

## Default destination

Use the destination defined by the active workflow.
