# ADR-004: Database Choice

## Status

Accepted

## Context

The MVP domain requires:

- strong relational consistency,
- lifecycle state tracking,
- transactional updates,
- audit-friendly history,
- queryability across competitions, participants, registrations, matches, and results.

The repo already points to PostgreSQL.

## Options

### Option A: PostgreSQL

### Option B: MySQL

### Option C: MongoDB or other schemaless document database

## Pros and Cons

### Option A

Pros:

- Strong relational model for the documented domain.
- Mature transactions, constraints, indexing, and migration tooling.
- Good fit for domain invariants and query-heavy administrative workflows.
- Widely understood by teams and cloud providers.

Cons:

- Requires disciplined schema evolution.
- Domain modeling can still be damaged by poor table design if the database becomes the primary architecture driver.

### Option B

Pros:

- Mature relational option with broad hosting support.
- Good enough for many business applications.

Cons:

- No clear advantage over PostgreSQL for this domain.
- Slightly weaker fit for teams already oriented toward the documented stack.

### Option C

Pros:

- Flexible schema evolution.
- Useful for highly variable document structures.

Cons:

- Weak fit for this consistency-heavy, relational domain.
- More application-level burden for invariants that belong in the data model and transaction model.
- Higher risk of ad hoc modeling around competition state.

## Trade-offs

- PostgreSQL favors explicit relational discipline over schemaless convenience.
- MongoDB would accelerate some early iteration but would likely externalize too many invariants into application code.
- MySQL is viable but not differentiated enough to displace PostgreSQL here.

## Risks

- Poor migration discipline can still create operational risk.
- Overuse of database-specific shortcuts can leak persistence concerns into the domain.

## Decision

Use:

- PostgreSQL as the primary transactional database

## Consequences

- The system gets strong consistency guarantees for competition workflows.
- The ERD in `docs/06-diagrams/erd.mmd` maps naturally to the chosen persistence model.
- Schema design and migrations become first-class operational concerns from the start.
