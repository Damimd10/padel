# ADR-003: Backend Architecture

## Status

Accepted

## Context

The domain is consistency-heavy:

- competitions,
- categories and divisions,
- registrations,
- results,
- progression,
- closure invariants.

The repo already documents NestJS and hexagonal architecture as the target backend approach.

## Options

### Option A: NestJS modular monolith with hexagonal architecture

### Option B: Fastify or Express lightweight service with custom architecture

### Option C: Early microservices split by domain area

## Pros and Cons

### Option A

Pros:

- Aligns with the documented target stack.
- Strong fit for modular domain/application/adapter separation.
- Good team ergonomics for controllers, DI, modules, and testing.
- Easier to evolve from one deployable to multiple modules than to prematurely split services.

Cons:

- NestJS can encourage framework-heavy code if discipline is weak.
- Reflection/decorator patterns can leak into domain code if boundaries are not enforced.

### Option B

Pros:

- Lower framework surface area.
- Potentially simpler runtime and lower abstraction overhead.

Cons:

- More architecture must be built and enforced manually.
- Lower payoff given the repo already assumes NestJS.
- Team maintainability may suffer if patterns are inconsistently applied.

### Option C

Pros:

- Service isolation and independent deployability.
- Clear runtime ownership boundaries if the organization is already large.

Cons:

- Premature for the current domain and team stage.
- Increases operational overhead and distributed consistency risk.
- Harms local DX and documentation-to-delivery flow.

## Trade-offs

- NestJS modular monolith trades some framework weight for stronger team consistency and faster delivery.
- Lightweight frameworks reduce abstraction but increase the burden of getting architecture right repeatedly.
- Microservices optimize organizational scale before product and domain maturity justify them.

## Risks

- Accidental anemic domain model if application services become controller-like scripts.
- Tight ORM/framework coupling if ports and adapters are ignored.
- Overgrown monolith if domain modules are not kept explicit.

## Decision

Use:

- NestJS + TypeScript
- modular monolith deployment model
- documented hexagonal architecture
- explicit separation between domain, application, inbound adapters, outbound adapters, and infrastructure

## Consequences

- The backend remains maintainable, testable, and aligned with domain invariants.
- Team onboarding is easier because architectural rules are explicit.
- The product can scale functionally before needing runtime fragmentation.
