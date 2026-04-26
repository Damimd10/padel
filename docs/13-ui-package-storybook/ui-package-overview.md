# UI Package Overview

The UI package is the only source for reusable UI components. It uses Shadcn, Radix UI, Tailwind CSS and Storybook.

## Rules

- reusable UI belongs in `packages/ui`
- application-specific composition belongs in apps, not the shared UI package
- Storybook is mandatory for reusable components
- every component change must define variants, states, accessibility behavior, story examples and test expectations
