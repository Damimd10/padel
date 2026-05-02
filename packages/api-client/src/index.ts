import axios, { AxiosError, type AxiosInstance } from "axios";
import {
  type CompetitionOverviewCollection,
  type CurrentSessionResponse,
  type SignInEmailRequest,
  type SignInEmailResponse,
  type SignOutResponse,
  type SignUpEmailRequest,
  type SignUpEmailResponse,
  competitionOverviewCollectionSchema,
  currentSessionResponseSchema,
  sharedPingContract,
  signInEmailRequestSchema,
  signInEmailResponseSchema,
  signOutResponseSchema,
  signUpEmailRequestSchema,
  signUpEmailResponseSchema,
} from "@padel/schemas";
import { z } from "zod";

export const competitionOverviewPath = "/competitions";

const authErrorPayloadSchema = z
  .object({
    code: z.string().optional(),
    message: z.string().optional(),
  })
  .passthrough();

export type AuthErrorPayload = z.infer<typeof authErrorPayloadSchema>;

export function sampleContractSummary() {
  const parsed = sharedPingContract.parse({ status: "ok", version: "0.0.0" });

  return `${parsed.status}:${parsed.version}`;
}

export interface CompetitionOverviewRequestOptions {
  signal?: AbortSignal;
}

export interface ApiClientConfig {
  apiBaseUrl?: string;
  axios?: AxiosInstance;
  baseUrl?: string;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly payload?: unknown,
    readonly responseBody?: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export interface PadelApiClient {
  getCompetitionOverview(
    options?: CompetitionOverviewRequestOptions,
  ): Promise<CompetitionOverviewCollection>;
  getCurrentSession(): Promise<CurrentSessionResponse>;
  signIn(input: SignInEmailRequest): Promise<SignInEmailResponse>;
  signOut(): Promise<SignOutResponse>;
  signUp(input: SignUpEmailRequest): Promise<SignUpEmailResponse>;
}

function normalizeBaseUrl(baseUrl?: string) {
  if (!baseUrl) {
    return "";
  }

  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function resolveBaseUrl(config: ApiClientConfig) {
  return normalizeBaseUrl(config.baseUrl ?? config.apiBaseUrl);
}

function serializePayload(payload: unknown) {
  if (typeof payload === "string") {
    return payload;
  }

  if (payload === undefined) {
    return undefined;
  }

  try {
    return JSON.stringify(payload);
  } catch {
    return undefined;
  }
}

function mapAxiosError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (error instanceof AxiosError) {
    const payload = error.response?.data;
    const parsedError = authErrorPayloadSchema.safeParse(payload);

    return new ApiClientError(
      parsedError.success && parsedError.data.message
        ? parsedError.data.message
        : error.message,
      error.response?.status ?? 500,
      parsedError.success ? parsedError.data.code : undefined,
      payload,
      serializePayload(payload),
    );
  }

  if (error instanceof Error) {
    return new ApiClientError(error.message, 500);
  }

  return new ApiClientError("Unknown API client error.", 500);
}

async function parseAxiosResponse<T>(
  request: Promise<{ data: unknown }>,
  schema: z.ZodType<T>,
): Promise<T> {
  try {
    const response = await request;
    return schema.parse(response.data);
  } catch (error) {
    throw mapAxiosError(error);
  }
}

export function createApiClient(config: ApiClientConfig = {}): PadelApiClient {
  const api =
    config.axios ??
    axios.create({
      baseURL: resolveBaseUrl(config),
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

  return {
    async signUp(input) {
      const payload = signUpEmailRequestSchema.parse(input);

      return parseAxiosResponse(
        api.post("/auth/sign-up", payload),
        signUpEmailResponseSchema,
      );
    },

    async signIn(input) {
      const payload = signInEmailRequestSchema.parse(input);

      return parseAxiosResponse(
        api.post("/auth/sign-in", payload),
        signInEmailResponseSchema,
      );
    },

    async signOut() {
      return parseAxiosResponse(api.post("/auth/sign-out"), signOutResponseSchema);
    },

    async getCurrentSession() {
      return parseAxiosResponse(
        api.get("/auth/session"),
        currentSessionResponseSchema,
      );
    },

    async getCompetitionOverview(options = {}) {
      return parseAxiosResponse(
        api.get(competitionOverviewPath, {
          headers: {
            accept: "application/json",
          },
          signal: options.signal,
        }),
        competitionOverviewCollectionSchema,
      );
    },
  };
}
