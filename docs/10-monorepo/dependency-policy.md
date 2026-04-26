# Dependency Policy

## Purpose

Define dependency governance for the monorepo before code is written.

## Package manager decision

- use `pnpm` as the package manager
- keep one lockfile at the workspace root
- prefer `workspace:` protocol for internal package dependencies

## Dependency rules

- runtime dependencies belong only where they are actually needed
- avoid hidden transitive reliance across internal packages
- shared contracts should live in explicit shared packages, not be copied between apps
- tooling dependencies should be centralized when it improves consistency
- UI-specific dependencies should stay within the UI package or frontend app unless intentionally shared

## Versioning and release rules

- use Changesets for package versioning and changelog generation
- version boundaries should follow publishable or releasable package boundaries, not arbitrary folder grouping

## Governance

- dependency additions must be justified in docs or tickets when they affect architecture, delivery, or security posture
- package boundary exceptions must be documented before implementation
