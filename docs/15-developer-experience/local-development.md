# Local Development

## Purpose

Define the local developer workflow before implementation begins.

## Expected local flow

1. install with `pnpm`
2. copy `.env.example` to `.env` and set local values before starting backend work
3. boot local infrastructure through the checked-in Docker workflow
4. run workspace tasks through Nx
5. rely on Biome for source hygiene
6. use Lefthook for commit-time validation
7. run affected tests before pushing

## Local PostgreSQL for `apps/api`

`TKT-015` establishes the default local PostgreSQL path for Prisma, NestJS runtime development, repository integration tests, and future Better Auth persistence.

### Standard environment

Create a local `.env` from the checked-in template:

```bash
cp .env.example .env
```

Use this baseline connection string unless you intentionally change the Docker service settings:

```bash
POSTGRES_DB=padel
POSTGRES_USER=padel
POSTGRES_PASSWORD=padel
POSTGRES_PORT=5432
DATABASE_URL=postgresql://padel:padel@localhost:5432/padel?schema=public
```

If your machine already uses port `5432`, set a different `POSTGRES_PORT` and keep `DATABASE_URL` aligned with the same port.

### Boot the database

From the repository root:

```bash
pnpm run db:up
```

Useful companion commands:

```bash
pnpm run db:ps
pnpm run db:logs
pnpm run db:down
```

The checked-in compose file provisions a single local PostgreSQL 16 container named `padel-postgres` with a persistent Docker volume. It reads `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_PORT` from `.env` so local developers can resolve port collisions without editing committed infrastructure files.

### Prisma workflow for `apps/api`

Generate the Prisma client after schema changes:

```bash
pnpm --filter @padel/api prisma:generate
```

Apply the checked-in migrations to the local database:

```bash
pnpm --filter @padel/api prisma:migrate:deploy
```

Create and apply a new local development migration when an approved backend ticket changes the Prisma schema:

```bash
pnpm --filter @padel/api prisma:migrate:dev --name <migration-name>
```

### Integration-test workflow

With PostgreSQL running and `DATABASE_URL` configured, the Prisma repository integration test can run against the real local database:

```bash
pnpm --filter @padel/api test:integration:db
```

That suite applies checked-in Prisma migrations before executing the repository and auth assertions, so it validates the same schema path used by local NestJS development.

## Better Auth local flow

`TKT-016` extends the local backend baseline with Better Auth runtime wiring and a PostgreSQL-backed session path.

See `/docs/15-developer-experience/auth-local-workflow.md` for:

- required auth environment variables
- local cookie/session guidance
- the database-backed auth integration test flow
- a minimal manual sign-up and session-establishment check

## Principle

Local development should be fast enough to use constantly and strict enough to reduce CI surprises.
