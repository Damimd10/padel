# Frontend Overview

## Purpose

Define the frontend implementation model for React, TypeScript and the TanStack stack.

## Architecture summary

- React + TypeScript application under `apps/web`
- TanStack Router for route structure
- TanStack Query for server state
- TanStack Form + Zod for form state and validation
- TanStack Store for app-local state when route or server state is not the right fit
- `packages/api-client` for backend consumption from the frontend
- `packages/schemas` for shared contract validation between frontend and backend
- reusable UI consumed from `packages/ui`

## Primary rules

- use SSR only when it improves initial load, SEO, or security-sensitive delivery
- use client-side TanStack Query flows when the feature needs interaction, cache reuse, refetching, or mutations
- use TanStack Store only for local or global UI state
- use `packages/schemas` plus `packages/api-client` as the default coordination boundary between frontend and backend

## Data flow progression

1. route loaders prefetch route-critical data with `ensureQueryData`
2. route components consume the same query options with `useSuspenseQuery`
3. `packages/api-client` validates responses with Zod-backed schemas before UI consumption
4. TanStack Query owns server state lifecycle
5. TanStack Store owns UI state lifecycle
6. TanStack Form + Zod own form state and validation
7. mutations invalidate specific queries
8. SSR is applied only where it adds clear delivery value

## Delivery rule

Frontend tickets must use the frontend implementation workflow and must not introduce backend or infrastructure scope unless explicitly split into separate tickets.
