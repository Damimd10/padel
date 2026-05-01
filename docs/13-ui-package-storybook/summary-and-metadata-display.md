# Summary and Metadata Display

## Context

Issue `TKT-024` / GitHub issue `#31` adds the next shared data-display wave for `packages/ui`.

The target primitives are:

- `Inline Metadata List`
- `Key-Value Summary Block`
- `Progress Indicator`

These surfaces sit between lightweight feedback primitives and the upcoming table foundation. They must make dense operational context legible without dragging workflow logic into the shared UI package.

## Assumptions

- `TKT-023` should establish the shared operational feedback vocabulary before this ticket finalizes status-relevant display states.
- Shared display primitives in `packages/ui` must remain presentational and must not own route data loading, rule evaluation, mutations, or workflow-specific actions.
- The primary use case is operations-heavy product UI, so density and clarity matter more than decorative minimalism.
- Shared APIs should accept data already shaped for display instead of raw DTOs or feature-specific transport objects.

## Decisions

### 1. Component scope and boundaries

- `Inline Metadata List` is the compact surface for short operational facts such as date ranges, formats, owners, counts, and secondary statuses.
- `Key-Value Summary Block` is the higher-density surface for grouped facts where labels and values need stronger hierarchy than a simple metadata row provides.
- `Progress Indicator` is the shared progress surface for visible completion or step advancement, not a workflow engine or timeline orchestration layer.
- None of these primitives should fetch data, derive workflow state, or decide whether a competition, registration, or result is healthy.
- Domain-specific wrappers such as competition overview cards, registration review summaries, or result-entry support panels should stay in `apps/web` unless reuse is proven later.

### 2. Public API direction

- Shared APIs should prefer explicit display-oriented inputs such as `items`, `label`, `value`, `status`, `description`, `currentValue`, `maxValue`, or `steps` rather than ambiguous children-only contracts where structure matters.
- `Inline Metadata List` should support typed item arrays and optional per-item emphasis or status styling without forcing consumers into one exact layout.
- `Key-Value Summary Block` should support grouped key-value pairs, empty-value handling, and optional supporting description text while keeping label-value relationships semantically clear.
- `Progress Indicator` should support both numeric progress and step-oriented progress when the rendered contract remains obvious in Storybook and tests.
- If a variant or option exists only to express density, spacing, or emphasis, prefer composition-friendly classes or subcomponents over boolean prop accumulation.

### 3. Accessibility and information hierarchy contract

- Label-value relationships must remain understandable for assistive technology and not rely only on visual grid alignment.
- Status-relevant emphasis should use text, iconography, or explicit labels in addition to color so blocked, pending, or complete states remain legible.
- Dense metadata should preserve scanability by keeping labels visually subordinate to critical values and operational warnings.
- `Progress Indicator` should expose semantic progress information where the public contract implies it, including accessible current-versus-total context.
- Empty or unavailable values should be rendered intentionally so missing information does not look identical to a real zero or completed state.

### 4. Storybook documentation contract

Storybook for this wave should organize these components under `Shared/Data Display/...` and cover:

- purpose and when-to-use guidance,
- dense admin examples rather than only sparse marketing layouts,
- empty or unavailable data handling,
- status-relevant states when supported,
- composition boundaries between primitive display surfaces and workflow-specific summary panels,
- and misuse guidance, especially where a table or feature-owned composition is more appropriate.

Recommended minimum stories:

- `Inline Metadata List`: default, dense admin row, with emphasized item, empty or fallback values
- `Key-Value Summary Block`: default, grouped summary, long-label handling, missing-value state
- `Progress Indicator`: numeric progress, step-oriented progress if supported, blocked or warning-adjacent context, compact embedding example

### 5. Testing contract

- Unit coverage should validate rendering contracts, semantic label-value output, and status or progress states that are part of the public API.
- Integration coverage should validate package entrypoint exports and ensure the primitives stay generic to presentation instead of accepting app-specific workflow objects.
- Storybook interaction or assertion coverage should validate accessible progress output and any stateful display semantics that are exposed as part of the shared contract.
- Tests should verify semantics and contract stability, not pixel-perfect implementation details.

## Trade-offs

- Explicit item-based APIs improve consistency and Storybook clarity, but they reduce the free-form flexibility of pure-children composition.
- Supporting both numeric and step-oriented progress can make the API more useful across workflows, but it risks overloading one primitive if the display contract is not tightly defined.
- Dense admin-oriented examples improve operational realism, but they require more careful docs to avoid encouraging shared components to absorb whole workflow panels.

## Risks

- If status semantics remain vague after `TKT-023`, this ticket could hard-code ad hoc warning or success styling that later conflicts with the feedback primitives.
- If shared display components accept raw feature objects, `packages/ui` will accumulate transport-shape coupling and become harder to evolve.
- If Storybook examples stay too sparse, reviewers may approve components that fail once real competition and review data becomes dense.
- If `Progress Indicator` tries to cover timeline, progress bar, checklist, and workflow orchestration in one API, the component surface will become muddy quickly.

## Next Actions

- Use this document as the acceptance-review checklist for issue `#31`.
- Keep `TKT-024` behind `TKT-023` where shared status language meaningfully affects display semantics.
- When implementation starts, add Storybook docs that clearly separate display primitives from feature-owned competition or registration summary panels.
- Follow this ticket with `TKT-025` only after the surrounding feedback and summary display vocabulary is stable.
