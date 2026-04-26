# Backend Coding Standards

## Purpose

Define backend-specific coding style and structural conventions for the hexagonal backend.

## Naming

- folder and file names should use `kebab-case`
- use case names should be explicit and action-oriented
- repository ports and adapter implementations should be clearly distinguishable
- DTOs, entities and value objects should use names that reflect their architectural role

## Architecture rules

- domain code must not depend on NestJS, ORM details or transport DTOs
- application services orchestrate use cases; they do not become a second controller layer
- adapters translate between external formats and application/domain models
- infrastructure code wires implementations and runtime concerns

## Persistence rules

- persistence models should not become the domain model by default
- repository contracts should be owned by the core, not by infrastructure

## Examples of what belongs here

- `kebab-case` for backend file names
- naming of use cases and ports
- boundaries between controllers, use cases and repositories
- placement of integration tests and persistence tests
