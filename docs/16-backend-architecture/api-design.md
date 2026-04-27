# API Design

## Rules

- public contracts should be explicit and version-aware when needed
- frontend/backend coordination should use `packages/schemas` plus `packages/api-client` as the default contract boundary
- request/response DTOs belong to adapter boundaries
- responses intended for frontend consumption should stay compatible with shared schema validation
- validation and serialization concerns should not leak into domain entities
- error contracts should be predictable and documented
