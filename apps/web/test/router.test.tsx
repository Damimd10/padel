// @vitest-environment jsdom

import { createApiClient } from "@padel/api-client";
import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { App } from "../src/app.js";
import {
  competitionOverviewFixture,
  emptyCompetitionOverviewFixture,
} from "../src/features/competition-operations/competition-overview-fixtures.js";
import { createWebRouter } from "../src/router.js";

(window as Window & { scrollTo: () => void }).scrollTo = () => {};

function createTestRouter(fetchImplementation: typeof globalThis.fetch) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const apiClient = createApiClient({
    fetch: fetchImplementation,
  });

  const router = createWebRouter({
    apiClient,
    auth: {
      isAuthenticated: true,
      roleLabel: "Competition operations",
      userName: "Operations desk",
    },
    history: createMemoryHistory({
      initialEntries: ["/competitions/operations"],
    }),
    queryClient,
  });

  return {
    queryClient,
    router,
  };
}

describe("competition operations route", () => {
  it("renders the loading state while the route-critical query is pending", async () => {
    const { queryClient, router } = createTestRouter(
      () =>
        new Promise<Response>(() => {
          // Intentionally unresolved to keep the route in its pending state.
        }),
    );

    render(<App queryClient={queryClient} router={router} />);

    await waitFor(() => {
      expect(document.querySelector('[data-slot="skeleton"]')).not.toBeNull();
    });
  });

  it("renders the empty state when the overview query returns no competitions", async () => {
    const { queryClient, router } = createTestRouter(async () =>
      new Response(JSON.stringify(emptyCompetitionOverviewFixture), {
        headers: {
          "content-type": "application/json",
        },
        status: 200,
      }),
    );

    render(<App queryClient={queryClient} router={router} />);

    expect(
      await screen.findByText("No competitions need operational review yet."),
    ).toBeTruthy();
  });

  it("renders the blocked error state when the query fails", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const { queryClient, router } = createTestRouter(async () =>
      new Response(JSON.stringify({ message: "Backend unavailable" }), {
        headers: {
          "content-type": "application/json",
        },
        status: 503,
      }),
    );

    render(<App queryClient={queryClient} router={router} />);

    expect(
      await screen.findByText("Competition overview could not be loaded"),
    ).toBeTruthy();

    consoleErrorSpy.mockRestore();
  });

  it("renders the populated operational table with shared UI primitives", async () => {
    const { queryClient, router } = createTestRouter(async () =>
      new Response(JSON.stringify(competitionOverviewFixture), {
        headers: {
          "content-type": "application/json",
        },
        status: 200,
      }),
    );

    render(<App queryClient={queryClient} router={router} />);

    expect(await screen.findByText("North Circuit Masters")).toBeTruthy();
    expect(
      screen.getByText("Review registrations and keep operations moving"),
    ).toBeTruthy();
    expect(document.querySelector('[data-slot="table"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="inline-alert"]')).not.toBeNull();
  });
});
