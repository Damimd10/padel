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
export type SharedPingContract = z.infer<typeof sharedPingContract>;
