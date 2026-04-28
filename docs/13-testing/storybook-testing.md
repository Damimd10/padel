# Storybook Testing Strategy

## Role: Browser Debugger / Accessibility Tester

### Purpose
Utilize Storybook as a development workbench and a platform for "Living Documentation" and visual/interaction validation.

### Interaction Testing (Play Functions)
- Each story should include a `play` function that simulates a basic interaction (e.g., clicking a button, filling a form).
- Use the `@storybook/test` package for assertions within the browser.
- At minimum, Storybook validation should include a successful `storybook build` path through Nx/root scripts; browser-level interaction execution can expand from there.

### Visual Regression Testing
- **Tool**: Chromatic (or similar).
- **Scope**: Reusable UI components in `packages/ui`.
- **Workflow**: On every PR, capture snapshots of all stories. Flag visual "diffs" for manual review by designers/engineers.

### Accessibility Integration
- Enable the `@storybook/addon-a11y` to provide real-time feedback during development.
- **Requirement**: All stories must pass the A11y panel checks before being merged.

### Component Discovery
- Organize stories by domain (e.g., `Tournament/Bracket`, `Shared/Buttons`).
- Use MDX for detailed documentation on when and how to use specific tournament UI patterns.

### Validation Workflow
- Use `pnpm storybook` for local component review in `packages/ui`.
- Use `pnpm storybook:build` as the baseline validation command for reusable UI changes before merge and in CI wiring.
