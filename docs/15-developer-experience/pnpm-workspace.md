# pnpm Workspace Strategy

## Decision

Use `pnpm` as the package manager for the monorepo.

## Why

- efficient workspace dependency management
- strong support for internal package linking with `workspace:`
- fast installs and deterministic lockfile behavior
- good fit for Nx-managed monorepos

## Rules

- keep one workspace lockfile at the root
- prefer explicit workspace dependencies
- do not mix package managers in the repo
