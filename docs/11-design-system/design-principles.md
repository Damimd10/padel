# Design Principles

## Context

This design system serves an admin-heavy competition workflow product for clubs and organizers. The UI must support:

- high-density operational screens,
- status-heavy workflows,
- trust-sensitive competition data,
- and fast decision-making under pressure.

## Assumptions

- The first users are administrators, organizers, and support staff before casual players.
- Clarity and trust matter more than expressive brand theater.
- The UI will contain many tables, forms, filters, statuses, and workflow transitions.

## Decisions

### 1. Operational clarity over decorative minimalism

- Information should be easy to scan before it is visually “clean.”
- Dense UIs are acceptable if hierarchy remains explicit.

### 2. Trust-first interaction language

- Status, validation, eligibility, and progression states must look unambiguous.
- Visual styling must reduce doubt, not create aesthetic ambiguity.

### 3. Competitive tone, not generic SaaS tone

- The system should feel disciplined, structured, and event-oriented.
- Avoid soft pastel “dashboard default” aesthetics that weaken urgency and competitive context.

### 4. Hierarchy by responsibility

- Screens should clearly separate:
  - competition setup,
  - participant administration,
  - match operations,
  - and final outcomes.

### 5. Color is semantic before decorative

- Color must first communicate workflow meaning:
  - draft,
  - pending,
  - approved,
  - in progress,
  - blocked,
  - completed,
  - invalid.

### 6. Components should expose state explicitly

- Empty, loading, invalid, locked, and completed states are first-class.
- Do not optimize only for the happy path.

### 7. Consistency beats novelty

- Repeated admin actions should look and behave consistently across all workflows.
- Interaction predictability is more important than inventive UI patterns.

## Trade-offs

- This system will feel more structured than playful.
- It may look denser than consumer apps, but that is appropriate for the product’s risk profile.
- Reducing ambiguity may cost some visual softness.

## Risks

- Over-correcting toward density can create fatigue.
- Overusing semantic color can create visual noise.
- If hierarchy is weak, the system can still become a “busy admin wall.”

## Next Actions

- Define tokens around semantic meaning, not generic theme slots.
- Use typography and spacing rules that support dense but readable layouts.
- Build component inventory around workflow tasks, not around generic dashboard templates.
