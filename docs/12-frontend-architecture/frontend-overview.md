# Frontend Overview

## Purpose

Define the frontend implementation model for React, TypeScript and the TanStack stack.

## Architecture summary

- React + TypeScript application under `apps/web`
- TanStack Router for route structure
- TanStack Query for server state
- TanStack Form + Zod for form state and validation
- TanStack Store for app-local state when route or server state is not the right fit
- reusable UI consumed from `packages/ui`

## Delivery rule

Frontend tickets must use the frontend implementation workflow and must not introduce backend or infrastructure scope unless explicitly split into separate tickets.
