# Delivery Lanes

## Purpose

Define how GitHub Issues and GitHub Projects separate frontend, backend and infrastructure work.

## Lanes

- `frontend`: React, TanStack, UI package integration, Storybook-facing app work
- `backend`: NestJS, APIs, database behavior, domain/application/infrastructure backend work
- `infrastructure`: CI/CD, environments, Docker, deployment, tooling and platform setup

## Required ticket metadata

Every ticket should declare:

- delivery lane
- implementation workflow
- labels for lane and area

## Recommended board setup

Use at least one of these separation mechanisms:

- dedicated `Lane` project field
- labels such as `lane:frontend`, `lane:backend`, `lane:infrastructure`
- filtered views by lane

## Sprint planning rule

Sprint scope should be balanced and visible by lane so blocked backend or infrastructure work does not get hidden inside frontend-heavy boards.
