import { createApiClient } from "@padel/api-client";
import { QueryClient } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@padel/ui/styles.css";

import { App } from "./app.js";
import { createWebRouter } from "./router.js";
import { createScaffoldApiFetch } from "./scaffold-api-fetch.js";

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

  const apiClient = createApiClient({
    fetch: createScaffoldApiFetch(),
  });

  const router = createWebRouter({
    apiClient,
    auth: {
      isAuthenticated: true,
      roleLabel: "Competition operations",
      userName: "Operations desk",
    },
    queryClient,
  });

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App queryClient={queryClient} router={router} />
    </StrictMode>,
  );
}
