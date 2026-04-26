# Database Strategy

## Rules

- PostgreSQL persistence belongs to outbound adapters and infrastructure
- schema choices should support the domain model without forcing domain leakage from persistence details
- transaction strategy should be explicit at the application layer
- migration and operational concerns should not distort domain boundaries
