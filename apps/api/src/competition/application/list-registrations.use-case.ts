import { Inject, Injectable } from "@nestjs/common";
import type { RegistrationCollection } from "@padel/schemas";

import {
  type RegistrationRepository,
  RegistrationRepositoryToken,
} from "./ports/registration-repository.js";

@Injectable()
export class ListRegistrationsUseCase {
  constructor(
    @Inject(RegistrationRepositoryToken)
    private readonly registrationRepository: RegistrationRepository,
  ) {}

  async execute(competitionId: string): Promise<RegistrationCollection> {
    return this.registrationRepository.findByCompetitionId(competitionId);
  }
}
