# Testing Quality Gates

## Role: QA Expert / Security Auditor / Accessibility Tester

### Purpose
Define the mandatory validation steps that must pass before any code is merged or a ticket is closed.

### Mandatory Gates

#### 1. Code Coverage
- **Domain Logic**: 100% unit coverage.
- **Application Logic**: >80% coverage (unit + integration).
- **Critical Paths**: 100% E2E coverage (defined by ADR-009).

#### 2. Accessibility (A11y)
- **Component Level**: No violations in RTL or Storybook A11y panel.
- **CI Level**: Playwright-axe pass on critical user journeys (Registration, Bracket view).

#### 3. Security
- **SAST**: Pass static analysis (e.g., SonarQube, Biome linting).
- **Dependency Audit**: No "High" or "Critical" vulnerabilities (verified via `pnpm audit`).
- **Auth/Authz**: Integration tests must explicitly verify that unauthorized users are blocked from Admin/Organizer endpoints (IDOR protection).

#### 4. Storybook
- All new UI components in `packages/ui` must have a story.
- All Storybook Interaction tests must pass in CI.

#### 5. Local Validation
- **Pre-commit (Lefthook)**: Run linting and affected unit tests.
- **Pre-push (Lefthook)**: Run affected integration tests.
