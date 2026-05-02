// @vitest-environment jsdom

import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/app.js";
import {
  competitionOverviewFixture,
  emptyCompetitionOverviewFixture,
} from "../src/features/competition-operations/competition-overview-fixtures.js";
import { createWebRouter } from "../src/router.js";
import { useAuthStore } from "../src/stores/auth-store.js";

vi.mock("@padel/api-client", () => ({
  createApiClient: () => ({
    getCompetitionOverview: vi.fn(),
    getSession: vi.fn(() =>
      Promise.resolve({
        authenticated: true,
        user: {
          id: "1",
          name: "Test",
          email: "test@test.com",
          emailVerified: false,
        },
      }),
    ),
    signInWithEmail: vi.fn(),
    signUpWithEmail: vi.fn(),
    signOut: vi.fn(),
    forgetPassword: vi.fn(),
    resetPassword: vi.fn(),
  }),
}));

(window as Window & { scrollTo: () => void }).scrollTo = () => {};

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  });
});

function createTestRouter(
  fetchImplementation: typeof globalThis.fetch,
  initialEntry = "/competitions/operations",
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const apiClient = {
    getCompetitionOverview: async () => {
      const response = await fetchImplementation(
        new Request("https://test.local/competitions"),
      );
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}.`);
      }
      return response.json();
    },
    getSession: () =>
      Promise.resolve({
        authenticated: true,
        user: {
          id: "1",
          name: "Test",
          email: "test@test.com",
          emailVerified: false,
          image: null,
        },
      }),
    signInWithEmail: vi.fn(),
    signUpWithEmail: vi.fn(),
    signOut: vi.fn(),
    forgetPassword: vi.fn(),
    resetPassword: vi.fn(),
  };

  useAuthStore.setState({
    user: {
      id: "1",
      name: "Test",
      email: "test@test.com",
      emailVerified: false,
      image: null,
    },
    isAuthenticated: true,
    isLoading: false,
    error: null,
  });

  const router = createWebRouter({
    apiClient: apiClient as never,
    history: createMemoryHistory({
      initialEntries: [initialEntry],
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
    const { queryClient, router } = createTestRouter(
      async () =>
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

    const { queryClient, router } = createTestRouter(
      async () =>
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
    const { queryClient, router } = createTestRouter(
      async () =>
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
