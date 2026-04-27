# Routing

## Rules

- route ownership belongs to `apps/web`
- route trees should be explicit and organized by feature or bounded page area
- route-level data loading and boundaries should be documented before implementation
- route loaders should prefetch route-critical data with `ensureQueryData`
- route components should consume prefetched server state with `useSuspenseQuery` using the same query options
- routes should avoid mixing unrelated query definitions between loader prefetch and component consumption
- route files and folders should use `kebab-case` unless framework constraints require otherwise
