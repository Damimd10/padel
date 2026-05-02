import {
  type AuthMutationResponse,
  type AuthSessionResponse,
  type CompetitionOverviewCollection,
  type ForgetPasswordRequest,
  type ForgetPasswordResponse,
  type ResetPasswordRequest,
  type ResetPasswordResponse,
  type SignInWithEmailRequest,
  type SignOutResponse,
  type SignUpWithEmailRequest,
  authMutationResponseSchema,
  authSessionResponseSchema,
  competitionOverviewCollectionSchema,
  forgetPasswordResponseSchema,
  resetPasswordResponseSchema,
  signOutResponseSchema,
} from "@padel/schemas";
import type { AxiosInstance } from "axios";
import axios from "axios";

export const competitionOverviewPath = "/competitions";
export const signUpPath = "/auth/sign-up";
export const signInPath = "/auth/sign-in";
export const signOutPath = "/auth/sign-out";
export const sessionPath = "/auth/session";
export const forgetPasswordPath = "/auth/forget-password";
export const resetPasswordPath = "/auth/reset-password";

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly responseBody: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export interface CompetitionOverviewRequestOptions {
  signal?: AbortSignal;
}

export interface CreateApiClientOptions {
  apiBaseUrl?: string;
}

export interface PadelApiClient {
  getCompetitionOverview(
    options?: CompetitionOverviewRequestOptions,
  ): Promise<CompetitionOverviewCollection>;

  signUpWithEmail(
    request: SignUpWithEmailRequest,
  ): Promise<AuthMutationResponse>;

  signInWithEmail(
    request: SignInWithEmailRequest,
  ): Promise<AuthMutationResponse>;

  signOut(): Promise<SignOutResponse>;

  getSession(): Promise<AuthSessionResponse>;

  forgetPassword(
    request: ForgetPasswordRequest,
  ): Promise<ForgetPasswordResponse>;

  resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse>;
}

function parseResponseWithSchema<T>(
  data: unknown,
  schema: { parse(input: unknown): T },
): T {
  return schema.parse(data);
}

export function createApiClient({
  apiBaseUrl = "/api",
}: CreateApiClientOptions = {}): PadelApiClient {
  const client: AxiosInstance = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiClientError(
          `API request failed with status ${error.response.status}.`,
          error.response.status,
          error.response.data,
        );
      }
      throw error;
    },
  );

  return {
    async getCompetitionOverview(options = {}) {
      const response = await client.get(competitionOverviewPath, {
        signal: options.signal,
      });
      return parseResponseWithSchema(
        response.data,
        competitionOverviewCollectionSchema,
      );
    },

    async signUpWithEmail(request) {
      const response = await client.post(signUpPath, request);
      return parseResponseWithSchema(response.data, authMutationResponseSchema);
    },

    async signInWithEmail(request) {
      const response = await client.post(signInPath, request);
      return parseResponseWithSchema(response.data, authMutationResponseSchema);
    },

    async signOut() {
      const response = await client.post(signOutPath);
      return parseResponseWithSchema(response.data, signOutResponseSchema);
    },

    async getSession() {
      const response = await client.get(sessionPath);
      return parseResponseWithSchema(response.data, authSessionResponseSchema);
    },

    async forgetPassword(request) {
      const response = await client.post(forgetPasswordPath, request);
      return parseResponseWithSchema(
        response.data,
        forgetPasswordResponseSchema,
      );
    },

    async resetPassword(request) {
      const response = await client.post(resetPasswordPath, request);
      return parseResponseWithSchema(
        response.data,
        resetPasswordResponseSchema,
      );
    },
  };
}
