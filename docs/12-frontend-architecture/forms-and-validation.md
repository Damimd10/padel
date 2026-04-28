# Forms and Validation

## Context

Competition workflows include high-impact forms such as competition setup, registration review actions, category assignment, and result entry.

These forms need explicit ownership and validation boundaries.

## Assumptions

- TanStack Form is the default form-state owner.
- Zod is the default validation language.
- Some validation rules are shared with backend contracts, but not every UI rule belongs in shared schemas.

## Decisions

### 1. TanStack Form owns edit sessions, not server truth

TanStack Form should represent:

- the editable snapshot,
- field lifecycle,
- validation lifecycle,
- and submit intent.

It should not be treated as a general-purpose store for non-form workflow state.

### 2. Zod schemas validate boundaries, but schema ownership is tiered

Use shared schemas from `packages/schemas` when the rule is part of a stable cross-layer contract.

Use feature-local Zod schemas when the rule is:

- specific to a workflow surface,
- about UI coercion or shaping,
- or not appropriate for backend contract reuse.

This avoids forcing all frontend form concerns into one globally shared schema layer.

### 3. Form defaults must come from deliberate mapping, not raw query objects

When a form edits backend-backed data, default values should come from an explicit mapping step from query data into form input shape.

This prevents:

- accidental coupling to transport DTO structure,
- uncontrolled field shape drift,
- and subtle editing bugs when transport contracts change.

### 4. Validation should match interaction risk

Validation expectations should be explicit for:

- on-change feedback where fast correction matters,
- on-blur feedback where premature noise would be harmful,
- and submit-time validation for cross-field or action-gating rules.

Not every field needs real-time validation.

### 5. Mutation submission remains separate from form ownership

The form owns input state. The mutation layer owns server submission, transport failure handling, cache invalidation, and post-submit route or feedback behavior.

Do not bury mutation side effects inside generic field or form primitives.

## Trade-offs

- Explicit mapping between query data and form data adds ceremony.
- Shared schemas improve consistency but can over-couple frontend and backend if used indiscriminately.
- Strong validation design reduces ambiguity but requires more upfront decisions about interaction timing.

## Risks

- Teams may bypass schema ownership rules and place all validation in the wrong layer.
- Reusing raw DTOs as form values can make harmless backend changes break forms unexpectedly.
- Over-validating on every keystroke can degrade usability on dense admin forms.

## Anti-patterns

- Binding form fields directly to raw query result shapes without a mapping boundary.
- Using one giant shared schema for every frontend and backend concern.
- Putting route navigation, toasts, and cache invalidation directly into reusable field components.
- Using TanStack Store to hold draft form state that TanStack Form should own.
- Treating client-side validation as a substitute for backend enforcement.

## Next Actions

- Document schema ownership examples once the first forms are ticketed.
- Define form-state and submission-state patterns in Storybook only for reusable field primitives, not full workflows.
- Review high-risk forms first: competition creation, registration decisions, and result entry.
