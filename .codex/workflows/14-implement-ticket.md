# Workflow: Implement Ticket

## Goal

Implement one approved ticket only, using the implementation path required by its delivery lane and affected app/package.

## Agents

Use the agents required by the ticket lane and scope:

- frontend-developer
- react-specialist
- tanstack-architect
- storybook-specialist
- backend-developer
- api-designer
- postgres-pro
- build-engineer
- test-automator
- code-reviewer

## Skills

- test-driven-development
- tanstack-architecture
- ui-package-shadcn-radix-tailwind
- storybook-design-system
- postgres-best-practices
- code-review

## Inputs

- GitHub Issue
- linked docs
- linked ADRs
- acceptance criteria
- affected apps/packages

## Required flow

1. Read the GitHub Issue first.
2. Verify linked docs and ADRs.
3. Verify affected app/package and delivery lane.
4. Create a short implementation plan before changing code.
5. Write or update tests.
6. Update Storybook if `packages/ui` changes.
7. Run Biome.
8. Run Nx affected checks.
9. Update ticket status.

## Rules

- only implement the selected ticket
- do not expand scope
- respect package boundaries
- use the frontend architecture rules for frontend tickets
- use the hexagonal backend rules for backend tickets
- infrastructure changes must still follow the same ticket and validation discipline
