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
- reusable UI component tests should be colocated with the source file using `component.test.tsx` beside `component.tsx`

## Test file placement

- `packages/ui` tests should be colocated with the component they validate
- use `*.test.tsx` beside the production file, for example `card.tsx` and `card.test.tsx`
- package-level catch-all test files should be avoided when the behavior belongs to a specific reusable component
- when a component exposes multiple structural helpers from one module, keep the tests beside that module instead of splitting them into an unrelated shared test folder

## Rule

UI package changes are not complete if component behavior changed but Storybook and test expectations were not updated.
