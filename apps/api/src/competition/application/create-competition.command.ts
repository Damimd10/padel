import { createCompetitionRequestSchema } from "@padel/schemas";
import { z } from "zod";

type CreateCompetitionRequest = z.infer<typeof createCompetitionRequestSchema>;

export interface CreateCompetitionCommand extends CreateCompetitionRequest {
  ownerId: string;
}
