# Numeric and Date-Oriented Inputs

## Context

Issue `TKT-029` / GitHub issue `#29` adds the next reusable input wave for `packages/ui`.

The target controls are:

- `Numeric Input`
- `Date Input`
- `Date Range Input`

These controls are needed by competition-configuration and result-entry workflows, but the shared package contract must stay generic to input semantics rather than feature logic.

## Assumptions

- `Field`, `Input`, and the first shared form-control wave already establish the baseline label, description, invalid-state, and entrypoint conventions for `packages/ui`.
- Shared form controls in `packages/ui` must not own parsing pipelines, persistence rules, form submission behavior, or competition-specific workflow logic.
- Native browser semantics should be preferred when they preserve a credible shared API and accessibility baseline.
- Storybook remains the primary validation surface for documenting interaction expectations before app-level forms compose these controls.

## Decisions

### 1. Scope and boundaries

- `Numeric Input` is the shared number-oriented entry surface for quantities, scores, ordering values, and similar bounded numeric data.
- `Date Input` is the shared single-date entry surface for calendar dates such as registration deadlines, competition start dates, or result dates.
- `Date Range Input` is the shared two-value date composition surface for start and end dates that belong together semantically.
- None of these controls should embed competition-specific labels, presets, business-rule validation, timezone workflows, or persistence shaping.
- `Date Range Input` should focus on shared structure and semantics, not on async calendars, app-owned date math, or feature-specific shortcut behavior.

### 2. Public API direction

- `Numeric Input` should stay close to standard input semantics first, exposing shared support for native attributes such as `min`, `max`, `step`, `inputMode`, `value`, and `defaultValue`.
- `Date Input` should preserve standard date-field semantics and allow consumers to supply the data shape their form layer owns without forcing package-level parsing helpers.
- `Date Range Input` should expose an explicit shared contract for two related date values and should compose cleanly with the existing `Field` model rather than replacing it.
- Shared exports should prefer generic names and prop shapes that make TanStack Form mapping straightforward without leaking workflow meaning into `packages/ui`.
- If `Date Range Input` needs internal helper subcomponents, those helpers should remain part of a coherent shared API instead of pushing low-level wiring burden into every consuming app.

### 3. Accessibility and interaction contract

- All controls must preserve visible focus treatment, disabled treatment, and invalid-state composition through the shared field contract.
- `Numeric Input` stories and tests should document keyboard increment and decrement relevance where native behavior is part of the public contract.
- `Date Input` stories and tests should document read-only, disabled, invalid, and keyboard-relevant states without overpromising browser-specific picker behavior that the package does not control.
- `Date Range Input` should make start and end relationships explicit in labels, descriptions, or helper structure so consumers do not need to re-invent accessibility wiring for paired dates.
- Shared package behavior should document what is guaranteed across browsers versus what remains browser-native behavior.

### 4. Storybook documentation contract

Storybook for this wave should organize these controls under `Shared/Forms/...` and cover:

- purpose and when-to-use guidance,
- default state,
- disabled state,
- read-only state where applicable,
- invalid-state composition with `Field`,
- keyboard-relevant interaction expectations,
- dense admin-form examples where the controls appear with labels, descriptions, and validation copy,
- and explicit boundaries between shared input semantics and app-owned parsing or validation logic.

Recommended minimum stories:

- `Numeric Input`: default, constrained with `min` or `max`, disabled, read-only, invalid with `Field`, keyboard-relevant example
- `Date Input`: default, with description, disabled, read-only, invalid with `Field`, keyboard-relevant example
- `Date Range Input`: default pair, invalid start or end example, disabled, read-only if supported, `Field` composition guidance, TanStack Form mapping example in docs

### 5. Testing contract

- Unit coverage should validate prop passthrough, invalid-state wiring, and the public rendering contract for each exported surface.
- Integration coverage should validate package entrypoint exports and confirm the controls compose with `Field` without app-specific dependencies.
- Storybook interaction coverage should exercise focus movement and keyboard-relevant behavior where the public contract depends on it.
- Tests should verify documented shared semantics and accessibility wiring, not browser-specific picker internals that belong outside the package boundary.

## Trade-offs

- Lean shared APIs reduce feature leakage but leave consumers responsible for app-local coercion and business-rule validation.
- Relying on browser-native date and number behavior keeps the package smaller, but creates some interaction differences across browsers that must be documented honestly.
- A single `Date Range Input` surface improves reuse, but it requires careful API design so it stays generic rather than turning into a feature-specific mini-form.

## Risks

- If the shared API starts owning parsing or normalization, `packages/ui` could absorb feature logic that belongs in TanStack Form mappings or Zod schemas.
- If Storybook documents only static rendering, keyboard and invalid-state behavior for dense admin forms may regress unnoticed.
- If `Date Range Input` is under-specified, each app form may invent different start and end wiring, hurting consistency and accessibility.
- If browser-native behavior is assumed rather than documented, consumers may expect identical picker UX that the shared package cannot guarantee.

## Next Actions

- Use this document as the acceptance-review checklist for issue `#29` before implementation starts.
- Keep `Field` as the primary invalid, description, and label composition contract instead of duplicating that structure inside each control.
- When implementation starts, add Storybook stories and colocated tests in the same pull request as the new exports.
- If `Date Range Input` needs a more opinionated API than this document supports, pause for a focused ADR or design-system decision instead of improvising in code.
