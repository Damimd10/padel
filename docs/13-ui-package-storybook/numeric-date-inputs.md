# Numeric and Date-Oriented Inputs

## Context

Issue `TKT-029` / GitHub issue `#29` adds the next reusable input wave for `packages/ui`.

The target controls are:

- `Numeric Input`
- `Date Picker`
- `Date Range Picker`

These controls are needed by competition-configuration and result-entry workflows, but the shared package contract must stay generic to input semantics rather than feature logic.

## Assumptions

- `Field`, `Input`, and the first shared form-control wave already establish the baseline label, description, invalid-state, and entrypoint conventions for `packages/ui`.
- `Popover` already provides the shared overlay contract needed for calendar disclosure behavior inside `packages/ui`.
- Shared form controls in `packages/ui` must not own parsing pipelines, persistence rules, form submission behavior, or competition-specific workflow logic.
- The shared package should follow shadcn composition principles where they align with our stack, while replacing shadcn's visual styling and utility primitives with our approved design-system surfaces.
- Storybook remains the primary validation surface for documenting interaction expectations before app-level forms compose these controls.

## Decisions

### 1. Scope and boundaries

- `Numeric Input` is the shared number-oriented entry surface for quantities, scores, ordering values, and similar bounded numeric data.
- `Date Picker` is the shared single-date selection surface for calendar dates such as registration deadlines, competition start dates, or result dates.
- `Date Range Picker` is the shared two-value date selection surface for start and end dates that belong together semantically.
- None of these controls should embed competition-specific labels, presets, business-rule validation, timezone workflows, or persistence shaping.
- Date selection controls should follow the same structural principles as shadcn's date-picker patterns: composable trigger, popover disclosure, and calendar-driven selection with package-owned accessibility wiring.
- `Date Range Picker` should focus on shared structure and semantics, not on feature-specific shortcut behavior, persistence shaping, or business-rule-specific date math.

### 2. Public API direction

- `Numeric Input` should stay close to standard input semantics first, exposing shared support for native attributes such as `min`, `max`, `step`, `inputMode`, `value`, and `defaultValue`.
- `Date Picker` should expose a shadcn-style composed API built from shared package primitives such as `Field`, `Input` or trigger surface, `Popover`, and `Calendar`, while keeping the visual result aligned with our design tokens and component styling.
- `Date Range Picker` should expose a shared contract for two related date values and should compose cleanly with the existing `Field` model rather than replacing it.
- Shared exports should prefer generic names and prop shapes that make TanStack Form mapping straightforward without leaking workflow meaning into `packages/ui`.
- If the date-picker family needs internal helper subcomponents, those helpers should remain part of a coherent shared API instead of pushing low-level wiring burden into every consuming app.
- Shared date-picker APIs may own presentational formatting and calendar-open state when needed for the component contract, but they should not absorb workflow validation or persistence concerns.

### 3. Accessibility and interaction contract

- All controls must preserve visible focus treatment, disabled treatment, and invalid-state composition through the shared field contract.
- `Numeric Input` stories and tests should document keyboard increment and decrement relevance where native behavior is part of the public contract.
- `Date Picker` stories and tests should document trigger behavior, keyboard reachability, disabled and invalid states, and the package-owned interaction between text entry, popover disclosure, and calendar selection.
- `Date Range Picker` should make start and end relationships explicit in labels, descriptions, trigger copy, or helper structure so consumers do not need to re-invent accessibility wiring for paired dates.
- Shared package behavior should document what is guaranteed by the component contract versus what remains dependent on browser focus, locale, or text-input parsing behavior.

### 4. Storybook documentation contract

Storybook for this wave should organize these controls under `Shared/Forms/...` and cover:

- purpose and when-to-use guidance,
- default state,
- disabled state,
- invalid-state composition with `Field`,
- keyboard-relevant interaction expectations,
- dense admin-form examples where the controls appear with labels, descriptions, and validation copy,
- and explicit boundaries between shared input semantics and app-owned parsing or validation logic.

Recommended minimum stories:

- `Numeric Input`: default, constrained with `min` or `max`, disabled, read-only, invalid with `Field`, keyboard-relevant example
- `Date Picker`: default, with description, disabled, invalid with `Field`, text-entry plus calendar-trigger example, keyboard-relevant example
- `Date Range Picker`: default range, invalid example, disabled, `Field` composition guidance, and a range-calendar example aligned with shadcn interaction patterns

### 5. Testing contract

- Unit coverage should validate prop passthrough, invalid-state wiring, and the public rendering contract for each exported surface.
- Integration coverage should validate package entrypoint exports and confirm the controls compose with `Field` without app-specific dependencies.
- Storybook interaction coverage should exercise focus movement and keyboard-relevant behavior where the public contract depends on it.
- Tests should verify documented shared semantics and accessibility wiring, including popover and calendar composition, without drifting into feature-specific workflow logic.

## Trade-offs

- Lean shared APIs reduce feature leakage but leave consumers responsible for app-local coercion and business-rule validation.
- A shadcn-style date-picker composition creates a richer, more consistent cross-browser experience, but it increases package responsibility for open state, formatting, and calendar interaction.
- A single `Date Range Picker` surface improves reuse, but it requires careful API design so it stays generic rather than turning into a feature-specific mini-form.

## Risks

- If the shared API starts owning parsing or normalization, `packages/ui` could absorb feature logic that belongs in TanStack Form mappings or Zod schemas.
- If Storybook documents only static rendering, keyboard and invalid-state behavior for dense admin forms may regress unnoticed.
- If `Date Range Picker` is under-specified, each app form may invent different start and end wiring, hurting consistency and accessibility.
- If the shadcn reference behavior is copied too literally, `packages/ui` may inherit implementation details that do not fit our current field, popover, and styling contracts.

## Next Actions

- Use this document as the acceptance-review checklist for issue `#29` before implementation starts.
- Keep `Field` as the primary invalid, description, and label composition contract instead of duplicating that structure inside each control.
- When implementation starts, add Storybook stories and colocated tests in the same pull request as the new exports.
- Follow shadcn's date-picker composition principles, but express them through our package primitives and tokens instead of copying shadcn styling verbatim.
- If `Date Range Picker` needs a more opinionated API than this document supports, pause for a focused ADR or design-system decision instead of improvising in code.
