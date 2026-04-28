# Typography Rules

## Context

Typography must support:

- scan-heavy admin screens,
- long tabular and form-based workflows,
- explicit status communication,
- and occasional competition-facing summary views.

## Assumptions

- Primary users read UI quickly, often under operational pressure.
- Typography should privilege readability over personality.

## Decisions

### Font families

- Use one primary UI sans family for application text.
- Use one mono family for identifiers, scores, technical references, and structured numeric data.

### Hierarchy model

- `display`: reserved for major competition headers or dashboard hero counts.
- `title`: page or section titles.
- `section`: cards, panels, tables, and grouped workflow headings.
- `body`: default forms, descriptions, and helper text.
- `meta`: secondary labels, timestamps, category chips, and captions.

### Typography behavior

- Titles should be compact and assertive, not oversized.
- Body copy should stay neutral and quiet.
- Labels should prioritize scannability over expressive style.
- Numeric competition data should align clearly and consistently.

### Emphasis rules

- Use weight before size when emphasizing within dense panels.
- Avoid overusing uppercase for anything except very short labels or section overlines.
- Use mono selectively for IDs, round labels, or result strings, not for general body text.

## Trade-offs

- A restrained type scale improves usability but limits visual drama.
- Stronger hierarchy in admin UIs requires careful weight balance to avoid heaviness.

## Risks

- Overusing medium and bold weights can make dense screens visually noisy.
- Too small a meta scale can hurt readability in status-heavy layouts.

## Next Actions

- Tie typography tokens directly to semantic text styles instead of arbitrary size ladders.
- Validate table density and form readability before expanding the type scale.
