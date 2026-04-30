# Frontend Coding Standards

## Context

These standards operationalize the React and TanStack architecture decisions for the frontend workspace. They exist to reduce architectural drift, not to enforce style preferences without value.

## Assumptions

- Workspace-wide formatting and linting are documented elsewhere.
- These rules focus on frontend structure, ownership, and React-specific implementation discipline.

## Decisions

### 1. File and module naming should make ownership obvious

- Route folders and non-component files should use `kebab-case`.
- React component identifiers should use `PascalCase`.
- Query modules, form schema modules, and store modules should be named by feature responsibility, not by vague technical labels such as `utils` or `helpers`.

### 2. Colocation is preferred when it preserves feature traceability

Within a feature boundary, colocate related:

- route-facing compositions,
- query definitions,
- mutations,
- form schemas,
- tests,
- and app-specific subcomponents.

For reusable UI work in `packages/ui`, colocate tests directly beside the component module they verify, for example `button.tsx` and `button.test.tsx`.

Do not centralize unrelated frontend logic into generic top-level folders for convenience.

### 3. Components should be small in responsibility, not artificially tiny

A component should usually do one of these:

- orchestrate a route or feature section,
- render a reusable UI surface,
- or render a narrow piece of presentational structure.

Avoid both extremes:

- massive “screen god components,”
- and over-fragmentation where every three lines become a component.

### 4. Hooks should encapsulate one boundary concern

Custom hooks are appropriate when they clarify a boundary such as:

- a query contract,
- a mutation workflow,
- a form configuration,
- or a reusable interaction pattern.

Hooks should not become hidden mini-frameworks that mix:

- routing,
- fetching,
- mutation side effects,
- notifications,
- and presentation state

without a clear reason.

### 5. Prefer derivation during render over effect-driven synchronization

If state can be derived from:

- props,
- route state,
- query data,
- or form state,

derive it directly instead of mirroring it through effects.

Effects should be used for real side effects, not for repairing data flow mistakes.

### 6. Avoid unstable component and module patterns

- Do not define components inside other components unless there is a strong and local reason.
- Avoid module-level mutable state for request- or route-specific behavior.
- Keep import paths explicit enough that ownership is visible during review.

### 7. Shared package boundaries are mandatory

- `packages/ui` must stay presentation-oriented.
- `packages/api-client` must stay transport-oriented.
- `packages/schemas` must stay contract-oriented.
- `apps/web` owns route composition and workflow orchestration.

When code does not fit those boundaries cleanly, fix the design instead of forcing the dependency.

## Trade-offs

- Strong colocation and naming rules create more visible modules.
- Refusing overly generic helpers can feel slower at first.
- Derivation-first React patterns require clearer thinking about ownership but reduce long-term bugs.

## Risks

- Teams may create “temporary” generic folders that become permanent architecture debt.
- Complex hooks can hide too much behavior and become hard to test.
- Overzealous reuse can still erode package boundaries even with naming conventions in place.

## Anti-patterns

- `utils.ts` or `helpers.ts` files that accumulate unrelated logic.
- Hooks that fetch, transform, mutate, navigate, and notify in one place.
- Effects whose only purpose is copying one state source into another.
- Shared components that import app-specific feature modules.
- Re-export barrels that hide domain ownership and bloat imports indiscriminately.
- A package-level `test/` folder for unrelated UI component tests when file-local ownership would be clearer.

## Next Actions

- Use these standards to review the first frontend ticket set before any code starts.
- Mirror the most enforceable rules later in linting and review checklists.
- Keep the standards narrow enough that violating them indicates real architectural drift.
