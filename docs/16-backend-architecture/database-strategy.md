# Database Strategy

## Rules

- PostgreSQL persistence belongs to outbound adapters and infrastructure
- schema choices should support the domain model without forcing domain leakage from persistence details
- transaction strategy should be explicit at the application layer
- migration and operational concerns should not distort domain boundaries
- the concrete persistence implementation approach is defined in `/docs/07-adrs/adr-010-backend-persistence-implementation.md`, using Prisma as the accepted adapter-layer ORM

## Local infrastructure baseline

- `apps/api` uses the checked-in repository `compose.yaml` as the default local PostgreSQL workflow for backend delivery
- local Prisma and NestJS development use `DATABASE_URL=postgresql://padel:padel@localhost:5432/padel?schema=public` unless a developer intentionally overrides the compose settings
- local port or credential overrides must flow through `.env` so the checked-in infrastructure stays shared while each developer can resolve host-specific conflicts
- the local database setup must stay generic enough to support future Prisma-managed application tables and Better Auth persistence tables without introducing authentication-specific code in infrastructure tickets

## Migration policy

- Prisma migrations under `apps/api/prisma/migrations` are the canonical database-change history for local and CI-compatible backend setup
- repository integration tests should validate adapters against schema state produced by Prisma migrations instead of hand-written ad hoc table creation
- schema changes for backend tickets must land with updated migration files, regenerated Prisma client output, and matching documentation updates when the workflow changes
