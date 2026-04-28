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
