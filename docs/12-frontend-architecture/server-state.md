# Server State

## Rules

- server state should use TanStack Query
- TanStack Query is the default mechanism for fetching, caching, refetching, and mutations of backend-backed data
- query keys should be structured and predictable
- route-critical data should be prefetched with `ensureQueryData` before component render when route loaders are available
- components should read prefetched query results with `useSuspenseQuery` and the same query options
- invalidation strategy must be documented for each mutation-heavy feature
- mutations should invalidate specific related queries instead of broad cache resets
- backend contracts should be consumed through typed client boundaries rather than ad hoc fetch logic
- `packages/api-client` should validate responses with Zod-backed schemas before data reaches feature UI
