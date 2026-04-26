---
name: component-api-governance
description: Define prop API design, slot strategy, variant rules, and deprecation policy for reusable components in this workspace.
metadata:
  source: local
  origin: created in .codex/workflows/01-install-missing-skills.md
---

# Skill: component-api-governance

## Purpose

Define governance for reusable component APIs, including naming, variants, composition points and change management.

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
