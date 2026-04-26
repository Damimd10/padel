---
name: quality-gates
description: Define local and CI validation gates, enforcement levels, and release blockers for this workspace.
metadata:
  source: local
  origin: created for DX documentation and workflow alignment
---

# Skill: quality-gates

## Purpose

Define local, CI and review-time quality gates before implementation begins.

## Project rules

- Follow `AGENTS.md`.
- Do not write application code unless this skill is used from an implementation workflow.
- Documentation-first: produce docs, decisions and tickets before code.
- Prefer Markdown outputs under `/docs`.

## Required output quality

Every output must include:

- context
- assumptions
- decisions
- trade-offs
- risks
- next actions
