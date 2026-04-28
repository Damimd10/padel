# ADR-005: API Communication Pattern

## Status

Accepted

## Context

The system must support:

- separate `apps/web` and `apps/api`,
- end-to-end type safety,
- explicit validation at boundaries,
- team maintainability,
- and hexagonal backend architecture.

The repo already assumes `packages/schemas` and `packages/api-client` as contract boundaries.

## Options

### Option A: REST API with shared Zod schemas and typed API client

### Option B: GraphQL

### Option C: tRPC

## Pros and Cons

### Option A

Pros:

- Strong fit for separate web and API applications.
- Clear transport boundary between frontend and backend.
- Good compatibility with NestJS.
- Shared Zod schemas can provide runtime validation and type inference.
- Easier to document, test, and operationalize for admin workflows.

Cons:

- Requires discipline to keep contracts explicit and versioned.
- Can become verbose if endpoint design is poor.

### Option B

Pros:

- Flexible querying model.
- Useful when clients have highly variable read shapes.

Cons:

- Adds schema, resolver, and graph complexity not clearly justified by current use cases.
- Can hide backend query complexity behind flexible client selection.
- Less aligned with the repo’s existing contract boundary model.

### Option C

Pros:

- Strong type safety in TypeScript-only environments.
- Low ceremony between client and server in monorepos.

Cons:

- Tighter coupling between frontend and backend implementation details.
- Weaker fit if transport clarity and contract independence are important.
- Less ideal if future clients are not all TypeScript/React.

## Trade-offs

- REST plus shared schemas favors explicit contracts and organizational clarity over magical inference.
- GraphQL optimizes query flexibility more than this product currently needs.
- tRPC optimizes TypeScript ergonomics but increases coupling across app boundaries.

## Risks

- Schema drift if `packages/schemas` is bypassed.
- Weak error modeling if API boundaries are treated informally.
- Too many bespoke endpoints if resource and workflow modeling is undisciplined.

## Decision

Use:

- REST-style HTTP APIs
- `packages/schemas` for shared request/response schemas
- `packages/api-client` as the typed frontend consumption boundary
- Zod validation at backend boundaries and again in the client boundary

## Consequences

- The API remains explicit, testable, and independently evolvable.
- Frontend and backend preserve type safety without collapsing into one runtime model.
- Contract validation becomes unavoidable rather than optional.
