# Routing

## Context

TanStack Router is the frontend navigation and route-orchestration layer. In this product, route design is not only about URLs. It is also the coordination boundary for layout, access, route-critical data, and workflow entry rules.

## Assumptions

- The application contains authenticated admin and operator workflows.
- Most screens depend on route params, filters, pagination, or workflow context.
- Shareable state should use the URL when practical.

## Decisions

### 1. Route tree structure follows workflow areas, not implementation trivia

The route tree should primarily reflect user-recognizable workflow areas such as:

- competitions,
- registrations,
- matches,
- standings,
- and administrative settings.

Routes should not be organized around technical concerns like “hooks,” “tables,” or “api.”

### 2. Route files own navigation semantics and entry coordination

Each route is responsible for:

- route params and search param contracts,
- layout composition,
- route-level authorization and preconditions,
- loader-based prefetch for route-critical data,
- and handoff into feature modules.

This makes the route layer the entry boundary, not the feature implementation boundary.

### 3. URL is the source of truth for shareable workflow state

State should live in route params or search params when it changes:

- what resource is being viewed,
- what page or segment is visible,
- what filters are shareable,
- or which tab is meaningfully navigable.

This preserves deep-linking, back/forward behavior, and operator trust.

State should not be forced into the URL when it is:

- ephemeral,
- purely presentational,
- or not useful to restore/share.

### 4. Route loaders prefetch only route-critical data

Loader prefetch is for data that the route cannot meaningfully render without, such as:

- the competition record being edited,
- the registration list for a review screen,
- or the match context needed before a result-entry surface appears.

Loaders should not eagerly fetch every possible panel on a complex screen.

### 5. Route components reuse the same query definitions as loaders

A route loader and the route subtree must rely on the same query option factory or equivalent feature-owned query contract.

This avoids:

- key drift,
- inconsistent stale behavior,
- and duplicate fetching caused by “almost the same” query definitions.

### 6. Nested layouts should isolate responsibility

Nested routes and layouts are appropriate when they create clear separation between:

- global shell concerns,
- workflow-area framing,
- and page-specific content.

Nested layouts are not a license to bury essential business context three components deep.

## Trade-offs

- Strong URL ownership improves reproducibility but increases upfront route design effort.
- Loader discipline prevents waterfalls but requires teams to think clearly about what is truly route-critical.
- Feature modularity may introduce some indirection compared with putting everything in route files.

## Risks

- Overloading search params with every UI preference can create fragile URLs.
- Underusing the URL can make key workflows hard to restore and debug.
- Route files may still bloat if they absorb feature logic rather than delegating it.

## Anti-patterns

- Fetching route-critical data only in child component effects.
- Using route loaders for every background panel or optional widget.
- Defining one query shape in the loader and a different one in the rendered route.
- Storing navigable table state only in local component state.
- Building route trees around generic layout wrappers rather than workflow boundaries.

## Next Actions

- Define route groups and search param contracts once the first MVP screens are sequenced.
- Pair each route with its route-critical query set and loader preconditions.
- Keep route review focused on recoverability, deep-linkability, and fetch coordination.
