# Hexagonal Architecture

## Core rule

Business rules should not depend directly on frameworks, databases or transport mechanisms.

## Layers

### Domain

- entities
- value objects
- domain services
- domain policies and invariants

### Application

- use cases
- command/query orchestration
- ports for outbound dependencies
- transaction boundaries where needed

### Inbound adapters

- controllers
- DTO translation at the boundary
- authentication and request mapping concerns

### Outbound adapters

- repositories
- persistence implementations
- external service clients

### Infrastructure

- Nest module wiring
- configuration
- container/bootstrap concerns
- deployment/runtime integration

## Dependency rule

Dependencies must point inward toward the domain/application core. Framework and persistence concerns stay at the adapter or infrastructure edge.
