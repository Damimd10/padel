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
  baseUrl?: string;
  fetch?: typeof globalThis.fetch;
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

async function readJson(response: Response) {
  const text = await response.text();

  if (!text) {
    return {
      payload: null,
      rawBody: "",
    };
  }

  return {
    payload: JSON.parse(text) as unknown,
    rawBody: text,
  };
}

async function parseJsonResponse<T>(
  response: Response,
  schema: z.ZodType<T>,
): Promise<T> {
  const { payload, rawBody } = await readJson(response);

  if (!response.ok) {
    const parsedError = authErrorPayloadSchema.safeParse(payload);

    throw new ApiClientError(
      parsedError.success && parsedError.data.message
        ? parsedError.data.message
        : `Request failed with status ${response.status}.`,
      response.status,
      parsedError.success ? parsedError.data.code : undefined,
      payload,
      rawBody,
    );
  }

  return schema.parse(payload);
}

function buildUrl(baseUrl: string, path: string) {
  return `${baseUrl}${path}`;
}

export function createApiClient(config: ApiClientConfig = {}): PadelApiClient {
  const request = config.fetch ?? globalThis.fetch;
  const baseUrl = resolveBaseUrl(config);

  if (!request) {
    throw new Error(
      "A fetch implementation is required to create the API client.",
    );
  }

  return {
    async signUp(input) {
      const payload = signUpEmailRequestSchema.parse(input);
      const response = await request(buildUrl(baseUrl, "/auth/sign-up"), {
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      return parseJsonResponse(response, signUpEmailResponseSchema);
    },

    async signIn(input) {
      const payload = signInEmailRequestSchema.parse(input);
      const response = await request(buildUrl(baseUrl, "/auth/sign-in"), {
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      return parseJsonResponse(response, signInEmailResponseSchema);
    },

    async signOut() {
      const response = await request(buildUrl(baseUrl, "/auth/sign-out"), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      return parseJsonResponse(response, signOutResponseSchema);
    },

    async getCurrentSession() {
      const response = await request(buildUrl(baseUrl, "/auth/session"), {
        credentials: "include",
        method: "GET",
      });

      return parseJsonResponse(response, currentSessionResponseSchema);
    },

    async getCompetitionOverview(options = {}) {
      const response = await request(buildUrl(baseUrl, competitionOverviewPath), {
        credentials: "include",
        headers: {
          accept: "application/json",
        },
        method: "GET",
        signal: options.signal,
      });

      return parseJsonResponse(response, competitionOverviewCollectionSchema);
    },
  };
}
