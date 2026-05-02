import {
  QueryClient,
  QueryClientProvider,
  type QueryClient as QueryClientType,
} from "@tanstack/react-query";
import {
  type AnyRouter,
  type RouterHistory,
  RouterProvider,
} from "@tanstack/react-router";
import { useState } from "react";

import { type PadelApiClient, createApiClient } from "@padel/api-client";

import { type AppRouter, createAppRouter } from "./routes.js";

export interface AppRuntime {
  apiClient: PadelApiClient;
  queryClient: QueryClient;
  router: AppRouter;
}

interface LegacyAppProps {
  queryClient: QueryClientType;
  router: AnyRouter;
}

interface RuntimeAppProps {
  runtime?: AppRuntime;
}

type AppProps = LegacyAppProps | RuntimeAppProps;

function getDefaultApiBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:3000";
}

export function createAppRuntime(options?: {
  apiClient?: PadelApiClient;
  history?: RouterHistory;
  queryClient?: QueryClient;
}) {
  const queryClient =
    options?.queryClient ??
    new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false,
        },
        queries: {
          retry: false,
        },
      },
    });
  const apiClient =
    options?.apiClient ??
    createApiClient({
      baseUrl: getDefaultApiBaseUrl(),
    });

  return {
    apiClient,
    queryClient,
    router: createAppRouter(
      {
        apiClient,
        queryClient,
      },
      {
        history: options?.history,
      },
    ),
  } satisfies AppRuntime;
}

function isLegacyProps(props: AppProps): props is LegacyAppProps {
  return "queryClient" in props && "router" in props;
}

export function App(props: AppProps) {
  const [resolvedRuntime] = useState(() => {
    if (isLegacyProps(props)) {
      return {
        apiClient: props.router.options.context.apiClient,
        queryClient: props.queryClient,
        router: props.router,
      } satisfies AppRuntime;
    }

    return props.runtime ?? createAppRuntime();
  });

  return (
    <QueryClientProvider client={resolvedRuntime.queryClient}>
      <RouterProvider router={resolvedRuntime.router} />
    </QueryClientProvider>
  );
}
