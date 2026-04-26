# Component Testing

## Purpose

Define testing expectations for reusable UI components.

## Coverage expectations

- stories for documented states and variants
- accessibility-aware review
- unit or interaction-focused validation where component behavior justifies it
- integration expectations when components depend on surrounding composition patterns

## Rule

UI package changes are not complete if component behavior changed but Storybook and test expectations were not updated.
