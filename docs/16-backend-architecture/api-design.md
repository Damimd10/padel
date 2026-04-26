# API Design

## Rules

- public contracts should be explicit and version-aware when needed
- request/response DTOs belong to adapter boundaries
- validation and serialization concerns should not leak into domain entities
- error contracts should be predictable and documented
