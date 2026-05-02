import { describe, expect, it } from "vitest";

import {
  ApiClientError,
  competitionOverviewPath,
  createApiClient,
  sampleContractSummary,
} from "../src/index.js";

describe("api-client package", () => {
  it("reads the shared schema package", () => {
    expect(sampleContractSummary()).toBe("ok:0.0.0");
  });

  it("maps the sign-up contract and sends credentials", async () => {
    const fetchStub = async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(input).toBe("http://localhost:3000/auth/sign-up");
      expect(init?.credentials).toBe("include");
      expect(init?.method).toBe("POST");
      expect(init?.headers).toEqual({
        "Content-Type": "application/json",
      });
      expect(JSON.parse(String(init?.body))).toEqual({
        email: "player@example.com",
        name: "Padel Player",
        password: "password-1234",
      });

      return new Response(
        JSON.stringify({
          user: {
            email: "player@example.com",
            emailVerified: false,
            id: "user-1",
            image: null,
            name: "Padel Player",
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 201,
        },
      );
    };

    const apiClient = createApiClient({
      baseUrl: "http://localhost:3000",
      fetch: fetchStub as typeof fetch,
    });

    await expect(
      apiClient.signUp({
        email: "player@example.com",
        name: "Padel Player",
        password: "password-1234",
      }),
    ).resolves.toMatchObject({
      user: {
        email: "player@example.com",
        name: "Padel Player",
      },
    });
  });

  it("maps the current session response into a nullable frontend shape", async () => {
    const apiClient = createApiClient({
      fetch: async () =>
        new Response(
          JSON.stringify({
            authenticated: true,
            session: {
              expiresAt: "2026-05-10T00:00:00.000Z",
              id: "session-1",
              userId: "user-1",
            },
            user: {
              email: "player@example.com",
              emailVerified: false,
              id: "user-1",
              image: null,
              name: "Padel Player",
            },
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
            status: 200,
          },
        ),
    });

    await expect(apiClient.getCurrentSession()).resolves.toMatchObject({
      session: {
        id: "session-1",
      },
      user: {
        email: "player@example.com",
      },
    });
  });

  it("allows the current-session contract to return null", async () => {
    const apiClient = createApiClient({
      fetch: async () =>
        new Response(JSON.stringify({ authenticated: false }), {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
        }),
    });

    await expect(apiClient.getCurrentSession()).resolves.toBeNull();
  });

  it("maps backend auth failures into ApiClientError", async () => {
    const apiClient = createApiClient({
      fetch: async () =>
        new Response(
          JSON.stringify({
            code: "invalid_credentials",
            message: "Email or password is incorrect.",
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
            status: 401,
          },
        ),
    });

    await expect(
      apiClient.signIn({
        email: "player@example.com",
        password: "wrong-password",
      }),
    ).rejects.toEqual(
      expect.objectContaining<ApiClientError>({
        code: "invalid_credentials",
        message: "Email or password is incorrect.",
        name: "ApiClientError",
        status: 401,
      }),
    );
  });

  it("parses the competition overview contract through the typed client", async () => {
    const client = createApiClient({
      apiBaseUrl: "https://padel.test/api",
      fetch: async (input) => {
        expect(input).toBe(`https://padel.test/api${competitionOverviewPath}`);

        return new Response(
          JSON.stringify([
            {
              id: "fa222204-b855-4fb0-b507-e169249e588e",
              title: "North Circuit Masters",
              format: "round-robin",
              status: "open",
              startsAt: "2026-05-03T12:00:00.000Z",
              endsAt: "2026-05-05T21:00:00.000Z",
              owner: {
                id: "44e7eb17-a42b-4de8-bf34-2f8d78680d39",
                name: "Lucia Perez",
                email: "lucia@example.com",
              },
            },
          ]),
          {
            headers: {
              "content-type": "application/json",
            },
            status: 200,
          },
        );
      },
    });

    await expect(client.getCompetitionOverview()).resolves.toMatchObject([
      {
        status: "open",
        title: "North Circuit Masters",
      },
    ]);
  });

  it("throws a typed transport error for non-success responses", async () => {
    const client = createApiClient({
      fetch: async () =>
        new Response(JSON.stringify({ message: "Backend unavailable" }), {
          headers: {
            "content-type": "application/json",
          },
          status: 503,
        }),
    });

    await expect(client.getCompetitionOverview()).rejects.toEqual(
      expect.objectContaining<ApiClientError>({
        message: "Request failed with status 503.",
        responseBody: '{"message":"Backend unavailable"}',
        status: 503,
      }),
    );
  });
}
