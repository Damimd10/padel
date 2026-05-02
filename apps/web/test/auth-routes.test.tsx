// @vitest-environment jsdom

import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory } from "@tanstack/react-router";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { ApiClientError, type PadelApiClient } from "@padel/api-client";

import { App, createAppRuntime } from "../src/app.js";

afterEach(() => {
  cleanup();
});

beforeAll(() => {
  Object.defineProperty(window, "scrollTo", {
    configurable: true,
    value: vi.fn(),
    writable: true,
  });
});

afterAll(() => {
  vi.restoreAllMocks();
});

function createSession() {
  return {
    session: {
      createdAt: "2026-05-01T00:00:00.000Z",
      expiresAt: "2026-05-10T00:00:00.000Z",
      id: "session-1",
      ipAddress: null,
      token: "token-1",
      updatedAt: "2026-05-01T00:00:00.000Z",
      userAgent: "vitest",
      userId: "user-1",
    },
    user: {
      createdAt: "2026-05-01T00:00:00.000Z",
      email: "organizer@example.com",
      emailVerified: false,
      id: "user-1",
      image: null,
      name: "Organizer One",
      updatedAt: "2026-05-01T00:00:00.000Z",
    },
  } as const;
}

function createApiClientMock(
  overrides: Partial<PadelApiClient> = {},
): PadelApiClient {
  return {
    getCompetitionOverview: vi.fn().mockResolvedValue([]),
    getCurrentSession: vi.fn().mockResolvedValue(null),
    signIn: vi.fn(),
    signOut: vi.fn().mockResolvedValue({ success: true }),
    signUp: vi.fn(),
    ...overrides,
  };
}

function renderWithRuntime(
  apiClient: PadelApiClient,
  initialEntries: string[],
) {
  const runtime = createAppRuntime({
    apiClient,
    history: createMemoryHistory({ initialEntries }),
    queryClient: new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false,
        },
        queries: {
          retry: false,
        },
      },
    }),
  });

  render(<App runtime={runtime} />);

  return runtime;
}

describe("auth routes", () => {
  it("redirects authenticated users away from guest-only entry routes", async () => {
    const apiClient = createApiClientMock({
      getCurrentSession: vi.fn().mockResolvedValue(createSession()),
    });

    renderWithRuntime(apiClient, ["/login"]);

    await screen.findByRole("heading", {
      name: "Welcome, Organizer One.",
    });

    expect(screen.queryByRole("heading", { name: "Sign in" })).toBeNull();
  });

  it("shows pending and error states when sign-in fails", async () => {
    let rejectSignIn!: (reason?: unknown) => void;

    const signInPromise = new Promise<never>((_, reject) => {
      rejectSignIn = reject;
    });

    const apiClient = createApiClientMock({
      getCurrentSession: vi.fn().mockResolvedValue(null),
      signIn: vi.fn().mockReturnValue(signInPromise),
    });

    renderWithRuntime(apiClient, ["/login"]);

    await screen.findByRole("heading", { name: "Sign in" });

    const user = userEvent.setup();

    await user.type(
      screen.getByRole("textbox", { name: /email/i }),
      "organizer@example.com",
    );
    await user.type(screen.getByLabelText(/password/i), "password-1234");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    const pendingButton = screen.getByRole("button", {
      name: "Signing in...",
    });

    expect((pendingButton as HTMLButtonElement).disabled).toBe(true);

    rejectSignIn(
      new ApiClientError(
        "Email or password is incorrect.",
        401,
        "INVALID_EMAIL_OR_PASSWORD",
      ),
    );

    await screen.findByText("Email or password is incorrect.");
  });

  it("registers a user and lands them on the dashboard with a success message", async () => {
    const apiClient = createApiClientMock({
      getCurrentSession: vi
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(createSession()),
      signUp: vi.fn().mockResolvedValue({
        token: null,
        user: createSession().user,
      }),
    });

    renderWithRuntime(apiClient, ["/register"]);

    await screen.findByRole("heading", { name: "Register" });

    const user = userEvent.setup();

    await user.type(
      screen.getByRole("textbox", { name: /full name/i }),
      "Organizer One",
    );
    await user.type(
      screen.getByRole("textbox", { name: /email/i }),
      "organizer@example.com",
    );
    await user.type(screen.getByLabelText(/password/i), "password-1234");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await screen.findByRole("heading", {
      name: "Welcome, Organizer One.",
    });

    expect(
      screen.getByText(
        "Account created successfully. Your authenticated dashboard is ready.",
      ),
    ).not.toBeNull();

    await waitFor(() => {
      expect(apiClient.signUp).toHaveBeenCalledWith({
        email: "organizer@example.com",
        name: "Organizer One",
        password: "password-1234",
      });
    });
  });
});
