# Frontend Overview

## Context

The frontend supports an admin-heavy competition workflow product with dense operational screens, stateful workflows, and trust-sensitive domain data.

The architecture must optimize for:

- predictable data ownership,
- route-aware orchestration,
- explicit component boundaries,
- end-to-end type safety,
- and team maintainability over time.

## Assumptions

- The primary application is `apps/web`.
- The backend remains the system of record for competition data.
- The frontend uses React, TanStack Router, TanStack Query, TanStack Form, TanStack Store, Zod, `packages/api-client`, and `packages/ui`.
- Most screens are authenticated workflow screens rather than marketing or content pages.

## Decisions

### 1. Frontend responsibility is orchestration, not domain authority

The frontend is responsible for:

- presenting workflow state,
- coordinating route transitions,
- collecting user intent,
- validating boundary inputs,
- and keeping UI state coherent.

The frontend is not responsible for:

- being the source of truth for competition entities,
- re-implementing backend invariants as hidden client-only logic,
- or maintaining a parallel domain model in client state.

### 2. Data ownership is explicit and hierarchical

Each data category has one default owner:

- URL and route params own navigation state, shareable filters, pagination, sorting, and selected tabs when they affect navigation or sharability.
- TanStack Query owns backend-backed server state.
- TanStack Form owns in-progress form editing state.
- TanStack Store owns non-shareable UI state that must outlive a single component tree.
- Local React state owns short-lived view-only state scoped to one component or one narrow subtree.

When two owners are possible, choose the narrower owner unless shareability or reuse clearly requires a broader one.

### 3. Route files own page composition and preconditions

Routes are the top-level orchestration boundary in `apps/web`. A route should decide:

- which data is route-critical,
- which prefetches must happen before first meaningful paint,
- which permission or precondition checks gate entry,
- which layout frame surrounds the workflow,
- and which feature compositions are mounted.

Routes should not become dumping grounds for all feature logic. They orchestrate; feature modules implement.

### 4. Feature modules own workflow behavior

A feature module should own:

- query option definitions,
- mutation hooks,
- form schemas specific to the workflow,
- feature-level view model mapping,
- and app-specific component compositions.

Feature modules should not leak raw transport details into presentational UI or spread logic across unrelated shared folders.

### 5. Shared UI stays presentation-first

`packages/ui` is for reusable primitives and composites that are:

- stylistically consistent with the design system,
- accessibility-reviewed,
- reusable across multiple workflows,
- and transport-agnostic.

`packages/ui` must not import:

- `packages/api-client`,
- route definitions,
- feature queries,
- or workflow-specific orchestration code.

### 6. Contracts cross package boundaries through schemas and the typed client

The frontend consumes backend data through:

- `packages/schemas` for shared contract schemas,
- `packages/api-client` for transport and response parsing,
- and feature-level mapping where transport data must be adapted for UI usage.

Raw `fetch` usage inside arbitrary route components is not the default architecture.

## Recommended frontend layering

The default layering in `apps/web` is:

1. route layer
2. feature orchestration layer
3. shared UI composition layer
4. design-system primitive layer

This means:

- route layer coordinates URL, loader behavior, route boundaries, and entry preconditions,
- feature orchestration layer coordinates queries, forms, mutations, and screen-specific logic,
- shared UI composition layer renders reusable domain-shaped surfaces without owning data fetching,
- design-system primitive layer provides accessible building blocks and stable component APIs.

## Trade-offs

- This architecture creates more files and clearer seams than a looser “just React components” approach.
- Some duplication across feature modules is acceptable when it avoids vague abstractions.
- Mapping transport data into UI-shaped data adds effort but reduces leakage from backend contracts into presentation.

## Risks

- Teams may bypass ownership rules and reintroduce mixed state sources.
- Shared packages can still become a dumping ground if feature code is promoted too early.
- Over-engineering view-model layers can create friction if applied mechanically to trivial screens.

## Anti-patterns

- Treating TanStack Store as a second backend cache.
- Letting route components own every query, mutation, form, and table concern directly.
- Passing raw backend DTOs deep into `packages/ui`.
- Creating generic “manager” hooks that hide routing, fetching, validation, and mutation side effects in one abstraction.
- Building reusable components whose API is mostly boolean flags instead of composition.

## Next Actions

- Keep the remaining frontend docs aligned to this ownership model.
- Enforce these boundaries in future ticket slicing and review checklists.
- Reflect package responsibilities again when `docs/13-ui-architecture/` and backend docs are finalized.
