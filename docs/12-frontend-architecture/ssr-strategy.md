# SSR Strategy

## Purpose

Define the server-rendering and hydration approach for the frontend application.

## Rules

- SSR and route-loading decisions should be explicit per route or route group
- SSR should be used only where it creates real value for initial load, SEO, or security-sensitive delivery
- server-rendered and client-rendered boundaries should be intentional
- interactive, cache-heavy, refetch-heavy, or mutation-heavy flows should prefer client-side TanStack Query execution after hydration
- data-loading strategy should avoid duplicate client/server fetch patterns where possible
- reusable UI components should remain compatible with the selected SSR model
