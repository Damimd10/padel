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
    image: z.string().url().nullable().optional(),
    createdAt: z.iso.datetime().optional(),
    updatedAt: z.iso.datetime().optional(),
  })
  .strict();

export const authSessionSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    expiresAt: z.iso.datetime(),
    createdAt: z.iso.datetime().optional(),
    updatedAt: z.iso.datetime().optional(),
    token: z.string().optional(),
    ipAddress: z.string().nullable().optional(),
    userAgent: z.string().nullable().optional(),
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
    redirect: z.boolean().optional(),
    token: z.string().nullable().optional(),
    url: z.string().optional(),
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

export const signUpEmailRequestSchema = signUpWithEmailRequestSchema;
export const signUpEmailResponseSchema = authMutationResponseSchema;
export const signInEmailRequestSchema = signInWithEmailRequestSchema;
export const signInEmailResponseSchema = authMutationResponseSchema;

export const signOutResponseSchema = z
  .object({
    success: z.literal(true),
  })
  .strict();

export const currentSessionResponseSchema = authSessionResponseSchema.transform(
  (value) =>
    value.authenticated
      ? {
          session: value.session,
          user: value.user,
        }
      : null,
);

export const authErrorSchema = z
  .object({
    code: z.enum([
      "duplicate_email",
      "invalid_credentials",
      "auth_unavailable",
    ]),
    message: z.string(),
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
    status: z.enum(["draft", "open", "closed"]),
    startsAt: z.iso.datetime(),
    endsAt: z.iso.datetime(),
    owner: competitionOverviewOwnerSchema,
  })
  .strict();

export const competitionOverviewCollectionSchema = z
  .array(competitionOverviewItemSchema)
  .readonly();

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
export type AuthError = z.infer<typeof authErrorSchema>;
export type AuthMutationResponse = z.infer<typeof authMutationResponseSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
export type AuthSessionResponse = z.infer<typeof authSessionResponseSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type AnonymousSessionResponse = z.infer<
  typeof anonymousSessionResponseSchema
>;
export type CurrentSessionResponse = z.infer<
  typeof currentSessionResponseSchema
>;
export type SharedPingContract = z.infer<typeof sharedPingContract>;
export type SignInEmailRequest = z.infer<typeof signInEmailRequestSchema>;
export type SignInEmailResponse = z.infer<typeof signInEmailResponseSchema>;
export type SignInWithEmailRequest = z.infer<
  typeof signInWithEmailRequestSchema
>;
export type SignOutResponse = z.infer<typeof signOutResponseSchema>;
export type SignUpEmailRequest = z.infer<typeof signUpEmailRequestSchema>;
export type SignUpEmailResponse = z.infer<typeof signUpEmailResponseSchema>;
export type SignUpWithEmailRequest = z.infer<
  typeof signUpWithEmailRequestSchema
>;
