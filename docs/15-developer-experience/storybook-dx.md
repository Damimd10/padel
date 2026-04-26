# Storybook DX

## Decision

Storybook is mandatory for reusable UI components in `packages/ui`.

## Purpose

Storybook is both:

- the documentation layer for reusable UI
- a validation layer for UI changes before application integration

## Rules

- every `packages/ui` component change requires stories
- Storybook should be part of the review and quality gate conversation for UI work
- Storybook is not optional for reusable UI package delivery
