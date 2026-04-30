# UI Package Overview

The UI package is the only source for reusable UI components. It uses `shadcn/ui` conventions, Radix UI primitives, Tailwind CSS and Storybook.

## Purpose

Define the responsibility and technology baseline for `packages/ui` before implementation work begins.

## Technology baseline

- Radix UI provides the accessible primitive behavior for shared interactive components
- `shadcn/ui` patterns are the starting point for component structure, composition and styling ergonomics
- Tailwind CSS provides the styling layer, token consumption and variant composition baseline
- Storybook is the mandatory documentation and validation surface for reusable UI delivery

## Package boundaries

- reusable UI belongs in `packages/ui`
- application-specific composition belongs in apps, not the shared UI package
- `shadcn/ui` code copied into the workspace must be adapted to package conventions before it is treated as shared UI
- Radix-based behavior should be wrapped behind the shared component API instead of being scattered across apps

## Storybook bootstrap expectations

- Storybook for `packages/ui` should not be bootstrapped for placeholder exports; it starts when the first real reusable component surface is approved
- the Storybook setup must load the same shared Tailwind entrypoints, CSS variables and token definitions that consuming apps rely on
- the Storybook preview shell must support the same `shadcn/ui` and Radix-driven states the package exposes, including accessibility-relevant interaction states
- any shared provider or decorator required for theme, styling or overlay behavior must be documented as part of the bootstrap
- Storybook configuration work belongs with `packages/ui` and supporting shared config in `packages/config`, not with app-specific setup

## Rules

- Storybook is mandatory for reusable components
- every component change must define variants, states, accessibility behavior, story examples and test expectations
- specialized component waves should land with their own explicit contract doc when the API surface or Storybook taxonomy would otherwise be ambiguous

## Recommended delivery path

To keep `packages/ui` parallelizable without breaking package boundaries, the next shared-component wave should follow this sequence:

1. form foundations first so all data-entry work shares the same field semantics, label wiring and validation surface
2. selection and choice controls plus layout/feedback primitives in parallel once the form foundation contracts are in place
3. interactive overlays after the base trigger, content and feedback primitives are already documented in Storybook

## Parallelization guardrails

- `packages/ui` tickets may run in parallel only when they do not redefine the same public API surface or duplicate shared helpers
- form primitives should establish the baseline field contract before more specialized controls build on top of it
- Storybook categories and docs should mirror the approved ticket slicing so teams can work independently without inventing new taxonomy mid-implementation
- overlays must keep Radix portal, focus and keyboard behavior inside the shared package boundary instead of pushing those concerns into consuming apps

## Related docs

- `docs/13-ui-package-storybook/selection-choice-controls.md`
