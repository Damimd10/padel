# E2E Testing Strategy (Playwright)

## Role: Test Automator / Security Auditor

### Purpose
E2E tests validate high-value user journeys across the entire stack, from UI to Database.

### Critical Journeys (Risk-Based)
1. **The Tournament Lifecycle**:
   - Organizer creates a "Men's Open" tournament.
   - Player registers and pays (mocked).
   - Organizer closes registration and generates a 16-team bracket.
   - Admin enters scores for the first round.
   - System correctly progresses winners to the quarter-finals.
2. **Access Control (Security)**:
   - Verify that a regular Player cannot enter scores for a match they aren't in.
   - Verify that an unauthenticated user cannot access the Admin dashboard.

### Structure & Patterns
- **Page Object Model (POM)**: Every page/major component has a corresponding Class in `tests/e2e/pom/`.
- **Fixtures**: Use Playwright fixtures for setup (e.g., `test.extend({ tournament: async ({ page }, use) => { ... } })`).
- **Global Setup**: Handle authentication once and reuse state via `storageState`.

### Environment & CI
- **Local**: Run against a local development server or a Docker-composed environment.
- **CI**: Use `nx affected --target=e2e` to only run tests related to changed apps/packages.
- **Reporting**: Upload Playwright traces and videos on failure for debugging.

### Browser Debugging Strategy
- Use `npx playwright test --debug` for local troubleshooting.
- Utilize Playwright's "Trace Viewer" to inspect DOM snapshots, network requests, and console logs at the point of failure.
