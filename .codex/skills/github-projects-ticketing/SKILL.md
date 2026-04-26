---
name: github-projects-ticketing
description: Define execution-ticket structure, field mapping, and traceability when mirroring approved backlog items into GitHub Issues or GitHub Projects.
metadata:
  source: local
  origin: created in .codex/workflows/01-install-missing-skills.md
---

# Skill: github-projects-ticketing

## Purpose

Define how approved backlog items are translated into GitHub execution tickets while preserving links to docs and ADRs.

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
