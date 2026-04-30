# Selection and Choice Controls

## Context

Issue `TKT-019` / GitHub issue `#22` adds the next reusable form-control wave for `packages/ui`.

The target controls are:

- `Checkbox`
- `Radio Group`
- `Select`
- `Switch`

These controls sit after the base field-contract work and must stay aligned with:

- the shared UI package boundaries,
- the documented accessibility posture,
- the `shadcn/ui` + Radix UI composition approach,
- and Storybook-first validation for reusable UI.

## Assumptions

- `TKT-018` establishes the baseline field contract before this ticket is implemented.
- Shared form controls in `packages/ui` must remain generic and must not own feature workflows, async loading, routing, mutations, or data fetching.
- Radix primitives are the preferred behavior foundation for keyboard, focus, and state handling when a composite widget is required.
- The visual tone should stay operational, disciplined, and trust-first rather than decorative or consumer-app styled.

## Decisions

### 1. Component scope and boundaries

- `Checkbox` is the shared multi-select or boolean confirmation control for independent options.
- `Radio Group` is the shared single-choice control for mutually exclusive options that should remain visible at once.
- `Select` is the shared collapsed-choice control for one selected value from a bounded option list.
- `Switch` is the shared binary on/off control for immediate mode or setting changes.
- `Select` in this ticket explicitly excludes combobox, search, async option loading, and typeahead orchestration beyond the standard accessible select surface offered by the wrapped primitive.
- None of these controls should embed label copy, validation copy, option fetching, or feature-specific submission logic.

### 2. Public API direction

- Each control should expose a minimal shared API that mirrors standard form semantics first and Radix-specific escape hatches second.
- Shared APIs should prefer common HTML or form concepts such as `disabled`, `required`, `name`, `value`, `defaultValue`, `checked`, and `onCheckedChange` or `onValueChange` where the wrapped primitive requires it.
- Public exports should stay composable with the `TKT-018` field contract instead of re-inventing separate label, hint, or validation wrappers inside each control.
- `Radio Group` and `Select` should support item subcomponents or item-oriented composition that keeps option rendering explicit without forcing app-specific data shapes into the package API.

### 3. Accessibility and interaction contract

- All four controls must remain keyboard-operable without mouse-only affordances.
- `Checkbox` and `Switch` must expose checked and disabled states clearly and preserve visible focus treatment.
- `Radio Group` stories and implementation should document arrow-key movement, checked-state changes, and focus expectations across grouped options.
- `Select` stories and implementation should document trigger focus, open or closed behavior, highlighted option behavior, keyboard selection, and disabled-option handling.
- Invalid or error-adjacent presentation belongs to the shared field contract and visual state composition, not to bespoke feature logic inside these controls.

### 4. Storybook documentation contract

Storybook for this wave should organize these controls under `Shared/Forms/...` and cover:

- purpose and when-to-use guidance,
- default state,
- disabled state,
- keyboard-relevant interaction state,
- checked or selected state,
- long-label or dense-admin examples where useful,
- invalid or error-adjacent examples when that state is part of the public contract,
- and misuse boundaries, especially the line between `Select` and combobox behavior.

Recommended minimum stories:

- `Checkbox`: default, checked, disabled, invalid-adjacent, long label
- `Radio Group`: default, preselected, disabled option, invalid-adjacent, keyboard navigation
- `Select`: default, with placeholder, disabled, option groups if supported, invalid-adjacent, keyboard open and selection behavior
- `Switch`: default, checked, disabled, field-setting example, invalid-adjacent only if the field contract supports it cleanly

### 5. Testing contract

- Unit coverage should validate public prop mapping, controlled or uncontrolled state behavior, and disabled-state handling.
- Integration coverage should validate package entrypoint exports and that wrapped Radix interactions remain accessible through the shared API.
- Storybook interaction coverage should exercise keyboard and focus behavior for `Radio Group` and `Select`, and checked-state behavior for `Checkbox` and `Switch`.
- Tests should verify shared semantics and package boundaries, not private styling implementation details.

## Trade-offs

- Lean shared APIs reduce feature leakage but may require consumers to compose more field-level structure themselves.
- Radix-based composition improves accessibility and keyboard behavior but introduces more subcomponent surface area than a naive wrapper.
- Strictly excluding combobox behavior keeps `Select` focused, but some feature teams may initially expect a richer search-driven control from the same component family.

## Risks

- If `TKT-018` lands with an unclear field contract, these controls may duplicate label, description, and validation composition in inconsistent ways.
- If `Select` scope is not enforced, feature-specific async or searchable behavior could leak into `packages/ui` and create long-term API debt.
- If Storybook coverage stops at static rendering, keyboard and focus regressions in Radix-based controls may slip through review.
- If `Switch` and checkbox semantics are blurred, the design system may encourage incorrect control choice in product workflows.

## Next Actions

- Implement `TKT-018` first so these controls can reuse the approved field composition baseline.
- Keep this document linked from the UI package docs and use it as the acceptance-review checklist for issue `#22`.
- When implementation starts, add Storybook docs pages that explicitly call out `Checkbox` vs `Switch` usage and `Select` vs combobox boundaries.
- Add component-level stories and tests in the same pull request as each new export so Storybook remains the source of truth for the shared control contract.
