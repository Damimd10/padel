# Biome Strategy

## Decision

Use `Biome` as the default formatter, linter and import organizer.

## Why

- fast execution
- one tool for common source hygiene tasks
- consistent local and CI behavior

## Rules

- Biome is the default formatting and linting path
- import organization should be part of the standard check flow
- local hooks and CI should call the same Biome commands for changed scope where practical
