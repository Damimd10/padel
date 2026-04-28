# Storybook Documentation Strategy

## Purpose

Define how Storybook should document the abstract design system and later the shared UI package.

## Storybook role

Storybook should act as:

- component documentation,
- design review surface,
- accessibility review surface,
- state reference,
- and reusable UI validation layer.

It should not become a dumping ground for application-specific screens.

## Documentation-first strategy

Because this project is documentation-first, Storybook should mirror the design-system structure and support progressive implementation.

Storybook documentation should eventually organize content into:

- Foundations
- Tokens
- Typography
- Spacing and layout
- Color and status semantics
- Inputs and forms
- Data display
- Navigation
- Overlays
- Feedback and status
- Workflow patterns

## Story requirements per reusable component

Each reusable component should include stories for:

- default state,
- variants,
- empty state where relevant,
- loading state,
- error state,
- warning state,
- success state,
- disabled or read-only state,
- accessibility-relevant states,
- dense admin usage when relevant.

## Required documentation sections per component

Each documented reusable component should include:

- Purpose
- When to use
- When not to use
- Variants
- States
- Accessibility behavior
- Composition guidance
- Known misuse patterns

## Workflow-pattern documentation

Not everything should become a shared component immediately.

Storybook should also document pattern-level examples for recurring operational workflows such as:

- registration review presentation,
- category/division assignment patterns,
- result-entry layout patterns,
- closure-readiness feedback,
- blocked-state presentation,
- dense table action patterns.

These should be documented as patterns first and promoted to shared abstractions only when repetition is proven.

## Review strategy

Storybook should support:

- design review,
- engineering review,
- accessibility review,
- and regression review.

## Guardrails

- Shared UI belongs in `packages/ui`.
- App-specific orchestration belongs in application code, not in the shared package.
- Pattern stories must clearly indicate whether they represent:
  - a foundation,
  - a reusable component,
  - or an application composition pattern.

## Validation expectations

Storybook should remain aligned with:

- design tokens,
- component states,
- accessibility guidelines,
- and the documented product workflows.

Whenever a reusable component changes, its stories should be updated together with:

- states,
- accessibility notes,
- and any affected workflow examples.
