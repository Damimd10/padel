# Integration Testing Strategy

## Role: QA Expert / Test Automator

### Purpose
Integration tests validate the "seams" of the application where different modules or external systems meet.

### Backend Integration (Hexagonal Adapters)
- **Outbound Adapters**: Test repositories against a real PostgreSQL instance (via Docker/Testcontainers) to verify SQL queries and Zod mapping.
- **Inbound Adapters**: Test NestJS Controllers using `supertest` to verify routing, guards, and status code mapping.
- **Transaction Management**: Verify that unit-of-work/transaction decorators correctly commit or rollback changes.

### Frontend Integration (Route & Data)
- **TanStack Router + Query**: Test that navigating to a route triggers the correct query and renders the data.
- **Form Submission**: Test the full cycle of user input -> TanStack Form validation -> TanStack Query mutation -> Cache invalidation.
- **Mock Service Worker (MSW)**: Use MSW to intercept network requests at the browser level, allowing tests to exercise the full HTTP stack without a real backend.

### Contract Testing
- **Consumer-Driven Contracts**: Ensure the Frontend's expectations (TypeScript types/Zod schemas) match the Backend's API definitions.
- **Strategy**: Share Zod schemas between Frontend and Backend in the monorepo to ensure compile-time and runtime alignment.

### Rules
- **No Manual Mocks for DB**: Always use a real database for repository tests.
- **Isolation**: Each test must run in a clean transaction or have its data purged via `TRUNCATE`.
