# Component Testing Strategy

## Role: Accessibility Tester / Browser Debugger

### Purpose
Test individual React components or small clusters of components in isolation, focusing on interactivity, accessibility, and visual states.

### Tooling
- **Engine**: Vitest + React Testing Library (RTL).
- **Interactions**: `@testing-library/user-event` for realistic input simulation.
- **Accessibility**: `jest-axe` for automated WCAG checks.

### Focus Areas
1. **User Interactions**: Verify that clicking "Register" on a tournament card opens the correct modal and sets focus.
2. **State Transitions**: Test "Loading", "Error", and "Empty" states for data-driven components (e.g., Match List).
3. **Accessibility (A11y)**:
   - Every component test must include a basic accessibility pass: `expect(await axe(container)).toHaveNoViolations()`.
   - Verify keyboard navigation for complex components like Brackets or Dropdowns.
   - Ensure proper ARIA labels and roles are present for assistive technology.

### Best Practices
- **Query by Priority**: Always prefer `getByRole` or `getByLabelText` over `testid` or CSS selectors to mirror how users (and screen readers) perceive the UI.
- **Avoid Implementation Details**: Do not test component internals (state/refs). Test the rendered output and user-observable behavior.
- **Mocking Props**: Pass diverse sets of props to simulate various tournament configurations (e.g., Round Robin vs. Single Elimination layouts).
- **Colocation**: For `packages/ui`, keep component tests beside the component file as `component-name.test.tsx` so reusable ownership, stories, and tests stay grouped together.
