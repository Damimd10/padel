# Module Boundaries

## Rules

- modules should align to business capabilities or bounded contexts
- controllers should not own business rules
- repositories should implement ports, not define domain logic
- cross-module communication should be explicit and narrow
- avoid a shared dumping ground for utilities that blur domain boundaries
