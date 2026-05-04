import { z } from "zod";

export const sharedPingContract = z.object({
  status: z.literal("ok"),
  version: z.literal("0.0.0"),
});

export const competitionFormatSchema = z.enum([
  "elimination",
  "round-robin",
  "league",
]);
export const authUserSchema = z
  .object({
    id: z.string(),
    email: z.email(),
    name: z.string(),
    emailVerified: z.boolean(),
    image: z.url().nullable(),
  })
  .strict();

export const authSessionSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    expiresAt: z.iso.datetime(),
  })
  .strict();

export const signUpWithEmailRequestSchema = z
  .object({
    name: z.string().trim().min(1),
    email: z.email(),
    password: z.string().min(8).max(128),
  })
  .strict();

export const signInWithEmailRequestSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8).max(128),
  })
  .strict();

export const authMutationResponseSchema = z
  .object({
    user: authUserSchema,
  })
  .strict();

export const authenticatedSessionResponseSchema = z
  .object({
    authenticated: z.literal(true),
    user: authUserSchema,
    session: authSessionSchema,
  })
  .strict();

export const anonymousSessionResponseSchema = z
  .object({
    authenticated: z.literal(false),
  })
  .strict();

export const authSessionResponseSchema = z.union([
  authenticatedSessionResponseSchema,
  anonymousSessionResponseSchema,
]);

export const signOutResponseSchema = z
  .object({
    success: z.literal(true),
  })
  .strict();

export const authErrorSchema = z
  .object({
    code: z.enum([
      "duplicate_email",
      "invalid_credentials",
      "auth_unavailable",
      "invalid_token",
      "expired_token",
    ]),
    message: z.string(),
  })
  .strict();

export const forgetPasswordRequestSchema = z
  .object({
    email: z.email(),
    redirectTo: z.string().optional(),
  })
  .strict();

export const forgetPasswordResponseSchema = z
  .object({
    success: z.literal(true),
  })
  .strict();

export const resetPasswordRequestSchema = z
  .object({
    newPassword: z.string().min(8).max(128),
    token: z.string().min(1),
  })
  .strict();

export const resetPasswordResponseSchema = z
  .object({
    success: z.literal(true),
  })
  .strict();

export const createCompetitionRequestSchema = z
  .object({
    title: z.string().trim().min(1),
    format: competitionFormatSchema,
    startsAt: z.iso.datetime(),
    endsAt: z.iso.datetime(),
  })
  .strict()
  .refine(
    ({ startsAt, endsAt }) =>
      new Date(startsAt).getTime() <= new Date(endsAt).getTime(),
    {
      message: "Competition end date must not be earlier than start date.",
      path: ["endsAt"],
    },
  );

export const createCompetitionResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  format: competitionFormatSchema,
  startsAt: z.iso.datetime(),
  endsAt: z.iso.datetime(),
  ownerId: z.string(),
  status: z.literal("draft"),
});

export const competitionOverviewOwnerSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
  })
  .strict();

export const competitionOverviewItemSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    format: competitionFormatSchema,
    status: z.enum(["draft", "open", "closed", "cancelled"]),
    startsAt: z.iso.datetime(),
    endsAt: z.iso.datetime(),
    owner: competitionOverviewOwnerSchema,
  })
  .strict();

export const competitionOverviewCollectionSchema = z
  .array(competitionOverviewItemSchema)
  .readonly();

export const competitionStatusTransitionResponseSchema = z
  .object({
    status: z.enum(["draft", "open", "closed", "cancelled"]),
  })
  .strict();

export type CreateCompetitionRequest = z.infer<
  typeof createCompetitionRequestSchema
>;
export type CreateCompetitionResponse = z.infer<
  typeof createCompetitionResponseSchema
>;
export type CompetitionFormat = z.infer<typeof competitionFormatSchema>;
export type CompetitionOverviewOwner = z.infer<
  typeof competitionOverviewOwnerSchema
>;
export type CompetitionOverviewItem = z.infer<
  typeof competitionOverviewItemSchema
>;
export type CompetitionOverviewCollection = z.infer<
  typeof competitionOverviewCollectionSchema
>;
export type CompetitionStatusTransitionResponse = z.infer<
  typeof competitionStatusTransitionResponseSchema
>;
export type AuthError = z.infer<typeof authErrorSchema>;
export type AuthMutationResponse = z.infer<typeof authMutationResponseSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
export type AuthSessionResponse = z.infer<typeof authSessionResponseSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type AnonymousSessionResponse = z.infer<
  typeof anonymousSessionResponseSchema
>;
export type SharedPingContract = z.infer<typeof sharedPingContract>;
export type SignInWithEmailRequest = z.infer<
  typeof signInWithEmailRequestSchema
>;
export type SignOutResponse = z.infer<typeof signOutResponseSchema>;
export type SignUpWithEmailRequest = z.infer<
  typeof signUpWithEmailRequestSchema
>;
export type ForgetPasswordRequest = z.infer<typeof forgetPasswordRequestSchema>;
export type ForgetPasswordResponse = z.infer<
  typeof forgetPasswordResponseSchema
>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>;

export const createCategoryRequestSchema = z
  .object({
    label: z.string().trim().min(1),
  })
  .strict();

export const updateCategoryRequestSchema = z
  .object({
    label: z.string().trim().min(1),
  })
  .strict();

export const categoryResponseSchema = z
  .object({
    id: z.string().uuid(),
    competitionId: z.string().uuid(),
    label: z.string(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .strict();

export const categoryCollectionSchema = z.array(categoryResponseSchema);

export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>;
export type UpdateCategoryRequest = z.infer<typeof updateCategoryRequestSchema>;
export type CategoryResponse = z.infer<typeof categoryResponseSchema>;
export type CategoryCollection = z.infer<typeof categoryCollectionSchema>;

export const divisionNameSchema = z.enum(["masculino", "femenino", "mixto"]);

export const createDivisionRequestSchema = z
  .object({
    name: divisionNameSchema,
  })
  .strict();

export const updateDivisionRequestSchema = z
  .object({
    name: divisionNameSchema,
  })
  .strict();

export const divisionResponseSchema = z
  .object({
    id: z.string().uuid(),
    competitionId: z.string().uuid(),
    name: divisionNameSchema,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .strict();

export const divisionCollectionSchema = z.array(divisionResponseSchema);

export type DivisionName = z.infer<typeof divisionNameSchema>;
export type CreateDivisionRequest = z.infer<typeof createDivisionRequestSchema>;
export type UpdateDivisionRequest = z.infer<typeof updateDivisionRequestSchema>;
export type DivisionResponse = z.infer<typeof divisionResponseSchema>;
export type DivisionCollection = z.infer<typeof divisionCollectionSchema>;

export const registrationStatusSchema = z.enum([
  "registered",
  "pending_review",
  "approved",
  "rejected",
  "withdrawn",
]);

export const createRegistrationRequestSchema = z
  .object({
    categoryId: z.string().uuid(),
    divisionId: z.string().uuid(),
  })
  .strict();

export const registrationResponseSchema = z
  .object({
    id: z.string().uuid(),
    competitionId: z.string().uuid(),
    participantId: z.string(),
    categoryId: z.string().uuid(),
    divisionId: z.string().uuid(),
    status: registrationStatusSchema,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .strict();

export const registrationCollectionSchema = z.array(registrationResponseSchema);

export const reviewRegistrationRequestSchema = z
  .object({
    categoryId: z.string().uuid().optional(),
    divisionId: z.string().uuid().optional(),
  })
  .strict();

export type CreateRegistrationRequest = z.infer<
  typeof createRegistrationRequestSchema
>;
export type RegistrationResponse = z.infer<typeof registrationResponseSchema>;
export type RegistrationCollection = z.infer<
  typeof registrationCollectionSchema
>;
export type ReviewRegistrationRequest = z.infer<
  typeof reviewRegistrationRequestSchema
>;

export const matchStatusSchema = z.enum([
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
]);

export const matchResponseSchema = z
  .object({
    id: z.string().uuid(),
    competitionId: z.string().uuid(),
    registrationAId: z.string().uuid(),
    registrationBId: z.string().uuid(),
    status: matchStatusSchema,
    scheduledAt: z.iso.datetime().nullable(),
    scoreA: z.number().int().min(0).nullable(),
    scoreB: z.number().int().min(0).nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .strict();

export const matchCollectionSchema = z.array(matchResponseSchema);

export const generateMatchesResponseSchema = z
  .object({
    matchCount: z.number().int().min(0),
  })
  .strict();

export const scheduleMatchRequestSchema = z
  .object({
    scheduledAt: z.iso.datetime(),
  })
  .strict();

export const completeMatchRequestSchema = z
  .object({
    scoreA: z.number().int().min(0),
    scoreB: z.number().int().min(0),
  })
  .strict();

export type MatchStatus = z.infer<typeof matchStatusSchema>;
export type MatchResponse = z.infer<typeof matchResponseSchema>;
export type MatchCollection = z.infer<typeof matchCollectionSchema>;
export type GenerateMatchesResponse = z.infer<
  typeof generateMatchesResponseSchema
>;
export type ScheduleMatchRequest = z.infer<typeof scheduleMatchRequestSchema>;
export type CompleteMatchRequest = z.infer<typeof completeMatchRequestSchema>;
