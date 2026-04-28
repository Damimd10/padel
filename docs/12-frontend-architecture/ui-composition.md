# UI Composition

## Context

The design system is workflow-oriented, accessibility-sensitive, and intentionally not generic dashboard boilerplate. Frontend composition therefore needs clear rules for what belongs in `packages/ui` versus `apps/web`.

## Assumptions

- Storybook is the source of truth for reusable UI components.
- `packages/ui` contains shared primitives and selected reusable composites.
- Application workflows remain feature-owned unless repetition proves that a shared abstraction is justified.

## Decisions

### 1. Composition layers must stay distinct

The frontend should treat these as separate layers:

- design-system primitives,
- reusable shared composites,
- app-level workflow compositions,
- and route-level screens.

The same component should not try to satisfy all four roles.

### 2. `packages/ui` owns reusable interface building blocks

`packages/ui` may contain:

- primitives based on Radix/shadcn/Tailwind decisions,
- reusable admin composites such as tables, filter bars, banners, dialogs, and field wrappers,
- and domain-shaped presentation components that are proven reusable across multiple workflows.

`packages/ui` must not contain:

- route loaders,
- API calls,
- query hooks,
- workflow-specific mutation behavior,
- or hidden application policy.

### 3. `apps/web` owns workflow composition

Feature modules in `apps/web` should compose:

- query-backed data,
- route params,
- form logic,
- mutation handling,
- and reusable UI surfaces.

This is where competition-specific workflows such as registration review or result entry should primarily live.

### 4. Prefer explicit composition over boolean prop accumulation

When a component starts growing many flags such as:

- `isCompact`
- `isDense`
- `isEditable`
- `isReviewMode`
- `showActions`

the likely problem is weak composition, not missing props.

Prefer:

- explicit subcomponents,
- compound component structure,
- slot-based composition,
- or separate workflow wrappers.

### 5. Shared components should accept stable UI-facing props

`packages/ui` components should receive:

- presentational props,
- typed data already shaped for display,
- and explicit callbacks for user intent.

They should not need to know:

- where the data came from,
- how it was fetched,
- which route is active,
- or which mutation library is in use.

### 6. Storybook is the contract surface for shared UI

Every reusable component promoted into `packages/ui` should carry Storybook documentation for:

- purpose,
- variants,
- states,
- accessibility behavior,
- composition rules,
- and misuse patterns.

If a component cannot be documented clearly outside one screen, it probably does not belong in `packages/ui` yet.

## Trade-offs

- Strong package boundaries reduce accidental coupling but slow down promotion into shared UI.
- Workflow compositions may repeat some glue code by design.
- Explicit composition patterns create more components, but each has a clearer contract.

## Risks

- Teams may over-promote screen-specific components into `packages/ui`.
- Poorly shaped shared component props can leak domain and transport complexity everywhere.
- Boolean-prop growth can gradually make reusable components impossible to reason about.

## Anti-patterns

- Importing query hooks or router utilities into `packages/ui`.
- Making one shared component adapt to every workflow through flags.
- Passing raw DTOs directly into reusable display components.
- Hiding accessibility-critical behavior behind opaque wrappers with no Storybook contract.
- Using Storybook as a gallery for full application screens rather than shared UI contracts and patterns.

## Next Actions

- Classify each planned component from the design-system inventory as primitive, shared composite, or app-only composition.
- Require composition guidance and misuse notes in Storybook docs for every shared component.
- Reassess promotion into `packages/ui` only after repetition is proven across features.
