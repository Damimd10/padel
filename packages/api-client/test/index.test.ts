import {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { describe, expect, it } from "vitest";

import {
  type ApiClientError,
  competitionOverviewPath,
  createApiClient,
  sampleContractSummary,
} from "../src/index.js";

describe("api-client package", () => {
  it("reads the shared schema package", () => {
    expect(sampleContractSummary()).toBe("ok:0.0.0");
  });

  it("maps the sign-up contract through axios with shared config", async () => {
    const post = async (
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ) => {
      expect(url).toBe("/auth/sign-up");
      expect(data).toEqual({
        email: "player@example.com",
        name: "Padel Player",
        password: "password-1234",
      });
      expect(config).toBeUndefined();

      return {
        data: {
          user: {
            email: "player@example.com",
            emailVerified: false,
            id: "user-1",
            image: null,
            name: "Padel Player",
          },
        },
      };
    };

    const apiClient = createApiClient({
      axios: {
        defaults: {
          baseURL: "http://localhost:3000",
          withCredentials: true,
        },
        get: async () => ({ data: null }),
        post,
      } as unknown as AxiosInstance,
      baseUrl: "http://localhost:3000",
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
      axios: {
        defaults: {},
        get: async () => ({
          data: {
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
          },
        }),
        post: async () => ({ data: null }),
      } as unknown as AxiosInstance,
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
      axios: {
        defaults: {},
        get: async () => ({ data: { authenticated: false } }),
        post: async () => ({ data: null }),
      } as unknown as AxiosInstance,
    });

    await expect(apiClient.getCurrentSession()).resolves.toBeNull();
  });

  it("maps backend auth failures into ApiClientError", async () => {
    const apiClient = createApiClient({
      axios: {
        defaults: {},
        get: async () => ({ data: null }),
        post: async () => {
          throw new AxiosError(
            "Request failed with status code 401",
            "ERR_BAD_REQUEST",
            undefined,
            undefined,
            {
              config: {
                headers: new AxiosHeaders(),
              } as InternalAxiosRequestConfig,
              data: {
                code: "invalid_credentials",
                message: "Email or password is incorrect.",
              },
              headers: {},
              status: 401,
              statusText: "Unauthorized",
            },
          );
        },
      } as unknown as AxiosInstance,
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
        responseBody:
          '{"code":"invalid_credentials","message":"Email or password is incorrect."}',
        status: 401,
      }),
    );
  });

  it("parses the competition overview contract through the typed client", async () => {
    const apiClient = createApiClient({
      axios: {
        defaults: {},
        get: async (url: string, config?: AxiosRequestConfig) => {
          expect(url).toBe(competitionOverviewPath);
          expect(config).toMatchObject({
            headers: {
              accept: "application/json",
            },
          });

          return {
            data: [
              {
                endsAt: "2026-05-05T21:00:00.000Z",
                format: "round-robin",
                id: "fa222204-b855-4fb0-b507-e169249e588e",
                owner: {
                  email: "lucia@example.com",
                  id: "44e7eb17-a42b-4de8-bf34-2f8d78680d39",
                  name: "Lucia Perez",
                },
                startsAt: "2026-05-03T12:00:00.000Z",
                status: "open",
                title: "North Circuit Masters",
              },
            ],
          };
        },
        post: async () => ({ data: null }),
      } as unknown as AxiosInstance,
    });

    await expect(apiClient.getCompetitionOverview()).resolves.toMatchObject([
      {
        status: "open",
        title: "North Circuit Masters",
      },
    ]);
  });

  it("throws a typed transport error for non-success responses", async () => {
    const apiClient = createApiClient({
      axios: {
        defaults: {},
        get: async () => {
          throw new AxiosError(
            "Request failed with status code 503",
            "ERR_BAD_RESPONSE",
            undefined,
            undefined,
            {
              config: {
                headers: new AxiosHeaders(),
              } as InternalAxiosRequestConfig,
              data: {
                message: "Backend unavailable",
              },
              headers: {},
              status: 503,
              statusText: "Service Unavailable",
            },
          );
        },
        post: async () => ({ data: null }),
      } as unknown as AxiosInstance,
    });

    await expect(apiClient.getCompetitionOverview()).rejects.toEqual(
      expect.objectContaining({
        message: "Backend unavailable",
        name: "ApiClientError",
        responseBody: '{"message":"Backend unavailable"}',
        status: 503,
      }),
    );
  });
});
