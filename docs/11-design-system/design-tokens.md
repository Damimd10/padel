# Design Tokens

## Context

The system needs tokens that support workflow semantics, dense operations, and future reuse across `apps/web`, `packages/ui`, and Storybook.

## Assumptions

- Tokens should be abstract enough to support later theming.
- Token names should reflect purpose, not raw presentation.
- The design system should avoid overly brand-driven token naming.

## Decisions

### Token groups

- `color.*`
- `space.*`
- `size.*`
- `radius.*`
- `border.*`
- `shadow.*`
- `font.family.*`
- `font.size.*`
- `font.weight.*`
- `line.height.*`
- `motion.*`
- `z.*`

### Color token taxonomy

- `color.surface.*`
- `color.text.*`
- `color.border.*`
- `color.action.*`
- `color.status.*`
- `color.data.*`
- `color.focus.*`

### Space token taxonomy

- `space.0`
- `space.1`
- `space.2`
- `space.3`
- `space.4`
- `space.5`
- `space.6`
- `space.8`
- `space.10`
- `space.12`
- `space.16`

### Size token taxonomy

- `size.control.sm`
- `size.control.md`
- `size.control.lg`
- `size.icon.xs`
- `size.icon.sm`
- `size.icon.md`
- `size.icon.lg`
- `size.panel.max`

### Radius token taxonomy

- `radius.0`
- `radius.2`
- `radius.4`
- `radius.8`
- `radius.round`

### Border token taxonomy

- `border.width.default`
- `border.width.strong`
- `border.style.default`

### Shadow token taxonomy

- `shadow.none`
- `shadow.overlay`
- `shadow.focus`

### Typography token taxonomy

- `font.family.ui`
- `font.family.mono`
- `font.size.xs`
- `font.size.sm`
- `font.size.md`
- `font.size.lg`
- `font.size.xl`
- `font.size.display`
- `font.weight.regular`
- `font.weight.medium`
- `font.weight.semibold`
- `font.weight.bold`
- `line.height.tight`
- `line.height.body`
- `line.height.loose`

## Trade-offs

- Semantic naming is less immediately visual than literal naming, but scales better.
- A broader token taxonomy adds setup discipline but reduces future inconsistency.

## Risks

- Too many tokens too early can create unnecessary complexity.
- Too few semantic tokens can push teams back toward raw ad hoc values.

## Next Actions

- Keep token count intentionally limited in the first version.
- Introduce new tokens only when repeated UI patterns justify them.
- Link token changes to design-system review rather than local feature preference.
