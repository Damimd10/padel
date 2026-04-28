# Component Testing

## Purpose

Define testing expectations for reusable UI components.

## Coverage expectations

- stories for documented states and variants
- accessibility-aware review
- unit or interaction-focused validation where component behavior justifies it
- integration expectations when components depend on surrounding composition patterns
- keyboard and focus-state coverage for Radix-driven interactions when applicable
- variant and token parity checks for `shadcn/ui` and Tailwind-based styling contracts

## Rule

UI package changes are not complete if component behavior changed but Storybook and test expectations were not updated.
