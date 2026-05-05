import { z } from "zod";

export const createCompetitionFormSchema = z.object({
  title: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  format: z.enum(["elimination", "round-robin", "league"]),
  startsAt: z.string().min(1, "Start date is required"),
  endsAt: z.string().min(1, "End date is required"),
  regStartsAt: z.string().optional(),
  regEndsAt: z.string().optional(),
  maxTeams: z.number().int().min(2).max(128).optional(),
  pricePerTeam: z.number().int().min(0),
  isPublic: z.boolean(),
  requiresApproval: z.boolean(),
  hasWaitlist: z.boolean(),
  groupCount: z.number().int().min(2).max(8).optional(),
  teamsPerGroup: z.number().int().min(2).max(8).optional(),
  setsToWin: z.number().int().min(1).max(3),
  gamesPerSet: z.number().int().min(4).max(9),
  tiebreakPoints: z.number().int().min(7).max(10),
  goldenPoint: z.boolean(),
  matchDurationMinutes: z.number().int().min(15).max(180),
  courts: z.array(
    z.object({
      name: z.string().trim().min(1),
      type: z.string().trim().min(1),
    }),
  ),
  firstMatchTime: z.string().optional(),
  lastMatchTime: z.string().optional(),
  breakBetweenMatchesMinutes: z.number().int().min(5).max(60),
  autoGenerateSchedule: z.boolean(),
  earlyBirdDiscount: z.number().int().min(0).max(100),
  isFreeEntry: z.boolean(),
  prizes: z.array(
    z.object({
      place: z.string().trim().min(1),
      amount: z.number().int().min(0),
    }),
  ),
});

export type CreateCompetitionFormValues = z.infer<
  typeof createCompetitionFormSchema
>;
