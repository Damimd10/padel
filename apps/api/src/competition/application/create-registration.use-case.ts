import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { RegistrationResponse } from "@padel/schemas";

import { CompetitionRegistration } from "../domain/competition-registration.js";
import {
  type CategoryRepository,
  CategoryRepositoryToken,
} from "./ports/category-repository.js";
import {
  type CompetitionRepository,
  CompetitionRepositoryToken,
} from "./ports/competition-repository.js";
import {
  type DivisionRepository,
  DivisionRepositoryToken,
} from "./ports/division-repository.js";
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
    @Inject(CompetitionRepositoryToken)
    private readonly competitionRepository: CompetitionRepository,
    @Inject(CategoryRepositoryToken)
    private readonly categoryRepository: CategoryRepository,
    @Inject(DivisionRepositoryToken)
    private readonly divisionRepository: DivisionRepository,
  ) {}

  async execute(
    input: CreateRegistrationCommand,
  ): Promise<RegistrationResponse> {
    const competition = await this.competitionRepository.findById(
      input.competitionId,
    );

    if (!competition) {
      throw new NotFoundException("Competition not found.");
    }

    const competitionResponse = competition.toResponse();
    if (competitionResponse.status !== ("open" as string)) {
      throw new Error(
        "Registration is only allowed for competitions in open status.",
      );
    }

    const existing =
      await this.registrationRepository.findByParticipantAndCompetition(
        input.participantId,
        input.competitionId,
      );

    if (existing) {
      throw new Error("You are already registered for this competition.");
    }

    const category = await this.categoryRepository.findById(input.categoryId);
    if (
      !category ||
      category.toResponse().competitionId !== input.competitionId
    ) {
      throw new NotFoundException(
        "The selected category does not exist in this competition.",
      );
    }

    const division = await this.divisionRepository.findById(input.divisionId);
    if (
      !division ||
      division.toResponse().competitionId !== input.competitionId
    ) {
      throw new NotFoundException(
        "The selected division does not exist in this competition.",
      );
    }

    const id = await this.registrationRepository.nextId();
    const now = new Date().toISOString();
    const registration = CompetitionRegistration.create(input, id, now);

    await this.registrationRepository.create(registration);

    return registration.toResponse();
  }
}
