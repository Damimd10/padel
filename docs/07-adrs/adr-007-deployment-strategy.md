# ADR-007: Deployment Strategy

## Status

Accepted

## Context

The product must scale to real-world usage, but the biggest operational risks are:

- broken competition state,
- missing result traceability,
- fragile releases during active events,
- and poor team maintainability.

The system is not a consumer social product requiring extreme low-latency distributed infrastructure from day one.

## Options

### Option A: Separate web and API deployables on managed containers with managed PostgreSQL

### Option B: Early Kubernetes platform

### Option C: Serverless-heavy deployment

## Pros and Cons

### Option A

Pros:

- Operationally simple and team-friendly.
- Good local-to-prod parity with Docker.
- Clear separation between `apps/web` and `apps/api`.
- Managed PostgreSQL reduces infrastructure burden while preserving relational reliability.

Cons:

- Less fine-grained scaling than a service mesh or function split.
- Some platform coupling if the chosen container host is too opinionated.

### Option B

Pros:

- Strong standardization and scalability patterns.
- Useful for larger platform teams.

Cons:

- Too much operational ceremony for the current stage.
- Higher onboarding and maintenance cost.
- Risks optimizing for hypothetical future scale instead of current correctness.

### Option C

Pros:

- Lower raw infrastructure management in some environments.
- Elastic scaling for bursty traffic.

Cons:

- Harder local parity.
- More complex workflow around long-lived admin operations and migrations.
- Risk of over-fragmentation and platform-specific operational behavior.

## Trade-offs

- Managed containers trade maximum platform control for much better maintainability.
- Kubernetes would buy future flexibility at a large present-day complexity cost.
- Serverless would buy elasticity at the cost of operational clarity and runtime cohesion.

## Risks

- Weak observability can still make competition-day incidents painful.
- Poor secrets/config discipline can undermine an otherwise simple deployment model.
- Manual release gates can slow delivery if not revisited later.

## Decision

Use:

- separate deployables for `apps/web` and `apps/api`
- Dockerized services
- managed container hosting
- managed PostgreSQL
- preview/staging environments automatically
- manual production promotion until operational stability is proven

## Consequences

- Infrastructure remains intentionally boring and maintainable.
- The team gets clear deployment boundaries without premature orchestration complexity.
- The platform supports real-world usage while preserving delivery speed and operational clarity.
