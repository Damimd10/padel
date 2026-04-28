# Test Data Strategy

## Role: QA Expert / Test Automator

### Purpose
Ensure consistent, predictable, and isolated data for all levels of testing, especially for complex tournament structures.

### Data Generation Patterns

#### 1. Domain Factories
- Use a library like `fishery` or custom builder classes to create Domain Entities/Value Objects in memory for unit tests.
- **Example**: `TournamentFactory.create({ category: 'Men Open' })`.

#### 2. Persistence Seeders
- **Integration Tests**: Use a "Cleaner" utility to truncate tables before each test. Use repositories to insert minimal required state.
- **E2E Tests**: Use a dedicated API endpoint or CLI command to "Seed" a specific tournament scenario (e.g., "Full 32-team bracket in Quarter-finals state").

### Complex Tournament Scenarios
Testing must handle the "Combinatorial Explosion" of tournament types:
- **Bracket Tests**: Seed 4, 8, 16, and 31 (unbalanced) team scenarios.
- **Round Robin**: Seed groups of 3, 4, and 5 teams to verify ranking logic (points, sets, games).
- **Edge Cases**: Seed walkovers, retired players, and disputed results.

### Environment-Specific Strategy
- **Development**: `pnpm run db:seed:dev` populates the local DB with a variety of active tournaments for manual testing.
- **Testing/CI**: Use `TRUNCATE` and per-test seeding to ensure isolation.
- **Staging**: Periodic "Sanitized Production Snapshots" to test performance and migrations with real-world data volumes (GDPR compliant).

### Data Isolation
- **Playwright**: Use unique IDs (e.g., `tournament-e2e-${Date.now()}`) for all created entities to avoid collisions if tests run in parallel.
- **Vitest**: Parallel tests run in separate processes; ensure each uses a unique DB schema or separate DB containers if needed.
