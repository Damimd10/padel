# Auth Local Workflow

## Purpose

Document the local Better Auth setup, session policy, and the backend-owned self-service auth flow.

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

`TKT-016` established the Better Auth runtime foundation. `TKT-043` adds explicit backend-owned self-service auth contracts on top of that foundation in `apps/api`.

Current local behavior:

- email and password is the enabled baseline sign-in method
- Better Auth owns the session, account, verification, and cookie mechanics at the platform edge
- the backend consumes authenticated identity through explicit auth boundaries rather than importing Better Auth types into competition domain code
- `POST /auth/sign-up` and `POST /auth/sign-in` create a persisted session row in PostgreSQL and set a session cookie on the HTTP response
- `POST /auth/sign-out` clears the current session cookie and deletes the session row when present
- `GET /auth/session` returns `{ authenticated: false }` when no valid session is present

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
- app-owned auth sign-up creates user, account, and session rows in PostgreSQL
- invalid credentials and duplicate sign-up attempts return explicit auth error payloads
- the established session can be read back through `GET /auth/session`

## Manual end-to-end session check

Use this flow when you want a quick manual proof that the auth foundation is alive without a full frontend implementation.

1. Sign up a local test user and store the session cookie:

```bash
curl -i \
  -H 'Origin: http://localhost:3000' \
  -H 'Content-Type: application/json' \
  -c /tmp/padel-auth-cookie.txt \
  -d '{"name":"Local Auth User","email":"local-auth@example.com","password":"password-1234"}' \
  http://localhost:3000/auth/sign-up
```

2. Read the current session using the stored cookie:

```bash
curl -i \
  -b /tmp/padel-auth-cookie.txt \
  http://localhost:3000/auth/session
```

3. Sign out and confirm the session is gone:

```bash
curl -i \
  -b /tmp/padel-auth-cookie.txt \
  -c /tmp/padel-auth-cookie.txt \
  -X POST \
  http://localhost:3000/auth/sign-out
```

```bash
curl -i \
  -b /tmp/padel-auth-cookie.txt \
  http://localhost:3000/auth/session
```

Expected result:

- the first response returns a backend-owned `{ user }` payload and a `Set-Cookie` header
- the second response returns `{ authenticated: true, session, user }`
- the sign-out response returns `{ success: true }` and a clearing `Set-Cookie` header
- the final session check returns `{ authenticated: false }`
- PostgreSQL contains corresponding `user`, `account`, and `session` rows

## Boundary reminder

This workflow proves the authentication foundation only. Role checks and protected competition-management behavior should be added in follow-up tickets instead of being folded into `TKT-016`.
