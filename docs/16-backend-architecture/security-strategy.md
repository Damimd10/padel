# Security Strategy

## Rules

- authentication and authorization checks should be explicit at inbound and application boundaries
- Better Auth is the accepted authentication framework for this project
- Better Auth session, account, and cookie concerns belong to platform or infrastructure wiring, not to competition domain entities
- secrets and operational security belong to infrastructure concerns
- audit-sensitive actions should be traceable
- validation and sanitization are required at external boundaries
