# Auth Local Workflow

## Purpose

Document the local Better Auth setup, session policy, and the minimum validation flow for the authentication foundation.

## Environment variables

`apps/api` requires these auth-specific environment variables in addition to the standard PostgreSQL settings:

```bash
BETTER_AUTH_SECRET=change-me-in-local-dev
BETTER_AUTH_URL=http://localhost:3000
```

### Variable rules

- `BETTER_AUTH_SECRET` must be set for every environment and should be treated like any other backend secret.
- `BETTER_AUTH_URL` should match the public base URL used to access the backend auth endpoints in the current environment.
- for local development, keep `BETTER_AUTH_URL` aligned with the backend origin you will call from the browser or `curl`

## Local session and cookie baseline

`TKT-016` establishes the first owned session path using Better Auth with PostgreSQL-backed persistence in `apps/api`.

Current local behavior:

- email and password is the enabled baseline sign-in method
- Better Auth owns the session, account, verification, and cookie mechanics at the platform edge
- the backend consumes authenticated identity through explicit auth boundaries rather than importing Better Auth types into competition domain code
- sign-up and sign-in create a persisted session row in PostgreSQL and set a session cookie on the HTTP response

Operational guidance:

- keep auth/session concerns in inbound adapters and infrastructure wiring
- do not import Better Auth models into competition domain entities
- treat cookie policy, secret handling, and origin alignment as infrastructure concerns

## Local setup flow

1. Copy the checked-in environment template and set auth values:

```bash
cp .env.example .env
```

2. Boot PostgreSQL:

```bash
pnpm run db:up
```

3. Apply the checked-in Prisma migrations:

```bash
pnpm --filter @padel/api prisma:migrate:deploy
```

4. Start the backend:

```bash
pnpm --filter @padel/api build
pnpm --filter @padel/api exec node dist/apps/api/main.js
```

## Integration validation

Run the database-backed integration suite for the current backend auth and repository adapters:

```bash
pnpm --filter @padel/api test:integration:db
```

That suite verifies:

- Prisma-backed competition persistence against PostgreSQL
- Better Auth sign-up creates user, account, and session rows in PostgreSQL
- Better Auth can read the established session back through `/auth/get-session`

## Manual end-to-end session check

Use this flow when you want a quick manual proof that the auth foundation is alive without a full frontend implementation.

1. Sign up a local test user and store the session cookie:

```bash
curl -i \
  -H 'Origin: http://localhost:3000' \
  -H 'Content-Type: application/json' \
  -c /tmp/padel-auth-cookie.txt \
  -d '{"name":"Local Auth User","email":"local-auth@example.com","password":"password-1234"}' \
  http://localhost:3000/auth/sign-up/email
```

2. Read the current session using the stored cookie:

```bash
curl -i \
  -b /tmp/padel-auth-cookie.txt \
  http://localhost:3000/auth/get-session
```

Expected result:

- the first response returns a user payload and a `Set-Cookie` header
- the second response returns a `session` object and the same user identity
- PostgreSQL contains corresponding `user`, `account`, and `session` rows

## Boundary reminder

This workflow proves the authentication foundation only. Role checks and protected competition-management behavior should be added in follow-up tickets instead of being folded into `TKT-016`.
