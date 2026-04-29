import type { createCompetitionRequestSchema } from "@padel/schemas";
import type { z } from "zod";

type CreateCompetitionRequest = z.infer<typeof createCompetitionRequestSchema>;

export interface CreateCompetitionCommand extends CreateCompetitionRequest {
  ownerId: string;
}
