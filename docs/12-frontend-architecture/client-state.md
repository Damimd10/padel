# Client State

## Context

The stack includes TanStack Store, but the product also already has route state, server state, form state, and local React state. That means client-state scope must be intentionally narrow.

## Assumptions

- Most important product data is backend-owned.
- Many UI concerns are recoverable from URL, query cache, or form state.
- Introducing a store is cheap technically and expensive architecturally if misused.

## Decisions

### 1. TanStack Store is for UI-owned state only

TanStack Store is appropriate for state that is:

- client-owned,
- not part of backend truth,
- not naturally expressed as route state,
- and awkward to thread through many layers with local state alone.

Typical candidates include:

- shell-level UI preferences,
- temporary panel visibility that spans route subtrees,
- local interaction state shared across sibling branches,
- and non-persistent operator aids.

### 2. Prefer narrower owners before introducing a store

Before adding TanStack Store, evaluate this order:

1. local component state
2. lifted state within a feature subtree
3. route/search params if the state is navigable or shareable
4. TanStack Form if it is edit state
5. TanStack Query if it is backend-backed
6. TanStack Store only if none of the above fit cleanly

### 3. Store shape should remain feature-scoped or shell-scoped

Stores should not become one global mutable bag.

Prefer:

- shell-scoped stores for true app-shell concerns,
- feature-scoped stores for workflow-local UI coordination,
- and selectors or derived reads that minimize unnecessary re-renders.

### 4. Store data must be reconstructable or disposable

If losing the store state on refresh would create data loss or business inconsistency, the state probably belongs somewhere else.

That rule is important because store state is not the system of record.

## Trade-offs

- Narrow store usage keeps the architecture understandable.
- Some interactions may require a bit more route or component composition instead of a convenient global store.
- Feature-scoped stores can introduce extra files, but they avoid silent coupling across the app.

## Risks

- A store can quickly become a shadow backend cache.
- Global mutable state can obscure where UI behavior actually comes from.
- Teams may put durable workflow progress into the store because it feels convenient.

## Anti-patterns

- Copying query data into TanStack Store for reads and writes.
- Using one app-wide store for every screen concern.
- Persisting workflow-critical state only in the store.
- Using TanStack Store where a route param or form already owns the concern.
- Triggering backend mutations from inside store definitions.

## Next Actions

- Approve a small set of allowed store use cases before implementation starts.
- Review any proposed new global store as an architectural exception.
- Keep state-ownership checks part of PR review once delivery begins.
