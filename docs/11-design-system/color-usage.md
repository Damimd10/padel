# Color Usage

## Context

Color in this product must support trust, state, and workflow progress before brand expression.

## Assumptions

- Users need to distinguish administrative states quickly.
- The product should feel competitive and disciplined, not soft and generic.

## Decisions

### Color roles

- `surface`: page, panel, elevated panel, overlay
- `text`: primary, secondary, muted, inverse
- `border`: subtle, default, strong
- `action`: primary, secondary, ghost, destructive
- `status`: draft, pending, approved, in-progress, warning, blocked, completed, invalid
- `focus`: visible keyboard and active focus ring

### Color usage rules

- Neutral surfaces should carry most of the interface.
- Saturated color should be reserved for action and state meaning.
- Status colors should appear consistently in chips, badges, rows, and callouts.
- Destructive and invalid states must be visually distinct from warning states.

### Tone direction

- Use a restrained neutral base.
- Use one strong accent family for primary action.
- Use status colors with enough depth to remain legible in dense UIs.

### Competition-specific guidance

- Do not rely on decorative “sports” colors without semantic value.
- Winners, completion, approval, and validated outcomes should feel conclusive.
- Pending or disputed states should feel visibly unresolved.

## Trade-offs

- Semantic color systems are more rigid than brand-led palettes.
- Restrained color usage can feel less visually flashy, but improves trust.

## Risks

- Too many strong status colors can overwhelm the interface.
- Weak distinction between warning, blocked, and invalid states will hurt usability.

## Next Actions

- Keep palette depth limited in v1.
- Validate that semantic colors still work in grayscale and low-saturation conditions.
