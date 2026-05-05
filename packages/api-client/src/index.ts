import {
  type AuthMutationResponse,
  type AuthSessionResponse,
  type CategoryCollection,
  type CategoryResponse,
  type CompetitionOverviewCollection,
  type CompleteMatchRequest,
  type CreateCategoryRequest,
  type CreateCompetitionRequest,
  type CreateCompetitionResponse,
  type CreateDivisionRequest,
  type CreateRegistrationRequest,
  type DivisionCollection,
  type DivisionResponse,
  type ForgetPasswordRequest,
  type ForgetPasswordResponse,
  type GenerateMatchesResponse,
  type MatchCollection,
  type RegistrationCollection,
  type RegistrationResponse,
  type ResetPasswordRequest,
  type ResetPasswordResponse,
  type ReviewRegistrationRequest,
  type ScheduleMatchRequest,
  type SignInWithEmailRequest,
  type SignOutResponse,
  type SignUpWithEmailRequest,
  type UpdateCategoryRequest,
  type UpdateDivisionRequest,
  authMutationResponseSchema,
  authSessionResponseSchema,
  categoryCollectionSchema,
  categoryResponseSchema,
  competitionOverviewCollectionSchema,
  completeMatchRequestSchema,
  createCompetitionResponseSchema,
  divisionCollectionSchema,
  divisionResponseSchema,
  forgetPasswordResponseSchema,
  generateMatchesResponseSchema,
  matchCollectionSchema,
  registrationCollectionSchema,
  registrationResponseSchema,
  resetPasswordResponseSchema,
  scheduleMatchRequestSchema,
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

export function competitionCategoriesPath(competitionId: string) {
  return `/competitions/${competitionId}/categories`;
}

export function competitionCategoryPath(
  competitionId: string,
  categoryId: string,
) {
  return `/competitions/${competitionId}/categories/${categoryId}`;
}

export function competitionDivisionsPath(competitionId: string) {
  return `/competitions/${competitionId}/divisions`;
}

export function competitionDivisionPath(
  competitionId: string,
  divisionId: string,
) {
  return `/competitions/${competitionId}/divisions/${divisionId}`;
}

export function competitionRegistrationsPath(competitionId: string) {
  return `/competitions/${competitionId}/registrations`;
}

export function competitionRegistrationApprovePath(
  competitionId: string,
  registrationId: string,
) {
  return `/competitions/${competitionId}/registrations/${registrationId}/approve`;
}

export function competitionRegistrationRejectPath(
  competitionId: string,
  registrationId: string,
) {
  return `/competitions/${competitionId}/registrations/${registrationId}/reject`;
}

export function competitionOpenPath(competitionId: string) {
  return `/competitions/${competitionId}/open`;
}

export function competitionClosePath(competitionId: string) {
  return `/competitions/${competitionId}/close`;
}

export function competitionCancelPath(competitionId: string) {
  return `/competitions/${competitionId}/cancel`;
}

export function competitionMatchesPath(competitionId: string) {
  return `/competitions/${competitionId}/matches`;
}

export function generateMatchesPath(competitionId: string) {
  return `/competitions/${competitionId}/matches/generate`;
}

export function matchSchedulePath(competitionId: string, matchId: string) {
  return `/competitions/${competitionId}/matches/${matchId}/schedule`;
}

export function matchStartPath(competitionId: string, matchId: string) {
  return `/competitions/${competitionId}/matches/${matchId}/start`;
}

export function matchCompletePath(competitionId: string, matchId: string) {
  return `/competitions/${competitionId}/matches/${matchId}/complete`;
}

export function matchCancelPath(competitionId: string, matchId: string) {
  return `/competitions/${competitionId}/matches/${matchId}/cancel`;
}

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

export interface ListCategoriesRequestOptions {
  signal?: AbortSignal;
}

export interface CreateCategoryRequestOptions {
  signal?: AbortSignal;
}

export interface UpdateCategoryRequestOptions {
  signal?: AbortSignal;
}

export interface DeleteCategoryRequestOptions {
  signal?: AbortSignal;
}

export interface ListDivisionsRequestOptions {
  signal?: AbortSignal;
}

export interface CreateDivisionRequestOptions {
  signal?: AbortSignal;
}

export interface UpdateDivisionRequestOptions {
  signal?: AbortSignal;
}

export interface DeleteDivisionRequestOptions {
  signal?: AbortSignal;
}

export interface ListRegistrationsRequestOptions {
  signal?: AbortSignal;
}

export interface CreateRegistrationRequestOptions {
  signal?: AbortSignal;
}

export interface ReviewRegistrationRequestOptions {
  signal?: AbortSignal;
}

export interface CompetitionStatusRequestOptions {
  signal?: AbortSignal;
}

export interface GenerateMatchesRequestOptions {
  signal?: AbortSignal;
}

export interface ListMatchesRequestOptions {
  signal?: AbortSignal;
}

export interface ScheduleMatchRequestOptions {
  signal?: AbortSignal;
}

export interface StartMatchRequestOptions {
  signal?: AbortSignal;
}

export interface CompleteMatchRequestOptions {
  signal?: AbortSignal;
}

export interface CancelMatchRequestOptions {
  signal?: AbortSignal;
}

export interface CreateApiClientOptions {
  apiBaseUrl?: string;
}

export interface PadelApiClient {
  createCompetition(
    request: CreateCompetitionRequest,
  ): Promise<CreateCompetitionResponse>;

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

  listCategories(
    competitionId: string,
    options?: ListCategoriesRequestOptions,
  ): Promise<CategoryCollection>;

  createCategory(
    competitionId: string,
    request: CreateCategoryRequest,
    options?: CreateCategoryRequestOptions,
  ): Promise<CategoryResponse>;

  updateCategory(
    competitionId: string,
    categoryId: string,
    request: UpdateCategoryRequest,
    options?: UpdateCategoryRequestOptions,
  ): Promise<CategoryResponse>;

  deleteCategory(
    competitionId: string,
    categoryId: string,
    options?: DeleteCategoryRequestOptions,
  ): Promise<void>;

  listDivisions(
    competitionId: string,
    options?: ListDivisionsRequestOptions,
  ): Promise<DivisionCollection>;

  createDivision(
    competitionId: string,
    request: CreateDivisionRequest,
    options?: CreateDivisionRequestOptions,
  ): Promise<DivisionResponse>;

  updateDivision(
    competitionId: string,
    divisionId: string,
    request: UpdateDivisionRequest,
    options?: UpdateDivisionRequestOptions,
  ): Promise<DivisionResponse>;

  deleteDivision(
    competitionId: string,
    divisionId: string,
    options?: DeleteDivisionRequestOptions,
  ): Promise<void>;

  listRegistrations(
    competitionId: string,
    options?: ListRegistrationsRequestOptions,
  ): Promise<RegistrationCollection>;

  createRegistration(
    competitionId: string,
    request: CreateRegistrationRequest,
    options?: CreateRegistrationRequestOptions,
  ): Promise<RegistrationResponse>;

  approveRegistration(
    competitionId: string,
    registrationId: string,
    request?: ReviewRegistrationRequest,
    options?: ReviewRegistrationRequestOptions,
  ): Promise<RegistrationResponse>;

  rejectRegistration(
    competitionId: string,
    registrationId: string,
    options?: ReviewRegistrationRequestOptions,
  ): Promise<RegistrationResponse>;

  openCompetition(
    competitionId: string,
    options?: CompetitionStatusRequestOptions,
  ): Promise<{ status: string }>;

  closeCompetition(
    competitionId: string,
    options?: CompetitionStatusRequestOptions,
  ): Promise<{ status: string }>;

  cancelCompetition(
    competitionId: string,
    options?: CompetitionStatusRequestOptions,
  ): Promise<{ status: string }>;

  generateMatches(
    competitionId: string,
    options?: GenerateMatchesRequestOptions,
  ): Promise<GenerateMatchesResponse>;

  listMatches(
    competitionId: string,
    options?: ListMatchesRequestOptions,
  ): Promise<MatchCollection>;

  scheduleMatch(
    competitionId: string,
    matchId: string,
    request: ScheduleMatchRequest,
    options?: ScheduleMatchRequestOptions,
  ): Promise<{ status: string }>;

  startMatch(
    competitionId: string,
    matchId: string,
    options?: StartMatchRequestOptions,
  ): Promise<{ status: string }>;

  completeMatch(
    competitionId: string,
    matchId: string,
    request: CompleteMatchRequest,
    options?: CompleteMatchRequestOptions,
  ): Promise<{ status: string }>;

  cancelMatch(
    competitionId: string,
    matchId: string,
    options?: CancelMatchRequestOptions,
  ): Promise<{ status: string }>;
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
    async createCompetition(request) {
      const response = await client.post(competitionOverviewPath, request);
      return parseResponseWithSchema(
        response.data,
        createCompetitionResponseSchema,
      );
    },

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

    async listCategories(competitionId, options = {}) {
      const response = await client.get(
        competitionCategoriesPath(competitionId),
        { signal: options.signal },
      );
      return parseResponseWithSchema(response.data, categoryCollectionSchema);
    },

    async createCategory(competitionId, request, options = {}) {
      const response = await client.post(
        competitionCategoriesPath(competitionId),
        request,
        { signal: options.signal },
      );
      return parseResponseWithSchema(response.data, categoryResponseSchema);
    },

    async updateCategory(competitionId, categoryId, request, options = {}) {
      const response = await client.patch(
        competitionCategoryPath(competitionId, categoryId),
        request,
        { signal: options.signal },
      );
      return parseResponseWithSchema(response.data, categoryResponseSchema);
    },

    async deleteCategory(competitionId, categoryId, options = {}) {
      await client.delete(competitionCategoryPath(competitionId, categoryId), {
        signal: options.signal,
      });
    },

    async listDivisions(competitionId, options = {}) {
      const response = await client.get(
        competitionDivisionsPath(competitionId),
        { signal: options.signal },
      );
      return parseResponseWithSchema(response.data, divisionCollectionSchema);
    },

    async createDivision(competitionId, request, options = {}) {
      const response = await client.post(
        competitionDivisionsPath(competitionId),
        request,
        { signal: options.signal },
      );
      return parseResponseWithSchema(response.data, divisionResponseSchema);
    },

    async updateDivision(competitionId, divisionId, request, options = {}) {
      const response = await client.patch(
        competitionDivisionPath(competitionId, divisionId),
        request,
        { signal: options.signal },
      );
      return parseResponseWithSchema(response.data, divisionResponseSchema);
    },

    async deleteDivision(competitionId, divisionId, options = {}) {
      await client.delete(competitionDivisionPath(competitionId, divisionId), {
        signal: options.signal,
      });
    },

    async listRegistrations(competitionId, options = {}) {
      const response = await client.get(
        competitionRegistrationsPath(competitionId),
        { signal: options.signal },
      );
      return parseResponseWithSchema(
        response.data,
        registrationCollectionSchema,
      );
    },

    async createRegistration(competitionId, request, options = {}) {
      const response = await client.post(
        competitionRegistrationsPath(competitionId),
        request,
        { signal: options.signal },
      );
      return parseResponseWithSchema(response.data, registrationResponseSchema);
    },

    async approveRegistration(
      competitionId,
      registrationId,
      request = {},
      options = {},
    ) {
      const response = await client.patch(
        competitionRegistrationApprovePath(competitionId, registrationId),
        request,
        { signal: options.signal },
      );
      return parseResponseWithSchema(response.data, registrationResponseSchema);
    },

    async rejectRegistration(competitionId, registrationId, options = {}) {
      const response = await client.patch(
        competitionRegistrationRejectPath(competitionId, registrationId),
        {},
        { signal: options.signal },
      );
      return parseResponseWithSchema(response.data, registrationResponseSchema);
    },

    async openCompetition(competitionId, options = {}) {
      const response = await client.patch(
        competitionOpenPath(competitionId),
        {},
        { signal: options.signal },
      );
      return response.data;
    },

    async closeCompetition(competitionId, options = {}) {
      const response = await client.patch(
        competitionClosePath(competitionId),
        {},
        { signal: options.signal },
      );
      return response.data;
    },

    async cancelCompetition(competitionId, options = {}) {
      const response = await client.patch(
        competitionCancelPath(competitionId),
        {},
        { signal: options.signal },
      );
      return response.data;
    },

    async generateMatches(competitionId, options = {}) {
      const response = await client.post(
        generateMatchesPath(competitionId),
        {},
        { signal: options.signal },
      );
      return parseResponseWithSchema(
        response.data,
        generateMatchesResponseSchema,
      );
    },

    async listMatches(competitionId, options = {}) {
      const response = await client.get(competitionMatchesPath(competitionId), {
        signal: options.signal,
      });
      return parseResponseWithSchema(response.data, matchCollectionSchema);
    },

    async scheduleMatch(competitionId, matchId, request, options = {}) {
      const response = await client.patch(
        matchSchedulePath(competitionId, matchId),
        scheduleMatchRequestSchema.parse(request),
        { signal: options.signal },
      );
      return response.data;
    },

    async startMatch(competitionId, matchId, options = {}) {
      const response = await client.patch(
        matchStartPath(competitionId, matchId),
        {},
        { signal: options.signal },
      );
      return response.data;
    },

    async completeMatch(competitionId, matchId, request, options = {}) {
      const response = await client.patch(
        matchCompletePath(competitionId, matchId),
        completeMatchRequestSchema.parse(request),
        { signal: options.signal },
      );
      return response.data;
    },

    async cancelMatch(competitionId, matchId, options = {}) {
      const response = await client.patch(
        matchCancelPath(competitionId, matchId),
        {},
        { signal: options.signal },
      );
      return response.data;
    },
  };
}
