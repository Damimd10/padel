# SSR Strategy

## Purpose

Define the server-rendering and hydration approach for the frontend application.

## Rules

- SSR and route-loading decisions should be explicit per route or route group
- server-rendered and client-rendered boundaries should be intentional
- data-loading strategy should avoid duplicate client/server fetch patterns where possible
- reusable UI components should remain compatible with the selected SSR model
