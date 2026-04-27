# Client State

## Rules

- use route state or server state before introducing additional client state
- use TanStack Store only for true client-owned state
- TanStack Store should manage local or global UI state, not backend-owned data
- state boundaries should be feature-scoped and easy to trace
- avoid duplicating server state into local stores without a strong reason
