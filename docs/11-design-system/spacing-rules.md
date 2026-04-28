# Spacing Rules

## Context

This product needs compact but readable layouts across:

- forms,
- grids,
- dashboards,
- tables,
- drawers,
- and modal workflows.

## Assumptions

- The UI will often be denser than a marketing site or consumer app.
- Spacing must encode hierarchy and grouping, not just “air.”

## Decisions

### Spacing principle

- Use spacing to show workflow structure first:
  - between pages,
  - between regions,
  - between groups,
  - between controls,
  - within controls.

### Density levels

- `compact`: tables, filters, batch operations, inline editing.
- `default`: forms, content panels, operational summaries.
- `relaxed`: onboarding, documentation, or low-frequency explanatory views.

### Grouping rules

- Intra-component spacing should always be smaller than inter-component spacing.
- Inter-field spacing should be smaller than inter-section spacing.
- Page section spacing should create visible workflow chunks, not one long scroll wall.

### Layout behavior

- Panels should feel tight but breathable.
- Data-dense areas should reduce decorative whitespace.
- Action areas should preserve enough separation to prevent accidental interaction.

## Trade-offs

- Tighter spacing improves operational efficiency but increases visual fatigue if hierarchy is weak.
- Looser spacing improves comfort but can make workflow screens longer and less scannable.

## Risks

- Over-compact layouts can reduce accuracy and accessibility.
- Inconsistent spacing scales create visual distrust in admin products.

## Next Actions

- Define component defaults by density mode rather than one universal spacing recipe.
- Validate spacing rules first on forms, tables, filters, and result-entry workflows.
