# SSR Strategy

## Context

The chosen frontend stack is React with TanStack Router and TanStack Query, not a framework that forces fullstack SSR conventions by default.

Most product value sits in authenticated, mutation-heavy operational screens. That changes the SSR calculus substantially.

## Assumptions

- SEO is not the main driver for the core product.
- Authenticated workflow screens dominate usage.
- The system may still expose a small number of entry or public-read surfaces later.
- SSR must justify its operational complexity rather than being used by default.

## Decisions

### 1. Default to client-rendered workflows with route-aware data prefetch

The default delivery model for authenticated competition workflows is:

- route resolution,
- route loader prefetch of route-critical data,
- hydration into client-side TanStack Query ownership,
- then client-side mutations and refetch flows.

This keeps the main workflow model consistent and avoids hybrid complexity where it is not buying much.

### 2. Use SSR selectively, not ideologically

SSR is allowed only when it clearly improves one of these:

- first-load performance for entry surfaces,
- public readability,
- authentication or security-sensitive shell delivery,
- or a route where avoiding an empty client shell has clear UX value.

SSR should not be introduced merely because the stack technically supports it.

### 3. Do not duplicate ownership across server and client paths

If a route uses SSR or server-prefetch behavior, the same query contract and cache ownership must still converge into TanStack Query on the client.

The architecture should avoid:

- one data path for SSR,
- another unrelated data path for CSR,
- and duplicated transformation logic in both places.

### 4. Shared UI must remain render-mode agnostic

Components in `packages/ui` should not assume:

- browser-only globals during render,
- route context presence,
- or direct access to client-only storage APIs.

Environment-specific behavior belongs at the app boundary.

## Trade-offs

- Avoiding default SSR reduces architectural complexity early.
- Selective SSR means some routes will have different delivery behavior and need extra discipline.
- Client-first delivery may produce slightly slower first paint on some entry routes, but that is preferable to a needlessly hybrid architecture.

## Risks

- Teams may overuse SSR once it exists for one route pattern.
- Hydration mismatches become more likely if shared UI components start reading unstable client-only values during render.
- Poorly documented SSR entry points can create invisible differences in route behavior.

## Anti-patterns

- Turning every route into an SSR candidate.
- Fetching the same resource once in a server path and again in a separate client effect.
- Using SSR to compensate for poor query planning or oversized client bundles.
- Allowing `packages/ui` to depend on browser-only APIs in render paths.

## Next Actions

- Document SSR eligibility per route group once route inventory is finalized.
- Keep route loaders and query definitions compatible with both prefetch and client reuse.
- Revisit SSR scope only after real route-level performance evidence exists.
