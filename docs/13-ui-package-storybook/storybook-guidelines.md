# Storybook Guidelines

## Purpose

Define how Storybook is used for the shared UI package.

## Bootstrap guardrails

- Storybook for `packages/ui` must reflect the real shared UI stack: Tailwind CSS for styling, `shadcn/ui` conventions for component composition and Radix UI for accessible primitives
- the initial bootstrap should include only the minimum shared configuration needed to render approved reusable components; app-only dependencies should stay out
- the preview environment must load the shared package stylesheet and token sources so stories are visually and behaviorally representative
- decorators or preview setup needed for overlays, portals, themes or other shared UI concerns must be documented when introduced

## Rules

- Storybook is mandatory for reusable components in `packages/ui`
- stories should document default, variant, edge and accessibility-relevant states
- stories for Radix-based components should cover keyboard, focus and open/closed behavior when those states are part of the public contract
- stories for `shadcn/ui`-style components should validate the documented variant API instead of relying on ad hoc local styling
- stories should support design review, engineering review and component validation
- Storybook should be updated whenever the public behavior of a reusable component changes
- Storybook setup changes should stay aligned with `packages/config` and the documented Tailwind/design-token strategy
