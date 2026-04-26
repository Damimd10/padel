# Local Development

## Purpose

Define the local developer workflow before implementation begins.

## Expected local flow

1. install with `pnpm`
2. run workspace tasks through Nx
3. rely on Biome for source hygiene
4. use Lefthook for commit-time validation
5. run affected tests before pushing

## Principle

Local development should be fast enough to use constantly and strict enough to reduce CI surprises.
