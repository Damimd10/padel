import { UnauthorizedException } from "@nestjs/common";
import { createCompetitionRequestSchema } from "@padel/schemas";
import { z } from "zod";

import type { AuthenticatedUser } from "../../../common/modules/auth/application/ports/auth-gateway.port.js";
import type { CreateCompetitionCommand } from "../../application/create-competition.command.js";

type CreateCompetitionRequest = z.infer<typeof createCompetitionRequestSchema>;

export function mapCreateCompetitionRequestToCommand(
  request: CreateCompetitionRequest,
  user: Pick<AuthenticatedUser, "id"> | undefined,
): CreateCompetitionCommand {
  const ownerId = user?.id;

  if (typeof ownerId !== "string" || ownerId.trim().length === 0) {
    throw new UnauthorizedException();
  }

  return {
    ...request,
    ownerId,
  };
}
