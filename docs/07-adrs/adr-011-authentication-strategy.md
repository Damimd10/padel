# ADR-011: Authentication Strategy

## Status

Accepted

## Context

The product needs authenticated administration flows for competition creation, registration review, structure management, and operational dashboards.

The current documentation already assumes:

- a React frontend in `apps/web`
- a NestJS backend in `apps/api`
- PostgreSQL as the system database
- hexagonal boundaries on the backend

What has not been explicit enough yet is the concrete authentication framework and the boundary where auth concerns should live.

The authentication approach must support:

- email and password as a minimum baseline
- future social or organization-oriented extensions without replacing the foundation
- session management that works well with a separate frontend and API
- PostgreSQL-backed persistence
- a clear separation between product domain models and auth/session models
- an implementation path that fits the documented NestJS and TypeScript stack

## Options

### Option A: Better Auth

Pros:

- TypeScript-first authentication framework with first-party database and plugin support.
- Works with PostgreSQL and aligns with the current stack direction.
- Covers sessions, user accounts, and future extension points without pushing the project toward an external auth SaaS by default.
- Keeps auth as a dedicated platform concern instead of mixing it into the competition domain model.

Cons:

- Adds another framework boundary that the team must learn and integrate carefully.
- Requires explicit guidance so Better Auth models and flows do not leak into core domain modules.

### Option B: Build a custom NestJS auth stack

Pros:

- Maximum control over implementation details.
- No dependency on an external auth framework abstraction.

Cons:

- Recreates commodity authentication work with high security risk.
- Slower to deliver and harder to harden correctly.
- Increases maintenance cost for sessions, password handling, and future auth features.

### Option C: Use a hosted auth platform as the primary solution

Pros:

- Faster managed setup for some flows.
- Reduces direct ownership of some auth infrastructure concerns.

Cons:

- Adds external platform coupling early.
- Can complicate local development, domain ownership, and backend integration boundaries.
- Not the best fit for the currently documented self-owned backend direction.

## Trade-offs

- Better Auth trades some integration complexity for a stronger off-the-shelf auth foundation than a custom implementation.
- A custom stack maximizes control but creates unnecessary security-sensitive product work.
- A hosted platform can accelerate setup but weakens ownership and portability earlier than needed.

## Risks

- Auth logic could spread into domain modules if route/session concerns are not kept at inbound and infrastructure boundaries.
- User identity concepts from Better Auth can become accidental competition-domain entities if mapping rules are not explicit.
- Session and cookie settings can still be misconfigured if operational guidance is weak.

## Decision

Use:

- `Better Auth` as the authentication framework
- PostgreSQL-backed auth persistence
- backend-owned auth wiring in `apps/api`
- explicit separation between auth/session models and the competition domain model

Authentication must remain a platform concern at the edge of the system:

- Better Auth integration belongs in inbound adapters and infrastructure wiring
- application use cases consume authenticated identity as input, not Better Auth internals
- domain entities must not import Better Auth types directly

## Consequences

- The project has a clear authentication direction aligned with the documented TypeScript and PostgreSQL stack.
- Future backend and frontend auth tickets can build on an explicit accepted decision instead of reopening the auth-tool choice.
- Implementation still needs dedicated tickets for local database infrastructure, Better Auth runtime wiring, session/cookie policy, and protected route behavior.
