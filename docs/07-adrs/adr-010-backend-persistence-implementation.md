# ADR-010: Backend Persistence Implementation Strategy

## Status

Accepted

## Context

The repo already accepts:

- NestJS + TypeScript for the backend
- a modular monolith with hexagonal architecture
- PostgreSQL as the primary transactional database
- backend integration testing as part of the quality model

What is still missing is the implementation-level persistence decision that turns those accepted directions into an execution-ready backend workflow for `CORE-01`.

The persistence approach must support:

- repository ports owned by the core
- explicit outbound adapters for persistence
- transaction control at the application layer
- migrations as a first-class operational concern
- strong testability with real PostgreSQL-backed integration coverage
- low risk of leaking ORM or persistence concepts into the domain model

## Options

### Option A: Prisma ORM + Prisma Migrate

### Option B: TypeORM with a data-mapper-style discipline

### Option C: Kysely + `pg` + SQL-first migrations

## Pros and Cons

### Option A

Pros:

- Strong TypeScript ergonomics and good developer productivity.
- Mature migration workflow and widely understood tooling.
- Good fit for CRUD-heavy administrative applications.
- Strong official Nest documentation and community adoption through the Prisma recipe.

Cons:

- Generated Prisma client types can become an accidental dependency of application or domain code.
- Schema-first modeling can pull design pressure toward persistence structures instead of domain boundaries.
- Transaction and repository patterns often drift toward Prisma-centric service code unless rigor is enforced.

### Option B

Pros:

- Familiar fit for many NestJS teams.
- Can support a data-mapper approach when used carefully.
- Includes migrations and relational mapping in one toolset.

Cons:

- The ecosystem strongly encourages entity decorators and persistence-shaped models.
- Domain and persistence models can collapse together unless the team fights the framework defaults.
- Higher risk of framework and ORM leakage into the domain layer than the repo's hexagonal guidance allows.

### Option C

Pros:

- Keeps SQL and relational behavior explicit while preserving strong TypeScript support.
- Fits hexagonal boundaries well because repository implementations stay in outbound adapters instead of becoming the domain model.
- Encourages deliberate mapping between persistence rows and domain entities.
- Works well with PostgreSQL transactions without forcing ORM-centric architecture.

Cons:

- More mapping code must be written manually.
- Team members need comfort with explicit SQL-oriented persistence design.
- Fewer batteries-included abstractions than full ORMs.

## Trade-offs

- Prisma optimizes for productivity and aligns better with the Nest ecosystem, but requires discipline to stop the generated client and schema models from leaking across architectural boundaries.
- TypeORM aligns with common NestJS examples, but its default patterns are the weakest fit for strict hexagonal separation.
- Kysely buys very explicit SQL ownership, but adds more custom persistence code and less leverage from the broader Nest documentation ecosystem.

## Risks

- Prisma schema models can become the accidental application model if repository mapping rules are not enforced.
- Teams may overuse Prisma directly in controllers or use cases if ports and adapters are not kept explicit.
- Transaction coordination can become inconsistent if application-level transaction boundaries are not standardized.

## Decision

Use:

- `Prisma ORM` as the persistence client for outbound adapters
- `Prisma Migrate` for schema and migration management
- repository interfaces defined in the application/core boundary
- repository implementations and persistence mapping inside outbound adapters
- Prisma transactions from the adapter layer, coordinated by application use cases when a transaction boundary is required

Additional rules:

- domain entities and value objects must not import Prisma client types, generated payload types, or migration code
- Prisma schema models must not become the domain model by default
- controllers translate HTTP payloads into application inputs; repositories translate Prisma records into domain objects
- backend integration tests should run against real PostgreSQL through Prisma-backed adapters, while domain and application unit tests use fakes or in-memory test doubles at the port boundary

## Consequences

- The backend now aligns more closely with Nest's documented ecosystem and common operational patterns.
- The first `CORE-01` backend slice can use Prisma without reopening the tool choice.
- We gain faster schema evolution and a smoother developer workflow, at the cost of needing explicit guardrails around repository boundaries and mapping.
- Migration discipline, transaction handling, and repository conventions remain explicit engineering responsibilities even though Prisma automates part of the persistence workflow.
