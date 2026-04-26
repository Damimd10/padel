# Backend Overview

## Purpose

Define the backend implementation model for NestJS, TypeScript and PostgreSQL.

## Architecture summary

The backend follows a hexagonal architecture:

- domain core for business rules
- application layer for use cases and orchestration
- inbound adapters for HTTP or other entrypoints
- outbound adapters for persistence and external services
- infrastructure wiring that does not leak into domain logic

## Delivery rule

Backend tickets must use the backend implementation workflow and must preserve the hexagonal separation described in this section.
