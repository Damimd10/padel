import { createApiClient } from "@padel/api-client";
import { QueryClient } from "@tanstack/react-query";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "@padel/ui/styles.css";

import { App } from "./app.js";
import { createWebRouter } from "./router.js";
import { useAuthStore } from "./stores/auth-store.js";

function AuthInitializer({
  apiClient,
  children,
}: {
  apiClient: ReturnType<typeof createApiClient>;
  children: React.ReactNode;
}) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    void initialize(apiClient);
  }, [initialize, apiClient]);

  return children;
}

const container = document.getElementById("root");

if (container) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 30_000,
      },
    },
  });

  const apiClient = createApiClient();

  const router = createWebRouter({
    apiClient,
    queryClient,
  });

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <AuthInitializer apiClient={apiClient}>
        <App queryClient={queryClient} router={router} />
      </AuthInitializer>
    </StrictMode>,
  );
}
