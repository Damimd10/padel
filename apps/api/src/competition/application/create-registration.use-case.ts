import { Inject, Injectable } from "@nestjs/common";
import type { RegistrationResponse } from "@padel/schemas";

import { CompetitionRegistration } from "../domain/competition-registration.js";
import {
  type RegistrationRepository,
  RegistrationRepositoryToken,
} from "./ports/registration-repository.js";

export interface CreateRegistrationCommand {
  competitionId: string;
  participantId: string;
  categoryId: string;
  divisionId: string;
}

@Injectable()
export class CreateRegistrationUseCase {
  constructor(
    @Inject(RegistrationRepositoryToken)
    private readonly registrationRepository: RegistrationRepository,
  ) {}

  async execute(
    input: CreateRegistrationCommand,
  ): Promise<RegistrationResponse> {
    const existing =
      await this.registrationRepository.findByParticipantAndCompetition(
        input.participantId,
        input.competitionId,
      );

    if (existing) {
      throw new Error("You are already registered for this competition.");
    }

    const id = await this.registrationRepository.nextId();
    const now = new Date().toISOString();
    const registration = CompetitionRegistration.create(input, id, now);

    await this.registrationRepository.create(registration);

    return registration.toResponse();
  }
}
