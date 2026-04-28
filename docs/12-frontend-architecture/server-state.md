# Server State

## Context

Competition data is transactional, multi-user, and backend-owned. The frontend therefore needs strict server-state handling rather than ad hoc fetching.

TanStack Query is the default server-state owner.

## Assumptions

- The backend is the system of record.
- Multiple users may act on the same competition, registration, or result within overlapping time windows.
- Data freshness matters most around operational transitions, not around passive read pages.

## Decisions

### 1. TanStack Query is the only default cache for backend-backed data

Backend-backed data should live in TanStack Query, not in:

- duplicated React state,
- TanStack Store mirrors,
- context-held caches,
- or component-local “snapshot copies” unless the feature is explicitly entering edit mode.

### 2. Query definitions are feature-owned and reusable across route and component boundaries

Each feature should define stable query contracts that include:

- query key shape,
- fetch function through `packages/api-client`,
- schema-backed parsing expectations,
- and stale/refetch expectations when needed.

These definitions should be shared between:

- route loaders,
- route components,
- nested feature components,
- and mutation invalidation logic.

### 3. Query keys must reflect domain identity and query shape

Query keys should encode:

- resource area,
- entity or collection identity,
- and the parameters that materially affect the response.

Keys must be:

- stable,
- serializable,
- and easy to inspect.

Vague string keys and one-off local conventions are not acceptable.

### 4. Cache invalidation must be targeted and justified

Mutations should prefer:

- precise invalidation of impacted queries,
- or explicit cache updates when the mutation result fully describes the changed server state.

Broad “invalidate everything in this area” behavior is allowed only when targeted invalidation is materially riskier than the additional refetch cost.

### 5. Server data may be adapted for UI, but transport and presentation should not collapse into one shape

`packages/api-client` and `packages/schemas` define transport contracts.

Feature modules may map those contracts into UI-facing shapes when needed for:

- grouped displays,
- workflow-specific labels,
- or derived flags used only in the frontend.

This mapping should happen before the data reaches `packages/ui`.

### 6. Suspense-oriented consumption is preferred for route-critical reads

Where route loaders prefetch route-critical data, route components should consume that data through the same query definitions in a Suspense-friendly way.

This produces one coherent fetch path instead of separate loader and component logic.

## Trade-offs

- Strict query ownership reduces ambiguity but requires disciplined query design.
- View-model mapping increases code surface area but prevents DTO leakage into presentational components.
- Targeted invalidation is more work than broad resets, but it protects operator responsiveness and predictability.

## Risks

- Teams may still duplicate backend data into stores for convenience.
- Mutation-heavy screens can become brittle if invalidation rules are implicit.
- Aggressive derived mapping can create drift if transport contracts change often.

## Anti-patterns

- Calling `fetch` directly inside shared components.
- Saving query results into TanStack Store “for easier access.”
- Rebuilding query keys inline in multiple places.
- Invalidating entire resource families after every mutation.
- Running fetches in `useEffect` for route-critical data that should have been coordinated through the route and query layer.

## Next Actions

- Standardize query key taxonomy when the first feature tickets are created.
- Document invalidation rules per mutation-heavy workflow.
- Keep server-state review focused on ownership, freshness expectations, and cross-user correctness.
