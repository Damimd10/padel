# Unit Testing Strategy (Vitest)

## Role: Test Automator / QA Expert

### Purpose
Unit tests protect the smallest units of business logic—specifically domain invariants and utility functions—ensuring they behave correctly in isolation.

### Tooling
- **Engine**: Vitest
- **Mocking**: Vitest's built-in `vi` for spies and mocks.
- **Assertion Style**: `expect(...)` with TypeScript-first matchers.

### File Placement & Naming
- Tests must reside next to the code they test: `[filename].spec.ts`.
- Naming convention: `describe('SymbolName', () => { it('should [expected behavior] when [condition]', ...)\})`.

### Strategies by Lane

#### Backend (NestJS / Hexagonal)
- **Domain Logic**: 100% coverage for Value Objects and Domain Entities. No mocks allowed here; these should be pure logic.
- **Application Services**: Test use-case logic by mocking outbound adapters (repositories, external APIs) using `fakes` or `vi.mocked`.
- **Zod Schemas**: Validate all input/output transformation logic.

#### Frontend (React / TanStack)
- **Utilities & Transformers**: Pure functions (e.g., bracket generators, score calculators) must have exhaustive property-based or table-driven tests.
- **State Selectors**: Test TanStack Store selectors and complex data derivations.
- **Form Validation**: Test Zod schemas used in TanStack Form.

### Mocking vs. Fakes
- **Use Fakes**: For complex stateful logic like an In-Memory Repository.
- **Use Mocks/Spies**: For one-off side effects (e.g., logging, event emission).
- **Rule**: Never mock what you don't own (e.g., don't mock TanStack Query internals; test the data transformation instead).
