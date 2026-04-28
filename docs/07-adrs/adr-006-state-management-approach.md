# ADR-006: State Management Approach

## Status

Accepted

## Context

The frontend is workflow-heavy and form-heavy. It needs:

- predictable server-state handling,
- explicit form validation,
- minimal accidental global state,
- and alignment with the documented TanStack approach.

## Options

### Option A: TanStack Query + TanStack Form + TanStack Store

### Option B: Redux Toolkit as the primary state solution

### Option C: XState-heavy workflow orchestration

## Pros and Cons

### Option A

Pros:

- Clean separation of server state, form state, and UI state.
- Already documented and aligned with ADR-001.
- Excellent fit for admin screens, forms, and route-driven data.
- Lower cognitive overhead than a universal state solution.

Cons:

- Requires discipline to avoid TanStack Store becoming a second server-state layer.
- Complex workflows may still need explicit UI modeling in some places.

### Option B

Pros:

- Familiar to many teams.
- Centralized global state model.

Cons:

- Encourages over-centralization of state that should remain server-owned or route-owned.
- Adds boilerplate and complexity for a product whose server state already maps well to Query.

### Option C

Pros:

- Strong for explicit workflow modeling and edge cases.

Cons:

- Too heavy as the default state architecture for the entire application.
- Would add a second major mental model on top of Query/Form/route state.
- Better reserved for specific complex UI flows if truly needed later.

## Trade-offs

- TanStack-based state management optimizes for separation and maintainability.
- Redux optimizes for centralization, which is not the primary need here.
- XState optimizes for explicit workflow machines, but that is too specialized as the default.

## Risks

- Query misuse as a generic local state store.
- Store misuse as an event bus or domain state shadow.
- Inconsistent mutation invalidation if feature teams are undisciplined.

## Decision

Use:

- TanStack Query for all default server state
- TanStack Form + Zod for forms
- TanStack Store only for UI-owned local/global state where route state or form state is insufficient

## Consequences

- The frontend gets a maintainable, explicit state model.
- Teams can reason about where state belongs instead of defaulting to global stores.
- The product preserves type safety and route/data consistency with the existing ADR-001.
